import { describe, test, expect, vi } from 'vitest'
import { setup } from '@nuxt/test-utils'
import consola from 'consola'

export function mockLogger (): typeof consola {
  const mock = {}

  consola.mockTypes((type) => {
    mock[type] = mock[type] || vi.fn()
    return mock[type]
  })

  // @ts-ignore
  return mock
}

const logger = mockLogger()

describe('warn', async () => {
  await setup({
    server: false
  })

  test('should warn if no provided fonts', () => {
    expect(logger.warn).toHaveBeenCalledWith('No provided fonts.')
  })
})
