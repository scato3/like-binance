"use client";

import { useCryptoStore } from "@/entities/crypto/model/store";
import { useMarketData } from "@/features/market-overview/model/use-market-data";
import styles from "./styles.module.scss";

export function CoinInfo() {
  const currentSymbol = useCryptoStore((state) => state.currentSymbol);
  const marketPrice = useCryptoStore(
    (state) => state.marketPrices[currentSymbol]?.price
  );
  const stats = useCryptoStore((state) => state.marketStats[currentSymbol]);

  useMarketData(currentSymbol);

  const formattedPrice = marketPrice ? parseFloat(marketPrice).toFixed(2) : "-";
  const priceChangePercent = stats?.priceChangePercent
    ? parseFloat(stats.priceChangePercent)
    : 0;
  const isPositive = priceChangePercent >= 0;

  return (
    <div className={styles.coinInfo}>
      <div className={styles.priceInfo}>
        <span className={styles.price}>${formattedPrice}</span>
        <span
          className={`${styles.change} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {isPositive ? "+" : ""}
          {priceChangePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
