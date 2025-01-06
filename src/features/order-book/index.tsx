"use client";

import { useEffect, useState, useRef } from "react";
import { useCryptoStore } from "@/entities/crypto/model/store";
import styles from "./styles.module.scss";

interface OrderBookItem {
  price: string;
  amount: string;
  total: string;
}

interface OrderBookBuffer {
  asks: string[][];
  bids: string[][];
}

export function OrderBook() {
  const [asks, setAsks] = useState<OrderBookItem[]>([]);
  const [bids, setBids] = useState<OrderBookItem[]>([]);
  const currentSymbol = useCryptoStore((state) => state.currentSymbol);
  const bufferRef = useRef<OrderBookBuffer>({ asks: [], bids: [] });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const formattedSymbol = currentSymbol.replace("/", "").toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@depth20@100ms`
    );

    const processOrders = (orders: string[][]): OrderBookItem[] => {
      let total = 0;
      return orders.map(([price, amount]) => {
        total += parseFloat(amount);
        return {
          price,
          amount,
          total: total.toFixed(3),
        };
      });
    };

    const updateOrderBook = () => {
      if (bufferRef.current.asks.length > 0) {
        setAsks(processOrders(bufferRef.current.asks));
      }
      if (bufferRef.current.bids.length > 0) {
        setBids(processOrders(bufferRef.current.bids));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      bufferRef.current = {
        asks: data.asks,
        bids: data.bids,
      };
    };

    // 1초마다 UI 업데이트
    timerRef.current = setInterval(updateOrderBook, 1000);

    return () => {
      ws.close();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSymbol]);

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    // 소수점이 있는 경우 모든 자릿수 표시
    if (num % 1 !== 0) {
      return num.toString();
    }
    // 정수인 경우 그대로 표시
    return num.toLocaleString();
  };

  const currentBaseAsset = currentSymbol.split("/")[0];
  const maxAmount = Math.max(
    ...asks.map((ask) => parseFloat(ask.amount)),
    ...bids.map((bid) => parseFloat(bid.amount))
  );

  // asks는 가격 내림차순 (높은 가격이 위에)
  const sortedAsks = [...asks].sort(
    (a, b) => parseFloat(b.price) - parseFloat(a.price)
  );

  // bids는 가격 내림차순 (높은 가격이 위에)
  const sortedBids = [...bids].sort(
    (a, b) => parseFloat(b.price) - parseFloat(a.price)
  );

  return (
    <div className={styles.orderBook}>
      <div className={styles.header}>
        <h3>Order Book</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.orderList}>
          <div className={styles.headers}>
            <span>Price(USDT)</span>
            <span>Amount({currentBaseAsset})</span>
            <span>Total</span>
          </div>
          <div className={styles.asks}>
            {sortedAsks.map((ask, i) => (
              <div key={i} className={styles.row}>
                <div
                  className={styles.background}
                  style={{
                    width: `${(parseFloat(ask.amount) / maxAmount) * 100}%`,
                  }}
                />
                <span className={styles.price}>{formatNumber(ask.price)}</span>
                <span className={styles.amount}>
                  {formatNumber(ask.amount)}
                </span>
                <span className={styles.total}>{formatNumber(ask.total)}</span>
              </div>
            ))}
          </div>
          <div className={styles.currentPrice}>
            <span className={styles.price}>
              {bids[0]?.price ? formatNumber(bids[0].price) : "-"}
            </span>
            <span className={styles.change}>
              ≈ {bids[0]?.price || "-"} USDT
            </span>
          </div>
          <div className={styles.bids}>
            {sortedBids.map((bid, i) => (
              <div key={i} className={styles.row}>
                <div
                  className={styles.background}
                  style={{
                    width: `${(parseFloat(bid.amount) / maxAmount) * 100}%`,
                  }}
                />
                <span className={styles.price}>{formatNumber(bid.price)}</span>
                <span className={styles.amount}>
                  {formatNumber(bid.amount)}
                </span>
                <span className={styles.total}>{formatNumber(bid.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
