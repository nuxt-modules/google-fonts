---
title: Options
description: 'Adding options to enhance your Google Fonts module for Nuxt'
position: 3
category: Guide
---

## families

Adding [Google font families](https://developers.google.com/fonts/docs/css2#quickstart_guides)

Type: Object
Default: {}

```js{}[nuxt.config.js]
googleFonts: {
  families: {
    Roboto: true,
    'Josefin+Sans': true,
    Lato: [100, 300],
    Raleway: {
      wght: [100, 400],
      ital: [100]
    },
  }
}
```

It is also possible to add fonts directly in the module declaration:

```js{}[nuxt.config.js]
export default defineNuxtConfig({
  modules: [
    ['@nuxtjs/google-fonts',{
        families: {
          Roboto: true,
          Inter: [400, 700],
           'Josefin+Sans': true,
          Lato: [100, 300],
          Raleway: {
            wght: [100, 400],
            ital: [100]
          },
        }
    }],
  ],
})
```

## display

The [font-display property](https://developers.google.com/fonts/docs/css2#use_font-display) lets you control what happens while the font is still loading or otherwise unavailable.

Type: String
Default: 'swap'

```js{}[nuxt.config.js]
googleFonts: {
  display: 'swap' // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
}
```

Note: manually enabling the `preload` option will turn off 'swap' by default.

## subsets

Some of the fonts in the Google Font Directory support multiple scripts (like Latin, Cyrillic, and Greek for example). In order to [specify which subsets](https://developers.google.com/fonts/docs/getting_started#specifying_script_subsets) should be downloaded the subset parameter should be appended to the URL.

Type: Array[String]|String
Default: []

```js{}[nuxt.config.js]
googleFonts: {
  subsets: 'greek'
}
```

## text

Oftentimes, when you want to use a web font on your site or application, you know in advance which letters you'll need.
This often occurs when you're using a web font in a logo or heading. See https://developers.google.com/fonts/docs/css2#optimizing_your_font_requests

In these cases, you should consider specifying a [text](https://developers.google.com/fonts/docs/css2#optimizing_your_font_requests).
This allows Google Fonts to return a font file that's optimized for your request. In some cases, this can reduce the size of the font file by up to 90%.

Type: String
Default: null

```js{}[nuxt.config.js]
googleFonts: {
  text: 'Hello world'
}
```

## prefetch

This option injects [dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch) into the head of your project.

```html
<link rel="dns-prefetch" href="https://fonts.gstatic.com/"/>
```

Type: Boolean
Default: true

```js{}[nuxt.config.js]
googleFonts: {
  prefetch: true
}
```

## preconnect

This option injects [preconnect](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices) into the head of your project.

```html
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />
```

Type: Boolean
Default: true

```js{}[nuxt.config.js]
googleFonts: {
  preconnect: true
}
```

## preload

This option injects [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload) into the head of your project.

```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto" />
```

Type: Boolean
Default: false

```js{}[nuxt.config.js]
googleFonts: {
  preload: true
}
```

## useStylesheet

This option injects useStylesheet into the head of your project which is recommended for projects that use the AMP module that removes scripts.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto" />
```

Type: Boolean
Default: false

```js{}[nuxt.config.js]
googleFonts: {
  useStylesheet: false
}
```
