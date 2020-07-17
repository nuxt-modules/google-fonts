module.exports = {
  rootDir: __dirname,
  buildModules: [
    { handler: require('../../../') }
  ],
  googleFonts: {
    download: true,
    families: {
      Roboto: true
    }
  }
}
