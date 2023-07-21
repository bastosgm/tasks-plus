import styles from "./styles.module.scss";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tasks
              <span>+</span>
            </h1>
          </Link>
          <Link href="/dashboard" className={styles.link}>
            My space
          </Link>
        </nav>
        <button className={styles.loginButton}>Access</button>
      </section>
    </header>
  );
}
