interface PriceChartProps {
  symbol: string;
}

export function PriceChart({ symbol }: PriceChartProps) {
  return (
    <div>
      <h2>가격 차트 ({symbol})</h2>
      {/* D3.js 차트는 나중에 구현 */}
    </div>
  );
}
