import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://app.lovenzea.online',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://app.lovenzea.online',
        ws: true,
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://app.lovenzea.online',
        changeOrigin: true,
      }
    }
  }
})
