/* language: typescript */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const clientRoot = path.resolve(__dirname, 'client')

export default defineConfig({
  root: clientRoot,
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      '@': path.resolve(clientRoot, 'src'),
      '@assets': path.resolve(clientRoot, 'src/assets'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'docs'),
    emptyOutDir: true,
  },
})