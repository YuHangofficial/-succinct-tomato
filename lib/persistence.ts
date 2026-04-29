"use client";

import type { PersistedFocusState } from "@/lib/types";

const STORE_PATH = "store/focus.json";
const STORE_KEY = "focusState";
const LEGACY_KEY = "serene-pomodoro-store";

type StoreLike = {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  save(): Promise<void>;
};

let storePromise: Promise<StoreLike | null> | null = null;

async function getStore(): Promise<StoreLike | null> {
  if (!storePromise) {
    storePromise = (async () => {
      try {
        const mod = await import("@tauri-apps/plugin-store");
        return await mod.load(STORE_PATH, { autoSave: 150 });
      } catch {
        return null;
      }
    })();
  }

  return storePromise;
}

export async function loadPersistedState(): Promise<Partial<PersistedFocusState> | null> {
  const store = await getStore();
  if (store) {
    return (await store.get<Partial<PersistedFocusState>>(STORE_KEY)) ?? null;
  }

  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function savePersistedState(snapshot: PersistedFocusState) {
  const store = await getStore();
  if (store) {
    await store.set(STORE_KEY, snapshot);
    await store.save();
    return;
  }

  localStorage.setItem(LEGACY_KEY, JSON.stringify(snapshot));
}
