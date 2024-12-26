import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, './src/renderer/src'),
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // port:
    host:'0.0.0.0',
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000', // 后端服务器地址
    //     changeOrigin: true, // 重写请求头中的host为target的host
    //     rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，去掉/api前缀
    //   },
    // }
  }
})
