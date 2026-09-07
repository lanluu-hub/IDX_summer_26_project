export function formatTime(timeStr) {
  if (!timeStr) return "Unknown";

  // Append a fallback date to instantiate a native Date object safely
  const dateObj = new Date(`1970-01-01T${timeStr}`);

  // Node.js native Internationalization API
  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
