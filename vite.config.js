import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',            // ← ensures CSS/JS paths are relative
  plugins: [react()],
  build: {
    outDir: 'build',     // your existing setting
    emptyOutDir: true,
  },
})
