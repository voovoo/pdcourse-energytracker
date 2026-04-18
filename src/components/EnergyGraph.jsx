import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import './EnergyGraph.css'

const TICK_STYLE = { fill: 'var(--text-muted)', fontSize: 12 }

function LiveTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const w = payload[0].value
  return (
    <div className="graph-tooltip">
      <span>{w} W</span>
    </div>
  )
}

function KwhTooltip({ active, payload, label, tariff }) {
  if (!active || !payload?.length) return null
  const kwh = payload[0].value
  return (
    <div className="graph-tooltip">
      <div className="tt-label">{label}</div>
      <div>{kwh} kWh</div>
      <div className="tt-cost">€ {(kwh * tariff).toFixed(3)}</div>
    </div>
  )
}

function LiveGraph({ points }) {
  const avg = Math.round(points.reduce((s, p) => s + p.watts, 0) / points.length)
  const now = new Date()
  const maxT = points[points.length - 1]?.t ?? 0
  const ticks = points.filter((_, i) => i % 30 === 0).map(p => p.t)
  const timeFormatter = t => {
    const d = new Date(now - (maxT - t) * 2000)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="t" ticks={ticks} tickFormatter={timeFormatter}
               tick={TICK_STYLE} axisLine={false} tickLine={false} />
        <YAxis domain={['auto', 'auto']} tick={TICK_STYLE} width={50}
               tickFormatter={v => `${v}W`} />
        <Tooltip content={<LiveTooltip />} />
        <ReferenceLine y={avg} stroke="var(--text-muted)" strokeDasharray="4 3"
                       label={{ value: `avg ${avg}W`, fill: 'var(--text-muted)', fontSize: 11, position: 'insideTopRight' }} />
        <Area type="monotone" dataKey="watts" stroke="var(--accent)"
              strokeWidth={2} fill="url(#liveGrad)" dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Use hex values — CSS vars are unreliable inside SVG stopColor attributes
const HEX = { day: '#4493f8', week: '#3fb950', year: '#bc8cff' }

function KwhGraph({ data, tariff, color, gradId }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                barCategoryGap="30%">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={TICK_STYLE} width={50} tickFormatter={v => `${v}`}
               unit=" kWh" />
        <Tooltip content={<KwhTooltip tariff={tariff} />} />
        <Bar dataKey="kwh" fill={`url(#${gradId})`} radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function EnergyGraph({ view, livePoints, dayData, weekData, yearData, tariff }) {
  return (
    <div className="graph-container">
      {view === 'live' && <LiveGraph points={livePoints} />}
      {view === 'day'  && <KwhGraph data={dayData}  tariff={tariff} color={HEX.day}  gradId="barGrad-day" />}
      {view === 'week' && <KwhGraph data={weekData} tariff={tariff} color={HEX.week} gradId="barGrad-week" />}
      {view === 'year' && <KwhGraph data={yearData} tariff={tariff} color={HEX.year} gradId="barGrad-year" />}
    </div>
  )
}
