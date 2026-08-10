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
        secure: false,
      },
      '/ws': {
        target: 'https://api.lovenzea.online',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://api.lovenzea.online',
        changeOrigin: true,
        secure: false,
      }
      // NOTE: /ws proxy removed in dev — WS disabled until backend CORS includes localhost
    }
  }
})

