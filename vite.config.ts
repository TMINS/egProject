import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "192.168.1.211",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // "/io": {
      //   target: "localhost:3000",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/io/, ""),
      // },
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  css: {
    //css预处理
    preprocessorOptions: {
      scss: {
        //引入var.scss全局预定义变量
        additionalData: '@import "./src/style/const.scss";',
      },
    },
  },
});
