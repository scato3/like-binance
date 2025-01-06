export const TRADING_CONFIG = {
  DEFAULT_SYMBOL: "BTCUSDT",
  SUPPORTED_PAIRS: ["BTCUSDT", "ETHUSDT", "BNBUSDT"],
  WS_ENDPOINTS: {
    TRADE: (symbol: string) => `${symbol.toLowerCase()}@trade`,
    TICKER: (symbol: string) => `${symbol.toLowerCase()}@ticker`,
  },
} as const;
