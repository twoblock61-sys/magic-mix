import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Shield, AlertTriangle, Zap, Target } from "lucide-react";

interface SwotBlockProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  onUpdate: (updates: {
    swotStrengths?: string[];
    swotWeaknesses?: string[];
    swotOpportunities?: string[];
    swotThreats?: string[];
  }) => void;
}

const quadrants = [
  {
    key: "strengths" as const,
    label: "Strengths",
    icon: Shield,
    updateKey: "swotStrengths" as const,
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-500/5",
    borderColor: "border-emerald-500/20",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    btnColor: "text-emerald-600/50 hover:text-emerald-600",
    iconBg: "bg-emerald-500/10",
  },
  {
    key: "weaknesses" as const,
    label: "Weaknesses",
    icon: AlertTriangle,
    updateKey: "swotWeaknesses" as const,
    gradient: "from-amber-500 to-orange-400",
    bg: "bg-amber-500/5",
    borderColor: "border-amber-500/20",
    dotColor: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    btnColor: "text-amber-600/50 hover:text-amber-600",
    iconBg: "bg-amber-500/10",
  },
  {
    key: "opportunities" as const,
    label: "Opportunities",
    icon: Zap,
    updateKey: "swotOpportunities" as const,
    gradient: "from-blue-500 to-cyan-400",
    bg: "bg-blue-500/5",
    borderColor: "border-blue-500/20",
    dotColor: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    btnColor: "text-blue-600/50 hover:text-blue-600",
    iconBg: "bg-blue-500/10",
  },
  {
    key: "threats" as const,
    label: "Threats",
    icon: Target,
    updateKey: "swotThreats" as const,
    gradient: "from-rose-500 to-pink-400",
    bg: "bg-rose-500/5",
    borderColor: "border-rose-500/20",
    dotColor: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400",
    btnColor: "text-rose-600/50 hover:text-rose-600",
    iconBg: "bg-rose-500/10",
  },
];

const SwotBlock = ({ strengths, weaknesses, opportunities, threats, onUpdate }: SwotBlockProps) => {
  const data = { strengths, weaknesses, opportunities, threats };

  const addItem = (q: typeof quadrants[number]) => {
    onUpdate({ [q.updateKey]: [...data[q.key], ""] });
  };

  const updateItem = (q: typeof quadrants[number], index: number, value: string) => {
    const newItems = [...data[q.key]];
    newItems[index] = value;
    onUpdate({ [q.updateKey]: newItems });
  };

  const removeItem = (q: typeof quadrants[number], index: number) => {
    onUpdate({ [q.updateKey]: data[q.key].filter((_, i) => i !== index) });
  };

  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border border-border/40"
      >
        {/* Header */}
        <div className="px-5 py-3 bg-muted/30 border-b border-border/30">
          <h3 className="text-sm font-semibold text-foreground tracking-wide">SWOT Analysis</h3>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2">
          {quadrants.map((q, qi) => {
            const Icon = q.icon;
            const items = data[q.key];
            return (
              <div
                key={q.key}
                className={`${q.bg} p-4 ${qi % 2 === 0 ? "border-r border-border/20" : ""} ${qi < 2 ? "border-b border-border/20" : ""}`}
              >
                {/* Quadrant header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${q.iconBg}`}>
                    <Icon className={`w-3.5 h-3.5 ${q.textColor}`} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${q.textColor}`}>
                    {q.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1.5 min-h-[60px]">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group/item flex items-start gap-2"
                    >
                      <span className={`mt-2 w-1.5 h-1.5 rounded-full ${q.dotColor} flex-shrink-0`} />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(q, index, e.target.value)}
                        className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/30"
                        placeholder={`Add ${q.label.toLowerCase().slice(0, -1)}...`}
                      />
                      <button
                        onClick={() => removeItem(q, index)}
                        className="p-0.5 rounded opacity-0 group-hover/item:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => addItem(q)}
                  className={`flex items-center gap-1 text-xs ${q.btnColor} transition-colors mt-2 px-1 py-0.5`}
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SwotBlock;
