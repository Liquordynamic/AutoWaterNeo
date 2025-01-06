import path from 'path'
import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  plugins: [
    react(),
    glsl(),
  ],
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, './src/renderer/src'),
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // host: '0.0.0.0',
    headers: {
      // 'Content-Security-Policy': "worker-src 'self' blob:; default-src 'self';"
       'Content-Security-Policy': "worker-src 'self' blob: http://localhost:5173"
    }
  },
})
