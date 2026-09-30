import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://getloss.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules/react/') || normalized.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (normalized.includes('node_modules/jspdf') || normalized.includes('node_modules/html2canvas')) {
            return 'vendor-pdf';
          }
          if (normalized.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        }
      }
    }
  }
})
