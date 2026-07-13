import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://chepti.github.io/KolMini/
export default defineConfig({
  plugins: [react()],
  base: '/KolMini/',
})
