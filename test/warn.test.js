const { setup, loadConfig } = require('@nuxtjs/module-test-utils')
const logger = require('../lib/logger')

logger.mockTypes(() => jest.fn())

describe('warn', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'warn'))))
  }, 60000)

  beforeEach(() => {
    logger.clear()
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('should warn if no provided fonts', () => {
    expect(logger.warn).toHaveBeenCalledWith('No provided fonts.')
  })
})
