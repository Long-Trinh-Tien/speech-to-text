import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'englishapp',
  plugins: [react()],
  build: {
    outDir: 'englishapp/dist',
    emptyOutDir: true,
  },
})
