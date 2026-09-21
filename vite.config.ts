import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLEFILE=1 npm run build  -> jeden HTML soubor (náhled / offline)
// npm run build               -> normální build pro Vercel
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.SINGLEFILE ? [viteSingleFile()] : []),
  ],
})
