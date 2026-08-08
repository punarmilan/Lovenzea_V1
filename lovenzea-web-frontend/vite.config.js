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
    proxy: {
      '/api': {
        target: 'https://api.lovenzea.online',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://api.lovenzea.online',
        ws: true,
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://api.lovenzea.online',
        changeOrigin: true,
      }
    }
  }
})
