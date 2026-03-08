import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricBlockProps {
  value: string;
  label: string;
  change: string;
  trend: "up" | "down" | "neutral";
  color: string;
  onUpdate: (updates: { metricValue?: string; metricLabel?: string; metricChange?: string; metricTrend?: "up" | "down" | "neutral"; metricColor?: string }) => void;
}

const metricColors = [
  { name: "Blue", gradient: "from-blue-500 to-cyan-400", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  { name: "Purple", gradient: "from-violet-500 to-purple-400", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  { name: "Green", gradient: "from-emerald-500 to-teal-400", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  { name: "Rose", gradient: "from-rose-500 to-pink-400", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  { name: "Amber", gradient: "from-amber-500 to-orange-400", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
];

const MetricBlock = ({ value, label, change, trend, color, onUpdate }: MetricBlockProps) => {
  const colorConfig = metricColors.find(c => c.name === color) || metricColors[0];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground";

  return (
    <div className="py-3">
      <motion.div
        className={`relative rounded-2xl ${colorConfig.bg} p-6 overflow-hidden`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Decorative gradient orb */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${colorConfig.gradient} opacity-10 blur-2xl`} />

        <div className="relative space-y-3">
          {/* Label */}
          <input
            type="text"
            value={label}
            onChange={(e) => onUpdate({ metricLabel: e.target.value })}
            className="text-sm font-medium text-muted-foreground bg-transparent outline-none w-full placeholder:text-muted-foreground/40"
            placeholder="Metric label..."
          />

          {/* Value */}
          <input
            type="text"
            value={value}
            onChange={(e) => onUpdate({ metricValue: e.target.value })}
            className={`text-4xl font-bold bg-transparent outline-none w-full bg-gradient-to-r ${colorConfig.gradient} bg-clip-text text-transparent placeholder:text-muted-foreground/30`}
            placeholder="0"
          />

          {/* Change & Trend */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <input
                type="text"
                value={change}
                onChange={(e) => onUpdate({ metricChange: e.target.value })}
                className={`text-sm font-medium ${trendColor} bg-transparent outline-none w-24 placeholder:text-muted-foreground/30`}
                placeholder="+12%"
              />
            </div>

            {/* Trend toggle */}
            <div className="flex items-center gap-0.5 ml-auto">
              {(["up", "down", "neutral"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onUpdate({ metricTrend: t })}
                  className={`p-1 rounded-md text-xs transition-all ${
                    trend === t ? "bg-foreground/10 text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"
                  }`}
                >
                  {t === "up" ? <TrendingUp className="w-3 h-3" /> : t === "down" ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                </button>
              ))}
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-0.5">
              {metricColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => onUpdate({ metricColor: c.name })}
                  className={`w-3 h-3 rounded-full bg-gradient-to-br ${c.gradient} transition-all ${color === c.name ? "ring-2 ring-offset-1 ring-foreground/20" : "opacity-40 hover:opacity-70"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MetricBlock;
