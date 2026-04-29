"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getMessages } from "@/lib/i18n";
import { StatsOverview } from "@/components/stats-overview";
import { Button } from "@/components/ui/button";
import { useFocusStore } from "@/stores/use-focus-store";

export default function StatsPage() {
  const history = useFocusStore((state) => state.history);
  const settings = useFocusStore((state) => state.settings);
  const t = getMessages(settings.language);

  return (
    <main className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="glass-panel flex items-center justify-between rounded-[2rem] border border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{t.appName}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{t.focusStats}</h1>
          </div>
          <Button variant="subtle" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToTimer}
            </Link>
          </Button>
        </header>

        <StatsOverview history={history} dailyGoal={settings.dailyGoal} language={settings.language} />
      </div>
    </main>
  );
}
