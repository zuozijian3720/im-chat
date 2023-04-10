import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import presetIcons from "@unocss/preset-icons";
import presetWind from "@unocss/preset-wind";
import presetAttributify from "@unocss/preset-attributify";
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
  ],
});
