"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <Link href="/">Crypto Exchange</Link>
          </div>
          <div className={styles.menu}>
            <Link href="/" className={styles.active}>
              Markets
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
