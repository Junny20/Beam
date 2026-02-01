export function formatDate(iso: string) {
  if (iso === "Never") return "Never";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}