import path from 'path'
import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
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
    host: '0.0.0.0',
  },
})
