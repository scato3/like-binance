import type {
  WebSocketMessage,
  KlineData,
  DepthData,
  WebSocketSubscriber,
} from "./types/binance";

class BinanceWebSocket {
  private static instance: BinanceWebSocket;

  static getInstance(): BinanceWebSocket {
    if (!BinanceWebSocket.instance) {
      BinanceWebSocket.instance = new BinanceWebSocket();
    }
    return BinanceWebSocket.instance;
  }

  subscribeMarketData(
    symbol: string,
    callback: WebSocketSubscriber<WebSocketMessage>
  ) {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@trade/${formattedSymbol}@ticker`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => ws.close();
  }

  subscribeOrderBook(symbol: string, callback: WebSocketSubscriber<DepthData>) {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@depth20@100ms`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => ws.close();
  }

  subscribeKline(
    symbol: string,
    interval: string,
    callback: WebSocketSubscriber<KlineData>
  ) {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@kline_${interval}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => ws.close();
  }
}

export const binanceWS = BinanceWebSocket.getInstance();
