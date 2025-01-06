import type { WebSocketMessage } from "./types/binance";

export class BinanceAPI {
  private static baseURL = "https://api.binance.com/api/v3";
  private static wsURL = "wss://stream.binance.com:9443/ws";

  static async getSymbolPrice(symbol: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/ticker/price?symbol=${symbol}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch price");
      return response.json();
    } catch (error) {
      console.error("Error fetching price:", error);
      throw error;
    }
  }

  static async get24hrStats(symbol: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/ticker/24hr?symbol=${symbol}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch 24hr stats");
      return response.json();
    } catch (error) {
      console.error("Error fetching 24hr stats:", error);
      throw error;
    }
  }

  static createWebSocket(
    streams: string[],
    messageHandler: (data: WebSocketMessage) => void
  ): WebSocket {
    const ws = new WebSocket(this.wsURL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: streams,
          id: 1,
        })
      );
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        if (!data.e) return;
        messageHandler(data as WebSocketMessage);
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return ws;
  }
}
