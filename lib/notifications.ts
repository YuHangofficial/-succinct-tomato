export async function notifyCompletion(title: string, body: string) {
  try {
    const mod = await import("@tauri-apps/plugin-notification");
    const granted = await mod.isPermissionGranted();
    if (!granted) {
      await mod.requestPermission();
    }
    mod.sendNotification({ title, body });
    return;
  } catch {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
    }
  }
}
