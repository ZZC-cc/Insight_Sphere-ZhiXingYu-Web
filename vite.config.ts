import vue from "@vitejs/plugin-vue";
import * as path from "path";
import UnoCSS from "unocss/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "localhost",
    port: 9520,
    proxy: {
      "/api": {
        target: "http://localhost:9666", // 目标地址
        changeOrigin: true, // 修改请求源
      },
    },
  },
});
