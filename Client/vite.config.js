import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // הפורט שבו ה-Frontend רץ
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // הכתובת שבה השרת (Backend) שלך רץ
        changeOrigin: true,
        secure: false,
      }
    }
  }
})