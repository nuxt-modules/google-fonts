import { join } from 'path'
import { sync } from 'del'
import { setupTest, getNuxt } from '@nuxt/test-utils'

describe('download', () => {
  setupTest({
    build: true,
    fixture: 'fixture/download'
  })

  afterAll(() => {
    const { options } = getNuxt()
    sync(join(options.srcDir, options.dir.assets))
  })

  test('render', () => {
    const { options } = getNuxt()
    expect(options.css).toHaveLength(1)
    expect(options.css[0]).toContain('fonts.css')
  })
})
