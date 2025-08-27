import "../styles/globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import Providers from "../components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LOKASCORE - Veri ve YZ Destekli Lokasyon Analizi",
    template: "%s | LOKASCORE",
  },
  description:
    "Harita üzerinden seçilen konumlar için AI destekli ticari potansiyel analizi. Girişimciler ve yatırımcılar için doğru konum seçme platformu.",
  keywords: [
    "lokasyon analizi",
    "yapay zeka",
    "ticari potansiyel",
    "konum seçimi",
    "girişimcilik",
  ],
  authors: [{ name: "LOKASCORE" }],
  creator: "LOKASCORE",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lokascore.com",
    title: "LOKASCORE - Veri ve YZ Destekli Lokasyon Analizi",
    description: "AI destekli lokasyon analizi ile doğru konum seçimi yapın",
    siteName: "LOKASCORE",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOKASCORE - Veri ve YZ Destekli Lokasyon Analizi",
    description: "AI destekli lokasyon analizi ile doğru konum seçimi yapın",
    creator: "@lokascore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers session={null}>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
