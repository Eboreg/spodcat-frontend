// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/scss/base.scss"],
  imports: {
    // autoImport: false,
  },
  vite: {
    optimizeDeps: {
      include: ["@pinia/colada", "@vueuse/core", "pinia", "vue-i18n", "@lucide/vue"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:map";
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_color.scss" as *;
            @use "@/assets/scss/_responsive.scss" as *;
          `,
        },
      },
    },
  },
  modules: ["@nuxtjs/i18n", "@pinia/nuxt", "@pinia/colada-nuxt", "@nuxt/icon", "@vueuse/nuxt"],
  i18n: {
    strategy: "no_prefix",
    locales: [
      { code: "en", language: "en-UK", file: "en.json" },
      { code: "sv", language: "sv-SE", file: "sv.json" },
    ],
  },
  runtimeConfig: {
    public: {
      backendHost: "https://backend.podd.huseli.us",
      frontendHost: "https://podd.huseli.us",
      siteName: "podd.huseli.us",
    },
  },
});
