export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['@nuxtjs/plausible'],
  nitro: {
    // Netlify publishes the static output of `nuxi generate`; without this, Nitro picks its Netlify server preset there and the build fails
    preset: 'static',
  },
})
