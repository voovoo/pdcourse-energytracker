import fs from 'node:fs'
import path from 'node:path'
import { dayData } from '../utils/meter.js'

// Vite plugin that exposes energy stats as a REST API.
//
// Dev:        GET /api/stats/daily  served dynamically by the dev server
// Production: dist/api/stats/daily.json written at build time (pre-rendered)
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

    writeBundle(options) {
      const outDir = options.dir ?? 'dist'
      const dir = path.join(outDir, 'api', 'stats')
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(
        path.join(dir, 'daily.json'),
        JSON.stringify(dayData(), null, 2)
      )
    },
  }
}
