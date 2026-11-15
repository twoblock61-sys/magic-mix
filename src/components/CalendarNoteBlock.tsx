import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isSameMonth,
  isToday,
  parseISO,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getCalendarMonthGrid, toTrackerDateKey } from "@/lib/calendarTrackerUtils";
import type { NoteBlock } from "@/contexts/NotesContext";

type CalendarEventItem = NonNullable<NoteBlock["calendarEvents"]>[number];
type CalendarView = NonNullable<NoteBlock["calendarView"]>;

interface CalendarNoteBlockProps {
  title: string;
  events: CalendarEventItem[];
  view: CalendarView;
  onUpdate: (updates: Partial<NoteBlock>) => void;
}

const CalendarNoteBlock = ({ title, events, view, onUpdate }: CalendarNoteBlockProps) => {
  const [visibleDate, setVisibleDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");

  const days = useMemo(() => getCalendarMonthGrid(visibleDate), [visibleDate]);
  const selectedKey = toTrackerDateKey(selectedDate);
  const selectedEvents = events
    .filter((event) => event.date === selectedKey)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const changeRange = (direction: -1 | 1) => {
    const update = view === "month"
      ? direction < 0 ? subMonths : addMonths
      : view === "week"
        ? direction < 0 ? subWeeks : addWeeks
        : direction < 0 ? subDays : addDays;
    setVisibleDate((date) => update(date, 1));
    setSelectedDate((date) => update(date, 1));
  };

  const addEvent = () => {
    const cleanTitle = eventTitle.trim();
    if (!cleanTitle) return;
    onUpdate({ calendarEvents: [...events, {
      id: crypto.randomUUID(),
      title: cleanTitle,
      date: selectedKey,
      ...(eventTime ? { time: eventTime } : {}),
    }] });
    setEventTitle("");
    setEventTime("");
  };

  const headerDate = view === "month"
    ? format(visibleDate, "MMMM yyyy")
    : view === "week"
      ? `${format(days.find((day) => toTrackerDateKey(day) <= toTrackerDateKey(visibleDate)) || visibleDate, "MMM d")} · Week`
      : format(selectedDate, "EEEE, MMM d");
  const displayDays = view === "day" ? [selectedDate] : view === "week" ? days.slice(0, 7).map((_, index) => addDays(visibleDate, index - visibleDate.getDay())) : days;

  return (
    <section className="my-3 overflow-hidden rounded-xl border border-border/70 bg-card" aria-label="Calendar block">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><CalendarDays className="size-4" /></span>
          <div className="min-w-0">
            <Input aria-label="Calendar title" value={title} onChange={(event) => onUpdate({ content: event.target.value })} className="h-6 border-0 bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:ring-0" />
            <p className="text-xs text-muted-foreground">{events.length} {events.length === 1 ? "event" : "events"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(["day", "week", "month"] as const).map((option) => (
            <Button key={option} variant={view === option ? "secondary" : "ghost"} size="sm" className="h-8 px-2.5 capitalize" onClick={() => onUpdate({ calendarView: option })}>{option}</Button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <Button variant="ghost" size="icon" className="size-8" aria-label="Previous calendar period" onClick={() => changeRange(-1)}><ArrowLeft className="size-4" /></Button>
          <span className="min-w-28 text-center text-xs font-medium text-muted-foreground">{headerDate}</span>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Next calendar period" onClick={() => changeRange(1)}><ArrowRight className="size-4" /></Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => { setVisibleDate(new Date()); setSelectedDate(new Date()); }}>Today</Button>
        </div>
      </header>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 p-3 sm:p-4">
          <div className="grid grid-cols-7 border-b border-border/50 pb-2 text-center text-[11px] font-medium text-muted-foreground">
            {"SMTWTFS".split("").map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className={cn("grid grid-cols-7", view === "month" ? "" : "min-h-48")}>
            {displayDays.map((day) => {
              const key = toTrackerDateKey(day);
              const dayEvents = events.filter((event) => event.date === key);
              const selected = key === selectedKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  aria-label={`${format(day, "MMMM d")}${dayEvents.length ? `, ${dayEvents.length} events` : ""}`}
                  className={cn(
                    "group/day flex min-h-14 min-w-0 flex-col items-center gap-1 border-b border-r border-border/40 p-1.5 text-xs transition-colors sm:min-h-[76px] sm:p-2",
                    view === "month" && !isSameMonth(day, visibleDate) && "text-muted-foreground/40",
                    selected && "bg-primary/5",
                    view !== "month" && "min-h-36 sm:min-h-48",
                  )}
                >
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", isToday(day) && "bg-primary text-primary-foreground", selected && !isToday(day) && "bg-secondary text-foreground")}>{format(day, "d")}</span>
                  <span className="hidden w-full space-y-1 sm:block">
                    {dayEvents.slice(0, view === "month" ? 2 : 5).map((item) => <span key={item.id} className="block truncate rounded bg-primary/10 px-1 py-0.5 text-left text-[10px] text-primary">{item.time ? `${item.time} ` : ""}{item.title}</span>)}
                    {dayEvents.length > (view === "month" ? 2 : 5) && <span className="block text-muted-foreground">+{dayEvents.length - (view === "month" ? 2 : 5)} more</span>}
                  </span>
                  <span className="flex gap-0.5 sm:hidden">{dayEvents.slice(0, 3).map((item) => <span key={item.id} className="size-1 rounded-full bg-primary" />)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="border-t border-border/60 p-4 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Selected day</p>
              <h3 className="mt-1 text-sm font-semibold">{format(selectedDate, "EEE, MMM d")}</h3>
            </div>
            {isToday(selectedDate) && <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">Today</span>}
          </div>
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {selectedEvents.length === 0 && <p className="py-3 text-xs text-muted-foreground">A little room for what matters.</p>}
            {selectedEvents.map((event) => (
              <div key={event.id} className="group/event flex items-start gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1"><p className="break-words text-xs font-medium">{event.title}</p>{event.time && <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><Clock3 className="size-3" />{event.time}</p>}</div>
                <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-70 sm:opacity-0 sm:group-hover/event:opacity-100" aria-label={`Delete ${event.title}`} onClick={() => onUpdate({ calendarEvents: events.filter((item) => item.id !== event.id) })}><Trash2 className="size-3.5" /></Button>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
            <Input aria-label="New event title" value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addEvent(); }} placeholder="Add an event…" className="h-9 text-xs" />
            <div className="flex gap-2">
              <Input aria-label="Event time" type="time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} className="h-9 min-w-0 text-xs" />
              <Button size="sm" className="h-9 shrink-0" onClick={addEvent} disabled={!eventTitle.trim()}><Plus className="size-3.5" />Add</Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CalendarNoteBlock;