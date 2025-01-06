import { useEffect } from "react";
import { useCryptoStore } from "@/entities/crypto/model/store";
import type { WebSocketMessage } from "@/shared/api/types/binance";

export function useMarketData(symbol: string) {
  const store = useCryptoStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 심볼에서 '/' 제거하여 바이낸스 API 형식으로 변환
    const formattedSymbol = symbol.replace("/", "").toLowerCase();

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@trade/${formattedSymbol}@ticker`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WebSocketMessage;

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
    };

    return () => {
      ws.close();
    };
  }, [symbol, store]);

  return null;
}
