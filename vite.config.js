import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use root base for custom domain (warframe-arsenal.com)
  // Change to '/warframe-arsenal/' if deploying to GitHub Pages subpath
  base: '/',
})
