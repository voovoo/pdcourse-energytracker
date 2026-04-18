import { dayData, weekData, yearData } from '../utils/simulation.js'

// Base URL of the real backend. Set VITE_API_URL in .env to point at a live server.
// If unset, all calls fall back to local mock data.
const API_BASE = import.meta.env.VITE_API_URL

async function fetchOrMock(path, mockFn) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}${path}`)
      if (res.ok) return res.json()
    } catch {}
  }
  return mockFn()
}

export const fetchDayData  = () => fetchOrMock('/stats/daily',   dayData)
export const fetchWeekData = () => fetchOrMock('/stats/weekly',  weekData)
export const fetchYearData = () => fetchOrMock('/stats/monthly', yearData)
