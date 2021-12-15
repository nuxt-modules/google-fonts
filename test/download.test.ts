import { join } from 'path'
import { sync } from 'del'
import { setupTest, getNuxt } from '@nuxt/test-utils'

let nuxtOptions

describe('download', () => {
  setupTest({
    build: true,
    fixture: 'fixture/download'
  })

  afterAll(() => {
    sync(join(nuxtOptions.srcDir, nuxtOptions.dir.assets))
  })

  test('render', () => {
    const { options } = getNuxt()
    nuxtOptions = options
    expect(options.css).toHaveLength(1)
    expect(options.css[0]).toContain('fonts.css')
  })
})
