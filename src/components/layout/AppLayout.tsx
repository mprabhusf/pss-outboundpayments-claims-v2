import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Breadcrumbs } from './Breadcrumbs'
import { ApplicationHeader } from './ApplicationHeader'
import { LeftSectionNav } from './LeftSectionNav'
import { BottomActionBar } from './BottomActionBar'
import { FloatingAssistant } from './FloatingAssistant'
import { useActionBar } from '../../context/ActionBarContext'
import styles from './AppLayout.module.css'

/* Routes that show only header + empty content (no breadcrumbs, app header, left nav, or body) */
const EMPTY_CONTENT_PATHS = [
  '/',
  '/clients', '/schedules', '/attendance',
  '/applicant-info', '/household', '/income', '/expenses', '/housing', '/assets',
  '/acknowledgement', '/confirmation',
  '/eligible-benefits', '/snap-details', '/tanf-details', '/medicaid-details',
  '/representing',
]

function isEmptyContentRoute(pathname: string) {
  return EMPTY_CONTENT_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function AppLayout() {
  const location = useLocation()
  const actionBar = useActionBar()
  const isLanding = location.pathname === '/'
  const isConfirmation = location.pathname === '/confirmation'
  const isClaimsWorkspace = location.pathname === '/claims' || location.pathname.startsWith('/claims/')
  const emptyContent = isEmptyContentRoute(location.pathname)
  const hideApplicationChrome = emptyContent || isClaimsWorkspace
  const showActionBar = !isLanding && !isConfirmation && !hideApplicationChrome && actionBar.state.primaryLabel

  return (
    <>
      <Header />
      <main className={styles.main}>
        {!isLanding && !hideApplicationChrome && (
          <div className={styles.breadcrumbWrap}>
            <div className={styles.breadcrumbInner}>
              <Breadcrumbs />
              {!isConfirmation && (
                <>
                  <h1 className="page-title">Public Benefits</h1>
                  <p className={styles.subtitle}>Application Form</p>
                </>
              )}
            </div>
          </div>
        )}
        {!hideApplicationChrome && <ApplicationHeader />}
        <div className={styles.contentWrap}>
          {!hideApplicationChrome && <LeftSectionNav />}
          <div className={styles.content}>
            {emptyContent ? null : <Outlet />}
          </div>
        </div>
      </main>
      {showActionBar && (
        <BottomActionBar
          primaryLabel={actionBar.state.primaryLabel}
          primaryTo={actionBar.state.primaryTo}
          onPrimaryClick={actionBar.state.onPrimaryClick}
          previousTo={actionBar.state.previousTo}
          showSave={actionBar.state.showSave}
          primaryDisabled={actionBar.state.primaryDisabled}
        />
      )}
      <Footer />
      <FloatingAssistant />
    </>
  )
}
