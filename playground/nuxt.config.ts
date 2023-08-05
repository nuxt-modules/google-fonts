import GoogleFontsModule from '../src/module'

export default defineNuxtConfig({
  modules: [
    GoogleFontsModule
  ],
  googleFonts: {
    families: {
      Roboto: {
        wght: [100, 400],
        text: 'Roboto'
      },
      Mulish: true
    },
    text: 'Hello World'
  }
})
