"use client";

import styles from "./styles.module.scss";
import { PriceChart } from "@/features/price-chart";

export function MarketOverview() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <PriceChart />
        </div>
      </div>
    </div>
  );
}
