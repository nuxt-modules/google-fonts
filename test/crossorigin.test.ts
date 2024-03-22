import { describe, test, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('crossOrigin', async () => {
  await setup({
    nuxtConfig: {
      app: {
        head: {
          link: [
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato' }
          ]
        }
      },
      googleFonts: {
        families: {
          Roboto: true
        },
        download: false,
        crossOrigin: 'anonymous'
      }
    }
  })

  test('has crossorigin="anonymous" attribute', async () => {
    const body = await $fetch('/')
    expect(body).toContain('crossorigin="anonymous"')
  })
})
