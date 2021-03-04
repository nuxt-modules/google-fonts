import { setupTest, get } from '@nuxt/test-utils'

describe('basic', () => {
  setupTest({
    server: true,
    fixture: 'fixture/basic'
  })

  test('has prefetch link', async () => {
    const { body } = await get('/')
    expect(body).toContain('<link data-n-head="ssr" data-hid="gf-prefetch" rel="dns-prefetch" href="https://fonts.gstatic.com/">')
  })

  test('has preconnect link', async () => {
    const { body } = await get('/')
    expect(body).toContain('<link data-n-head="ssr" data-hid="gf-preconnect" rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">')
  })

  test('has preload link', async () => {
    const { body } = await get('/')
    expect(body).toContain('<link data-n-head="ssr" data-hid="gf-preload" rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('no has stylesheet link', async () => {
    const { body } = await get('/')
    expect(body).not.toContain('<link data-n-head="ssr" data-hid="gf-style" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('has script to import font css', async () => {
    const { body } = await get('/')
    expect(body).toContain('data-hid="gf-script"')
  })

  test('has noscript fallback', async () => {
    const { body } = await get('/')
    expect(body).toContain('data-hid="gf-noscript"')
  })
})
