---
title: Downloading Fonts
description: 'Downloading fonts option to enhance your Google Fonts module for Nuxt'
position: 4
category: Guide
---

## download

With this option you can download css and google sources for your local project. This means that your project will not depend on these external resources.

Type: Boolean
Default: true

```js{}[nuxt.config.js]
googleFonts: {
  download: true
}
```


## base64

This option encodes the fonts and inject directly into the generated css file.

Type: Boolean
Default: true

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  base64: true
}
```

## inject

This option injects the [globally generated css](https://nuxtjs.org/api/configuration-css/) file.

Type: Boolean
Default: true

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  inject: true
}
```

## overwriting

This option prevents files from being downloaded more than once.

Type: Boolean
Default: false

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  overwriting: false
}
```

## outputDir

Specifies the output directory for downloaded files.

Type: String
Default: this.options.dir.assets

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  outputDir: this.options.dir.assets
}
```

## stylePath

Specifies the output directory for downloaded files.

Type: String
Default: 'css/fonts.css'

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  stylePath: 'css/fonts.css'
}
```

## fontsDir

Specifies the directory where the fonts will be downloaded.

<alert type="info">

This option is used if the base64 option is disabled.

</alert>

Type: String
Default: 'fonts'

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  base64: false,
  fontsDir: 'fonts'
}
```

## fontsPath

Specifies the path of the fonts within the generated css file.

<alert type="info">

This option is used if the base64 option is disabled.

</alert>

Type: String
Default: '~assets/fonts'

```js{}[nuxt.config.js]
googleFonts: {
  download: true,
  base64: false,
  fontsPath: '~assets/fonts'
}
```
