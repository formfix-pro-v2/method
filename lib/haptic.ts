// Trigger haptic feedback on supported devices
export function haptic(style: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30, 10, 30],
  };

  try {
    navigator.vibrate(patterns[style]);
  } catch {
    // Not supported
  }
}
