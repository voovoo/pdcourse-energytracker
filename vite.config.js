import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { statsApiPlugin } from './src/api/statsPlugin.js'

export default defineConfig({
  plugins: [react(), statsApiPlugin()],
})
