import { fileURLToPath } from 'url'
import { describe, test, expect, afterAll } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils'
import { deleteAsync } from 'del'

describe('download', async () => {
  await setup({
    server: false,
    nuxtConfig: {
      googleFonts: {
        families: {
          Roboto: true
        }
      }
    }
  })

  test('render', () => {
    expect(useTestContext().nuxt?.options.css).toHaveLength(1)
    expect(useTestContext().nuxt?.options.css[0]).toContain('nuxt-google-fonts.css')
  })

  afterAll(async () => {
    await deleteAsync(fileURLToPath(new URL('./fixture/download/node_modules', import.meta.url)))
  })
})
