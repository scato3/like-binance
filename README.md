# 실시간 암호화폐 거래소 대시보드

바이낸스 API를 활용한 실시간 암호화폐 거래소 대시보드입니다. WebSocket을 통한 실시간 데이터 처리와 D3.js를 활용한 차트 시각화를 제공합니다.

## 주요 기능

### 1. 실시간 캔들스틱 차트

- D3.js를 활용한 커스텀 캔들스틱 차트
- WebSocket을 통한 실시간 가격 업데이트
- 크로스헤어와 가격 라벨 표시
- 거래량 차트 연동
- 다양한 시간 간격 지원 (1s, 15m, 1h, 4h, 1d, 1w)

### 2. 실시간 호가창 (Order Book)

- 실시간 매수/매도 호가 업데이트
- 주문량 시각화
- 1초 간격 UI 업데이트
- 가격별 누적 수량 표시

### 3. 실시간 시세 정보

- 24시간 고가/저가
- 거래량 정보
- 가격 변동률

### 4. 심볼 관리

- USDT/BTC/BNB 마켓 지원
- 실시간 가격 업데이트
- 심볼 검색 및 필터링

## 기술 스택

### Frontend

- **Framework**: Next.js
- **Language**: TypeScript
- **차트**: D3.js
- **상태 관리**: Zustand
- **스타일링**: SCSS Modules

### 데이터 통신

- **WebSocket**: 바이낸스 WebSocket API
  - 캔들스틱 데이터 (`@kline_<interval>`)
  - 거래 데이터 (`@trade`)
  - 24시간 통계 (`@ticker`)
  - 호가창 데이터 (`@depth20@100ms`)

## 주요 구현 사항

### 1. WebSocket 데이터 처리

```typescript
class BinanceWebSocket {
  private static instance: BinanceWebSocket;

  // 시세 및 거래 데이터
  subscribeMarketData(
    symbol: string,
    callback: WebSocketSubscriber<WebSocketMessage>
  ) {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `${BINANCE_WS_URL}/${formattedSymbol}@trade/${formattedSymbol}@ticker`
    );
    // ...
  }

  // 호가창 데이터
  subscribeOrderBook(symbol: string, callback: WebSocketSubscriber<DepthData>) {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `${BINANCE_WS_URL}/${formattedSymbol}@depth20@100ms`
    );
    // ...
  }

  // 캔들스틱 차트 데이터
  subscribeKline(
    symbol: string,
    interval: string,
    callback: WebSocketSubscriber<KlineData>
  ) {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `${BINANCE_WS_URL}/${formattedSymbol}@kline_${interval}`
    );
    // ...
  }
}
```

### 2. 실시간 데이터 활용

```typescript
// 시세 정보 업데이트
export function useMarketData(symbol: string) {
  useEffect(() => {
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
  }, [symbol]);
}

// 호가창 업데이트
export function OrderBook() {
  useEffect(() => {
    const unsubscribe = binanceWS.subscribeOrderBook(currentSymbol, (data) => {
      bufferRef.current = {
        asks: data.asks,
        bids: data.bids,
      };
    });
    // 1초마다 UI 업데이트
    timerRef.current = setInterval(updateOrderBook, 1000);
    return () => unsubscribe();
  }, [currentSymbol]);
}

// 차트 데이터 업데이트
export function PriceChart() {
  useEffect(() => {
    const unsubscribe = binanceWS.subscribeKline(
      currentSymbol,
      interval,
      (message) => {
        const {
          k: { t, o, h, l, c, v },
        } = message;
        setData((prev) => {
          // 캔들스틱 데이터 업데이트 로직
        });
      }
    );
    return () => unsubscribe();
  }, [currentSymbol, interval]);
}
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
