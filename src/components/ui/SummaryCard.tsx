import { useState, ReactNode } from 'react'
import styles from './SummaryCard.module.css'

interface SummaryCardProps {
  title: string
  summary: ReactNode
  children: ReactNode
  onEdit?: () => void
  onDelete?: () => void
  defaultExpanded?: boolean
}

export function SummaryCard({
  title,
  summary,
  children,
  onEdit,
  onDelete,
  defaultExpanded = false,
}: SummaryCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={`card ${styles.card}`}>
      <div
        className={styles.header}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((ex) => !ex)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <div className={styles.headerContent}>
          <h4 className={styles.title}>{title}</h4>
          {!expanded && <div className={styles.summary}>{summary}</div>}
        </div>
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button type="button" className={styles.actionBtn} onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button type="button" className={styles.actionBtn} onClick={onDelete}>
              Delete
            </button>
          )}
          <span className={styles.expandIcon} aria-hidden>
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      {expanded && <div className={styles.body}>{children}</div>}
    </div>
  )
}
