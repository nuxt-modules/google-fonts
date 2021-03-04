[![@nuxtjs/google-fonts](./docs/static/preview.svg)](https://google-fonts.nuxtjs.org)

# @nuxtjs/google-fonts

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> [Google Fonts](https://developers.google.com/fonts) module for [NuxtJS](https://nuxtjs.org)

- [✨ &nbsp;Release Notes](https://google-fonts.nuxtjs.org/releases)
- [📖 &nbsp;Documentation](https://google-fonts.nuxtjs.org)

## Features

- Specify fonts by name/variant
- Parse head links to Google Fonts
- Creates only an external link to Google Fonts
- [Support CSS API v2](https://developers.google.com/fonts/docs/css2)
- [Add dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch)
- [Add preconnect](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#Best_practices)
- [Add preload](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Preloading_content)
- Download css/fonts to local project (No need external resources)
- Encode fonts to base64

[📖 &nbsp;Read more](https://google-fonts.nuxtjs.org)

## Setup

1. Add `@nuxtjs/google-fonts` dependency to your project

```bash
yarn add --dev @nuxtjs/google-fonts # or npm install --save-dev @nuxtjs/google-fonts
```

2. Add `@nuxtjs/google-fonts` to the `buildModules` section of `nuxt.config.js`

```js
{
  buildModules: [
    // Simple usage
    '@nuxtjs/google-fonts',

    // With options
    ['@nuxtjs/google-fonts', { /* module options */ }]
  ]
}
```

:warning: If you are using Nuxt **< v2.9** you have to install the module as a `dependency` (No `--dev` or `--save-dev` flags) and use `modules` section in `nuxt.config.js` instead of `buildModules`.

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `yarn dev` or `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/google-fonts/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/google-fonts

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/google-fonts.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/google-fonts

[github-actions-ci-src]: https://github.com/nuxt-community/google-fonts-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-community/google-fonts-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/google-fonts-module.svg
[codecov-href]: https://codecov.io/gh/nuxt-community/google-fonts-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/google-fonts.svg
[license-href]: https://npmjs.com/package/@nuxtjs/google-fonts
