import { describe, expect, it } from "vitest";
import {
  getCalendarMonthGrid,
  getCalendarWeekLabel,
  getTrackerDates,
  getTrackerMonthLeadingDays,
  getTrackerStreak,
  toTrackerDateKey,
} from "@/lib/calendarTrackerUtils";

describe("calendar and tracker date helpers", () => {
  const referenceDate = new Date(2026, 10, 15, 12);

  it("provides one day, seven days, and every day in the selected month", () => {
    expect(getTrackerDates(referenceDate, "day")).toHaveLength(1);
    expect(getTrackerDates(referenceDate, "week")).toHaveLength(7);
    expect(getTrackerDates(referenceDate, "month")).toHaveLength(30);
  });

  it("builds a calendar grid that includes complete weeks around the month", () => {
    const grid = getCalendarMonthGrid(referenceDate);
    expect(grid.length % 7).toBe(0);
    expect(grid[0].getDay()).toBe(0);
    expect(grid.at(-1)?.getDay()).toBe(6);
  });

  it("labels the week containing the selected date with its full date range", () => {
    expect(getCalendarWeekLabel(referenceDate)).toBe("Nov 15–21, 2026");
  });

  it("keys check-ins by local calendar date and counts consecutive days", () => {
    const checkins = {
      "2026-11-15": true,
      "2026-11-14": true,
      "2026-11-13": true,
      "2026-11-11": true,
    };
    expect(toTrackerDateKey(referenceDate)).toBe("2026-11-15");
    expect(getTrackerMonthLeadingDays(referenceDate)).toBe(0);
    expect(getTrackerStreak(checkins, referenceDate)).toBe(3);
  });
});