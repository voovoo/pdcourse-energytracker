import './StatsCards.css'

// NEED REFACTORING: business logic (CO2 calc, peak-hour loop, monthly savings)
// should be extracted out of this UI component into a custom hook or utility.

const CO2_PER_KWH = 0.389 // kg CO₂ per kWh (Dutch grid average, 2024)

function fmt(n, decimals = 2) {
  return n.toFixed(decimals)
}

export default function StatsCards({ liveWatts, dayData, yearData, tariff, showSavings }) {
  const todayKwh = dayData.reduce((sum, d) => sum + d.kwh, 0)
  const todayCost = todayKwh * tariff
  const projectedKwh = (todayKwh / (new Date().getHours() + 1)) * 24
  const projectedCost = projectedKwh * tariff

  const todayCo2 = todayKwh * CO2_PER_KWH
  const projectedCo2 = projectedKwh * CO2_PER_KWH

  let peakHour = null
  let peakKwh = 0
  for (const point of dayData) {
    if (point.kwh > peakKwh) {
      peakKwh = point.kwh
      peakHour = point.label
    }
  }

  const currentKwh  = yearData.at(-1)?.kwh ?? 0
  const previousKwh = yearData.at(-2)?.kwh ?? 0
  const savedKwh    = previousKwh - currentKwh
  const savedCost   = savedKwh * tariff

  const cards = [
    {
      label: 'Now',
      value: `${liveWatts} W`,
      sub: `${fmt(liveWatts / 1000, 3)} kW`,
      accent: liveWatts > 1000 ? 'red' : liveWatts > 500 ? 'amber' : 'green',
    },
    {
      label: 'Today',
      value: `${fmt(todayKwh)} kWh`,
      sub: `€ ${fmt(todayCost)}`,
    },
    {
      label: 'Projected day',
      value: `${fmt(projectedKwh)} kWh`,
      sub: `€ ${fmt(projectedCost)}`,
    },
    {
      label: 'CO₂ today',
      value: `${fmt(todayCo2, 2)} kg`,
      sub: `${fmt(projectedCo2, 2)} kg projected`,
    },
    {
      label: 'Peak hour',
      value: peakHour ?? '—',
      sub: peakHour ? `${fmt(peakKwh, 3)} kWh` : 'no data',
    },
  ]

  if (showSavings) {
    cards.push({
      label: 'Monthly savings',
      value: `${savedKwh >= 0 ? '-' : '+'}${fmt(Math.abs(savedKwh), 1)} kWh`,
      sub: `€ ${fmt(Math.abs(savedCost))} vs last month`,
      accent: savedKwh >= 0 ? 'green' : 'red',
      wide: true,
    })
  }

  return (
    <div className="stats-grid">
      {cards.map(card => (
        <div key={card.label} className={`stat-card ${card.accent || ''} ${card.wide ? 'wide' : ''}`}>
          <span className="stat-label">{card.label}</span>
          <span className="stat-value">{card.value}</span>
          <span className="stat-sub">{card.sub}</span>
        </div>
      ))}
    </div>
  )
}
