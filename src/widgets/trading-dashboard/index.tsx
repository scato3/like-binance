"use client";

import { OrderBook } from "@/features/order-book";
import { MarketOverview } from "@/features/market-overview";
import { TradingHeader } from "@/components/layout/trading-header";
import styles from "./styles.module.scss";

export function TradingDashboard() {
  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <TradingHeader />
        <div className={styles.content}>
          <OrderBook />
          <div className={styles.chartArea}>
            <MarketOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
