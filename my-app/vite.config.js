import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // For SPA routing - all routes should serve index.html
  preview: {
    port: 4173,
  },
})
