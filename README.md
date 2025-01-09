# 실시간 암호화폐 거래소 대시보드

바이낸스 API를 활용한 실시간 암호화폐 거래소 대시보드입니다. WebSocket을 통한 실시간 데이터 처리와 D3.js를 활용한 차트 시각화를 제공합니다.

## 주요 기능

### 1. 실시간 캔들스틱 차트

- D3.js를 활용한 커스텀 캔들스틱 차트
- WebSocket을 통한 실시간 가격 업데이트
- 크로스헤어와 가격 라벨 표시
- 거래량 차트 연동
- 다양한 시간 간격 지원 (1s, 15m, 1h, 4h, 1d, 1w)

### 2. 실시간 시세 정보

- 24시간 고가/저가
- 거래량 정보
- 가격 변동률

### 3. 심볼 관리

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

- **REST API**: 바이낸스 Public API
- **WebSocket**: 바이낸스 WebSocket API
  - 캔들스틱 데이터 (`@kline`)
  - 거래 데이터 (`@trade`)
  - 24시간 통계 (`@ticker`)

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

## 주요 구현 사항

### 1. D3.js 차트 구현

```typescript
export function PriceChart() {
  // 캔들스틱 차트 구현
  const yScale = d3
    .scaleLinear()
    .domain([
      (d3.min(data, (d) => d.low) as number) * 0.999,
      (d3.max(data, (d) => d.high) as number) * 1.001,
    ])
    .range([priceHeight, 0]);

  // 실시간 가격 라벨
  const priceLabel = g
    .append("g")
    .attr("class", "price-label")
    .style("display", "none");
}
```

### 2. WebSocket 데이터 처리

```typescript
export function useMarketData(symbol: string) {
  useEffect(() => {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@trade/${formattedSymbol}@ticker`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 실시간 데이터 처리
    };

    return () => ws.close();
  }, [symbol]);
}
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
