import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/", // keep as "/" if repo is username.github.io, else '/repo-name/'
})
