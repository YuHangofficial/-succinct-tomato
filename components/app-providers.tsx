"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { FocusStoreSync } from "@/components/focus-store-sync";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <FocusStoreSync />
      {children}
    </ThemeProvider>
  );
}
