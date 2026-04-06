import { Link, useLocation } from 'react-router-dom'
import { useAppState } from '../../context/AppState'
import { SECTION_HEADERS } from '../../config/steps'
import styles from './LeftSectionNav.module.css'

function NavItem({
  to,
  label,
  active,
  unlocked,
}: { to: string; label: string; active: boolean; unlocked: boolean }) {
  const content = (
    <>
      {!unlocked && <span className={styles.locked} aria-hidden />}
      {label}
    </>
  )
  const className = [
    styles.item,
    active ? styles.itemActive : '',
    !unlocked ? styles.itemLocked : '',
  ].filter(Boolean).join(' ')

  if (unlocked) {
    return (
      <Link to={to} className={className} aria-current={active ? 'step' : undefined}>
        {content}
      </Link>
    )
  }
  return (
    <span className={className} aria-disabled>
      {content}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionTitle}>{children}</div>
}

export function LeftSectionNav() {
  const location = useLocation()
  const { isStepUnlocked } = useAppState()

  const isLanding = location.pathname === '/'
  const isConfirmation = location.pathname === '/confirmation'
  if (isLanding || isConfirmation) return null

  return (
    <aside className={styles.aside} aria-label="Application sections">
      <nav className={styles.nav}>
        <SectionTitle>{SECTION_HEADERS.qualifier}</SectionTitle>
        <NavItem
          to="/applicant-info"
          label="Applicant Information"
          active={location.pathname === '/applicant-info'}
          unlocked={isStepUnlocked('applicant-info')}
        />
        <NavItem
          to="/household"
          label="Household Information"
          active={location.pathname === '/household'}
          unlocked={isStepUnlocked('household')}
        />
        <NavItem
          to="/income"
          label="Income"
          active={location.pathname === '/income'}
          unlocked={isStepUnlocked('income')}
        />
        <NavItem
          to="/expenses"
          label="Expenses"
          active={location.pathname === '/expenses'}
          unlocked={isStepUnlocked('expenses')}
        />
        <NavItem
          to="/housing"
          label="Housing Situation"
          active={location.pathname === '/housing'}
          unlocked={isStepUnlocked('housing')}
        />
        <NavItem
          to="/assets"
          label="Assets"
          active={location.pathname === '/assets'}
          unlocked={isStepUnlocked('assets')}
        />
        <SectionTitle>ELIGIBILITY EVALUATION</SectionTitle>
        <NavItem
          to="/eligible-benefits"
          label="View & Select Eligible Benefits"
          active={location.pathname === '/eligible-benefits'}
          unlocked={isStepUnlocked('eligible-benefits')}
        />
        <NavItem
          to="/snap-details"
          label="SNAP"
          active={location.pathname === '/snap-details'}
          unlocked={isStepUnlocked('snap-details')}
        />
        <NavItem
          to="/snap-details"
          label="SNAP Application Details"
          active={location.pathname === '/snap-details'}
          unlocked={isStepUnlocked('snap-details')}
        />
        <NavItem
          to="/tanf-details"
          label="TANF"
          active={location.pathname === '/tanf-details'}
          unlocked={isStepUnlocked('tanf-details')}
        />
        <NavItem
          to="/tanf-details"
          label="TANF Application Details"
          active={location.pathname === '/tanf-details'}
          unlocked={isStepUnlocked('tanf-details')}
        />
        <NavItem
          to="/medicaid-details"
          label="MEDICAID"
          active={location.pathname === '/medicaid-details'}
          unlocked={isStepUnlocked('medicaid-details')}
        />
        <NavItem
          to="/medicaid-details"
          label="MEDICAID Application Details"
          active={location.pathname === '/medicaid-details'}
          unlocked={isStepUnlocked('medicaid-details')}
        />
        <SectionTitle>{SECTION_HEADERS.submission}</SectionTitle>
        <NavItem
          to="/acknowledgement"
          label="Acknowledgement & Submission"
          active={location.pathname === '/acknowledgement'}
          unlocked={isStepUnlocked('acknowledgement')}
        />
        <NavItem
          to="/confirmation"
          label="Confirmation"
          active={location.pathname === '/confirmation'}
          unlocked={isStepUnlocked('confirmation')}
        />
      </nav>
    </aside>
  )
}
