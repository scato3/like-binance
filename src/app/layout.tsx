import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { TradingDashboard } from "@/widgets/trading-dashboard";
import "./globals.scss";
import localFont from "next/font/local";

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
        <div className="app-layout">
          <TradingDashboard />
          <div className="sidebar">{children}</div>
        </div>
      </body>
    </html>
  );
}
