import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import RootLayoutClient from "./context";

const FigtreeFont = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForesightX | Prediction Market",
  description: "Predict future outcomes and trends with ForesightX, the premier blockchain-based prediction market.",
  keywords: [
    "Prediction Market",
    "Blockchain Predictions",
    "Market Forecasting",
    "Crowdsourced Predictions",
    "ForesightX"
  ],
  authors: [
    {
      name: "Taiwo Triumphant",
      url: "https://foresightx.com",
    },
  ],
  openGraph: {
    title: "ForesightX Prediction Market",
    description: "Predict future outcomes and trends with ForesightX, the leading blockchain-based prediction market.",
    type: "website",
    siteName: "ForesightX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForesightX Prediction Market",
    description: "Predict future outcomes and trends with ForesightX, the leading blockchain-based prediction market.",
    creator: "@foresightx",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <RootLayoutClient>
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="832" />
        <meta
          property="og:site_name"
          content="ForesightX — Prediction Market"
        />
        <meta
          property="og:url"
          content="https://foresightx.com/"
        />
        <meta name="twitter:image" content="/foresightx-image.png" />
        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="832" />
        <body className={FigtreeFont.className}>
          {children}
          <Toaster richColors position="top-center" />
          <Analytics />
        </body>
      </RootLayoutClient>
    </html>
  );
}

