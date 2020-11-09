const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('use stylesheet', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'use-stylesheet'))))
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
    expect(html).toContain('<link data-n-head="ssr" data-hid="gf-preconnect" rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">')
  })

  test('has preload link', async () => {
    const html = await get('/')
    expect(html).toContain('<link data-n-head="ssr" data-hid="gf-preload" rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('has stylesheet link', async () => {
    const html = await get('/')
    expect(html).toContain('<link data-n-head="ssr" data-hid="gf-style" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('no has script', async () => {
    const html = await get('/')
    expect(html).not.toContain('data-hid="gf-script"')
  })

  test('not has noscript fallback', async () => {
    const html = await get('/')
    expect(html).not.toContain('data-hid="gf-noscript"')
  })
})
