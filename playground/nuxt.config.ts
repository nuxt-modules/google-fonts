import GoogleFontsModule from '../src/module'

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
