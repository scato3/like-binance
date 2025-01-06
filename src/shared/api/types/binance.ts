export interface MarketPrice {
  symbol: string;
  price: string;
  time?: number;
}

export interface FuturesMarkPrice {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
  time: number;
}

export interface Futures24hrStats {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  lastQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface WebSocketTradeEvent {
  e: "trade";
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
  M: boolean;
}

export interface WebSocketMarkPriceEvent {
  e: "markPriceUpdate";
  E: number;
  s: string;
  p: string;
  i: string;
  P: string;
  r: string;
  T: number;
}

export interface WebSocket24hrEvent {
  e: "24hrTicker";
  E: number;
  s: string;
  p: string;
  P: string;
  w: string;
  x: string;
  c: string;
  Q: string;
  b: string;
  B: string;
  a: string;
  A: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  O: number;
  C: number;
  F: number;
  L: number;
  n: number;
}

export type WebSocketMessage = WebSocketTradeEvent | WebSocket24hrEvent;

export interface WebSocketMessageHandler {
  (message: WebSocketMessage): void;
}
