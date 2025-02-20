"use client";

import { useState } from "react";
import { useCryptoStore } from "@/entities/crypto/model/store";
import { COINS } from "@/shared/data/coins";
import { useMarketData } from "@/features/market-overview/model/use-market-data";
import styles from "./styles.module.scss";

type QuoteAsset = "USDT" | "BTC" | "BNB";

export function CoinList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteAsset>("USDT");
  const currentSymbol = useCryptoStore((state) => state.currentSymbol);
  const setCurrentSymbol = useCryptoStore((state) => state.setCurrentSymbol);

  useMarketData(currentSymbol);

  const filteredCoins = COINS.filter(
    (coin) =>
      coin.quoteAsset === selectedQuote &&
      coin.baseAsset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.quoteFilter}>
        {["USDT", "BTC", "BNB"].map((quote) => (
          <button
            key={quote}
            className={`${styles.quoteButton} ${
              selectedQuote === quote ? styles.active : ""
            }`}
            onClick={() => setSelectedQuote(quote as QuoteAsset)}
          >
            {quote}
          </button>
        ))}
      </div>
      <div className={styles.symbolList}>
        {filteredCoins.map((coin) => (
          <button
            key={coin.symbol}
            className={`${styles.symbolButton} ${
              currentSymbol === coin.symbol ? styles.active : ""
            }`}
            onClick={() => setCurrentSymbol(coin.symbol)}
          >
            <div className={styles.symbolInfo}>
              <span className={styles.baseAsset}>{coin.baseAsset}</span>
              <span className={styles.separator}>/</span>
              <span className={styles.quoteAsset}>{coin.quoteAsset}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
