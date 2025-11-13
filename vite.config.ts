import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5176,
    strictPort: true,
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
    host: 'localhost',
    port: 5176,
    strictPort: true,
  },
})