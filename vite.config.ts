import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        arrows: false,
        keep_infinity: true,
        passes: 3
      },
      format: {
        comments: false
      }
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          lit: ['lit'],
          marked: ['marked', 'dompurify', 'highlight.js'],
          jszip: ['jszip'],
          pica: ['pica']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    cors: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    cors: true
  }
});