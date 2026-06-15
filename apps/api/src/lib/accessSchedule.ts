export interface AccessScheduleWindow {
  timezone: string;
  days: number[];
  startHHMM: string;
  endHHMM: string;
}

export function isWithinAccessSchedule(schedule: AccessScheduleWindow, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: schedule.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);

  if (!schedule.days.includes(dayIndex)) return false;

  const current = `${hour === "24" ? "00" : hour}:${minute}`;

  if (schedule.startHHMM <= schedule.endHHMM) {
    return current >= schedule.startHHMM && current <= schedule.endHHMM;
  }

  return current >= schedule.startHHMM || current <= schedule.endHHMM;
}
