import { join } from 'path'
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
    await del(join(useTestContext().nuxt?.options.rootDir || '', 'node_modules'))
  })
})
