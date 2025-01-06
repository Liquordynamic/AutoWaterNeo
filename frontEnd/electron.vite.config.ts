import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      headers: {
        // 'Content-Security-Policy': "worker-src 'self' blob:; default-src 'self';"
         'Content-Security-Policy': "worker-src 'self' blob: http://localhost:5173"
      }
    }
  }
})
