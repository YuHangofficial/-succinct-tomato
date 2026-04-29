"use client";

import { MoonStar, Settings2, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { getMessages } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppLanguage, FocusSettings } from "@/lib/types";

function SettingField({
  label,
  description,
  value,
  onChange
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function SettingsSheet({
  settings,
  onUpdate,
  language,
  onLanguageChange
}: {
  settings: FocusSettings;
  onUpdate: (patch: Partial<FocusSettings>) => void;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
}) {
  const { setTheme, theme } = useTheme();
  const t = getMessages(language);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="subtle" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.settings}</DialogTitle>
          <DialogDescription>{t.settingsDescription}</DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-5 overflow-y-auto pr-1">
          <SettingField
            label={t.focusDuration}
            description={t.focusDurationDesc}
            value={settings.focusMinutes}
            onChange={(value) => onUpdate({ focusMinutes: value })}
          />
          <SettingField
            label={t.shortBreak}
            description={t.shortBreakDesc}
            value={settings.shortBreakMinutes}
            onChange={(value) => onUpdate({ shortBreakMinutes: value })}
          />
          <SettingField
            label={t.longBreak}
            description={t.longBreakDesc}
            value={settings.longBreakMinutes}
            onChange={(value) => onUpdate({ longBreakMinutes: value })}
          />
          <SettingField
            label={t.dailyGoal}
            description={t.dailyGoalDesc}
            value={settings.dailyGoal}
            onChange={(value) => onUpdate({ dailyGoal: value })}
          />

          <label className="block space-y-2">
            <p className="text-sm font-medium">{t.completionSound}</p>
            <Input
              value={settings.soundLabel}
              onChange={(event) => onUpdate({ soundLabel: event.target.value })}
              placeholder={t.gentleBell}
            />
          </label>

          <label className="flex items-center justify-between rounded-[1.4rem] border border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-medium">{t.autoStartBreaks}</p>
              <p className="text-xs text-muted-foreground">{t.autoStartBreaksDesc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(event) => onUpdate({ autoStartBreaks: event.target.checked })}
            />
          </label>

          <label className="flex items-center justify-between rounded-[1.4rem] border border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-medium">{t.autoStartFocus}</p>
              <p className="text-xs text-muted-foreground">{t.autoStartFocusDesc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartFocus}
              onChange={(event) => onUpdate({ autoStartFocus: event.target.checked })}
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm font-medium">{t.language}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={language === "zh" ? "default" : "subtle"} onClick={() => onLanguageChange("zh")}>
                {t.chinese}
              </Button>
              <Button variant={language === "en" ? "default" : "subtle"} onClick={() => onLanguageChange("en")}>
                {t.english}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">{t.theme}</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={theme === "light" ? "default" : "subtle"} onClick={() => setTheme("light")}>
                <SunMedium className="mr-2 h-4 w-4" />
                {t.light}
              </Button>
              <Button variant={theme === "dark" ? "default" : "subtle"} onClick={() => setTheme("dark")}>
                <MoonStar className="mr-2 h-4 w-4" />
                {t.dark}
              </Button>
              <Button variant={theme === "system" ? "default" : "subtle"} onClick={() => setTheme("system")}>
                {t.system}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
