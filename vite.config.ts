import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import ui from "@nuxt/ui/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ui({
      ui: {
        colors: {
          primary: "slate",
          secondary: "slate",
          success: "emerald",
          info: "slate",
          warning: "slate",
          error: "rose",
          neutral: "neutral",
        },
      },
    }),
    vue(),
    vueDevTools(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@nuxt/ui") || id.includes("@iconify")) {
            return "nuxt-ui";
          }
          if (
            id.includes("node_modules/vue/") ||
            id.includes("node_modules/vue-router") ||
            id.includes("node_modules/pinia") ||
            id.includes("node_modules/vue-i18n")
          ) {
            return "vue-vendor";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
