import { useEffect } from 'react'
import { SummaryCard } from '../components/ui/SummaryCard'
import { useActionBar } from '../context/ActionBarContext'

export function Expenses() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/housing',
      previousTo: '/income',
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <SummaryCard title="Child care" summary="$0 monthly" onEdit={() => {}}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label className="field-label">Provider</label>
            <input className="input" placeholder="Name" />
          </div>
          <div>
            <label className="field-label">Monthly amount</label>
            <input type="number" className="input" placeholder="0" />
          </div>
        </div>
      </SummaryCard>
      <SummaryCard title="Medical expenses" summary="$0 monthly" onEdit={() => {}}>
        <div>
          <label className="field-label">Monthly amount</label>
          <input type="number" className="input" placeholder="0" />
        </div>
      </SummaryCard>
      <button type="button" className="btn btn-secondary">
        + Add expense
      </button>
    </div>
  )
}
