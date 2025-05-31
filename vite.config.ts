import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['msw'],
  },
  server: {
    allowedHosts: ['.ngrok-free.app'], // 모든 ngrok 주소 허용
    host: true // 외부 접근 허용 (필수)
  }
})
