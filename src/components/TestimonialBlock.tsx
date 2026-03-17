import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User } from "lucide-react";

interface TestimonialBlockProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  style: string;
  onUpdate: (updates: {
    testimonialQuote?: string;
    testimonialAuthor?: string;
    testimonialRole?: string;
    testimonialRating?: number;
    testimonialStyle?: string;
  }) => void;
}

const styles = [
  { id: "minimal", label: "Minimal" },
  { id: "bordered", label: "Bordered" },
  { id: "filled", label: "Filled" },
  { id: "gradient", label: "Gradient" },
];

const TestimonialBlock = ({ quote, author, role, rating, style, onUpdate }: TestimonialBlockProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const containerClass = {
    minimal: "bg-transparent",
    bordered: "border-l-4 border-primary/30 bg-card/40",
    filled: "bg-muted/60",
    gradient: "bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent border border-primary/10",
  }[style] || "bg-transparent";

  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl p-6 group overflow-hidden ${containerClass}`}
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              onClick={() => onUpdate({ testimonialRating: star })}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20"
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* Quote */}
        <div className="relative">
          <span className="absolute -top-3 -left-1 text-4xl font-serif text-primary/15 select-none">"</span>
          <textarea
            value={quote}
            onChange={(e) => onUpdate({ testimonialQuote: e.target.value })}
            className="w-full bg-transparent outline-none text-base text-foreground leading-relaxed resize-none pl-4 placeholder:text-muted-foreground/30 italic"
            placeholder="Write a testimonial quote…"
            rows={2}
          />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <div className="flex-1 min-w-0">
            <input
              value={author}
              onChange={(e) => onUpdate({ testimonialAuthor: e.target.value })}
              className="w-full bg-transparent outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground/30"
              placeholder="Author name"
            />
            <input
              value={role}
              onChange={(e) => onUpdate({ testimonialRole: e.target.value })}
              className="w-full bg-transparent outline-none text-xs text-muted-foreground placeholder:text-muted-foreground/25"
              placeholder="Role / Company"
            />
          </div>
        </div>

        {/* Style picker */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex gap-1.5 mt-4"
            >
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onUpdate({ testimonialStyle: s.id })}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-all ${
                    style === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TestimonialBlock;
