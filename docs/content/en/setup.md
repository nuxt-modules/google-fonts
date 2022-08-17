---
title: Setup
description: 'How to setup Google Fonts module in your Nuxt project'
position: 2
category: Guide
---

Check the [Nuxt documentation](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.

## Installation

Add `@nuxtjs/google-fonts` dependency to your project:

<alert type="warning">
  
If you are using Nuxt v2, install "@nuxtjs/google-fonts": "^2.0.0" instead of v3 of the module. 
  
</alert>

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add --dev @nuxtjs/google-fonts
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install --save-dev @nuxtjs/google-fonts
  ```

  </code-block>
</code-group>

Then, add `@nuxtjs/google-fonts` to the `buildModules` section of `nuxt.config.js`:

```js[nuxt.config.js]
{
  buildModules: [
    '@nuxtjs/google-fonts'
  ],
}
```

<alert type="warning">

If you are using Nuxt < v2.9 you have to install the module as a dependency (No --dev or --save-dev flags) and use modules section in nuxt.config.js instead of buildModules.

</alert>
