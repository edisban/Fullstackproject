import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5176,
      clientPort: 5176,
    },
    proxy: {
      // Forward any /api/* calls during dev to the Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5176,
    strictPort: true,
  },
})