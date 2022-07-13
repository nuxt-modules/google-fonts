import { defineNuxtConfig } from 'nuxt'
import GoogleFontsModule from '../../../src/module'

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato' }
      ]
    }
  },
  modules: [
    GoogleFontsModule
  ],
  googleFonts: {
    families: {
      Roboto: true
    },
    useStylesheet: true,
    download: false,
    preload: true
  }
})
