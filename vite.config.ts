import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/SlotGame/' : '/',
  build: {
    cssCodeSplit: false, 
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // ← Delete console.logs
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
}))