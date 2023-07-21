import { describe, test, expect, vi, afterAll } from 'vitest'
import { setup } from '@nuxt/test-utils'

describe('disable', async () => {
  const spyStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => undefined!)

  afterAll(() => {
    spyStderr.mockRestore()
  })

  await setup({
    nuxtConfig: {
      app: {
        // @ts-ignore
        head: () => {}
      },
      googleFonts: {
        families: {
          Roboto: true
        }
      }
    }
  })

  test('should warn if head as function', () => {
    expect(spyStderr).toBeCalledTimes(1)
    const output = spyStderr.mock.calls[0][0].toString()
    expect(output).contains('[warn] [nuxt:google-fonts] This module does not work with `head` as function.')
  })
})
