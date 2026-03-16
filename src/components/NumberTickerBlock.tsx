import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface NumberTickerBlockProps {
  value: string;
  label: string;
  prefix: string;
  suffix: string;
  onUpdate: (updates: { tickerValue?: string; tickerLabel?: string; tickerPrefix?: string; tickerSuffix?: string }) => void;
}

const NumberTickerBlock = ({ value, label, prefix, suffix, onUpdate }: NumberTickerBlockProps) => {
  const numValue = parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const from = displayValue;
    const to = numValue;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + (to - from) * eased);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [numValue]);

  const formatNumber = (n: number) => {
    if (Number.isInteger(numValue)) return Math.round(n).toLocaleString();
    return n.toFixed(1);
  };

  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 px-6 rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm group"
      >
        {/* Big number */}
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <input
            value={prefix}
            onChange={(e) => onUpdate({ tickerPrefix: e.target.value })}
            className="bg-transparent outline-none text-3xl font-bold text-foreground/60 text-right w-8 placeholder:text-muted-foreground/20"
            placeholder="$"
          />
          <span className="text-5xl font-bold text-foreground tabular-nums tracking-tight">
            {formatNumber(displayValue)}
          </span>
          <input
            value={suffix}
            onChange={(e) => onUpdate({ tickerSuffix: e.target.value })}
            className="bg-transparent outline-none text-xl font-bold text-foreground/60 w-8 placeholder:text-muted-foreground/20"
            placeholder="%"
          />
        </div>

        {/* Label */}
        <input
          value={label}
          onChange={(e) => onUpdate({ tickerLabel: e.target.value })}
          className="bg-transparent outline-none text-sm text-muted-foreground/60 text-center w-full placeholder:text-muted-foreground/25"
          placeholder="Description label…"
        />

        {/* Hidden value input */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-muted-foreground/50">Value:</span>
            <input
              value={value}
              onChange={(e) => onUpdate({ tickerValue: e.target.value })}
              className="bg-transparent outline-none text-xs text-foreground w-20 text-center"
              placeholder="0"
              type="number"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NumberTickerBlock;
