const { join } = require('path')
const del = require('del')
const { setup, loadConfig } = require('@nuxtjs/module-test-utils')

describe('download', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'download'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
    await del(join(nuxt.options.srcDir, nuxt.options.dir.assets))
  })

  test('render', () => {
    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css[0]).toContain('fonts.css')
  })
})
