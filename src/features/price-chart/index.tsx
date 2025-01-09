import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useCryptoStore } from "@/entities/crypto/model/store";
import styles from "./styles.module.scss";

const INTERVALS = {
  "1s": "1s",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
  "1w": "1w",
} as const;

type Interval = keyof typeof INTERVALS;

interface Candle {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type BinanceKlineResponse = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string // Volume
];

export function PriceChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentSymbol = useCryptoStore((state) => state.currentSymbol);
  const [interval, setInterval] = useState<Interval>("15m");
  const [data, setData] = useState<Candle[]>([]);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const margin = {
      top: 20,
      right: 65,
      bottom: 100,
      left: 0,
    };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;
    const volumeHeight = 80;
    const priceHeight = height - volumeHeight - 20;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (data.length === 0) return;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.time) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        (d3.min(data, (d) => d.low) as number) * 0.999,
        (d3.max(data, (d) => d.high) as number) * 1.001,
      ])
      .range([priceHeight, 0]);

    const volumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.volume) as number])
      .range([volumeHeight, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(width > 800 ? 10 : 5);

    const yAxis = d3
      .axisRight(yScale)
      .tickFormat((d) => d.toLocaleString())
      .tickSize(0)
      .ticks(6);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${priceHeight})`)
      .call(xAxis);

    const yAxisG = g
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${width},0)`)
      .call(yAxis);

    yAxisG
      .selectAll(".tick text")
      .attr("x", 6)
      .attr("dy", 4)
      .style("fill", "#76808f")
      .style("font-size", "11px");

    yAxisG.select(".domain").remove();

    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(6))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#f0f3fa")
      .attr("stroke-opacity", 0.1);

    const volumeG = g
      .append("g")
      .attr("transform", `translate(0,${priceHeight + 20})`);

    const volumeBars = volumeG
      .selectAll(".volume-bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "volume-bar");

    volumeBars
      .append("rect")
      .attr("x", (d) => xScale(d.time) - (width / data.length) * 0.4)
      .attr("y", (d) => volumeScale(d.volume))
      .attr("width", (width / data.length) * 0.8)
      .attr("height", (d) => volumeHeight - volumeScale(d.volume))
      .attr("fill", (d) => (d.open > d.close ? "#f6465d33" : "#0ecb8133"));

    const volumeLabel = g
      .append("g")
      .attr("class", "volume-label")
      .style("display", "none")
      .style("z-index", 1);

    volumeLabel
      .append("rect")
      .attr("x", width + 2)
      .attr("width", 65)
      .attr("height", 20)
      .attr("fill", "#f6465d");

    const volumeLabelText = volumeLabel
      .append("text")
      .attr("x", width + 33)
      .attr("dy", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff");

    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "candle")
      .each(function (d) {
        const g = d3.select(this);
        const x = xScale(d.time);
        const candleWidth = Math.max((width / data.length) * 0.8, 1);

        g.append("line")
          .attr("class", "wick")
          .attr("x1", x)
          .attr("x2", x)
          .attr("y1", yScale(d.high))
          .attr("y2", yScale(d.low))
          .attr("stroke", d.open > d.close ? "#f6465d" : "#0ecb81");

        g.append("rect")
          .attr("x", x - candleWidth / 2)
          .attr("y", yScale(Math.max(d.open, d.close)))
          .attr("width", candleWidth)
          .attr(
            "height",
            Math.max(1, Math.abs(yScale(d.open) - yScale(d.close)))
          )
          .attr("fill", d.open > d.close ? "#f6465d" : "#0ecb81");
      });

    const crosshairX = g
      .append("line")
      .attr("class", "crosshair-x")
      .attr("y1", 0)
      .attr("y2", height)
      .style("display", "none");

    const crosshairY = g
      .append("line")
      .attr("class", "crosshair-y")
      .attr("x1", 0)
      .attr("x2", width)
      .style("display", "none");

    const priceLabel = g
      .append("g")
      .attr("class", "price-label")
      .style("display", "none");

    priceLabel
      .append("rect")
      .attr("x", width + 2)
      .attr("width", 65)
      .attr("height", 20)
      .attr("fill", "#f6465d");

    const priceLabelText = priceLabel
      .append("text")
      .attr("x", width + 33)
      .attr("dy", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff");

    svg
      .on("mousemove", function (event) {
        const [mouseX, mouseY] = d3.pointer(event);
        const x = mouseX - margin.left;
        const y = mouseY - margin.top;

        if (x < 0 || x > width || y < 0 || y > height) {
          crosshairX.style("display", "none");
          crosshairY.style("display", "none");
          priceLabel.style("display", "none");
          volumeLabel.style("display", "none");
          return;
        }

        const price = yScale.invert(y);
        const volume: number | null =
          y > priceHeight ? +volumeScale.invert(y - priceHeight - 20) : null;

        crosshairX
          .attr("x1", x)
          .attr("x2", x)
          .style("display", null)
          .attr("stroke", "rgba(255, 255, 255, 0.2)");

        crosshairY
          .attr("y1", y)
          .attr("y2", y)
          .style("display", null)
          .attr("stroke", "rgba(255, 255, 255, 0.2)");

        if (y <= priceHeight) {
          priceLabel
            .attr("transform", `translate(0,${y - 10})`)
            .style("display", null);
          volumeLabel.style("display", "none");
          priceLabelText.text(price.toFixed(2));
        } else {
          volumeLabel
            .attr("transform", `translate(0,${y - 10})`)
            .style("display", null);
          priceLabel.style("display", "none");
          volumeLabelText.text(
            volume !== null
              ? volume >= 1000000
                ? (volume / 1000000).toFixed(2) + "M"
                : volume >= 1000
                ? (volume / 1000).toFixed(2) + "K"
                : volume.toFixed(2)
              : "0"
          );
        }
      })
      .on("mouseleave", function () {
        crosshairX.style("display", "none");
        crosshairY.style("display", "none");
        priceLabel.style("display", "none");
        volumeLabel.style("display", "none");
      });

    const volumeYAxis = d3
      .axisRight(volumeScale)
      .tickFormat((d) => {
        const volume = d as number;
        if (volume >= 1000000) {
          return `${(volume / 1000000).toFixed(1)}M`;
        }
        if (volume >= 1000) {
          return `${(volume / 1000).toFixed(1)}K`;
        }
        return volume.toFixed(1);
      })
      .tickSize(0)
      .ticks(3);

    const volumeYAxisG = g
      .append("g")
      .attr("class", "volume-y-axis")
      .attr("transform", `translate(${width},${priceHeight + 20})`)
      .style("z-index", 1)
      .call(volumeYAxis);

    volumeYAxisG
      .selectAll(".tick text")
      .attr("x", 6)
      .attr("dy", 4)
      .style("fill", "#76808f")
      .style("font-size", "11px");

    volumeYAxisG.select(".domain").remove();

    g.append("g")
      .attr("class", "volume-grid")
      .attr("transform", `translate(0,${priceHeight + 20})`)
      .selectAll("line")
      .data(volumeScale.ticks(3))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => volumeScale(d))
      .attr("y2", (d) => volumeScale(d))
      .attr("stroke", "#f0f3fa")
      .attr("stroke-opacity", 0.1);
  }, [data]);

  useEffect(() => {
    const formattedSymbol = currentSymbol.replace("/", "").toLowerCase();

    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${formattedSymbol.toUpperCase()}&interval=${interval}&limit=100`
    )
      .then((res) => res.json())
      .then((rawData: BinanceKlineResponse[]) => {
        const candleData = rawData.map((d) => ({
          time: new Date(d[0]),
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
          volume: parseFloat(d[5]),
        }));
        setData(candleData);
      });

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formattedSymbol}@kline_${interval}`
    );

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.k) {
        const { t, o, h, l, c, v } = message.k;
        setData((prev) => {
          const newData = [...prev];
          const lastCandle = {
            time: new Date(t),
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c),
            volume: parseFloat(v),
          };

          if (
            newData[newData.length - 1]?.time.getTime() ===
            lastCandle.time.getTime()
          ) {
            newData[newData.length - 1] = lastCandle;
          } else {
            newData.push(lastCandle);
            if (newData.length > 100) newData.shift();
          }

          return newData;
        });
      }
    };

    return () => ws.close();
  }, [currentSymbol, interval]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.intervals}>
        {Object.keys(INTERVALS).map((int) => (
          <button
            key={int}
            className={`${styles.intervalButton} ${
              interval === int ? styles.active : ""
            }`}
            onClick={() => setInterval(int as Interval)}
          >
            {int}
          </button>
        ))}
      </div>
      <div className={styles.chartWrapper}>
        <svg ref={svgRef} className={styles.chart} />
        <div ref={tooltipRef} className={styles.tooltip} />
      </div>
    </div>
  );
}
