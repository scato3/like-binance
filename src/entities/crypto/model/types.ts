export interface Coin {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface MarketStats {
  high24h: string;
  low24h: string;
  volume24h: string;
  volumeUsdt24h: string;
  priceChangePercent: string;
}

export interface MarketPrice {
  symbol: string;
  price: string;
}
