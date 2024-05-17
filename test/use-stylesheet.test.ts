import { describe, test, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('use stylesheet', async () => {
  await setup({
    nuxtConfig: {
      app: {
        head: {
          link: [
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato' },
          ],
        },
      },
      googleFonts: {
        families: {
          Roboto: true,
        },
        useStylesheet: true,
        download: false,
        preload: true,
      },
    },
  })

  test('has prefetch link', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="dns-prefetch" href="https://fonts.gstatic.com/"')
  })

  test('has preconnect link', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous"')
  })

  test('has preload link (enabled in config)', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto&family=Lato"')
  })

  test('has stylesheet link', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Lato"')
  })

  test('has stylesheet that does not contain display swap', async () => {
    const body = await $fetch('/')
    expect(body).not.toContain('display=swap')
  })

  test('no has script', async () => {
    const body = await $fetch('/')
    expect(body).not.toContain('l.href=\'https://fonts.googleapis.com/css2?family=Roboto&family=Lato\'')
  })

  test('not has noscript fallback', async () => {
    const body = await $fetch('/')
    expect(body).not.toContain('<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Lato"></noscript>')
  })
})
