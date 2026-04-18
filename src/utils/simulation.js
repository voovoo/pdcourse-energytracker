// Realistic hourly consumption pattern (watts average per hour)
const HOURLY_WATTS = [
  120, 100, 90, 85, 90, 160,   // 00-05 (night / early morning)
  380, 520, 440, 340, 300, 320, // 06-11 (morning rush)
  420, 370, 310, 300, 330, 480, // 12-17 (midday / afternoon)
  680, 720, 640, 520, 380, 220, // 18-23 (evening peak)
]

// Appliance spikes: [name, extraWatts, durationSeconds]
const APPLIANCES = [
  ['Kettle', 2200, 180],
  ['Microwave', 1100, 120],
  ['Washing machine', 900, 1800],
  ['Oven', 2000, 2400],
  ['Dishwasher', 1200, 3600],
]

// State for live simulation
let liveWatts = 320
let spikeWatts = 0
let spikeRemaining = 0

export function nextLiveWatts() {
  const hour = new Date().getHours()
  const base = HOURLY_WATTS[hour]

  // Random appliance spike trigger (~3% chance each tick)
  if (spikeRemaining <= 0 && Math.random() < 0.03) {
    const [, extra, dur] = APPLIANCES[Math.floor(Math.random() * APPLIANCES.length)]
    spikeWatts = extra
    spikeRemaining = Math.ceil(dur / 2) // ticks (2s each)
  }

  if (spikeRemaining > 0) {
    spikeRemaining--
    if (spikeRemaining === 0) spikeWatts = 0
  }

  // Smooth toward base + noise
  const target = base + spikeWatts + (Math.random() - 0.5) * 80
  liveWatts = liveWatts * 0.85 + target * 0.15
  return Math.max(50, Math.round(liveWatts))
}

export function generateDayData() {
  const now = new Date()
  const currentHour = now.getHours()
  return Array.from({ length: 24 }, (_, h) => {
    if (h > currentHour) return null
    const watts = HOURLY_WATTS[h] + (Math.random() - 0.5) * 60
    const kwh = (Math.max(50, watts) / 1000)
    return { label: `${String(h).padStart(2, '0')}:00`, kwh: +kwh.toFixed(3) }
  }).filter(Boolean)
}

export function generateWeekData() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()
  return Array.from({ length: 7 }, (_, i) => {
    const dayIdx = (today - 6 + i + 7) % 7
    // weekdays use more than weekends (slightly)
    const isWeekend = dayIdx === 0 || dayIdx === 6
    const base = isWeekend ? 7.2 : 9.8
    const kwh = base + (Math.random() - 0.5) * 2
    return { label: days[dayIdx], kwh: +kwh.toFixed(2) }
  })
}

export function generateYearData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  // Winter months use more energy (heating)
  const monthlyBase = [310, 280, 255, 220, 195, 175, 170, 175, 200, 240, 275, 305]
  const currentMonth = new Date().getMonth()
  return Array.from({ length: 12 }, (_, i) => {
    if (i > currentMonth) return null
    const kwh = monthlyBase[i] + (Math.random() - 0.5) * 30
    return { label: months[i], kwh: +kwh.toFixed(1) }
  }).filter(Boolean)
}

// Generates a CSV string for monthly usage and triggers a file download.
// tariff — EUR/kWh rate used to calculate cost column.
// year   — calendar year to label the filename (defaults to current year).
export function exportMonthlyCSV(tariff, year = new Date().getFullYear()) {
  const data = generateYearData()
  const rows = [
    ['Month', 'kWh', 'Cost (EUR)'],
    ...data.map(({ label, kwh }) => [label, kwh, (kwh * tariff).toFixed(2)]),
  ]
  const csv = rows.map(r => r.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `energy-${year}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
