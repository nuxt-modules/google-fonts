import { setupTest } from '@nuxt/test-utils'

const mockReporter = {
  warn: jest.fn()
}

jest.mock('consola', () => ({
  info: jest.fn(),
  success: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  withTag: jest.fn().mockImplementation(() => mockReporter)
}))

describe('warn', () => {
  setupTest({
    build: true,
    fixture: 'fixture/warn'
  })

  test('should warn if no provided fonts', () => {
    expect(mockReporter.warn).toHaveBeenCalledWith('No provided fonts.')
  })
})
