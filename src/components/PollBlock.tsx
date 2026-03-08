import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BarChart3 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollBlockProps {
  question: string;
  options: PollOption[];
  onQuestionChange: (q: string) => void;
  onOptionsChange: (opts: PollOption[]) => void;
}

const pollColors = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-pink-400",
];

const PollBlock = ({ question, options, onQuestionChange, onOptionsChange }: PollBlockProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const vote = (optionId: string) => {
    if (hasVoted) return;
    onOptionsChange(options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
    setHasVoted(true);
  };

  const resetVotes = () => {
    onOptionsChange(options.map(o => ({ ...o, votes: 0 })));
    setHasVoted(false);
  };

  const addOption = () => {
    onOptionsChange([...options, { id: crypto.randomUUID(), text: `Option ${options.length + 1}`, votes: 0 }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    onOptionsChange(options.filter(o => o.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    onOptionsChange(options.map(o => o.id === id ? { ...o, text } : o));
  };

  return (
    <div className="py-3">
      <div className="space-y-3">
        {/* Question */}
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary flex-shrink-0" />
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="text-base font-semibold bg-transparent outline-none flex-1 placeholder:text-muted-foreground/40"
            placeholder="Ask a question..."
          />
        </div>

        {/* Options */}
        <div className="space-y-2">
          {options.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const gradient = pollColors[index % pollColors.length];

            return (
              <motion.div
                key={option.id}
                layout
                className="relative group/opt"
              >
                <motion.button
                  onClick={() => vote(option.id)}
                  disabled={hasVoted}
                  className={`relative w-full text-left rounded-xl overflow-hidden transition-all ${
                    hasVoted ? "" : "hover:ring-2 ring-primary/20 cursor-pointer"
                  }`}
                  whileTap={!hasVoted ? { scale: 0.99 } : {}}
                >
                  {/* Background bar */}
                  <div className="absolute inset-0 bg-muted/40 rounded-xl" />
                  {hasVoted && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradient} opacity-20 rounded-xl`}
                    />
                  )}

                  <div className="relative flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {!hasVoted && (
                        <div className={`w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0`} />
                      )}
                      {hasVoted && (
                        <span className={`text-xs font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent min-w-[36px]`}>
                          {percentage}%
                        </span>
                      )}
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateOptionText(option.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent outline-none text-sm flex-1 min-w-0"
                        placeholder="Option text..."
                      />
                    </div>

                    {hasVoted && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {option.votes} vote{option.votes !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </motion.button>

                {/* Remove option */}
                {options.length > 2 && !hasVoted && (
                  <button
                    onClick={() => removeOption(option.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover/opt:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!hasVoted && (
            <button
              onClick={addOption}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
            >
              <Plus className="w-3 h-3" /> Add option
            </button>
          )}
          {hasVoted && (
            <button
              onClick={resetVotes}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
            >
              Reset votes
            </button>
          )}
          {totalVotes > 0 && (
            <span className="text-xs text-muted-foreground/60 ml-auto">
              {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollBlock;
