"use client";

import { motion } from "framer-motion";
import { Coffee, Expand, Pause, Play, SkipForward, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CelebrationOverlay } from "@/components/celebration-overlay";
import { FocusRing } from "@/components/focus-ring";
import { ModeSwitcher } from "@/components/mode-switcher";
import { SettingsSheet } from "@/components/settings-sheet";
import { SoundscapePanel } from "@/components/soundscape-panel";
import { TaskPanel } from "@/components/task-panel";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n";
import { notifyCompletion } from "@/lib/notifications";
import { toggleFullscreen } from "@/lib/window";
import { useFocusStore } from "@/stores/use-focus-store";
import { formatTime } from "@/lib/utils";

export default function HomePage() {
  const {
    mode,
    isRunning,
    remainingSeconds,
    tasks,
    currentTaskId,
    immersive,
    history,
    settings,
    lastCompletedAt,
    setMode,
    setRunning,
    tick,
    completeSession,
    skipToNext,
    setImmersive,
    addTask,
    toggleTask,
    bindTask,
    updateSettings,
    setLanguage
  } = useFocusStore();
  const hydrated = useFocusStore((state) => state.hydrated);
  const [showCelebration, setShowCelebration] = useState(false);
  const t = getMessages(settings.language);

  const totalSeconds =
    mode === "focus"
      ? settings.focusMinutes * 60
      : mode === "shortBreak"
        ? settings.shortBreakMinutes * 60
        : settings.longBreakMinutes * 60;

  const currentTask = tasks.find((task) => task.id === currentTaskId);
  const progress = totalSeconds === 0 ? 0 : 1 - remainingSeconds / totalSeconds;
  const todaySessions =
    history.find((item) => item.date === new Date().toISOString().slice(0, 10))?.sessions ?? 0;

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      const nextRemaining = useFocusStore.getState().remainingSeconds;
      if (nextRemaining <= 1) {
        window.clearInterval(interval);
        completeSession();
        notifyCompletion(t.completionTitle, t.completionBody);
      } else {
        tick();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [completeSession, isRunning, t.completionBody, t.completionTitle, tick]);

  useEffect(() => {
    if (!lastCompletedAt) return;
    setShowCelebration(true);
    const timeout = window.setTimeout(() => setShowCelebration(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [lastCompletedAt]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setRunning(!useFocusStore.getState().isRunning);
      }
      if (event.code === "Escape") {
        setImmersive(false);
        void toggleFullscreen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setImmersive, setRunning]);

  const stats = useMemo(
    () => [
      { label: t.today, value: `${todaySessions}/${settings.dailyGoal}`, icon: Target },
      { label: t.task, value: currentTask?.title ?? t.noTaskBound, icon: Sparkles },
      { label: t.sound, value: settings.soundLabel, icon: Coffee }
    ],
    [currentTask?.title, settings.dailyGoal, settings.soundLabel, t, todaySessions]
  );

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1500px] flex-col gap-5">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel flex items-center justify-between rounded-[2rem] border border-white/10 px-5 py-4"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{t.appName}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{t.tagline}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="subtle" asChild>
              <Link href="/stats">{t.stats}</Link>
            </Button>
            <SettingsSheet
              settings={settings}
              onUpdate={updateSettings}
              language={settings.language}
              onLanguageChange={setLanguage}
            />
            <Button
              variant="subtle"
              size="icon"
              onClick={async () => {
                const next = !immersive;
                setImmersive(next);
                await toggleFullscreen(next);
              }}
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </motion.header>

        <div className={`grid flex-1 gap-5 ${immersive ? "grid-cols-1" : "xl:grid-cols-[1.1fr_420px]"}`}>
          <section className="glass-panel relative flex flex-col rounded-[2.5rem] border border-white/10 px-5 py-6 md:px-10 md:py-10">
            <CelebrationOverlay active={showCelebration} />
            <div className="mb-8 flex flex-col items-center gap-5">
              <ModeSwitcher value={mode} onChange={setMode} language={settings.language} />
              <div className="space-y-2 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{t.mode[mode]}</p>
                <p className="text-sm text-muted-foreground">{currentTask?.title ?? t.noTaskSelected}</p>
                {!hydrated ? (
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.syncing}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <FocusRing
                progress={progress}
                timeLabel={formatTime(remainingSeconds)}
                modeLabel={t.mode[mode]}
                taskLabel={currentTask?.title ?? ""}
                immersive={immersive}
                language={settings.language}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <motion.div whileTap={{ scale: 0.96 }}>
                <Button size="lg" onClick={() => setRunning(!isRunning)}>
                  {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isRunning ? t.pause : t.start}
                </Button>
              </motion.div>
              <Button variant="subtle" size="lg" onClick={() => skipToNext()}>
                <SkipForward className="mr-2 h-4 w-4" />
                {t.skip}
              </Button>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  className="rounded-[1.7rem] border border-white/10 bg-white/8 p-4"
                >
                  <item.icon className="mb-4 h-4 w-4 text-accent" />
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-sm font-medium">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {!immersive ? (
            <aside className="space-y-5">
              <TaskPanel
                tasks={tasks}
                currentTaskId={currentTaskId}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onBindTask={bindTask}
                language={settings.language}
              />

              <SoundscapePanel
                settings={settings}
                onUpdate={updateSettings}
                language={settings.language}
              />

              <div className="glass-panel rounded-[2rem] border border-white/10 p-5">
                <p className="text-sm text-muted-foreground">{t.moodboardNotes}</p>
                <h2 className="mt-1 text-lg font-semibold">{t.premiumDirection}</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {t.premiumBullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
