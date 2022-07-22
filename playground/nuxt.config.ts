import { defineNuxtConfig } from 'nuxt'
import GoogleFontsModule from '..'

export default defineNuxtConfig({
  modules: [
    GoogleFontsModule
  ],
  googleFonts: {
    families: {
      Roboto: true,
      Mulish: true
    }
  }
})
