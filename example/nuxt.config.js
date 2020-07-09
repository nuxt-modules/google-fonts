module.exports = {
  rootDir: __dirname,
  buildModules: [
    { handler: require('../') }
  ],
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap' }
    ]
  }
}
