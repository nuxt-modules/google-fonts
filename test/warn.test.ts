import { describe, test, expect, vi, afterAll } from 'vitest'
import { setup } from '@nuxt/test-utils'

describe('warn', async () => {
  const spyStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => undefined!)

  afterAll(() => {
    spyStderr.mockRestore()
  })

  await setup({
    server: false,
  })

  test('should warn if no provided fonts', () => {
    expect(spyStderr).toBeCalledTimes(1)
    const output = spyStderr.mock.calls[0][0].toString()
    expect(output).contains('[warn] [nuxt:google-fonts] No provided fonts.')
  })
})
