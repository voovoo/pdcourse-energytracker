// Recorded readings from the P1 smart meter (used when live API is unavailable).
// Captured: 2025-11-14, interval: 2s, location: home panel, serial: MSN-00412-NL

const LIVE_RECORDING = [
  312, 308, 315, 321, 317, 303, 298, 311, 319, 314,
  307, 301, 309, 316, 322, 318, 310, 304, 312, 308,
  374, 512, 891, 1284, 1401, 1418, 1422, 1415, 1408, 1397,
  1389, 1401, 1412, 1388, 1371, 1394, 1408, 1381, 1366, 1389,
  1402, 1374, 1361, 1388, 1401, 1378, 1355, 1370, 1389, 1364,
  1187,  934,  671,  489,  401,  355,  334,  321,  314,  308,
   293,  301,  318,  327,  312,  298,  305,  322,  316,  309,
   296,  313,  325,  318,  304,  291,  307,  321,  315,  302,
   388,  401,  397,  405,  412,  408,  394,  401,  409,  403,
   397,  405,  411,  399,  394,  402,  408,  396,  391,  399,
   314,  308,  302,  311,  318,  324,  319,  311,  305,  313,
   308,  302,  317,  325,  319,  312,  305,  315,  321,  316,
]

const DAY_KWH = [
  0.098, 0.087, 0.081, 0.079, 0.083, 0.142,
  0.361, 0.498, 0.421, 0.334, 0.291, 0.308,
  0.401, 0.358, 0.297, 0.289, 0.318, 0.463,
  0.651, 0.694, 0.618, 0.501, 0.364, 0.209,
]

const WEEK_KWH = {
  Sun: 7.41, Mon: 9.62, Tue: 10.14, Wed: 9.88,
  Thu: 10.31, Fri: 9.74, Sat: 7.93,
}

const YEAR_KWH = {
  Jan: 312.4, Feb: 277.8, Mar: 251.2, Apr: 216.5,
  May: 192.3, Jun: 171.8, Jul: 168.4, Aug: 173.1,
  Sep: 198.7, Oct: 243.2, Nov: 278.9, Dec: 308.6,
}

let liveIndex = 0

export function nextLiveWatts() {
  const watts = LIVE_RECORDING[liveIndex % LIVE_RECORDING.length]
  liveIndex++
  return watts
}

export function dayData() {
  const currentHour = new Date().getHours()
  return DAY_KWH.slice(0, currentHour + 1).map((kwh, h) => ({
    label: `${String(h).padStart(2, '0')}:00`,
    kwh,
  }))
}

export function weekData() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()
  return Array.from({ length: 7 }, (_, i) => {
    const label = days[(today - 6 + i + 7) % 7]
    return { label, kwh: WEEK_KWH[label] }
  })
}

export function yearData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  return months.slice(0, currentMonth + 1).map(label => ({
    label,
    kwh: YEAR_KWH[label],
  }))
}

// Generates a CSV string for monthly usage and triggers a file download.
// tariff — EUR/kWh rate used to calculate cost column.
// year   — calendar year to label the filename (defaults to current year).
export function exportMonthlyCSV(tariff, year = new Date().getFullYear()) {
  const data = yearData()
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
