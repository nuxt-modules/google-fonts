const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'basic'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('has prefetch link', async () => {
    const html = await get('/')
    expect(html).toContain('<link data-n-head="ssr" data-hid="gf-prefetch" rel="dns-prefetch" href="https://fonts.gstatic.com/">')
  })

  test('has preconnect link', async () => {
    const html = await get('/')
    expect(html).toContain('<link data-n-head="ssr" data-hid="gf-preconnect" rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="true">')
  })

  test('has preload link', async () => {
    const html = await get('/')
    expect(html).toContain('<link data-n-head="ssr" data-hid="gf-preload" rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('has script to import font css', async () => {
    const html = await get('/')
    expect(html).toContain('data-hid="gf-script"')
  })

  test('has noscript fallback', async () => {
    const html = await get('/')
    expect(html).toContain('data-hid="gf-noscript"')
  })
})
