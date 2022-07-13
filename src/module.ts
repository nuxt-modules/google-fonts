import { resolve } from 'pathe'
import { defineNuxtModule, isNuxt2, resolvePath, useLogger } from '@nuxt/kit'
import { constructURL, download, isValidURL, parse, merge, DownloadOptions, GoogleFonts } from 'google-fonts-helper'
import { name, version } from '../package.json'

export interface ModuleOptions extends DownloadOptions, GoogleFonts {
  prefetch?: boolean
  preconnect?: boolean
  preload?: boolean
  useStylesheet?: boolean
  download?: boolean
  inject?: boolean
}

const logger = useLogger('nuxt:google-fonts')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'googleFonts'
  },
  defaults: {
    families: {},
    display: undefined, // set to 'swap' later if no preload or user value
    subsets: [],
    text: undefined,
    prefetch: true,
    preconnect: true,
    preload: false,
    useStylesheet: false,
    download: true,
    base64: false,
    inject: true,
    overwriting: false,
    outputDir: 'node_modules/.cache/nuxt-google-fonts',
    stylePath: 'css/nuxt-google-fonts.css',
    fontsDir: 'fonts',
    fontsPath: '../fonts'
  },
  async setup (options, nuxt) {
    // If user hasn't set the display value manually and isn't using
    // a preload, set the default display value to 'swap'
    if (options.display === undefined && !options.preload) {
      options.display = 'swap'
    }

    const fontsParsed = []

    // merge fonts from valid head link
    if (isNuxt2()) {
      nuxt.options.head = nuxt.options.head || {}
      nuxt.options.head.link = nuxt.options.head.link || []
      fontsParsed.push(...nuxt.options.head.link.filter(link => isValidURL(link.href)).map(link => parse(link.href)))
    } else {
      nuxt.options.app.head.link = nuxt.options.app.head.link || []
      fontsParsed.push(...nuxt.options.app.head.link.filter(link => isValidURL(link.href)).map(link => parse(link.href)))
    }

    // construct google fonts url
    const url = constructURL(merge(options, ...fontsParsed))

    if (!url) {
      logger.warn('No provided fonts.')

      return
    }

    // remove fonts
    if (isNuxt2()) {
      nuxt.options.head = nuxt.options.head || {}
      nuxt.options.head.link = nuxt.options.head.link || []
      nuxt.options.head.link = nuxt.options.head.link.filter(link => !isValidURL(link.href))
    } else {
      nuxt.options.app.head.link = nuxt.options.app.head.link || []
      nuxt.options.app.head.link = nuxt.options.app.head.link.filter(link => !isValidURL(link.href))
    }

    // download
    if (options.download) {
      const outputDir = await resolvePath(options.outputDir)

      try {
        const downloader = download(url, {
          base64: options.base64,
          overwriting: options.overwriting,
          outputDir,
          stylePath: options.stylePath,
          fontsDir: options.fontsDir,
          fontsPath: options.fontsPath
        })

        await downloader.execute()

        if (options.inject) {
          nuxt.options.css.push(resolve(outputDir, options.stylePath))
        }

        // Add the nuxt google fonts directory
        nuxt.options.nitro = nuxt.options.nitro || {}
        nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
        nuxt.options.nitro.publicAssets.push({ dir: outputDir })
      } catch (e) {
        logger.error(e)
      }

      return
    }

    if (isNuxt2()) {
      nuxt.options.head = nuxt.options.head || {}
      nuxt.options.head.link = nuxt.options.head.link || []
      nuxt.options.head.script = nuxt.options.head.script || []
      nuxt.options.head.noscript = nuxt.options.head.noscript || []
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID = nuxt.options.head.__dangerouslyDisableSanitizersByTagID || {}

      // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
      if (options.prefetch) {
        nuxt.options.head.link.push({
          hid: 'gf-prefetch',
          rel: 'dns-prefetch',
          href: 'https://fonts.gstatic.com/'
        })
      }

      // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices
      if (options.preconnect) {
        nuxt.options.head.link.push(
          // connect to domain of font files
          {
            hid: 'gf-preconnect',
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com/',
            crossorigin: 'anonymous'
          },

          // Should also preconnect to origin of Google fonts stylesheet.
          {
            hid: 'gf-origin-preconnect',
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com/'
          }
        )
      }

      // https://developer.mozilla.org/pt-BR/docs/Web/HTML/Preloading_content
      // optionally increase loading priority
      if (options.preload) {
        nuxt.options.head.link.push({
          hid: 'gf-preload',
          rel: 'preload',
          as: 'style',
          href: url
        })
      }

      // append CSS
      if (options.useStylesheet) {
        nuxt.options.head.link.push({
          hid: 'gf-style',
          rel: 'stylesheet',
          href: url
        })

        return
      }

      // JS to inject CSS
      nuxt.options.head.script.push({
        hid: 'gf-script',
        innerHTML: `(function(){var l=document.createElement('link');l.rel="stylesheet";l.href="${url}";document.querySelector("head").appendChild(l);})();`
      })

      // no-JS fallback
      nuxt.options.head.noscript.push({
        hid: 'gf-noscript',
        innerHTML: `<link rel="stylesheet" href="${url}">`
      })

      // Disable sanitazions
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID['gf-script'] = ['innerHTML']
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID['gf-noscript'] = ['innerHTML']

      return
    }

    nuxt.options.app.head.link = nuxt.options.app.head.link || []
    nuxt.options.app.head.script = nuxt.options.app.head.script || []

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
    if (options.prefetch) {
      nuxt.options.app.head.link.push({
        rel: 'dns-prefetch',
        href: 'https://fonts.gstatic.com/'
      })
    }

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices
    if (options.preconnect) {
      nuxt.options.app.head.link.push(
        // connect to domain of font files
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com/',
          crossorigin: 'anonymous'
        },

        // Should also preconnect to origin of Google fonts stylesheet.
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com/'
        }
      )
    }

    // https://developer.mozilla.org/pt-BR/docs/Web/HTML/Preloading_content
    // optionally increase loading priority
    if (options.preload) {
      nuxt.options.app.head.link.push({
        rel: 'preload',
        as: 'style',
        href: url
      })
    }

    // append CSS
    if (options.useStylesheet) {
      nuxt.options.app.head.link.push({
        rel: 'stylesheet',
        href: url
      })

      return
    }

    // JS to inject CSS
    nuxt.options.app.head.script.unshift({
      'data-hid': 'gf-script',
      children: `(function(){
        var h=document.querySelector("head");
        var m=h.querySelector('meta[name="head:count"]');
        if(m){m.setAttribute('content',Number(m.getAttribute('content'))+1);}
        else{m=document.createElement('meta');m.setAttribute('name','head:count');m.setAttribute('content','1');h.append(m);}
        var l=document.createElement('link');l.rel='stylesheet';l.href='${url}';h.appendChild(l);
      })();`
    })

    /*
    // no-JS fallback
    // waiting https://github.com/vueuse/head/pull/71
    /* nuxt.options.app.head.noscript.push({
      children: `<link rel="stylesheet" href="${url}">`
    })
    */
  }
})
