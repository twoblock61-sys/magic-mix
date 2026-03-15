import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatItem {
  id: string;
  value: string;
  label: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface StatRowBlockProps {
  stats: StatItem[];
  onUpdate: (stats: StatItem[]) => void;
}

const trendColors = {
  up: "text-emerald-500",
  down: "text-red-500",
  neutral: "text-muted-foreground/60",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const gradients = [
  "from-blue-500/10 to-cyan-500/5",
  "from-violet-500/10 to-purple-500/5",
  "from-emerald-500/10 to-teal-500/5",
  "from-amber-500/10 to-orange-500/5",
  "from-rose-500/10 to-pink-500/5",
  "from-sky-500/10 to-indigo-500/5",
];

const StatRowBlock = ({ stats, onUpdate }: StatRowBlockProps) => {
  const addStat = () => {
    if (stats.length >= 6) return;
    onUpdate([...stats, {
      id: crypto.randomUUID(),
      value: "0",
      label: "Label",
      change: "",
      trend: "neutral" as const,
    }]);
  };

  const removeStat = (id: string) => {
    if (stats.length <= 1) return;
    onUpdate(stats.filter(s => s.id !== id));
  };

  const updateStat = (id: string, updates: Partial<StatItem>) => {
    onUpdate(stats.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const cycleTrend = (id: string) => {
    const stat = stats.find(s => s.id === id);
    if (!stat) return;
    const order: StatItem["trend"][] = ["up", "down", "neutral"];
    const next = order[(order.indexOf(stat.trend) + 1) % order.length];
    updateStat(id, { trend: next });
  };

  return (
    <div className="py-3">
      <div className={`grid gap-3 ${
        stats.length <= 2 ? "grid-cols-2" : stats.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      }`}>
        <AnimatePresence>
          {stats.map((stat, index) => {
            const TrendIcon = trendIcons[stat.trend];
            return (
              <motion.div
                key={stat.id}
                className={`relative rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} border border-border/40 p-4 group`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                {stats.length > 1 && (
                  <motion.button
                    onClick={() => removeStat(stat.id)}
                    className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}

                <input
                  value={stat.value}
                  onChange={(e) => updateStat(stat.id, { value: e.target.value })}
                  className="w-full bg-transparent border-none outline-none text-2xl font-bold text-foreground placeholder:text-muted-foreground/30"
                  placeholder="0"
                />

                <input
                  value={stat.label}
                  onChange={(e) => updateStat(stat.id, { label: e.target.value })}
                  className="w-full bg-transparent border-none outline-none text-xs text-muted-foreground mt-0.5 placeholder:text-muted-foreground/30"
                  placeholder="Label"
                />

                <div className="flex items-center gap-1.5 mt-2">
                  <motion.button
                    onClick={() => cycleTrend(stat.id)}
                    className={`p-0.5 rounded ${trendColors[stat.trend]}`}
                    whileTap={{ scale: 0.8 }}
                    title="Click to change trend"
                  >
                    <TrendIcon className="w-3 h-3" />
                  </motion.button>
                  <input
                    value={stat.change}
                    onChange={(e) => updateStat(stat.id, { change: e.target.value })}
                    className={`bg-transparent border-none outline-none text-xs font-medium ${trendColors[stat.trend]} placeholder:text-muted-foreground/20 w-16`}
                    placeholder="+0%"
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {stats.length < 6 && (
          <motion.button
            onClick={addStat}
            className="rounded-xl border border-dashed border-border/40 p-4 flex flex-col items-center justify-center text-muted-foreground/30 hover:text-muted-foreground/60 hover:border-border transition-all min-h-[100px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] mt-1">Add stat</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default StatRowBlock;
