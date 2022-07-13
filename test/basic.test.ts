import { describe, test, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('basic', async () => {
  await setup({
    fixture: 'fixture/basic'
  })

  test('has prefetch link', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="dns-prefetch" href="https://fonts.gstatic.com/">')
  })

  test('has preconnect link to font origin', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous">')
  })

  test('has preconnect link to font stylesheet origin', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<link rel="preconnect" href="https://fonts.googleapis.com/">')
  })

  test('does not have preload link by default', async () => {
    const body = await $fetch('/')
    expect(body).not.toContain('<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('does not have static stylesheet link', async () => {
    const body = await $fetch('/')
    expect(body).not.toContain('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato">')
  })

  test('has display: swap in font script', async () => {
    const body = await $fetch('/')
    expect(body).toContain('display=swap')
  })

  test('has script to import font css', async () => {
    const body = await $fetch('/')
    expect(body).toContain('data-hid="gf-script"')
  })

  // waiting https://github.com/vueuse/head/pull/71
  test.skip('has noscript fallback', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&amp;family=Lato"></noscript>')
  })
})
