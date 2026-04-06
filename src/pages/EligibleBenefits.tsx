import { useEffect, useState } from 'react'
import { useActionBar } from '../context/ActionBarContext'
import styles from './EligibleBenefits.module.css'

const ELIGIBLE_PROGRAMS = [
  { id: 'SNAP', name: 'SNAP', description: 'Supplemental Nutrition Assistance Program — help with food costs.' },
  { id: 'TANF', name: 'TANF', description: 'Temporary Assistance for Needy Families — cash assistance and work support.' },
  { id: 'Medicaid', name: 'MEDICAID', description: 'Health coverage for eligible adults and children.' },
]

const ALL_BENEFITS = [
  { category: 'Food & basic needs', programs: ['SNAP', 'WIC', 'School meals'] },
  { category: 'Cash & work', programs: ['TANF', 'Unemployment', 'General Assistance'] },
  { category: 'Health', programs: ['Medicaid', 'CHIP', 'Medicare Savings'] },
  { category: 'Housing', programs: ['Section 8', 'LIHEAP', 'Emergency shelter'] },
]

export function EligibleBenefits() {
  const { setActionBar } = useActionBar()
  const [viewAll, setViewAll] = useState(false)
  const [selected, setSelected] = useState(['SNAP', 'TANF', 'Medicaid'])

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Proceed to Apply',
      primaryTo: '/snap-details',
      previousTo: '/assets',
      showSave: true,
    })
  }, [setActionBar])

  const toggle = (id: string) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    )
  }

  return (
    <div>
      <div className={styles.revaluate}>
        <button type="button" className="btn btn-info">
          Re-Evaluate my Benefits
        </button>
      </div>
      <div className="card">
        <h3 className="section-title">Eligible Programs</h3>
        <p className="helper-text" style={{ marginBottom: 'var(--space-4)' }}>
          Based on your information, you may be eligible for the following. Select the programs you want to apply for.
        </p>
        <div className={styles.programCards}>
          {ELIGIBLE_PROGRAMS.map((program) => {
            const isSelected = selected.includes(program.id)
            return (
              <div key={program.id} className={styles.programCard}>
                <div className={styles.programCardHeader}>
                  <span className={styles.programName}>{program.name}</span>
                  <button type="button" className={styles.infoBtn} aria-label="More information">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </button>
                </div>
                <p className={styles.programDesc}>{program.description}</p>
                <div className={styles.programActions}>
                  {isSelected ? (
                    <>
                      <span className={styles.selectedBadge}>Selected</span>
                      <button type="button" className={styles.deselectLink} onClick={() => toggle(program.id)}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={() => toggle(program.id)}>
                      Apply
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setViewAll((v) => !v)}
        >
          {viewAll ? 'Collapse' : 'View all Benefits'}
        </button>
      </div>
      {viewAll && (
        <div className="card" style={{ marginTop: 'var(--space-4)' }}>
          <h3 className="section-title">All benefits</h3>
          {ALL_BENEFITS.map((cat) => (
            <div key={cat.category} className={styles.category}>
              <h4 className={styles.catTitle}>{cat.category}</h4>
              <ul className={styles.programList}>
                {cat.programs.map((p) => (
                  <li key={p}>
                    <span className={styles.programName}>{p}</span>
                    <span className="helper-text"> — Eligibility criteria may apply.</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
