import type { AppLanguage, TimerMode } from "@/lib/types";

type Messages = {
  appName: string;
  tagline: string;
  stats: string;
  settings: string;
  backToTimer: string;
  syncing: string;
  mode: Record<TimerMode, string>;
  noTaskSelected: string;
  start: string;
  pause: string;
  skip: string;
  today: string;
  task: string;
  sound: string;
  noTaskBound: string;
  taskQueue: string;
  todayFocus: string;
  addTaskPlaceholder: string;
  pomodorosCompleted: string;
  active: string;
  focusTask: string;
  soundscape: string;
  ambientLayer: string;
  off: string;
  presets: {
    rain: string;
    brown: string;
    stream: string;
  };
  volume: string;
  moodboardNotes: string;
  premiumDirection: string;
  premiumBullets: [string, string, string];
  settingsDescription: string;
  focusDuration: string;
  focusDurationDesc: string;
  shortBreak: string;
  shortBreakDesc: string;
  longBreak: string;
  longBreakDesc: string;
  dailyGoal: string;
  dailyGoalDesc: string;
  completionSound: string;
  gentleBell: string;
  autoStartBreaks: string;
  autoStartBreaksDesc: string;
  autoStartFocus: string;
  autoStartFocusDesc: string;
  theme: string;
  language: string;
  light: string;
  dark: string;
  system: string;
  chinese: string;
  english: string;
  focusStats: string;
  totalSessions: string;
  focusMinutes: string;
  currentStreak: string;
  days: string;
  rhythm: string;
  focusMap: string;
  dailyGoalSessions: (count: number) => string;
  completionTitle: string;
  completionBody: string;
  ringFallback: string;
};

export const messages: Record<AppLanguage, Messages> = {
  zh: {
    appName: "简洁番茄",
    tagline: "安静专注，温柔陪伴。",
    stats: "统计",
    settings: "设置",
    backToTimer: "返回计时器",
    syncing: "正在同步本地数据...",
    mode: {
      focus: "专注",
      shortBreak: "短休息",
      longBreak: "长休息"
    },
    noTaskSelected: "还没有选择当前任务，请在右侧绑定一个任务。",
    start: "开始",
    pause: "暂停",
    skip: "跳过",
    today: "今日",
    task: "任务",
    sound: "声音",
    noTaskBound: "未绑定任务",
    taskQueue: "任务列表",
    todayFocus: "今日专注",
    addTaskPlaceholder: "添加下一步任务...",
    pomodorosCompleted: "个番茄完成",
    active: "进行中",
    focusTask: "开始专注",
    soundscape: "环境音",
    ambientLayer: "氛围层",
    off: "关闭",
    presets: {
      rain: "雨声",
      brown: "棕噪",
      stream: "溪流"
    },
    volume: "音量",
    moodboardNotes: "视觉说明",
    premiumDirection: "高级极简方向",
    premiumBullets: [
      "大号等宽数字搭配温柔雾感渐变与柔和辉光。",
      "莫兰迪中性色配合克制的珊瑚与灰蓝点缀。",
      "用大量留白与玻璃层次代替拥挤面板。"
    ],
    settingsDescription: "调整时长、声音、目标和整体视觉氛围。",
    focusDuration: "专注时长",
    focusDurationDesc: "默认 25 分钟。",
    shortBreak: "短休息",
    shortBreakDesc: "每段专注之间的轻柔重置。",
    longBreak: "长休息",
    longBreakDesc: "每完成四个番茄后使用。",
    dailyGoal: "每日目标",
    dailyGoalDesc: "每天完成多少次专注算达标。",
    completionSound: "完成提示音",
    gentleBell: "轻铃",
    autoStartBreaks: "自动开始休息",
    autoStartBreaksDesc: "专注结束后自动进入短休息或长休息。",
    autoStartFocus: "自动开始专注",
    autoStartFocusDesc: "休息结束后自动进入下一轮专注。",
    theme: "主题",
    language: "语言",
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
    chinese: "中文",
    english: "English",
    focusStats: "专注统计",
    totalSessions: "累计番茄",
    focusMinutes: "专注分钟",
    currentStreak: "当前连续",
    days: "天",
    rhythm: "节奏",
    focusMap: "35 天专注热力图",
    dailyGoalSessions: (count) => `每日目标：${count} 次`,
    completionTitle: "本轮已完成",
    completionBody: "休息一下，下一阶段已经准备好。",
    ringFallback: "选择一个任务，让这段专注时间安静地托住你的下一步工作。"
  },
  en: {
    appName: "Simple Pomodoro",
    tagline: "Quiet focus, beautifully held.",
    stats: "Stats",
    settings: "Settings",
    backToTimer: "Back to Timer",
    syncing: "Syncing local workspace...",
    mode: {
      focus: "Focus",
      shortBreak: "Short Break",
      longBreak: "Long Break"
    },
    noTaskSelected: "No active task selected. Choose one on the right to anchor this session.",
    start: "Start",
    pause: "Pause",
    skip: "Skip",
    today: "Today",
    task: "Task",
    sound: "Sound",
    noTaskBound: "No task bound",
    taskQueue: "Task Queue",
    todayFocus: "Today's Focus",
    addTaskPlaceholder: "Add a calm next step...",
    pomodorosCompleted: "pomodoros completed",
    active: "Active",
    focusTask: "Focus",
    soundscape: "Soundscape",
    ambientLayer: "Ambient Layer",
    off: "Off",
    presets: {
      rain: "Rain",
      brown: "Brown Noise",
      stream: "Stream"
    },
    volume: "Volume",
    moodboardNotes: "Moodboard Notes",
    premiumDirection: "Premium Minimal Direction",
    premiumBullets: [
      "Large monospaced numerals with warm fog-like glow.",
      "Morandi neutrals with restrained coral and slate accents.",
      "Glass panels with deep breathing space instead of dense dashboards."
    ],
    settingsDescription: "Tune duration, sound, goals, and the visual tone of the space.",
    focusDuration: "Focus Duration",
    focusDurationDesc: "Default 25 minutes.",
    shortBreak: "Short Break",
    shortBreakDesc: "A gentle reset between focus sessions.",
    longBreak: "Long Break",
    longBreakDesc: "Used after every four completed focus sessions.",
    dailyGoal: "Daily Goal",
    dailyGoalDesc: "How many focused sessions define a good day.",
    completionSound: "Completion Sound",
    gentleBell: "Gentle Bell",
    autoStartBreaks: "Auto-start Breaks",
    autoStartBreaksDesc: "Move into short or long break automatically.",
    autoStartFocus: "Auto-start Focus",
    autoStartFocusDesc: "Start the next focus block after a break ends.",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    system: "System",
    chinese: "Chinese",
    english: "English",
    focusStats: "Focus Statistics",
    totalSessions: "Total Sessions",
    focusMinutes: "Focus Minutes",
    currentStreak: "Current Streak",
    days: "days",
    rhythm: "Rhythm",
    focusMap: "35-day focus map",
    dailyGoalSessions: (count) => `Daily goal: ${count} sessions`,
    completionTitle: "Session Complete",
    completionBody: "Take a breath. Your next mode is ready.",
    ringFallback: "Choose a task and let the timer hold the room for your next deep work block."
  }
};

export function getMessages(language: AppLanguage) {
  return messages[language];
}
