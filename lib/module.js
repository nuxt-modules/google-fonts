const { resolve } = require('path')
const { GoogleFontsHelper } = require('google-fonts-helper')
const logger = require('./logger')

module.exports = function (moduleOptions) {
  this.nuxt.hook('build:before', async () => {
    const options = {
      families: {},
      display: null,
      subsets: [],
      prefetch: true,
      preconnect: true,
      preload: true,
      download: false,
      base64: false,
      inject: true,
      overwriting: false,
      outputDir: this.options.dir.assets,
      stylePath: 'css/fonts.css',
      fontsDir: 'fonts',
      fontsPath: '~assets/fonts',
      ...this.options['google-fonts'],
      ...this.options.googleFonts,
      ...moduleOptions
    }

    const googleFontsHelper = new GoogleFontsHelper({
      families: options.families,
      display: options.display,
      subsets: options.subsets
    })

    // merge fonts from valid head link
    const fontsParsed = (this.options.head.link || [])
      .filter(link => GoogleFontsHelper.isValidURL(link.href))
      .map(link => GoogleFontsHelper.parse(link.href))

    if (fontsParsed.length) {
      googleFontsHelper.merge(...fontsParsed)
    }

    // construct google fonts url
    const url = googleFontsHelper.constructURL()

    if (!url) {
      logger.warn('No provided fonts.')

      return
    }

    // remove fonts
    this.options.head.link = (this.options.head.link || [])
      .filter(link => !GoogleFontsHelper.isValidURL(link.href))

    // download
    if (options.download) {
      const outputDir = this.nuxt.resolver.resolveAlias(options.outputDir)

      try {
        await GoogleFontsHelper.download(url, {
          base64: options.base64,
          overwriting: options.overwriting,
          outputDir,
          stylePath: options.stylePath,
          fontsDir: options.fontsDir,
          fontsPath: options.fontsPath
        })

        if (options.inject) {
          this.options.css.push(resolve(outputDir, options.stylePath))
        }
      } catch (e) { /* istanbul ignore next */
        logger.error(e)
      }

      return
    }

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
    if (options.prefetch) {
      this.options.head.link.push({
        rel: 'dns-prefetch',
        href: 'https://fonts.gstatic.com/'
      })
    }

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices
    // connect to domain of font files
    if (options.preconnect) {
      this.options.head.link.push({
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
        crossorigin: true
      })
    }

    // https://developer.mozilla.org/pt-BR/docs/Web/HTML/Preloading_content
    // optionally increase loading priority
    if (options.preload) {
      this.options.head.link.push({
        rel: 'preload',
        as: 'style',
        href: url
      })
    }

    // async CSS
    this.options.head.link.push({
      vmid: 'google-fonts',
      rel: 'stylesheet',
      href: url,
      media: 'print',
      onload: 'this.onload=null;this.removeAttribute(\'media\');'
    })

    // no-JS fallback
    this.options.head.noscript = this.options.head.noscript || []
    this.options.head.noscript.push({
      innerHTML: `<link rel="stylesheet" href="${url}">`
    })

    this.options.head.__dangerouslyDisableSanitizers = this.options.head.__dangerouslyDisableSanitizers || []
    this.options.head.__dangerouslyDisableSanitizers.push('noscript')
  })
}

module.exports.meta = require('../package.json')
