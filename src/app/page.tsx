"use client";

import { CoinList } from "@/features/coin-list";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <CoinList />
    </div>
  );
}
