import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isExpired(deadlineString) {
  if (!deadlineString) return false;
  return new Date(deadlineString) < new Date();
}

// Helper formatting deadline
export function formatDeadline(dateString, weekday = "short") {
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
}

export function formatMediumShortDate(date) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(date);
  }
}

export function getMissionSubmissionStatus(mission) {
  if (mission) {
    const misStatusExpired = mission.status === "EXPIRED";
    const subStatus = mission.my_submission?.status;
    const dateExpired = isExpired(mission.deadline);

    if (!subStatus && (misStatusExpired || dateExpired)) return "expired";
    else if (!subStatus && !misStatusExpired && !dateExpired) return "available";
    else if (subStatus === "PENDING") return "pending";
    else if (subStatus === "APPROVED") return "approved";
    else if (subStatus === "REJECTED") return "rejected";
    else return "error";
  }

  return "error";
}
