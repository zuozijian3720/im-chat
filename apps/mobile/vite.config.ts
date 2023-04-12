import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import presetIcons from "@unocss/preset-icons";
import presetWind from "@unocss/preset-wind";
import presetAttributify from "@unocss/preset-attributify";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetIcons({
          /* options */
        }),
        presetAttributify({
          /* preset options */
        }),
        presetWind(),
      ],
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "IM Chat",
        short_name: "IM Chat",
        description: "A chat tool",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/icon-48.webp",
            type: "image/png",
            sizes: "48x48",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-72.webp",
            type: "image/png",
            sizes: "72x72",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-96.webp",
            type: "image/png",
            sizes: "96x96",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-128.webp",
            type: "image/png",
            sizes: "128x128",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-192.webp",
            type: "image/png",
            sizes: "192x192",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-256.webp",
            type: "image/png",
            sizes: "256x256",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-512.webp",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
