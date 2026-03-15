import { useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface QuoteCardBlockProps {
  quote: string;
  attribution: string;
  style: string;
  onUpdate: (updates: { quoteCardText?: string; quoteCardAttribution?: string; quoteCardStyle?: string }) => void;
}

const quoteStyles = [
  { id: "elegant", gradient: "from-slate-500/10 to-zinc-500/5", accent: "bg-gradient-to-b from-slate-400 to-zinc-500", quoteColor: "text-slate-400/20" },
  { id: "warm", gradient: "from-amber-500/10 to-orange-500/5", accent: "bg-gradient-to-b from-amber-400 to-orange-500", quoteColor: "text-amber-400/20" },
  { id: "cool", gradient: "from-blue-500/10 to-indigo-500/5", accent: "bg-gradient-to-b from-blue-400 to-indigo-500", quoteColor: "text-blue-400/20" },
  { id: "nature", gradient: "from-emerald-500/10 to-teal-500/5", accent: "bg-gradient-to-b from-emerald-400 to-teal-500", quoteColor: "text-emerald-400/20" },
  { id: "royal", gradient: "from-purple-500/10 to-violet-500/5", accent: "bg-gradient-to-b from-purple-400 to-violet-500", quoteColor: "text-purple-400/20" },
];

const QuoteCardBlock = ({ quote, attribution, style, onUpdate }: QuoteCardBlockProps) => {
  const currentStyle = quoteStyles.find(s => s.id === style) || quoteStyles[0];

  return (
    <motion.div
      className={`relative rounded-xl bg-gradient-to-br ${currentStyle.gradient} p-6 overflow-hidden group`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${currentStyle.accent}`} />

      {/* Large quote mark */}
      <div className={`absolute top-3 right-4 ${currentStyle.quoteColor}`}>
        <Quote className="w-16 h-16" strokeWidth={1} />
      </div>

      {/* Content */}
      <div className="relative pl-5">
        <textarea
          value={quote}
          onChange={(e) => onUpdate({ quoteCardText: e.target.value })}
          className="w-full bg-transparent border-none outline-none text-lg italic text-foreground/90 resize-none leading-relaxed placeholder:text-muted-foreground/30"
          placeholder="Type your quote here..."
          rows={2}
        />
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-6 h-px ${currentStyle.accent}`} />
          <input
            value={attribution}
            onChange={(e) => onUpdate({ quoteCardAttribution: e.target.value })}
            className="bg-transparent border-none outline-none text-sm font-medium text-muted-foreground placeholder:text-muted-foreground/30"
            placeholder="— Attribution"
          />
        </div>
      </div>

      {/* Style picker */}
      <div className="flex items-center gap-1.5 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {quoteStyles.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => onUpdate({ quoteCardStyle: s.id })}
            className={`w-5 h-5 rounded-full ${s.accent} transition-all ${
              style === s.id ? "ring-2 ring-offset-2 ring-offset-background ring-primary/50 scale-110" : "opacity-50 hover:opacity-80"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default QuoteCardBlock;
