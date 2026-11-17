import { useMemo, useState } from "react";
import { addMonths, addWeeks, format, isSameDay, subMonths, subWeeks } from "date-fns";
import { ArrowLeft, ArrowRight, Check, Flame, Plus, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getTrackerDates, getTrackerStreak, toTrackerDateKey, type TrackerView } from "@/lib/calendarTrackerUtils";
import type { NoteBlock } from "@/contexts/NotesContext";

type TrackerItem = NonNullable<NoteBlock["trackerItems"]>[number];
type TrackerPeriod = NonNullable<NoteBlock["trackerView"]>;

interface TrackerNoteBlockProps {
  title: string;
  items: TrackerItem[];
  view: TrackerPeriod;
  onUpdate: (updates: Partial<NoteBlock>) => void;
}

const TrackerNoteBlock = ({ title, items, view, onUpdate }: TrackerNoteBlockProps) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [itemName, setItemName] = useState("");
  const dates = useMemo(() => getTrackerDates(currentDate, view as TrackerView), [currentDate, view]);
  const periodLabel = view === "day" ? format(currentDate, "EEEE, MMM d") : view === "week" ? `Week of ${format(dates[0], "MMM d")}` : format(currentDate, "MMMM yyyy");
  const completion = items.length && dates.length
    ? Math.round(items.reduce((sum, item) => sum + dates.filter((day) => item.checkins[toTrackerDateKey(day)]).length, 0) / (items.length * dates.length) * 100)
    : 0;

  const movePeriod = (direction: -1 | 1) => {
    const change = view === "day" ? (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + direction) : view === "week" ? direction < 0 ? subWeeks : addWeeks : direction < 0 ? subMonths : addMonths;
    setCurrentDate((date) => change(date, 1));
  };

  const updateItems = (next: TrackerItem[]) => onUpdate({ trackerItems: next });
  const toggleCheckin = (item: TrackerItem, date: Date) => {
    const key = toTrackerDateKey(date);
    updateItems(items.map((current) => current.id === item.id ? {
      ...current,
      checkins: { ...current.checkins, [key]: !current.checkins[key] },
    } : current));
  };

  const addItem = () => {
    const name = itemName.trim();
    if (!name) return;
    updateItems([...items, { id: crypto.randomUUID(), name, checkins: {} }]);
    setItemName("");
  };

  return (
    <section className="my-3 overflow-hidden rounded-xl border border-border/70 bg-card" aria-label="Habit tracker block">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Target className="size-4" /></span>
          <div className="min-w-0">
            <Input aria-label="Tracker title" value={title} onChange={(event) => onUpdate({ content: event.target.value })} className="h-6 border-0 bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:ring-0" />
            <p className="text-xs text-muted-foreground">Small steps, visible progress</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(["day", "week", "month"] as const).map((option) => <Button key={option} variant={view === option ? "secondary" : "ghost"} size="sm" className="h-8 px-2.5 capitalize" onClick={() => onUpdate({ trackerView: option })}>{option}</Button>)}
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <Button variant="ghost" size="icon" className="size-8" aria-label="Previous tracker period" onClick={() => movePeriod(-1)}><ArrowLeft className="size-4" /></Button>
          <span className="min-w-28 text-center text-xs font-medium text-muted-foreground">{periodLabel}</span>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Next tracker period" onClick={() => movePeriod(1)}><ArrowRight className="size-4" /></Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2"><span className="text-2xl font-semibold tabular-nums">{completion}%</span><span className="text-xs text-muted-foreground">period completion</span></div>
        <div className="h-1.5 min-w-24 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${completion}%` }} /></div>
        <span className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? "habit" : "habits"}</span>
      </div>

      <div className="overflow-x-auto border-t border-border/50">
        <div className="min-w-[560px]">
          <div className="grid border-b border-border/50" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${dates.length}, minmax(30px, 1fr)) minmax(54px, auto)` }}>
            <div className="flex items-center px-4 py-2 text-[11px] font-medium text-muted-foreground">HABIT</div>
            {dates.map((date) => <div key={toTrackerDateKey(date)} className={cn("py-2 text-center text-[10px] text-muted-foreground", isSameDay(date, new Date()) && "font-semibold text-primary")} title={format(date, "EEEE, MMMM d")}>{view === "day" ? format(date, "EEE") : view === "month" ? format(date, "d") : format(date, "EEE").slice(0, 1)}</div>)}
            <div className="px-3 py-2 text-right text-[10px] text-muted-foreground">STREAK</div>
          </div>

          {items.length === 0 && <div className="px-4 py-9 text-center"><p className="text-sm font-medium">What would you like to keep showing up for?</p><p className="mt-1 text-xs text-muted-foreground">Add a habit below to begin your rhythm.</p></div>}
          {items.map((item) => {
            const streak = getTrackerStreak(item.checkins, new Date());
            const completed = dates.filter((date) => item.checkins[toTrackerDateKey(date)]).length;
            return (
              <div key={item.id} className="group/row grid min-h-12 border-b border-border/40 last:border-b-0" style={{ gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${dates.length}, minmax(30px, 1fr)) minmax(54px, auto)` }}>
                <div className="flex min-w-0 items-center gap-2 px-4"><span className="truncate text-xs font-medium">{item.name}</span><Button variant="ghost" size="icon" className="ml-auto size-6 shrink-0 opacity-70 sm:opacity-0 sm:group-hover/row:opacity-100" aria-label={`Delete ${item.name}`} onClick={() => updateItems(items.filter((current) => current.id !== item.id))}><Trash2 className="size-3.5" /></Button></div>
                {dates.map((date) => {
                  const checked = Boolean(item.checkins[toTrackerDateKey(date)]);
                  return <div key={toTrackerDateKey(date)} className="grid place-items-center"><button type="button" aria-label={`${checked ? "Unmark" : "Mark"} ${item.name} for ${format(date, "MMM d")}`} aria-pressed={checked} onClick={() => toggleCheckin(item, date)} className={cn("grid size-6 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", checked ? "bg-primary text-primary-foreground" : "bg-muted/70 text-transparent hover:bg-muted")}><Check className="size-3.5" /></button></div>;
                })}
                <div className="flex items-center justify-end gap-1 px-3 text-[10px] tabular-nums text-muted-foreground" title={`${completed} of ${dates.length} days completed`}><Flame className="size-3 text-primary" />{streak}</div>
              </div>
            );
          })}
        </div>
      </div>

      <form className="flex gap-2 border-t border-border/50 p-3 sm:px-4" onSubmit={(event) => { event.preventDefault(); addItem(); }}>
        <Input aria-label="New habit name" value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder="Add a habit or recurring goal…" className="h-9 max-w-sm text-xs" />
        <Button type="submit" size="sm" className="h-9" disabled={!itemName.trim()}><Plus className="size-3.5" />Add habit</Button>
      </form>
    </section>
  );
};

export default TrackerNoteBlock;