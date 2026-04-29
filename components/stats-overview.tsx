"use client";

import { Flame, Goal, TimerReset } from "lucide-react";
import { useMemo } from "react";

import { getMessages } from "@/lib/i18n";
import type { AppLanguage, FocusHistoryDay } from "@/lib/types";

function buildHeatmap(history: FocusHistoryDay[]) {
  const map = new Map(history.map((day) => [day.date, day.sessions]));
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (34 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      sessions: map.get(key) ?? 0
    };
  });
}

export function StatsOverview({
  history,
  dailyGoal,
  language
}: {
  history: FocusHistoryDay[];
  dailyGoal: number;
  language: AppLanguage;
}) {
  const t = getMessages(language);
  const totalSessions = history.reduce((sum, item) => sum + item.sessions, 0);
  const totalMinutes = history.reduce((sum, item) => sum + item.focusMinutes, 0);
  const streak = useMemo(() => {
    let days = 0;
    const map = new Map(history.map((day) => [day.date, day.sessions]));
    for (let offset = 0; offset < 365; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const key = date.toISOString().slice(0, 10);
      if ((map.get(key) ?? 0) > 0) {
        days += 1;
      } else {
        break;
      }
    }
    return days;
  }, [history]);

  const heatmap = useMemo(() => buildHeatmap(history), [history]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t.totalSessions, value: totalSessions, icon: Goal },
          { label: t.focusMinutes, value: totalMinutes, icon: TimerReset },
          { label: t.currentStreak, value: `${streak} ${t.days}`, icon: Flame }
        ].map((card) => (
          <div key={card.label} className="glass-panel rounded-[2rem] border border-white/10 p-5">
            <card.icon className="mb-4 h-5 w-5 text-accent" />
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-[2rem] border border-white/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t.rhythm}</p>
            <h2 className="mt-1 text-lg font-semibold">{t.focusMap}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{t.dailyGoalSessions(dailyGoal)}</p>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2">
          {heatmap.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.sessions} sessions`}
              className="aspect-square rounded-xl border border-white/10"
              style={{
                background:
                  day.sessions === 0
                    ? "color-mix(in srgb, hsl(var(--muted)) 50%, transparent)"
                    : `color-mix(in srgb, hsl(var(--accent)) ${Math.min(
                        20 + day.sessions * 18,
                        88
                      )}%, transparent)`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
