import { useEffect } from "react";
import { useCryptoStore } from "@/entities/crypto/model/store";
import { binanceWS } from "@/shared/api/binance";

export function useMarketData(symbol: string) {
  const store = useCryptoStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = binanceWS.subscribeMarketData(symbol, (data) => {
      switch (data.e) {
        case "trade":
          store.updateMarketPrice({ symbol, price: data.p });
          break;
        case "24hrTicker":
          store.updateMarketStats(symbol, {
            high24h: data.h,
            low24h: data.l,
            volume24h: data.v,
            volumeUsdt24h: data.q,
            priceChangePercent: data.P,
          });
          break;
      }
    });

    return () => unsubscribe();
  }, [symbol, store]);

  return null;
}
