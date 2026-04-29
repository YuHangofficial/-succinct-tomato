import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { AppProviders } from "@/components/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "简洁番茄",
  description: "简洁番茄是一款安静、优雅、专注的桌面番茄钟工具。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
