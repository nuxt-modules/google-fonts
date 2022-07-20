import { fileURLToPath } from 'url'
import { describe, test, expect, afterAll } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils'
import del from 'del'

describe('download', async () => {
  await setup({
    server: false,
    fixture: 'fixture/download'
  })

  test('render', () => {
    expect(useTestContext().nuxt?.options.css).toHaveLength(1)
    expect(useTestContext().nuxt?.options.css[0]).toContain('nuxt-google-fonts.css')
  })

  afterAll(async () => {
    await del(fileURLToPath(new URL('./fixture/download/node_modules', import.meta.url)))
  })
})
