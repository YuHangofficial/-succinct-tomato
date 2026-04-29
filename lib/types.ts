export type TimerMode = "focus" | "shortBreak" | "longBreak";
export type AppLanguage = "zh" | "en";

export type TaskItem = {
  id: string;
  title: string;
  completed: boolean;
  pomodoros: number;
};

export type FocusSettings = {
  language: AppLanguage;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  dailyGoal: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  soundLabel: string;
  accentHue: number;
  ambientSound: "off" | "rain" | "brown" | "stream";
  ambientVolume: number;
};

export type FocusHistoryDay = {
  date: string;
  sessions: number;
  focusMinutes: number;
};

export type PersistedFocusState = {
  mode: TimerMode;
  isRunning: boolean;
  remainingSeconds: number;
  completedFocusCount: number;
  currentTaskId: string | null;
  tasks: TaskItem[];
  history: FocusHistoryDay[];
  settings: FocusSettings;
};
