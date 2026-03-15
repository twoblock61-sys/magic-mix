import { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Sparkles, AlertTriangle, Info, Rocket, Heart, Zap, X } from "lucide-react";

interface BannerBlockProps {
  title: string;
  description: string;
  style: string;
  icon: string;
  onUpdate: (updates: { bannerTitle?: string; bannerDescription?: string; bannerStyle?: string; bannerIcon?: string }) => void;
}

const bannerStyles = [
  { id: "info", label: "Info", gradient: "from-blue-500/15 to-cyan-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  { id: "success", label: "Success", gradient: "from-emerald-500/15 to-green-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  { id: "warning", label: "Warning", gradient: "from-amber-500/15 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  { id: "error", label: "Error", gradient: "from-red-500/15 to-rose-500/10", border: "border-red-500/30", text: "text-red-400" },
  { id: "purple", label: "Purple", gradient: "from-purple-500/15 to-violet-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  { id: "pink", label: "Pink", gradient: "from-pink-500/15 to-rose-500/10", border: "border-pink-500/30", text: "text-pink-400" },
];

const bannerIcons: Record<string, typeof Megaphone> = {
  megaphone: Megaphone,
  sparkles: Sparkles,
  warning: AlertTriangle,
  info: Info,
  rocket: Rocket,
  heart: Heart,
  zap: Zap,
};

const BannerBlock = ({ title, description, style, icon, onUpdate }: BannerBlockProps) => {
  const [showStyles, setShowStyles] = useState(false);
  const currentStyle = bannerStyles.find(s => s.id === style) || bannerStyles[0];
  const IconComponent = bannerIcons[icon] || Megaphone;

  return (
    <motion.div
      className={`relative rounded-xl border ${currentStyle.border} bg-gradient-to-r ${currentStyle.gradient} p-5 overflow-hidden group`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Decorative dots */}
      <div className="absolute top-3 right-3 grid grid-cols-3 gap-1 opacity-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full bg-current ${currentStyle.text}`} />
        ))}
      </div>

      <div className="flex items-start gap-4">
        {/* Icon selector */}
        <div className="relative">
          <motion.button
            onClick={() => {
              const iconKeys = Object.keys(bannerIcons);
              const currentIdx = iconKeys.indexOf(icon);
              const nextIcon = iconKeys[(currentIdx + 1) % iconKeys.length];
              onUpdate({ bannerIcon: nextIcon });
            }}
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${currentStyle.gradient} border ${currentStyle.border} flex items-center justify-center ${currentStyle.text} cursor-pointer`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            title="Click to change icon"
          >
            <IconComponent className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={(e) => onUpdate({ bannerTitle: e.target.value })}
            className={`w-full bg-transparent border-none outline-none text-lg font-bold ${currentStyle.text} placeholder:opacity-50`}
            placeholder="Banner title..."
          />
          <input
            value={description}
            onChange={(e) => onUpdate({ bannerDescription: e.target.value })}
            className="w-full bg-transparent border-none outline-none text-sm text-muted-foreground mt-1 placeholder:opacity-50"
            placeholder="Add a description..."
          />
        </div>
      </div>

      {/* Style picker */}
      <div className="mt-3 flex items-center gap-1">
        {showStyles ? (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {bannerStyles.map((s) => (
              <motion.button
                key={s.id}
                onClick={() => { onUpdate({ bannerStyle: s.id }); setShowStyles(false); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                  style === s.id ? `${s.border} ${s.text} bg-gradient-to-r ${s.gradient}` : "border-border/50 text-muted-foreground/60 hover:text-muted-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {s.label}
              </motion.button>
            ))}
            <button onClick={() => setShowStyles(false)} className="p-1 text-muted-foreground/40 hover:text-muted-foreground">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowStyles(true)}
            className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors opacity-0 group-hover:opacity-100"
          >
            Change style
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BannerBlock;
