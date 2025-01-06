"use client";

import { useCryptoStore } from "@/entities/crypto/model/store";
import { useMarketData } from "@/features/market-overview/model/use-market-data";
import styles from "./styles.module.scss";

export function TradingHeader() {
  const currentSymbol = useCryptoStore((state) => state.currentSymbol);
  const marketPrice = useCryptoStore(
    (state) => state.marketPrices[currentSymbol]?.price
  );
  const stats = useCryptoStore((state) => state.marketStats[currentSymbol]);

  useMarketData(currentSymbol);

  const getDecimals = (price: string) => {
    const numericPrice = parseFloat(price);

    if (numericPrice >= 1) {
      return 2;
    } else {
      const significantDigits = price.match(/^0\.0*[1-9]/)?.[0].length || 0;
      return Math.max(significantDigits + 1, 4);
    }
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return "-";
    const decimals = getDecimals(price);
    return parseFloat(price).toFixed(decimals);
  };

  const formatStatValue = (value: string | undefined) => {
    if (!value) return "-";
    const decimals = getDecimals(value);
    const num = parseFloat(value);
    const [decimal] = num.toString().split(".");
    if (decimal && decimal.length < decimals) {
      return num.toString();
    }
    return num.toFixed(decimals);
  };

  const priceChangePercent = stats?.priceChangePercent
    ? parseFloat(stats.priceChangePercent)
    : 0;
  const isPositive = priceChangePercent >= 0;

  const [baseAsset, quoteAsset] = currentSymbol.split("/");

  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.left}>
          <span className={styles.star}>★</span>
          <span className={styles.pair}>
            <span className={styles.baseAsset}>{baseAsset}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.quoteAsset}>{quoteAsset}</span>
          </span>
          <span className={styles.price}>{formatPrice(marketPrice)}</span>
          <span
            className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}
          >
            {isPositive ? "+" : ""}
            {priceChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.label}>24h High</span>
            <span className={styles.value}>
              {formatStatValue(stats?.high24h)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>24h Low</span>
            <span className={styles.value}>
              {formatStatValue(stats?.low24h)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>24h Volume({baseAsset})</span>
            <span className={styles.value}>
              {formatStatValue(stats?.volume24h)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>24h Volume(USDT)</span>
            <span className={styles.value}>
              {formatStatValue(stats?.volumeUsdt24h)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
