# 실시간 암호화폐 거래소 대시보드

바이낸스 API를 활용한 실시간 암호화폐 거래소 대시보드입니다. WebSocket을 통한 실시간 데이터 처리와 최적화된 UI/UX를 제공합니다.

## 주요 기능

### 1. 실시간 시세 조회

- WebSocket을 통한 실시간 가격 업데이트
- 24시간 거래량, 고가/저가 등 상세 정보 제공

### 2. 호가창(Order Book)

- 실시간 호가 데이터 시각화
- 매수/매도 수량 비율 표시

### 3. 코인 목록

- USDT/BTC/BNB 마켓 지원
- 실시간 가격 변동 표시
- 검색 기능

## 기술 스택

### Frontend

- **Framework**: Next.js 15.0.4
- **Language**: TypeScript
- **상태 관리**: Zustand
- **스타일링**: SCSS Modules

### 데이터 통신

- **WebSocket**: 바이낸스 WebSocket API를 통한 실시간 데이터 구독
  - 시세 데이터 (`@trade`)
  - 24시간 통계 (`@ticker`)
  - 호가 데이터 (`@depth20`)

## 주요 구현 사항

### 1. 최적화된 WebSocket 관리

- 자동 재연결 메커니즘
- 지수 백오프 전략
- 효율적인 메시지 처리

### 2. 성능 최적화

- React.memo를 통한 불필요한 리렌더링 방지
- WebSocket 메시지 버퍼링
- 효율적인 상태 관리

### 3. 사용자 경험

- 반응형 디자인
- 다크 모드 지원
- 직관적인 인터페이스

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 환경 설정

프로젝트 실행을 위해 다음 환경이 필요합니다:

- Node.js 18.0.0 이상
- npm 9.0.0 이상

## 프로젝트 구조

```
src/
├── app/                 # Next.js 앱 라우터
├── components/          # 공통 컴포넌트
├── entities/           # 도메인 엔티티
├── features/           # 기능 단위 모듈
├── shared/             # 공통 유틸리티
└── widgets/            # 위젯 컴포넌트
```

## 핵심 구현 사항

### 1. WebSocket을 통한 실시간 데이터 처리

실시간 시세 데이터를 효율적으로 처리하기 위해 WebSocket을 활용하여 구현했습니다. 각 심볼별로 독립적인 WebSocket 연결을 관리하며, 커스텀 훅을 통해 재사용 가능한 형태로 구성했습니다.

```typescript
export function useMarketData(symbol: string) {
  const store = useCryptoStore();

  useEffect(() => {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@trade/${formattedSymbol}@ticker`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WebSocketMessage;
      if (data.e === "trade") {
        store.updateMarketPrice({ symbol, price: data.p });
      }
    };

    return () => ws.close();
  }, [symbol, store]);
}
```

### 2. 실시간 호가창 구현

호가창은 100ms 간격으로 업데이트되는 깊이 데이터를 처리하며, 버퍼링을 통해 UI 업데이트 빈도를 최적화했습니다.

```typescript
export function OrderBook() {
  const bufferRef = useRef<OrderBookBuffer>({ asks: [], bids: [] });

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      bufferRef.current = { asks: data.asks, bids: data.bids };
    };

    // 버퍼링된 데이터를 1초 간격으로 UI에 반영
    const updateInterval = setInterval(() => {
      if (bufferRef.current.asks.length)
        setAsks(processOrders(bufferRef.current.asks));
      if (bufferRef.current.bids.length)
        setBids(processOrders(bufferRef.current.bids));
    }, 1000);
  }, []);
}
```

### 3. 중앙 집중식 상태 관리

Zustand를 사용하여 전역 상태를 관리하며, 실시간 데이터 업데이트와 UI 동기화를 처리합니다.

```typescript
export const useCryptoStore = create<CryptoStore>((set) => ({
  currentSymbol: "BTC/USDT",
  marketPrices: {},
  updateMarketPrice: (price) =>
    set((state) => ({
      marketPrices: { ...state.marketPrices, [price.symbol]: price },
    })),
}));
```

이러한 구현을 통해 실시간 데이터의 안정적인 처리와 효율적인 상태 관리를 실현했습니다.
