import { useEffect } from 'react'
import { useActionBar } from '../context/ActionBarContext'

export function SnapDetails() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/tanf-details',
      previousTo: '/eligible-benefits',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <div className="card">
        <h3 className="section-title">SNAP — Food & basic needs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Do you prepare meals at home?</label>
            <select className="select">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label className="field-label">Have you received SNAP or food stamps in the past?</label>
            <select className="select">
              <option>No</option>
              <option>Yes — in this state</option>
              <option>Yes — in another state</option>
            </select>
          </div>
          <div>
            <label className="field-label">If yes, when did you last receive benefits?</label>
            <input type="month" className="input" />
          </div>
        </div>
      </div>
    </div>
  )
}
