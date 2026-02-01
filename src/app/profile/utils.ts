export function formatUnix(ts?: number) {
  if (!ts) return "Unknown";
  return new Date(ts * 1000).toLocaleString();
}

export function formatDate(ts?: number) {
  if (!ts) return "Unknown";
  return new Date(ts * 1000).toLocaleDateString();
}

export function personaStateLabel(state?: number) {
  const map: Record<number, { label: string; dot: string }> = {
    0: { label: "Offline", dot: "bg-gray-500" },
    1: { label: "Online", dot: "bg-green-500" },
    2: { label: "Busy", dot: "bg-red-500" },
    3: { label: "Away", dot: "bg-yellow-500" },
    4: { label: "Snooze", dot: "bg-yellow-400" },
    5: { label: "Looking to Trade", dot: "bg-blue-500" },
    6: { label: "Looking to Play", dot: "bg-purple-500" },
  };
  return map[state ?? -1] ?? { label: "Unknown", dot: "bg-gray-500" };
}

export function visibilityLabel(v?: number) {
  if (v === 3) return "Public";
  if (v === 1) return "Private";
  return "Unknown";
}