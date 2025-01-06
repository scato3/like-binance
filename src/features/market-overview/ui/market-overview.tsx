"use client";

import { useCryptoStore } from "@/entities/crypto/model/store";
import { COINS } from "@/shared/data/coins";
import styles from "./styles.module.scss";

export function MarketOverview() {
  const currentSymbol = useCryptoStore((state) => state.currentSymbol);
  const setCurrentSymbol = useCryptoStore((state) => state.setCurrentSymbol);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftContent}>{/* 차트는 나중에 구현 */}</div>
        <div className={styles.coinList}>
          {COINS.filter((coin) => coin.quoteAsset === "USDT").map((coin) => (
            <button
              key={coin.symbol}
              className={`${styles.coinButton} ${
                coin.symbol === currentSymbol ? styles.active : ""
              }`}
              onClick={() => setCurrentSymbol(coin.symbol)}
            >
              <span className={styles.pair}>
                <span className={styles.baseAsset}>{coin.baseAsset}</span>
                <span className={styles.separator}>/</span>
                <span className={styles.quoteAsset}>{coin.quoteAsset}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
