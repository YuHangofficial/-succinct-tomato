export async function toggleFullscreen(next?: boolean) {
  try {
    const mod = await import("@tauri-apps/api/window");
    const appWindow = mod.getCurrentWindow();
    const current = await appWindow.isFullscreen();
    await appWindow.setFullscreen(next ?? !current);
    return !current;
  } catch {
    return false;
  }
}
