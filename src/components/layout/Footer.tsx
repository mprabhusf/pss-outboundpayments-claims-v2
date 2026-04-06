import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <a href="#contact">Contact</a>
        <span className={styles.sep}>|</span>
        <a href="#faqs">FAQs</a>
        <span className={styles.sep}>|</span>
        <a href="#support">Support</a>
      </nav>
    </footer>
  )
}
