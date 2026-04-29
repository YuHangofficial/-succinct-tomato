"use client";

import { motion } from "framer-motion";

import { getMessages } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const circumference = 2 * Math.PI * 146;

export function FocusRing({
  progress,
  timeLabel,
  modeLabel,
  taskLabel,
  immersive,
  language
}: {
  progress: number;
  timeLabel: string;
  modeLabel: string;
  taskLabel: string;
  immersive?: boolean;
  language: AppLanguage;
}) {
  const t = getMessages(language);
  const safeProgress = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - safeProgress);

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[560px]", immersive && "max-w-[620px]")}>
      <motion.div
        className="absolute inset-7 rounded-full bg-accent/10 blur-3xl"
        animate={{ opacity: [0.24, 0.38, 0.24], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="ring-glow glass-panel relative flex h-full w-full items-center justify-center rounded-full border border-white/15">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 360 360" fill="none">
          <circle cx="180" cy="180" r="146" stroke="hsl(var(--progress-bg))" strokeWidth="10" />
          <motion.circle
            cx="180"
            cy="180"
            r="146"
            stroke="url(#ring-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--secondary-accent))" />
              <stop offset="55%" stopColor="hsl(var(--progress-track))" />
              <stop offset="100%" stopColor="hsl(var(--accent-strong))" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{modeLabel}</p>
          <div className="font-mono text-[clamp(4rem,11vw,7rem)] font-bold tracking-[-0.08em] text-foreground">
            {timeLabel}
          </div>
          <p className="max-w-[18rem] text-balance text-sm text-muted-foreground">
            {taskLabel || t.ringFallback}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RingPreview() {
  return <FocusRing progress={0.42} timeLabel={formatTime(1500)} modeLabel="Focus" taskLabel="Deep Writing" language="en" />;
}
