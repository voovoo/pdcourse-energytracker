import './TimeToggle.css'

const TABS = [
  { id: 'live', label: 'Live' },
  { id: 'day',  label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'year', label: 'Year' },
]

export default function TimeToggle({ active, onChange }) {
  return (
    <div className="time-toggle">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`toggle-btn ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.id === 'live' && active === 'live' && (
            <span className="live-dot" />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
