import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      overlay: false, // Disable error overlay to prevent blocking
    },
  },
  css: {
    postcss: {
      // Let Vite handle CSS processing, Tailwind will only process files with @import "tailwindcss"
    },
  },
})
