import { resolve } from 'pathe'
import type { MetaObject } from '@nuxt/schema'
import { defineNuxtModule, isNuxt2, resolvePath, useLogger } from '@nuxt/kit'
import { constructURL, download, isValidURL, parse, merge, DownloadOptions, GoogleFonts } from 'google-fonts-helper'
import { name, version } from '../package.json'

type NuxtAppHead = Required<MetaObject>

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

    const fontsParsed: GoogleFonts[] = []
    // @ts-ignore
    const head = (nuxt.options.app.head || nuxt.options.head) as NuxtAppHead

    // merge fonts from valid head link
    fontsParsed.push(...head.link
      .filter(link => isValidURL(String(link.href)))
      .map(link => parse(String(link.href)))
    )

    // construct google fonts url
    const url = constructURL(merge(options, ...fontsParsed))

    if (!url) {
      logger.warn('No provided fonts.')

      return
    }

    // remove fonts
    head.link = head.link.filter(link => !isValidURL(String(link.href)))

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

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
    if (options.prefetch) {
      head.link.push({
        key: 'gf-prefetch',
        rel: 'dns-prefetch',
        href: 'https://fonts.gstatic.com/'
      })
    }

    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices
    if (options.preconnect) {
      head.link.push(
        // connect to domain of font files
        {
          key: 'gf-preconnect',
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com/',
          crossorigin: 'anonymous'
        },

        // Should also preconnect to origin of Google fonts stylesheet.
        {
          key: 'gf-origin-preconnect',
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com/'
        }
      )
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload
    // optionally increase loading priority
    if (options.preload) {
      head.link.push({
        key: 'gf-preload',
        rel: 'preload',
        as: 'style',
        href: url
      })
    }

    // append CSS
    if (options.useStylesheet) {
      head.link.push({
        key: 'gf-style',
        rel: 'stylesheet',
        href: url
      })

      return
    }

    if (isNuxt2()) {
      // JS to inject CSS
      head.script.push({
        key: 'gf-script',
        innerHTML: `(function(){var l=document.createElement('link');l.rel="stylesheet";l.href="${url}";document.querySelector("head").appendChild(l);})();`
      })

      // no-JS fallback
      head.noscript.push({
        key: 'gf-noscript',
        innerHTML: `<link rel="stylesheet" href="${url}">`,
        tagPosition: 'bodyOpen'
      })

      // Disable sanitazions
      // @ts-ignore
      head.__dangerouslyDisableSanitizersByTagID = head.__dangerouslyDisableSanitizersByTagID || {}
      // @ts-ignore
      head.__dangerouslyDisableSanitizersByTagID['gf-script'] = ['innerHTML']
      // @ts-ignore
      head.__dangerouslyDisableSanitizersByTagID['gf-noscript'] = ['innerHTML']

      return
    }

    // JS to inject CSS
    head.script.unshift({
      key: 'gf-script',
      children: `(function(){
        var h=document.querySelector("head");
        var m=h.querySelector('meta[name="head:count"]');
        if(m){m.setAttribute('content',Number(m.getAttribute('content'))+1);}
        else{m=document.createElement('meta');m.setAttribute('name','head:count');m.setAttribute('content','1');h.append(m);}
        var l=document.createElement('link');l.rel='stylesheet';l.href='${url}';h.appendChild(l);
      })();`
    })

    // no-JS fallback
    head.noscript.push({
      children: `<link rel="stylesheet" href="${url}">`,
      tagPosition: 'bodyOpen'
    })
  }
})
