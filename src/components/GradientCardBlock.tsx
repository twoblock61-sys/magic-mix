import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GradientCardBlockProps {
  title: string;
  description: string;
  gradient: string;
  onUpdate: (updates: { gradientCardTitle?: string; gradientCardDescription?: string; gradientCardGradient?: string }) => void;
}

const cardGradients = [
  { id: "sunset", classes: "from-orange-500 via-rose-500 to-purple-600" },
  { id: "ocean", classes: "from-cyan-400 via-blue-500 to-indigo-600" },
  { id: "forest", classes: "from-emerald-400 via-green-500 to-teal-600" },
  { id: "aurora", classes: "from-violet-400 via-purple-500 to-fuchsia-600" },
  { id: "midnight", classes: "from-slate-700 via-zinc-800 to-slate-900" },
  { id: "dawn", classes: "from-amber-300 via-orange-400 to-rose-500" },
];

const GradientCardBlock = ({ title, description, gradient, onUpdate }: GradientCardBlockProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const currentGradient = cardGradients.find(g => g.id === gradient) || cardGradients[0];

  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative rounded-2xl bg-gradient-to-br ${currentGradient.classes} p-8 overflow-hidden group min-h-[140px]`}
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }} />

        {/* Glass effect circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-white/5 blur-xl" />

        {/* Content */}
        <div className="relative">
          <input
            value={title}
            onChange={(e) => onUpdate({ gradientCardTitle: e.target.value })}
            className="w-full bg-transparent outline-none text-2xl font-bold text-white tracking-tight placeholder:text-white/40 mb-2"
            placeholder="Card title…"
          />
          <textarea
            value={description}
            onChange={(e) => onUpdate({ gradientCardDescription: e.target.value })}
            className="w-full bg-transparent outline-none text-sm text-white/70 leading-relaxed resize-none placeholder:text-white/30"
            placeholder="Add a description…"
            rows={2}
          />
        </div>

        {/* Gradient picker */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="relative flex items-center gap-2 mt-4"
            >
              {cardGradients.map(g => (
                <motion.button
                  key={g.id}
                  onClick={() => onUpdate({ gradientCardGradient: g.id })}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${g.classes} border-2 transition-all ${
                    gradient === g.id ? "border-white scale-110" : "border-white/30 hover:border-white/60"
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

export default GradientCardBlock;
