// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n", "@pinia/nuxt", "@pinia/colada-nuxt", "@nuxt/icon", "@vueuse/nuxt", "@nuxt/eslint"],
  components: {
    dirs: [{ path: "~/components/ui", pathPrefix: false }, "~/components"],
  },
  imports: {
    scan: false,
  },
  devtools: { enabled: true },
  app: {
    layoutTransition: { name: "player" },
  },
  css: ["~/assets/scss/base.scss"],
  runtimeConfig: {
    public: {
      backendHost: "https://backend.podd.huseli.us",
      frontendHost: "https://podd.huseli.us",
      siteName: "podd.huseli.us",
    },
  },
  compatibilityDate: "2025-07-15",
  vite: {
    optimizeDeps: {
      include: ["@pinia/colada", "@vueuse/core", "pinia", "vue-i18n", "@lucide/vue"],
    },
  },
  eslint: {
    config: {
      autoInit: true,
      formatters: false,
      import: false,
      stylistic: false,
      standalone: false,
    },
  },
  i18n: {
    strategy: "no_prefix",
    locales: [
      { code: "en", language: "en-UK", file: "en.json" },
      { code: "sv", language: "sv-SE", file: "sv.json" },
    ],
  },
});
