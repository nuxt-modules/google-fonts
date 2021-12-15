module.exports = {
  preset: '@nuxt/test-utils',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.{js,ts}',
    '!**/node_modules/**',
    '!**/dist/**'
  ]
}
