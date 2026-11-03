export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['@nuxtjs/plausible'],
  nitro: {
    // Netlify publishes `dist` from `nuxi generate`: without the static preset Nitro picks its Netlify server preset there, and Netlify refuses `dist` when it is a symlink to `.output/public`
    preset: 'static',
    output: { publicDir: 'dist' },
  },
})
