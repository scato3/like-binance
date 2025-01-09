import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { TradingHeader } from "@/components/layout/trading-header";
import "./globals.scss";
import localFont from "next/font/local";
import { OrderBook } from "@/features/order-book";
import { MarketOverview } from "@/features/market-overview";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "실시간 암호화폐 거래 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr" className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
        <Navbar />
        <div className="trading-layout">
          <div className="trading-main">
            <TradingHeader />
            <div className="trading-content">
              <OrderBook />
              <div className="chart-area">
                <MarketOverview />
              </div>
            </div>
          </div>
          <div className="trading-sidebar">{children}</div>
        </div>
      </body>
    </html>
  );
}
