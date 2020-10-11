const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = (await setup(loadConfig(__dirname, 'basic'))))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('<link data-n-head="ssr" rel="dns-prefetch" href="https://fonts.gstatic.com/">')
    expect(html).toContain('<link data-n-head="ssr" rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="true">')
    expect(html).toContain('<link data-n-head="ssr" rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
    expect(html).toContain('<link data-n-head="ssr" vmid="google-fonts" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato" media="print" onload="this.onload=null;this.removeAttribute')
    expect(html).toContain('<noscript data-n-head="ssr"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Lato"></noscript>')
  })
})
