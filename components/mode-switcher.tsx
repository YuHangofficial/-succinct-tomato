"use client";

import { AnimatePresence, motion } from "framer-motion";

import { getMessages } from "@/lib/i18n";
import type { AppLanguage, TimerMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ModeSwitcher({
  value,
  onChange,
  language
}: {
  value: TimerMode;
  onChange: (mode: TimerMode) => void;
  language: AppLanguage;
}) {
  const t = getMessages(language);
  const modes: { id: TimerMode; label: string }[] = [
    { id: "focus", label: t.mode.focus },
    { id: "shortBreak", label: t.mode.shortBreak },
    { id: "longBreak", label: t.mode.longBreak }
  ];

  return (
    <div className="relative inline-flex rounded-full border border-white/10 bg-white/10 p-1 dark:bg-white/5">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={cn(
            "relative z-10 rounded-full px-4 py-2 text-sm transition",
            value === mode.id ? "text-white" : "text-muted-foreground"
          )}
          onClick={() => onChange(mode.id)}
          type="button"
        >
          <AnimatePresence>
            {value === mode.id ? (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                initial={{ opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            ) : null}
          </AnimatePresence>
          {mode.label}
        </button>
      ))}
    </div>
  );
}
