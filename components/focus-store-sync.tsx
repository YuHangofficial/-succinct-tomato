"use client";

import { useEffect } from "react";

import { loadPersistedState, savePersistedState } from "@/lib/persistence";
import { useFocusStore } from "@/stores/use-focus-store";

export function FocusStoreSync() {
  const hydrate = useFocusStore((state) => state.hydrate);

  useEffect(() => {
    let mounted = true;

    void loadPersistedState().then((snapshot) => {
      if (!mounted) return;
      hydrate(snapshot ?? {});
    });

    const unsubscribe = useFocusStore.subscribe((state) => {
      if (!state.hydrated) return;

      void savePersistedState(state.getSnapshot());
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [hydrate]);

  return null;
}
