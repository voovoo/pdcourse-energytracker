import { dayData } from '../utils/simulation.js'

// Vite dev-server plugin that exposes energy stats as a local REST API.
// Registered in vite.config.js.
//
// Endpoints:
//   GET /api/stats/daily  — hourly kWh breakdown for today
export function statsApiPlugin() {
  return {
    name: 'stats-api',
    configureServer(server) {
      server.middlewares.use('/api/stats', (req, res, next) => {
        if (req.url !== '/daily') return next()

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(dayData()))
      })
    },
  }
}
