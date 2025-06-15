import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5175,
    strictPort: true,
    open: true, // Автоматически открывает браузер
  },
})