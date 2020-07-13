const { basename, extname, resolve, join } = require('path')
const { format } = require('url')
const { unescape } = require('querystring')
const { outputFile, pathExistsSync } = require('fs-extra')
const deepmerge = require('deepmerge')
const got = require('got')

function isValidDisplay (display) {
  return display && ['auto', 'block', 'swap', 'fallback', 'optional'].includes(display)
}

function convertFamiliesObject (families) {
  const result = {}

  families.forEach((family) => {
    if (!family.includes(':')) {
      result[family] = true
      return
    }

    const parts = family.split(':')

    if (!parts[1]) {
      return
    }

    const values = {}
    const [styles, weights] = parts[1].split('@')

    styles.split(',').forEach((style, index) => {
      values[style] = weights.split(';').map((weight) => {
        if (/^\+?\d+$/.test(weight)) {
          return parseInt(weight)
        }

        const [pos, w] = weight.split(',')

        if (parseInt(pos) === index && /^\+?\d+$/.test(w)) {
          return parseInt(w)
        }
      }).filter(Boolean)
    })

    result[parts[0]] = values
  })

  return result
}

function convertFamiliesToArray (families) {
  const result = []

  Object.entries(families).forEach(([name, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      result.push(`${name}:wght@${values.join(';')}`)
    } else if (Object.keys(values).length > 0) {
      const styles = []
      const weights = []

      Object.entries(values).forEach(([style, weight], index) => {
        styles.push(style);

        (Array.isArray(weight) ? weight : [weight]).forEach((value) => {
          if (Object.keys(values).length === 1 && style === 'wght') {
            weights.push(value)
          } else {
            weights.push(`${index},${value}`)
          }
        })
      })

      result.push(`${name}:${styles.join(',')}@${weights.join(';')}`)
    } else if (values) {
      result.push(name)
    }
  })

  return result
}

function formatFontFileName (template, values) {
  return Object
    .entries(values)
    .filter(
      ([key]) => /^[a-z0-9_-]+$/gi.test(key)
    )
    .map(
      ([key, value]) =>
        [new RegExp(`([^{]|^){${key}}([^}]|$)`, 'g'), `$1${value}$2`]
    )
    .reduce(
      (str, [regexp, replacement]) => {
        return str.replace(regexp, replacement)
      }, template
    )
    .replace(/({|}){2}/g, '$1')
}

function parseFontsFromCss (content, fontsPath) {
  const fonts = []
  const re = {
    face: /\s*(?:\/\*\s*(.*?)\s*\*\/)?[^@]*?@font-face\s*{(?:[^}]*?)}\s*/gi,
    family: /font-family\s*:\s*(?:'|")?([^;]*?)(?:'|")?\s*;/i,
    weight: /font-weight\s*:\s*([^;]*?)\s*;/i,
    url: /url\s*\(\s*(?:'|")?\s*([^]*?)\s*(?:'|")?\s*\)\s*?/gi
  }

  let i = 1
  let match1

  while ((match1 = re.face.exec(content)) !== null) {
    const [fontface, comment] = match1
    let [, family] = re.family.exec(fontface)
    family = family || ''
    const [, weight] = re.weight.exec(fontface)

    let match2
    while ((match2 = re.url.exec(fontface)) !== null) {
      const [forReplace, url] = match2
      const urlPathname = new URL(url).pathname
      const ext = extname(urlPathname)
      if (ext.length < 2) { continue }
      const filename = basename(urlPathname, ext) || ''
      const newFilename = formatFontFileName('{_family}-{weight}-{comment}{i}.{ext}', {
        comment: comment || '',
        family,
        weight: weight || '',
        filename,
        _family: family.replace(/\s+/g, '_'),
        ext: ext.replace(/^\./, '') || '',
        i: i++
      }).replace(/\.$/, '')

      fonts.push({
        inputFont: url,
        outputFont: newFilename,
        inputText: forReplace,
        outputText: `url('${join(fontsPath, newFilename)}')`
      })
    }
  }

  return fonts
}

function downloadURL (url, config = {}) {
  config.headers = config.headers || {}

  if (!config.headers['user-agent']) {
    config.headers['user-agent'] = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'AppleWebKit/537.36 (KHTML, like Gecko)',
      'Chrome/80.0.3987.132 Safari/537.36'
    ].join(' ')
  }

  return got(url, config)
}

class GoogleFontsHelper {
  constructor (fonts = {}) {
    this.fonts = fonts
  }

  getFonts () {
    return this.fonts
  }

  constructURL () {
    const { families, display, subsets } = this.fonts
    const family = convertFamiliesToArray(families || {})

    if (family.length < 1) {
      return false
    }

    const query = {
      family
    }

    if (isValidDisplay(display)) {
      query.display = display
    }

    const subset = Array.isArray(subsets) ? subsets : [subsets]

    if (subset.length > 0) {
      query.subset = subset.join(',')
    }

    return unescape(format({
      protocol: 'https',
      hostname: 'fonts.googleapis.com',
      pathname: 'css2',
      query
    }))
  }

  merge (values) {
    if (!Array.isArray(values)) {
      values = [values]
    }

    const newFonts = values.map(value => value instanceof GoogleFontsHelper ? value.getFonts() : value)
    newFonts.unshift(this.fonts)

    this.fonts = deepmerge.all(newFonts)
  }

  static isValidURL (url) {
    return /fonts.googleapis.com/.test(url)
  }

  static parse (url) {
    if (!GoogleFontsHelper.isValidURL(url)) {
      return new GoogleFontsHelper()
    }

    const { searchParams } = new URL(url)

    if (!searchParams.has('family')) {
      return new GoogleFontsHelper()
    }

    const result = {}
    const families = convertFamiliesObject(searchParams.getAll('family'))
    const display = searchParams.get('display')
    const subsets = searchParams.get('subset')

    if (Object.keys(families).length < 1) {
      return new GoogleFontsHelper()
    }

    result.families = families

    if (isValidDisplay(display)) {
      result.display = display
    }

    if (subsets) {
      result.subsets = subsets.split(',')
    }

    return new GoogleFontsHelper(result)
  }

  static async download (url, config = {
    base64: false,
    overwriting: false,
    outputDir: './',
    stylePath: 'fonts.css',
    fontsDir: 'fonts',
    fontsPath: './fonts'
  }) {
    if (!GoogleFontsHelper.isValidURL(url)) {
      throw new Error('Invalid Google Fonts URl')
    }

    const stylePath = resolve(config.outputDir, config.stylePath)
    const fontsDir = resolve(config.outputDir, config.fontsDir)

    if (!config.overwriting && pathExistsSync(stylePath)) {
      return
    }

    let { body: css } = await downloadURL(url)

    const fonts = parseFontsFromCss(css, config.fontsPath)

    for (const font of fonts) {
      const response = downloadURL(font.inputFont)
      const buffer = await response.buffer()

      if (config.base64) {
        const mime = (await response).headers['content-type'] || 'font/woff2'
        const content = buffer.toString('base64')

        css = css.replace(font.inputText, `url('data:${mime};base64,${content}')`)
      } else {
        const fontPath = resolve(fontsDir, font.outputFont)

        await outputFile(fontPath, buffer)

        css = css.replace(font.inputText, font.outputText)
      }
    }

    await outputFile(stylePath, css)
  }
}

module.exports = GoogleFontsHelper
