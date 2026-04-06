import { useEffect } from 'react'
import { useActionBar } from '../context/ActionBarContext'

export function TanfDetails() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/medicaid-details',
      previousTo: '/snap-details',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <div className="card">
        <h3 className="section-title">TANF — Work and school</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Are you currently in school or training?</label>
            <select className="select">
              <option>No</option>
              <option>Yes — full time</option>
              <option>Yes — part time</option>
            </select>
          </div>
          <div>
            <label className="field-label">Work search status</label>
            <select className="select">
              <option>Actively looking for work</option>
              <option>Employed</option>
              <option>Not looking</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
