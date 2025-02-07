import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup/client-setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
