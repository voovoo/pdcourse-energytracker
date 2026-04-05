import { useState, useEffect } from 'react'
import { useLiveData } from './hooks/useLiveData'
import { generateDayData, generateWeekData, generateYearData } from './utils/simulation'
import TimeToggle from './components/TimeToggle'
import StatsCards from './components/StatsCards'
import EnergyGraph from './components/EnergyGraph'
import Settings from './components/Settings'
import './App.css'

export default function App() {
  const [view, setView]           = useState('live')
  const [tariff, setTariff]       = useState(0.22)
  const [showSettings, setSettings] = useState(false)

  const livePoints = useLiveData()
  const currentWatts = livePoints[livePoints.length - 1]?.watts ?? 0

  const [dayData,  setDayData]  = useState(() => generateDayData())
  const [weekData, setWeekData] = useState(() => generateWeekData())
  const [yearData, setYearData] = useState(() => generateYearData())

  // Refresh static datasets once per minute
  useEffect(() => {
    const id = setInterval(() => {
      setDayData(generateDayData())
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  const viewLabel = {
    live: 'Live consumption',
    day:  "Today's hourly consumption",
    week: 'This week — daily totals',
    year: 'This year — monthly totals',
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">Energy Tracker</span>
        </div>
        <button className="settings-btn" onClick={() => setSettings(true)} title="Settings">
          <SettingsIcon />
        </button>
      </header>

      <main className="app-main">
        <StatsCards
          liveWatts={currentWatts}
          dayData={dayData}
          tariff={tariff}
        />

        <section className="graph-section">
          <div className="graph-top">
            <h2 className="graph-title">{viewLabel[view]}</h2>
            <TimeToggle active={view} onChange={setView} />
          </div>
          <EnergyGraph
            view={view}
            livePoints={livePoints}
            dayData={dayData}
            weekData={weekData}
            yearData={yearData}
            tariff={tariff}
          />
        </section>
      </main>

      {showSettings && (
        <Settings
          tariff={tariff}
          onClose={() => setSettings(false)}
          onSave={setTariff}
        />
      )}
    </div>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
