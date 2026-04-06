import { Link, useNavigate } from 'react-router-dom'
import styles from './BottomActionBar.module.css'

interface BottomActionBarProps {
  /** Primary CTA label: Next, Proceed, Submit, etc. */
  primaryLabel: string
  primaryTo?: string
  onPrimaryClick?: () => void
  /** Path for Previous button */
  previousTo?: string
  /** Show Save for Later */
  showSave?: boolean
  /** Disable primary (e.g. until form valid) */
  primaryDisabled?: boolean
}

export function BottomActionBar({
  primaryLabel,
  primaryTo,
  onPrimaryClick,
  previousTo,
  showSave = true,
  primaryDisabled = false,
}: BottomActionBarProps) {
  const navigate = useNavigate()

  const handlePrimary = () => {
    if (onPrimaryClick) onPrimaryClick()
    else if (primaryTo) navigate(primaryTo)
  }

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {showSave && (
          <button type="button" className={`btn ${styles.saveForLater}`}>
            Save for Later
          </button>
        )}
      </div>
      <div className={styles.right}>
        {previousTo && (
          <Link to={previousTo} className="btn btn-secondary">
            Previous
          </Link>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={primaryDisabled}
          onClick={handlePrimary}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  )
}
