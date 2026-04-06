import { useEffect } from 'react'
import { useActionBar } from '../context/ActionBarContext'

export function MedicaidDetails() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/acknowledgement',
      previousTo: '/tanf-details',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <div className="card">
        <h3 className="section-title">MEDICAID — Health coverage</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Do you have health insurance now?</label>
            <select className="select">
              <option>No</option>
              <option>Yes — employer</option>
              <option>Yes — other</option>
            </select>
          </div>
          <div>
            <label className="field-label">Any special health needs or disabilities to report?</label>
            <textarea className="textarea" placeholder="Optional" rows={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
