import { Link } from 'react-router-dom'
import { APPLICATION_ID } from '../config/steps'
import styles from './Confirmation.module.css'

export function Confirmation() {
  return (
    <div className={styles.page}>
      <div className={styles.illustration} aria-hidden>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="56" fill="var(--color-success-light)" />
          <path d="M40 60l18 18 32-32" stroke="var(--color-success)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className={styles.title}>Application Submitted Successfully!</h2>
      <p className={styles.subtitle}>
        Your Public Benefits application has been received.
      </p>
      <div className="card" style={{ maxWidth: 480, margin: 'var(--space-6) auto' }}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.label}>Application Reference ID</td>
              <td className={styles.value}>{APPLICATION_ID}</td>
            </tr>
            <tr>
              <td className={styles.label}>Status</td>
              <td className={styles.value}>Submitted</td>
            </tr>
            <tr>
              <td className={styles.label}>Date Submitted</td>
              <td className={styles.value}>4 February 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
      <section className={styles.whatNext} aria-labelledby="what-next-heading">
        <h3 id="what-next-heading" className={styles.whatNextTitle}>What happens next?</h3>
        <p className={styles.whatNextText}>
          You will receive a confirmation letter by mail or email. Our team will review your application and may contact you if we need more information. You can check the status of your application anytime from your Applications dashboard.
        </p>
      </section>
      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary">
          Download Application Summary
        </button>
        <Link to="/" className="btn btn-primary">
          Close
        </Link>
      </div>
    </div>
  )
}
