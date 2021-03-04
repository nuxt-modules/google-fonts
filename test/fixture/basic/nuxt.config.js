export default {
  rootDir: __dirname,
  buildModules: [
    '../../../src/module.ts'
  ],
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato' }
    ]
  },
  googleFonts: {
    families: {
      Roboto: true
    }
  }
}
