// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
      './docs',
    ],
  },
}).append({
  files: ['docs/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
