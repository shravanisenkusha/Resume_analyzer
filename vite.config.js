import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Resume_analyzer/', // 👈 important for GitHub Pages
  plugins: [react()],
  server: {
    port: 3000,
  },
})
