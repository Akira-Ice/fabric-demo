import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "./",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    port: "8080",
    proxy: {
      // "/api": {
      //   target: "http://localhost:5000/",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""), // 不可以省略rewrite
      // },
      // "/cilent": {
      //   target: "https://test.iclass30.com",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/cilent/, ""), // 不可以省略rewrite
      // },
    },
  },
});
