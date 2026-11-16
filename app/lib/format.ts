export function formatSubCategoryLabel(sub: string): string {
  if (!sub) return "";
  let clean = sub.replace(/[?]/g, "").trim();
  clean = clean.replace(/\baan\b/gi, "&").replace(/\band\b/gi, "&");
  return clean
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
