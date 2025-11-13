import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: 'localhost', // This allows access from other devices on the network
    port: 5173,
    strictPort: true,
  },
})
