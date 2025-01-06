"use client";

import { CryptoDashboard } from "@/widgets/crypto-dashboard";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <CryptoDashboard />
    </div>
  );
}
