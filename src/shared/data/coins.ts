export interface Coin {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export const COINS: Coin[] = [
  // USDT 마켓
  { symbol: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT" },
  { symbol: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT" },
  { symbol: "BNB/USDT", baseAsset: "BNB", quoteAsset: "USDT" },
  { symbol: "XRP/USDT", baseAsset: "XRP", quoteAsset: "USDT" },
  { symbol: "ADA/USDT", baseAsset: "ADA", quoteAsset: "USDT" },
  { symbol: "DOGE/USDT", baseAsset: "DOGE", quoteAsset: "USDT" },
  { symbol: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT" },
  { symbol: "DOT/USDT", baseAsset: "DOT", quoteAsset: "USDT" },
  { symbol: "LTC/USDT", baseAsset: "LTC", quoteAsset: "USDT" },
  { symbol: "AVAX/USDT", baseAsset: "AVAX", quoteAsset: "USDT" },
  { symbol: "LINK/USDT", baseAsset: "LINK", quoteAsset: "USDT" },
  { symbol: "UNI/USDT", baseAsset: "UNI", quoteAsset: "USDT" },
  { symbol: "ATOM/USDT", baseAsset: "ATOM", quoteAsset: "USDT" },
  { symbol: "ETC/USDT", baseAsset: "ETC", quoteAsset: "USDT" },
  { symbol: "FIL/USDT", baseAsset: "FIL", quoteAsset: "USDT" },
  { symbol: "AAVE/USDT", baseAsset: "AAVE", quoteAsset: "USDT" },
  { symbol: "NEAR/USDT", baseAsset: "NEAR", quoteAsset: "USDT" },
  { symbol: "ALGO/USDT", baseAsset: "ALGO", quoteAsset: "USDT" },
  { symbol: "ICP/USDT", baseAsset: "ICP", quoteAsset: "USDT" },

  // BTC 마켓
  { symbol: "ETH/BTC", baseAsset: "ETH", quoteAsset: "BTC" },
  { symbol: "BNB/BTC", baseAsset: "BNB", quoteAsset: "BTC" },
  { symbol: "XRP/BTC", baseAsset: "XRP", quoteAsset: "BTC" },
  { symbol: "ADA/BTC", baseAsset: "ADA", quoteAsset: "BTC" },
  { symbol: "DOGE/BTC", baseAsset: "DOGE", quoteAsset: "BTC" },
  { symbol: "SOL/BTC", baseAsset: "SOL", quoteAsset: "BTC" },
  { symbol: "DOT/BTC", baseAsset: "DOT", quoteAsset: "BTC" },
  { symbol: "LTC/BTC", baseAsset: "LTC", quoteAsset: "BTC" },
  { symbol: "AVAX/BTC", baseAsset: "AVAX", quoteAsset: "BTC" },
  { symbol: "LINK/BTC", baseAsset: "LINK", quoteAsset: "BTC" },
  { symbol: "UNI/BTC", baseAsset: "UNI", quoteAsset: "BTC" },
  { symbol: "ATOM/BTC", baseAsset: "ATOM", quoteAsset: "BTC" },
  { symbol: "ETC/BTC", baseAsset: "ETC", quoteAsset: "BTC" },
  { symbol: "FIL/BTC", baseAsset: "FIL", quoteAsset: "BTC" },

  // BNB 마켓
  { symbol: "ETH/BNB", baseAsset: "ETH", quoteAsset: "BNB" },
  { symbol: "XRP/BNB", baseAsset: "XRP", quoteAsset: "BNB" },
  { symbol: "ADA/BNB", baseAsset: "ADA", quoteAsset: "BNB" },
  { symbol: "DOGE/BNB", baseAsset: "DOGE", quoteAsset: "BNB" },
  { symbol: "SOL/BNB", baseAsset: "SOL", quoteAsset: "BNB" },
  { symbol: "DOT/BNB", baseAsset: "DOT", quoteAsset: "BNB" },
  { symbol: "LTC/BNB", baseAsset: "LTC", quoteAsset: "BNB" },
  { symbol: "AVAX/BNB", baseAsset: "AVAX", quoteAsset: "BNB" },
  { symbol: "LINK/BNB", baseAsset: "LINK", quoteAsset: "BNB" },
  { symbol: "UNI/BNB", baseAsset: "UNI", quoteAsset: "BNB" },
  { symbol: "ATOM/BNB", baseAsset: "ATOM", quoteAsset: "BNB" },
  { symbol: "ETC/BNB", baseAsset: "ETC", quoteAsset: "BNB" },
  { symbol: "FIL/BNB", baseAsset: "FIL", quoteAsset: "BNB" },
];
