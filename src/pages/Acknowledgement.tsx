import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActionBar } from '../context/ActionBarContext'

export function Acknowledgement() {
  const { setActionBar } = useActionBar()
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [signature, setSignature] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Submit',
      onPrimaryClick: () => navigate('/confirmation'),
      previousTo: '/medicaid-details',
      showSave: true,
      primaryDisabled: !agreed || !signature.trim(),
    })
  }, [setActionBar, agreed, signature, navigate])

  return (
    <div>
      <div className="card">
        <h3 className="section-title">Final check & signature</h3>
        <p className="helper-text" style={{ marginBottom: 'var(--space-4)' }}>
          By signing, you confirm that the information you provided is true and complete to the best of your knowledge.
        </p>
        <label className="checkbox-group" style={{ marginBottom: 'var(--space-6)' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I certify that all information provided is true and accurate.</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Electronic signature (type your full name)</label>
            <input
              className="input"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Full legal name"
            />
          </div>
          <div>
            <label className="field-label">Signature date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
