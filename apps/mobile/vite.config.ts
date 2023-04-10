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
        theme_color: "#F3F4F6",
        icons: [
          {
            src: "icon_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon_512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
