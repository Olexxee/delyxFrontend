export function convertToHumanReadableTime(dateString: string | Date) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  if (diff < 60) return `${diff} sec${diff !== 1 ? "s" : ""} ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) !== 1 ? "s" : ""} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? "s" : ""} ago`;

  const days = Math.floor(diff / 86400);
  if (days === 1) return "Yesterday";
  if (days <= 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}
