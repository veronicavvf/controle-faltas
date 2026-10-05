import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // Redireciona qualquer requisição /api para o backend
    }
  }
})