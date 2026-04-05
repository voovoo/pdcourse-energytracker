import { useState } from 'react'
import './Settings.css'

export default function Settings({ tariff, onClose, onSave }) {
  const [value, setValue] = useState(String(tariff))
  const [error, setError] = useState('')

  function handleSave() {
    const n = parseFloat(value)
    if (isNaN(n) || n <= 0) {
      setError('Enter a valid positive number')
      return
    }
    onSave(n)
    onClose()
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          <label className="field-label">Electricity tariff (€ / kWh)</label>
          <div className="field-row">
            <span className="field-prefix">€</span>
            <input
              type="number"
              step="0.001"
              min="0"
              value={value}
              onChange={e => { setValue(e.target.value); setError('') }}
              className="field-input"
              autoFocus
            />
          </div>
          {error && <p className="field-error">{error}</p>}
          <p className="field-hint">
            Check your energy bill for the exact rate. Dutch average is around € 0.22/kWh.
          </p>
        </div>

        <div className="settings-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
