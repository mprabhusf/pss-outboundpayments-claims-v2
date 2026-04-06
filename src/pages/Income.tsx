import { useEffect } from 'react'
import { SummaryCard } from '../components/ui/SummaryCard'
import { DocumentCenter } from '../components/ui/DocumentCenter'
import { useActionBar } from '../context/ActionBarContext'

export function Income() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/expenses',
      previousTo: '/household',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <SummaryCard
        title="Employment income"
        summary="Wages, salary — $0 reported"
        onEdit={() => {}}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Source</label>
            <input className="input" placeholder="Employer name" />
          </div>
          <div>
            <label className="field-label">Amount (monthly)</label>
            <input type="number" className="input" placeholder="0" />
          </div>
        </div>
        <DocumentCenter
          title="Document Center"
          helperText="Upload pay stubs or other income verification. Uploading documents allows the system to auto-fill parts of the form."
          acceptedFileTypes={['.pdf', '.jpeg', '.png']}
        />
      </SummaryCard>
      <SummaryCard
        title="Other income"
        summary="No other income added"
        onEdit={() => {}}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Type</label>
            <select className="select">
              <option>Unemployment</option>
              <option>Child support</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="field-label">Amount (monthly)</label>
            <input type="number" className="input" placeholder="0" />
          </div>
        </div>
      </SummaryCard>
      <button type="button" className="btn btn-secondary">
        + Add income source
      </button>
    </div>
  )
}
