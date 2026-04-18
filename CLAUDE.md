# Energy Tracker

A HomeWizard-inspired dashboard for monitoring home energy consumption. Built with React + Vite.

## Stack

- **React 18** + **Vite 6**
- **Recharts** for charts
- No dedicated backend — data comes from `src/api/energy.js`, which calls `VITE_API_URL` if configured, otherwise falls back to recorded meter data from `src/utils/meter.js`

## Project Structure

```
src/
  api/
    energy.js          # Public data layer — fetchDayData / fetchWeekData / fetchYearData
                       # Each function tries VITE_API_URL first, falls back to meter.js on failure
    statsPlugin.js     # Vite plugin: GET /api/stats/daily in dev (dynamic);
                       # writes dist/api/stats/daily.json as a static file at build time
  components/
    EnergyGraph.jsx    # Recharts charts for all four views (live, day, week, year)
    StatsCards.jsx     # Stat cards: Now, Today, Projected day, CO₂ today, Peak hour
    TimeToggle.jsx     # Live / Day / Week / Year view selector
    Settings.jsx       # Tariff configuration modal
  hooks/
    useLiveData.js     # Polls nextLiveWatts() every 2s, maintains 60-point rolling window
  utils/
    meter.js           # Recorded P1 smart meter data (serial MSN-00412-NL, 2025-11-14)
                       # Used as offline fallback — no random generation
    experiments.js     # Feature flag registry — experimentIsRunning(name) returns rollout %
```

## Dev

```bash
npm install
npm run dev       # http://localhost:5173
```

`GET /api/stats/daily` returns hourly kWh data for today as JSON.  
Available on the dev server via `statsPlugin`, and as a static file in production (`dist/api/stats/daily.json`).

## Environment

| Variable       | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `VITE_API_URL` | Base URL of a real backend (e.g. `https://api.example.com`). Optional — if unset, all data served from `meter.js`. |
