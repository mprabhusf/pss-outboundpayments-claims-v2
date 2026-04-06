import { Link, useLocation } from 'react-router-dom'
import { APPLICATION_ID, DATE_CREATED, APP_STATUS } from '../../config/steps'
import styles from './ApplicationHeader.module.css'

const tabs = [
  { label: 'Application Sections', path: '/applicant-info' },
  { label: 'Application Preview', path: '/applicant-info' },
  { label: 'Benefits', path: '/eligible-benefits' },
]

export function ApplicationHeader() {
  const location = useLocation()
  const isApplicationRoute = location.pathname !== '/' && location.pathname !== '/confirmation'

  if (!isApplicationRoute) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}><strong>ID</strong> {APPLICATION_ID}</span>
          <span className={styles.metaItem}><strong>Category</strong> Public Benefits</span>
          <span className={styles.metaItem}><strong>Status</strong> {APP_STATUS}</span>
          <span className={styles.metaItem}><strong>Date Created</strong> {DATE_CREATED}</span>
        </div>
      </div>
      <nav className={styles.tabs} aria-label="Application tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={location.pathname.startsWith(tab.path) ? styles.tabActive : styles.tab}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
