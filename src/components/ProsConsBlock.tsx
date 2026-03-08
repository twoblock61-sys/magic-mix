import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, ThumbsUp, ThumbsDown } from "lucide-react";

interface ProsConsBlockProps {
  pros: string[];
  cons: string[];
  onProsChange: (items: string[]) => void;
  onConsChange: (items: string[]) => void;
}

const ProsConsBlock = ({ pros, cons, onProsChange, onConsChange }: ProsConsBlockProps) => {
  const addPro = () => onProsChange([...pros, ""]);
  const addCon = () => onConsChange([...cons, ""]);

  const updatePro = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    onProsChange(newPros);
  };

  const updateCon = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    onConsChange(newCons);
  };

  const removePro = (index: number) => onProsChange(pros.filter((_, i) => i !== index));
  const removeCon = (index: number) => onConsChange(cons.filter((_, i) => i !== index));

  return (
    <div className="py-3">
      <div className="grid grid-cols-2 gap-4">
        {/* Pros */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Pros</span>
          </div>
          <div className="h-px bg-gradient-to-r from-emerald-500/40 to-transparent" />
          <div className="space-y-1.5 pt-1">
            {pros.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group/item flex items-start gap-2"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updatePro(index, e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/30"
                  placeholder="Add a pro..."
                />
                <button
                  onClick={() => removePro(index)}
                  className="p-0.5 rounded opacity-0 group-hover/item:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            <button
              onClick={addPro}
              className="flex items-center gap-1 text-xs text-emerald-600/60 hover:text-emerald-600 transition-colors px-1 py-1"
            >
              <Plus className="w-3 h-3" /> Add pro
            </button>
          </div>
        </div>

        {/* Cons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10">
              <ThumbsDown className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Cons</span>
          </div>
          <div className="h-px bg-gradient-to-r from-rose-500/40 to-transparent" />
          <div className="space-y-1.5 pt-1">
            {cons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group/item flex items-start gap-2"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateCon(index, e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/30"
                  placeholder="Add a con..."
                />
                <button
                  onClick={() => removeCon(index)}
                  className="p-0.5 rounded opacity-0 group-hover/item:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            <button
              onClick={addCon}
              className="flex items-center gap-1 text-xs text-rose-600/60 hover:text-rose-600 transition-colors px-1 py-1"
            >
              <Plus className="w-3 h-3" /> Add con
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProsConsBlock;
