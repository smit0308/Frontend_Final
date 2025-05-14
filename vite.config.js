// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.jsx', '**/*.js'],  // tell Vite to treat .js files as JSX too
      jsxRuntime: 'automatic',
    })
  ],
  base: './',
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
});
