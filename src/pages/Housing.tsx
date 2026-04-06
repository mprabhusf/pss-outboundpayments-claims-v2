import { useEffect } from 'react'
import { useActionBar } from '../context/ActionBarContext'

export function Housing() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/assets',
      previousTo: '/expenses',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <div className="card">
        <h3 className="section-title">Housing situation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Housing type</label>
            <select className="select">
              <option>Renting</option>
              <option>Own (with mortgage)</option>
              <option>Own (no mortgage)</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="field-label">Monthly rent or mortgage</label>
            <input type="number" className="input" placeholder="0" />
          </div>
          <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
            <legend className="field-label">Utilities included (check all that apply)</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <label className="checkbox-group">
                <input type="checkbox" /> Heat
              </label>
              <label className="checkbox-group">
                <input type="checkbox" /> Electricity
              </label>
              <label className="checkbox-group">
                <input type="checkbox" /> Water
              </label>
              <label className="checkbox-group">
                <input type="checkbox" /> Gas
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  )
}
