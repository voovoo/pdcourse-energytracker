import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function statsApiPlugin() {
  return {
    name: 'stats-api',
    configureServer(server) {
      server.middlewares.use('/api/stats', async (req, res, next) => {
        const { generateDayData } = await import('./src/utils/simulation.js')

        if (req.url !== '/daily') return next()

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(generateDayData()))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), statsApiPlugin()],
})
