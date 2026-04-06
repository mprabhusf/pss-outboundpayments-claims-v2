import { useEffect } from 'react'
import { SummaryCard } from '../components/ui/SummaryCard'
import { DocumentCenter } from '../components/ui/DocumentCenter'
import { useActionBar } from '../context/ActionBarContext'

export function Assets() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/eligible-benefits',
      previousTo: '/housing',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <SummaryCard title="Bank accounts" summary="No accounts added" onEdit={() => {}}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Institution</label>
            <input className="input" placeholder="Bank name" />
          </div>
          <div>
            <label className="field-label">Balance</label>
            <input type="number" className="input" placeholder="0" />
          </div>
        </div>
        <DocumentCenter
          title="Document Center"
          helperText="Upload bank statements or other asset verification. Uploading documents allows the system to auto-fill parts of the form."
          acceptedFileTypes={['.pdf', '.jpeg', '.png']}
        />
      </SummaryCard>
      <SummaryCard title="Other assets" summary="No other assets" onEdit={() => {}}>
        <div>
          <label className="field-label">Description and value</label>
          <input className="input" placeholder="e.g. Vehicle, property" />
        </div>
      </SummaryCard>
      <button type="button" className="btn btn-secondary">
        + Add asset
      </button>
    </div>
  )
}
