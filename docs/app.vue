<template>
  <div>
    <div class="deprecation-banner">
      <code>@nuxtjs/google-fonts</code> is deprecated in favour of
      <a href="https://nuxt.com/modules/fonts"><code>@nuxt/fonts</code></a>.
      <a href="https://nuxt.com/modules/fonts/migrating-from-google-fonts">Read the migration guide →</a>
    </div>
    <AppLayout>
      <NuxtPage />
    </AppLayout>
  </div>
</template>

<style scoped>
.deprecation-banner {
  padding: 0.625rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
  background: #fef3c7;
  color: #78350f;
}

.deprecation-banner a {
  font-weight: 600;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.deprecation-banner code {
  font-size: 0.8125rem;
}

html.dark .deprecation-banner {
  background: #451a03;
  color: #fde68a;
}
</style>
