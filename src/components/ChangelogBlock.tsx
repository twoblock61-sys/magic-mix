import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar } from "lucide-react";

interface ChangelogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  tag: "added" | "fixed" | "improved" | "removed" | "breaking";
}

interface ChangelogBlockProps {
  entries: ChangelogEntry[];
  onUpdate: (entries: ChangelogEntry[]) => void;
}

const tagConfig: Record<string, { label: string; className: string }> = {
  added: { label: "Added", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  fixed: { label: "Fixed", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  improved: { label: "Improved", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  removed: { label: "Removed", className: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  breaking: { label: "Breaking", className: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
};

const tagKeys = Object.keys(tagConfig) as ChangelogEntry["tag"][];

const ChangelogBlock = ({ entries, onUpdate }: ChangelogBlockProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const addEntry = () => {
    onUpdate([
      ...entries,
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split("T")[0],
        title: "",
        description: "",
        tag: "added",
      },
    ]);
  };

  const updateEntry = (id: string, updates: Partial<ChangelogEntry>) => {
    onUpdate(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEntry = (id: string) => {
    onUpdate(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="py-3">
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground tracking-tight">Changelog</span>
          </div>
          <motion.button
            onClick={addEntry}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add entry
          </motion.button>
        </div>

        {/* Entries */}
        <div className="divide-y divide-border/20">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative px-6 py-4 group/entry"
                onMouseEnter={() => setHoveredId(entry.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-start gap-4">
                  {/* Date + Tag column */}
                  <div className="flex flex-col items-start gap-2 min-w-[120px] shrink-0">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
                      className="text-xs font-mono text-muted-foreground bg-transparent outline-none"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {tagKeys.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => updateEntry(entry.id, { tag })}
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                            entry.tag === tag
                              ? tagConfig[tag].className
                              : "bg-muted/50 text-muted-foreground/40 hover:text-muted-foreground/70"
                          }`}
                        >
                          {tagConfig[tag].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <input
                      value={entry.title}
                      onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground/30"
                      placeholder="What changed?"
                    />
                    <textarea
                      value={entry.description}
                      onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
                      className="w-full bg-transparent outline-none text-xs text-muted-foreground mt-1 resize-none placeholder:text-muted-foreground/25 leading-relaxed"
                      placeholder="Details…"
                      rows={1}
                    />
                  </div>

                  {/* Delete */}
                  <AnimatePresence>
                    {hoveredId === entry.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => removeEntry(entry.id)}
                        className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {entries.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground/50">No entries yet. Click "Add entry" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogBlock;
