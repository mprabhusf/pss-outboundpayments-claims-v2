import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

const CLIENTS_PATHS = ['/clients']
const SCHEDULES_PATHS = ['/schedules']
const ATTENDANCE_PATHS = ['/attendance']
const CLAIMS_PATHS = ['/claims']

function isActivePath(pathname: string, paths: string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function Header() {
  const location = useLocation()
  const pathname = location.pathname
  const isHome = pathname === '/'
  const isClients = isActivePath(pathname, CLIENTS_PATHS)
  const isSchedules = isActivePath(pathname, SCHEDULES_PATHS)
  const isAttendance = isActivePath(pathname, ATTENDANCE_PATHS)
  const isClaims = isActivePath(pathname, CLAIMS_PATHS)

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logoLink} aria-label="National Benefits – Home">
          <div className={styles.logo} aria-hidden>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
              <path d="M8 10h16v2H8V10zm0 5h12v2H8v-2zm0 5h10v2H8v-2z" fill="white" />
            </svg>
          </div>
          <span className={styles.appName}>Provider Portal</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={isHome ? styles.navLinkActive : styles.navLink}>Home</Link>
        <Link to="/clients" className={isClients ? styles.navLinkActive : styles.navLink}>Clients</Link>
        <Link to="/schedules" className={isSchedules ? styles.navLinkActive : styles.navLink}>Schedules</Link>
        <Link to="/attendance" className={isAttendance ? styles.navLinkActive : styles.navLink}>Attendance</Link>
        <Link to="/claims" className={isClaims ? styles.navLinkActive : styles.navLink}>Claims</Link>
      </nav>
      <div className={styles.right}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search…"
          aria-label="Search"
        />
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <div className={styles.avatar} title="AH">
          <span>AH</span>
        </div>
      </div>
    </header>
  )
}
