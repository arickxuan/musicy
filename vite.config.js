import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers' // 注意：Vuetify 3 使用 Vuet

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          // 如果你需要自动导入 Vuetify 的 composables
          'vuetify': ['useTheme', 'useDisplay'], // 按需添加你需要的 composables
        }
      ],
      dts: true // 生成自动导入的 TypeScript 声明文件
    }),
    Components({
      resolvers: [
        // Vuetify 解析器
        Vuetify3Resolver(),
      ],
      dts: true // 生成组件类型声明文件
    })
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
