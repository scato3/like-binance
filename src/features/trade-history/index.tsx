interface TradeHistoryProps {
  symbol: string;
}

export function TradeHistory({ symbol }: TradeHistoryProps) {
  return (
    <div>
      <h2>거래 내역 ({symbol})</h2>
      {/* 거래 내역 구현 예정 */}
    </div>
  );
}
