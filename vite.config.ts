import { URL, fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vueRouter from "vue-router/vite";
import { yamlPlugin } from "vite-yaml-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [yamlPlugin(), vueRouter(), vue(), vueDevTools()],
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
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: mode === "development" ? "http://localhost:4200" : "https://podd.huseli.us",
}));
