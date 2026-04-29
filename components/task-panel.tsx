"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMessages } from "@/lib/i18n";
import type { AppLanguage, TaskItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TaskPanel({
  tasks,
  currentTaskId,
  onAddTask,
  onToggleTask,
  onBindTask,
  language
}: {
  tasks: TaskItem[];
  currentTaskId: string | null;
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onBindTask: (id: string) => void;
  language: AppLanguage;
}) {
  const [draft, setDraft] = useState("");
  const t = getMessages(language);

  return (
    <div className="glass-panel rounded-[2rem] border border-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t.taskQueue}</p>
          <h2 className="text-lg font-semibold">{t.todayFocus}</h2>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t.addTaskPlaceholder}
          onKeyDown={(event) => {
            if (event.key === "Enter" && draft.trim()) {
              onAddTask(draft.trim());
              setDraft("");
            }
          }}
        />
        <Button
          size="icon"
          onClick={() => {
            if (!draft.trim()) return;
            onAddTask(draft.trim());
            setDraft("");
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 rounded-[1.4rem] border px-4 py-3 transition",
              currentTaskId === task.id
                ? "border-accent/40 bg-accent/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            )}
          >
            <button
              type="button"
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                task.completed ? "border-accent bg-accent text-white" : "border-white/15"
              )}
              onClick={(event) => {
                event.stopPropagation();
                onToggleTask(task.id);
              }}
            >
              {task.completed ? <Check className="h-3.5 w-3.5" /> : null}
            </button>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-sm", task.completed && "text-muted-foreground line-through")}>
                {task.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{task.pomodoros} {t.pomodorosCompleted}</p>
            </div>
            <Button variant="ghost" className="h-9 px-4" onClick={() => onBindTask(task.id)}>
              {currentTaskId === task.id ? t.active : t.focusTask}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
