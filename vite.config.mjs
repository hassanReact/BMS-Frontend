import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.xlsx'],  // 👈 tell Vite to handle xlsx as asset
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
