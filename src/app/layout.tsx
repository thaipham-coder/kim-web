import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { MobileBottomNav } from "@/components/MobileBottomNav"
import { FloatingCartSummary } from "@/components/FloatingCartSummary"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kimcafe.biz.vn'),
  title: "Kim Coffee & Fruit Tea",
  description: "Thơm vị cà phê - mát lành trái cây",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#171717" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <SpeedInsights />
        <MobileBottomNav />
        <FloatingCartSummary />
      </body>
    </html>
  );
}
