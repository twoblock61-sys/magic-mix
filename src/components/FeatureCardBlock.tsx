import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Heart, Star, Rocket, Globe, Lightbulb } from "lucide-react";

interface FeatureCardBlockProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  onUpdate: (updates: { featureCardTitle?: string; featureCardDescription?: string; featureCardIcon?: string; featureCardGradient?: string }) => void;
}

const iconMap: Record<string, typeof Sparkles> = {
  sparkles: Sparkles, zap: Zap, shield: Shield, heart: Heart,
  star: Star, rocket: Rocket, globe: Globe, lightbulb: Lightbulb,
};

const gradients = [
  { id: "blue", from: "from-blue-500", to: "to-cyan-400", shadow: "shadow-blue-500/20" },
  { id: "purple", from: "from-violet-500", to: "to-purple-400", shadow: "shadow-violet-500/20" },
  { id: "rose", from: "from-rose-500", to: "to-pink-400", shadow: "shadow-rose-500/20" },
  { id: "amber", from: "from-amber-500", to: "to-orange-400", shadow: "shadow-amber-500/20" },
  { id: "emerald", from: "from-emerald-500", to: "to-teal-400", shadow: "shadow-emerald-500/20" },
  { id: "slate", from: "from-slate-600", to: "to-zinc-500", shadow: "shadow-slate-500/20" },
];

const FeatureCardBlock = ({ title, description, icon, gradient, onUpdate }: FeatureCardBlockProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const currentGrad = gradients.find(g => g.id === gradient) || gradients[0];
  const IconComp = iconMap[icon] || Sparkles;

  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm p-6 overflow-hidden"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {/* Gradient orb background */}
        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${currentGrad.from} ${currentGrad.to} opacity-[0.07] blur-3xl`} />

        {/* Icon */}
        <motion.button
          onClick={() => {
            const keys = Object.keys(iconMap);
            const next = keys[(keys.indexOf(icon) + 1) % keys.length];
            onUpdate({ featureCardIcon: next });
          }}
          className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${currentGrad.from} ${currentGrad.to} flex items-center justify-center shadow-lg ${currentGrad.shadow} mb-4 cursor-pointer`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          title="Click to change icon"
        >
          <IconComp className="w-6 h-6 text-white" />
        </motion.button>

        {/* Content */}
        <input
          value={title}
          onChange={(e) => onUpdate({ featureCardTitle: e.target.value })}
          className="w-full bg-transparent outline-none text-lg font-semibold text-foreground tracking-tight placeholder:text-muted-foreground/30 mb-2"
          placeholder="Feature title…"
        />
        <textarea
          value={description}
          onChange={(e) => onUpdate({ featureCardDescription: e.target.value })}
          className="w-full bg-transparent outline-none text-sm text-muted-foreground/70 leading-relaxed resize-none placeholder:text-muted-foreground/25"
          placeholder="Describe this feature…"
          rows={2}
        />

        {/* Gradient picker */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-2 mt-4"
            >
              {gradients.map(g => (
                <motion.button
                  key={g.id}
                  onClick={() => onUpdate({ featureCardGradient: g.id })}
                  className={`w-5 h-5 rounded-full bg-gradient-to-br ${g.from} ${g.to} transition-all ${
                    gradient === g.id ? "ring-2 ring-offset-2 ring-offset-background ring-primary/50 scale-110" : "opacity-50 hover:opacity-80"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const { AnimatePresence } = require("framer-motion");

export default FeatureCardBlock;
