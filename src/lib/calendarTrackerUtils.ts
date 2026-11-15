import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type TrackerView = "day" | "week" | "month";

export const getTrackerDates = (date: Date, view: TrackerView): Date[] => {
  if (view === "day") return [startOfDay(date)];
  if (view === "week") {
    return eachDayOfInterval({ start: startOfWeek(date), end: endOfWeek(date) });
  }
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
};

export const getTrackerMonthLeadingDays = (date: Date): number =>
  getDay(startOfMonth(date));

export const toTrackerDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

export const getCalendarMonthGrid = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });

};

export const getTrackerStreak = (
  checkins: Record<string, boolean>,
  fromDate: Date,
): number => {
  let cursor = startOfDay(fromDate);
  if (!checkins[toTrackerDateKey(cursor)]) cursor = addDays(cursor, -1);

  let streak = 0;
  while (checkins[toTrackerDateKey(cursor)]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
};