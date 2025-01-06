import { create } from "zustand";
import type { MarketPrice } from "@/shared/api/types/binance";

interface MarketStats {
  high24h: string;
  low24h: string;
  volume24h: string;
  volumeUsdt24h: string;
  priceChangePercent: string;
}

interface CryptoStore {
  currentSymbol: string;
  marketPrices: Record<string, MarketPrice>;
  marketStats: Record<string, MarketStats>;
  setCurrentSymbol: (symbol: string) => void;
  updateMarketPrice: (price: MarketPrice) => void;
  updateMarketStats: (symbol: string, stats: Partial<MarketStats>) => void;
}

export const useCryptoStore = create<CryptoStore>((set) => ({
  currentSymbol: "BTC/USDT",
  marketPrices: {},
  marketStats: {},
  setCurrentSymbol: (symbol) => set({ currentSymbol: symbol }),
  updateMarketPrice: (price) =>
    set((state) => ({
      marketPrices: { ...state.marketPrices, [price.symbol]: price },
    })),
  updateMarketStats: (symbol, stats) =>
    set((state) => ({
      marketStats: {
        ...state.marketStats,
        [symbol]: { ...state.marketStats[symbol], ...stats },
      },
    })),
}));
