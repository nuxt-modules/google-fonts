import { resolve } from 'path'
import type { Module } from '@nuxt/types'
import consola from 'consola'
import defu from 'defu'
import { GoogleFontsHelper, DownloadOptions, GoogleFonts } from 'google-fonts-helper'
import { name, version } from '../package.json'

const logger = consola.withTag('nuxt:google-fonts')

export interface ModuleOptions extends Partial<DownloadOptions & GoogleFonts> {
  prefetch?: boolean;
  preconnect?: boolean;
  preload?: boolean;
  useStylesheet?: boolean;
  download?: boolean;
  inject?: boolean;
}

const CONFIG_KEY = 'googleFonts'

const nuxtModule: Module<ModuleOptions> = function (moduleOptions) {
  const DEFAULTS: ModuleOptions = {
    families: {},
    display: null,
    subsets: [],
    text: null,
    prefetch: true,
    preconnect: true,
    preload: true,
    useStylesheet: false,
    download: true,
    base64: false,
    inject: true,
    overwriting: false,
    outputDir: this.options.dir.assets,
    stylePath: 'css/fonts.css',
    fontsDir: 'fonts',
    fontsPath: '~assets/fonts'
  }

  this.nuxt.hook('build:before', async () => {
    const options: ModuleOptions = defu(
      this.options['google-fonts'],
      this.options[CONFIG_KEY],
      moduleOptions,
      DEFAULTS
    )

    const googleFontsHelper = new GoogleFontsHelper({
      families: options.families,
      display: options.display,
      subsets: options.subsets,
      text: options.text
    })

    // merge fonts from valid head link
    // @ts-ignore
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
    // @ts-ignore
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
      // @ts-ignore
      this.options.head.link.push({
        hid: 'gf-prefetch',
        rel: 'dns-prefetch',
        href: 'https://fonts.gstatic.com/'
      })
    }

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices
    // connect to domain of font files
    if (options.preconnect) {
      // @ts-ignore
      this.options.head.link.push({
        hid: 'gf-preconnect',
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
        crossorigin: ''
      })
      // Should also preconnect to origin of Google fonts stylesheet.
      // @ts-ignore
      this.options.head.link.push({
        hid: 'gf-origin-preconnect',
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com/'
      })
    }

    // https://developer.mozilla.org/pt-BR/docs/Web/HTML/Preloading_content
    // optionally increase loading priority
    if (options.preload) {
      // @ts-ignore
      this.options.head.link.push({
        hid: 'gf-preload',
        rel: 'preload',
        as: 'style',
        href: url
      })
    }

    // append CSS
    if (options.useStylesheet) {
      // @ts-ignore
      this.options.head.link.push({
        hid: 'gf-style',
        rel: 'stylesheet',
        href: url
      })

      return
    }

    // JS to inject CSS
    // @ts-ignore
    this.options.head.script = this.options.head.script || []
    // @ts-ignore
    this.options.head.script.push({
      hid: 'gf-script',
      innerHTML: `(function(){var l=document.createElement('link');l.rel="stylesheet";l.href="${url}";document.querySelector("head").appendChild(l);})();`
    })

    // no-JS fallback
    // @ts-ignore
    this.options.head.noscript = this.options.head.noscript || []
    // @ts-ignore
    this.options.head.noscript.push({
      hid: 'gf-noscript',
      innerHTML: `<link rel="stylesheet" href="${url}">`
    })

    // Disable sanitazions
    // @ts-ignore
    this.options.head.__dangerouslyDisableSanitizersByTagID = this.options.head.__dangerouslyDisableSanitizersByTagID || {}
    // @ts-ignore
    this.options.head.__dangerouslyDisableSanitizersByTagID['gf-script'] = ['innerHTML']
    // @ts-ignore
    this.options.head.__dangerouslyDisableSanitizersByTagID['gf-noscript'] = ['innerHTML']
  })
}

;(nuxtModule as any).meta = { name, version }

declare module '@nuxt/types' {
  interface NuxtConfig { [CONFIG_KEY]?: ModuleOptions } // Nuxt 2.14+
  interface Configuration { [CONFIG_KEY]?: ModuleOptions } // Nuxt 2.9 - 2.13
}

export default nuxtModule
