import { Link } from 'react-router-dom'
import { APPLICATION_ID } from '../../config/steps'
import styles from './Breadcrumbs.module.css'

interface BreadcrumbsProps {
  items?: { label: string; path?: string }[]
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const defaultItems = [
    { label: 'Applications' },
    { label: APPLICATION_ID, path: '/applicant-info' },
  ]
  const list = items.length ? items : defaultItems

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      {list.map((item, i) => (
        <span key={i} className={styles.item}>
          {i > 0 && <span className={styles.sep}>/</span>}
          {item.path ? (
            <Link to={item.path} className={styles.link}>{item.label}</Link>
          ) : (
            <span className={styles.text}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
