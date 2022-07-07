import { resolve } from 'pathe'
import { defineNuxtModule, resolvePath, useLogger } from '@nuxt/kit'
import { constructURL, download, isValidURL, parse, merge, DownloadOptions, GoogleFonts } from 'google-fonts-helper'
import { name, version } from '../package.json'

export interface ModuleOptions extends DownloadOptions, GoogleFonts {
  prefetch?: boolean;
  preconnect?: boolean;
  preload?: boolean;
  useStylesheet?: boolean;
  download?: boolean;
  inject?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'googleFonts'
  },
  defaults: nuxt => ({
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
    outputDir: nuxt.options.dir.assets,
    stylePath: 'css/fonts.css',
    fontsDir: 'fonts',
    fontsPath: '~assets/fonts'
  }),
  setup (moduleOptions, nuxt) {
    const logger = useLogger('nuxt:google-fonts')

    nuxt.hook('build:before', async () => {
      // If user hasn't set the display value manually and isn't using
      // a preload, set the default display value to 'swap'
      if (moduleOptions.display === undefined && !moduleOptions.preload) {
        moduleOptions.display = 'swap'
      }

      // merge fonts from valid head link
      const fontsParsed = nuxt.options.head.link!
        .filter(link => isValidURL(link.href))
        .map(link => parse(link.href))

      // construct google fonts url
      const url = constructURL(fontsParsed.length ? merge(moduleOptions, ...fontsParsed) : moduleOptions)

      if (!url) {
        logger.warn('No provided fonts.')

        return
      }

      // remove fonts
      nuxt.options.head.link = nuxt.options.head.link!.filter(link => !isValidURL(link.href))

      // download
      if (moduleOptions.download) {
        const outputDir = await resolvePath(moduleOptions.outputDir)

        try {
          const downloader = download(url, {
            base64: moduleOptions.base64,
            overwriting: moduleOptions.overwriting,
            outputDir,
            stylePath: moduleOptions.stylePath,
            fontsDir: moduleOptions.fontsDir,
            fontsPath: moduleOptions.fontsPath
          })

          await downloader.execute()

          if (moduleOptions.inject) {
            nuxt.options.css.push(resolve(outputDir, moduleOptions.stylePath))
          }
        } catch (e) {
          logger.error(e)
        }

        return
      }

      // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
      if (moduleOptions.prefetch) {
        nuxt.options.head.link.push({
          hid: 'gf-prefetch',
          rel: 'dns-prefetch',
          href: 'https://fonts.gstatic.com/'
        })
      }

      // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices
      // connect to domain of font files
      if (moduleOptions.preconnect) {
        nuxt.options.head.link.push({
          hid: 'gf-preconnect',
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com/',
          crossorigin: ''
        })

        // Should also preconnect to origin of Google fonts stylesheet.
        nuxt.options.head.link.push({
          hid: 'gf-origin-preconnect',
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com/'
        })
      }

      // https://developer.mozilla.org/pt-BR/docs/Web/HTML/Preloading_content
      // optionally increase loading priority
      if (moduleOptions.preload) {
        nuxt.options.head.link.push({
          hid: 'gf-preload',
          rel: 'preload',
          as: 'style',
          href: url
        })
      }

      // append CSS
      if (moduleOptions.useStylesheet) {
        // @ts-ignore
        nuxt.options.head.link.push({
          hid: 'gf-style',
          rel: 'stylesheet',
          href: url
        })

        return
      }

      // JS to inject CSS
      nuxt.options.head.script!.push({
        hid: 'gf-script',
        innerHTML: `(function(){var l=document.createElement('link');l.rel="stylesheet";l.href="${url}";document.querySelector("head").appendChild(l);})();`
      })

      // no-JS fallback
      nuxt.options.head.noscript!.push({
        hid: 'gf-noscript',
        innerHTML: `<link rel="stylesheet" href="${url}">`
      })

      // Disable sanitazions
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID!['gf-script'] = ['innerHTML']
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID!['gf-noscript'] = ['innerHTML']
    })
  }
})
