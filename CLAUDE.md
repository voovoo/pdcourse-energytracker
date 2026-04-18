# Energy Tracker

A HomeWizard-inspired dashboard for monitoring home energy consumption. Built with React + Vite.

## Stack

- **React 18** + **Vite 6**
- **Recharts** for charts
- No backend — data comes from `src/api/energy.js` which tries `VITE_API_URL` first, falls back to local recorded meter data

## Project Structure

```
src/
  api/
    energy.js          # Public data API — fetchDayData / fetchWeekData / fetchYearData
    statsPlugin.js     # Vite plugin: serves GET /api/stats/daily in dev, writes dist/api/stats/daily.json at build
  components/
    EnergyGraph.jsx    # Recharts charts for all four views (live, day, week, year)
    StatsCards.jsx     # Summary stat cards (Now, Today, Projected, CO₂, Peak hour)
    TimeToggle.jsx     # Live / Day / Week / Year toggle
    Settings.jsx       # Tariff configuration modal
  hooks/
    useLiveData.js     # Polls nextLiveWatts() every 2s, keeps 60-point rolling window
  utils/
    meter.js           # Recorded P1 meter data — used as fallback when API is unavailable
    experiments.js     # Feature flag registry (experimentIsRunning)
```

## Dev

```bash
npm install
npm run dev       # http://localhost:5173
```

`GET /api/stats/daily` is available on the dev server (served by `statsPlugin`).

## Environment

| Variable        | Description                              |
|-----------------|------------------------------------------|
| `VITE_API_URL`  | Base URL of a real backend (optional). If unset, all data comes from `meter.js`. |


