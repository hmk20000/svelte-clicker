import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 8080
  },
  preview: {
    port: 8080
  },
  base: '',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
}) 