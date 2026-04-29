# Serene Pomodoro Blueprint

## 1. Design Direction

### Brand feeling

- Premium minimal
- Quiet, restorative, focused
- Warm neutral base with restrained accent lighting
- Spacious layouts, rounded geometry, soft depth

### Palette

- Mist Ivory: `#F4EFEA`
- Porcelain Sand: `#E8DED6`
- Stone Taupe: `#C8BAAF`
- Graphite Ink: `#2F3440`
- Cloud Slate: `#6B7280`
- Muted Coral: `#D5957D`
- Dusty Teal: `#8CA6A3`

### Type

- UI: Inter or SF Pro
- Numeric display: Space Mono, Geist Mono, or IBM Plex Mono
- Future premium upgrade: Satoshi for headings plus a restrained mono for timer digits

### Motion

- Circular progress ring: spring-based easing
- Ambient breathing glow: 4.8s loop
- Number transitions: subtle blur and vertical settle
- Controls: tiny scale-down on press, soft highlight on hover
- Completion state: gentle confetti-light particles, never arcade-like

### Moodboard description

- Apple hardware calm
- Linear interface precision
- Arc Browser softness and atmosphere
- Matte glass, fogged gradients, warm daylight neutrals

## 2. Product Structure

- Main timer canvas
- Right-side task panel
- Slide-over settings
- Optional immersive full-screen mode
- Future tabs: Stats, Sounds, Themes

## 3. Tauri Packaging Direction

- Primary Windows target: NSIS installer
- Secondary Windows target: MSI via WiX for enterprise distribution
- macOS: DMG
- Linux: DEB and AppImage in next iteration

## 4. Next Phase Recommendations

- Replace localStorage persistence with `tauri-plugin-store`
- Add tray menu, global shortcuts, and startup launch toggle
- Add bundled audio assets and file picker for custom sounds
- Add a lightweight stats route with streaks and heatmap
