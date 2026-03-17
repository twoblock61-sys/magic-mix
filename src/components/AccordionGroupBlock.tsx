import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, X } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionGroupBlockProps {
  items: AccordionItem[];
  style: string;
  onUpdate: (updates: { accordionItems?: AccordionItem[]; accordionStyle?: string }) => void;
}

const styleOptions = [
  { id: "clean", label: "Clean" },
  { id: "bordered", label: "Bordered" },
  { id: "filled", label: "Filled" },
  { id: "separated", label: "Separated" },
];

const AccordionGroupBlock = ({ items, style, onUpdate }: AccordionGroupBlockProps) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [showOptions, setShowOptions] = useState(false);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), title: "", content: "" };
    onUpdate({ accordionItems: [...items, newItem] });
  };

  const updateItem = (id: string, updates: Partial<AccordionItem>) => {
    onUpdate({ accordionItems: items.map((item) => (item.id === id ? { ...item, ...updates } : item)) });
  };

  const removeItem = (id: string) => {
    onUpdate({ accordionItems: items.filter((item) => item.id !== id) });
  };

  const itemClass = {
    clean: "border-b border-border/30 last:border-b-0",
    bordered: "border border-border/40 rounded-xl mb-2",
    filled: "bg-muted/40 rounded-xl mb-2",
    separated: "bg-card border border-border/30 rounded-2xl mb-3 shadow-sm",
  }[style] || "border-b border-border/30 last:border-b-0";

  const containerClass = {
    clean: "rounded-2xl border border-border/40 bg-card/60 overflow-hidden",
    bordered: "space-y-0",
    filled: "space-y-0",
    separated: "space-y-0",
  }[style] || "rounded-2xl border border-border/40 bg-card/60 overflow-hidden";

  return (
    <div
      className="py-3"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className={containerClass}>
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative group/acc ${itemClass}`}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  </motion.div>
                  <input
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground/30"
                    placeholder="Section title…"
                  />
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="p-1 rounded-lg opacity-0 group-hover/acc:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pl-12">
                        <textarea
                          value={item.content}
                          onChange={(e) => updateItem(item.id, { content: e.target.value })}
                          className="w-full bg-transparent outline-none text-sm text-muted-foreground leading-relaxed resize-none placeholder:text-muted-foreground/25"
                          placeholder="Add content…"
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-2 mt-3"
          >
            <motion.button
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add section
            </motion.button>
            <div className="h-4 w-px bg-border/40" />
            {styleOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdate({ accordionStyle: s.id })}
                className={`text-[10px] font-medium px-2 py-1 rounded-full transition-all ${
                  style === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionGroupBlock;
