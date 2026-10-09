import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function isExpired(deadlineString) {
  if (!deadlineString) return false;
  return new Date(deadlineString) < new Date();
}

// Helper formatting deadline
export const formatDeadline = (dateString, weekday = "short") => {
  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("id-ID", {
        weekday: weekday,
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  } catch {
    return dateString;
  }
};