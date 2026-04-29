"use client";

import { create } from "zustand";

import type {
  AppLanguage,
  FocusHistoryDay,
  FocusSettings,
  PersistedFocusState,
  TaskItem,
  TimerMode
} from "@/lib/types";
import { todayKey } from "@/lib/utils";

type FocusState = {
  hydrated: boolean;
  mode: TimerMode;
  isRunning: boolean;
  remainingSeconds: number;
  completedFocusCount: number;
  currentTaskId: string | null;
  immersive: boolean;
  lastCompletedAt: number | null;
  tasks: TaskItem[];
  history: FocusHistoryDay[];
  settings: FocusSettings;
  hydrate: (snapshot: Partial<PersistedFocusState>) => void;
  getSnapshot: () => PersistedFocusState;
  setMode: (mode: TimerMode) => void;
  setRunning: (running: boolean) => void;
  tick: () => void;
  resetTimer: (mode?: TimerMode) => void;
  completeSession: () => void;
  skipToNext: () => void;
  setImmersive: (value: boolean) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  bindTask: (id: string | null) => void;
  updateSettings: (patch: Partial<FocusSettings>) => void;
  setLanguage: (language: AppLanguage) => void;
};

const baseSettings: FocusSettings = {
  language: "zh",
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  dailyGoal: 8,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  soundLabel: "Gentle Bell",
  accentHue: 18,
  ambientSound: "off",
  ambientVolume: 42
};

const durationMap = (settings: FocusSettings) => ({
  focus: settings.focusMinutes * 60,
  shortBreak: settings.shortBreakMinutes * 60,
  longBreak: settings.longBreakMinutes * 60
});

const initialTasks = [
  { id: crypto.randomUUID(), title: "Refine landing page motion", completed: false, pomodoros: 2 },
  { id: crypto.randomUUID(), title: "Reply to design review", completed: false, pomodoros: 1 }
];

export const useFocusStore = create<FocusState>()((set, get) => ({
  hydrated: false,
  mode: "focus",
  isRunning: false,
  remainingSeconds: baseSettings.focusMinutes * 60,
  completedFocusCount: 0,
  currentTaskId: null,
  immersive: false,
  lastCompletedAt: null,
  tasks: initialTasks,
  history: [],
  settings: baseSettings,
  hydrate: (snapshot) =>
    set((state) => {
      const settings = { ...state.settings, ...snapshot.settings };
      const mode = snapshot.mode ?? state.mode;
      return {
        hydrated: true,
        mode,
        isRunning: false,
        remainingSeconds:
          typeof snapshot.remainingSeconds === "number"
            ? snapshot.remainingSeconds
            : durationMap(settings)[mode],
        completedFocusCount: snapshot.completedFocusCount ?? state.completedFocusCount,
        currentTaskId: snapshot.currentTaskId ?? state.currentTaskId,
        tasks: snapshot.tasks?.length ? snapshot.tasks : state.tasks,
        history: snapshot.history ?? state.history,
        settings
      };
    }),
  getSnapshot: () => {
    const state = get();
    return {
      mode: state.mode,
      isRunning: false,
      remainingSeconds: state.remainingSeconds,
      completedFocusCount: state.completedFocusCount,
      currentTaskId: state.currentTaskId,
      tasks: state.tasks,
      history: state.history,
      settings: state.settings
    };
  },
  setMode: (mode) =>
    set((state) => ({
      mode,
      remainingSeconds: durationMap(state.settings)[mode],
      isRunning: false
    })),
  setRunning: (isRunning) => set({ isRunning }),
  tick: () =>
    set((state) => ({
      remainingSeconds: Math.max(0, state.remainingSeconds - 1)
    })),
  resetTimer: (mode) =>
    set((state) => {
      const nextMode = mode ?? state.mode;
      return {
        mode: nextMode,
        isRunning: false,
        remainingSeconds: durationMap(state.settings)[nextMode]
      };
    }),
  completeSession: () =>
    set((state) => {
      const today = todayKey();
      const history = [...state.history];
      const current = history.find((item) => item.date === today);
      const focusMinutes = state.mode === "focus" ? state.settings.focusMinutes : 0;

      if (current) {
        current.sessions += state.mode === "focus" ? 1 : 0;
        current.focusMinutes += focusMinutes;
      } else {
        history.push({
          date: today,
          sessions: state.mode === "focus" ? 1 : 0,
          focusMinutes
        });
      }

      const tasks = state.tasks.map((task) =>
        task.id === state.currentTaskId && state.mode === "focus"
          ? { ...task, pomodoros: task.pomodoros + 1 }
          : task
      );

      const nextCompletedFocusCount =
        state.mode === "focus" ? state.completedFocusCount + 1 : state.completedFocusCount;

      const shouldLongBreak = nextCompletedFocusCount > 0 && nextCompletedFocusCount % 4 === 0;
      const nextMode =
        state.mode === "focus" ? (shouldLongBreak ? "longBreak" : "shortBreak") : "focus";

      return {
        tasks,
        history,
        completedFocusCount: nextCompletedFocusCount,
        mode: nextMode,
        remainingSeconds: durationMap(state.settings)[nextMode],
        isRunning:
          state.mode === "focus"
            ? state.settings.autoStartBreaks
            : state.settings.autoStartFocus,
        lastCompletedAt: Date.now()
      };
    }),
  skipToNext: () =>
    set((state) => {
      const nextMode =
        state.mode === "focus"
          ? state.completedFocusCount > 0 && (state.completedFocusCount + 1) % 4 === 0
            ? "longBreak"
            : "shortBreak"
          : "focus";

      return {
        mode: nextMode,
        isRunning: false,
        remainingSeconds: durationMap(state.settings)[nextMode]
      };
    }),
  setImmersive: (immersive) => set({ immersive }),
  addTask: (title) =>
    set((state) => ({
      tasks: [
        { id: crypto.randomUUID(), title, completed: false, pomodoros: 0 },
        ...state.tasks
      ]
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    })),
  bindTask: (currentTaskId) => set({ currentTaskId }),
  updateSettings: (patch) =>
    set((state) => {
      const settings = { ...state.settings, ...patch };
      const total = durationMap(settings)[state.mode];
      const previousTotal = durationMap(state.settings)[state.mode];
      const remainingSeconds =
        state.remainingSeconds === previousTotal ? total : Math.min(state.remainingSeconds, total);

      return {
        settings,
        remainingSeconds
      };
    }),
  setLanguage: (language) =>
    set((state) => ({
      settings: { ...state.settings, language }
    }))
}));
