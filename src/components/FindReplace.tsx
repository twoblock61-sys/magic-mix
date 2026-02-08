import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Replace, X, ChevronDown, ChevronUp, CaseSensitive, WholeWord } from "lucide-react";

interface FindReplaceProps {
  isOpen: boolean;
  onClose: () => void;
  contentRef?: React.RefObject<HTMLElement>;
}

const FindReplace = ({ isOpen, onClose, contentRef }: FindReplaceProps) => {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [highlights, setHighlights] = useState<Range[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Clear highlights on close
  useEffect(() => {
    if (!isOpen) {
      clearHighlights();
      setFindText("");
      setReplaceText("");
      setCurrentMatch(0);
      setTotalMatches(0);
    }
  }, [isOpen]);

  const clearHighlights = useCallback(() => {
    // Remove all highlight marks
    document.querySelectorAll('mark[data-find-highlight]').forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
        parent.normalize();
      }
    });
    setHighlights([]);
  }, []);

  const findMatches = useCallback(() => {
    clearHighlights();
    
    if (!findText) {
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }

    const container = contentRef?.current || document.querySelector('[contenteditable="true"]');
    if (!container) return;

    const treeWalker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = treeWalker.nextNode())) {
      textNodes.push(node as Text);
    }

    let matchCount = 0;
    const newHighlights: Range[] = [];
    const searchFlags = matchCase ? "g" : "gi";
    const searchPattern = wholeWord 
      ? `\\b${findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`
      : findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const regex = new RegExp(searchPattern, searchFlags);

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || "";
      let match: RegExpExecArray | null;
      
      while ((match = regex.exec(text)) !== null) {
        try {
          const range = document.createRange();
          range.setStart(textNode, match.index);
          range.setEnd(textNode, match.index + match[0].length);
          newHighlights.push(range);
          matchCount++;
        } catch (e) {
          // Range might be invalid
        }
      }
    });

    // Apply highlights (without modifying DOM for now, just track)
    setHighlights(newHighlights);
    setTotalMatches(matchCount);
    setCurrentMatch(matchCount > 0 ? 1 : 0);

    // Highlight all matches visually
    if (matchCount > 0) {
      highlightMatches(newHighlights);
    }
  }, [findText, matchCase, wholeWord, contentRef, clearHighlights]);

  const highlightMatches = (ranges: Range[]) => {
    // Apply visual highlights
    ranges.forEach((range, index) => {
      try {
        const mark = document.createElement('mark');
        mark.setAttribute('data-find-highlight', 'true');
        mark.setAttribute('data-match-index', String(index));
        mark.className = index === 0 
          ? 'bg-primary text-primary-foreground rounded px-0.5'
          : 'bg-yellow-200 dark:bg-yellow-800 rounded px-0.5';
        range.surroundContents(mark);
      } catch (e) {
        // Range might cross element boundaries
      }
    });
  };

  const goToMatch = useCallback((direction: 'next' | 'prev') => {
    if (totalMatches === 0) return;

    let newIndex: number;
    if (direction === 'next') {
      newIndex = currentMatch >= totalMatches ? 1 : currentMatch + 1;
    } else {
      newIndex = currentMatch <= 1 ? totalMatches : currentMatch - 1;
    }
    setCurrentMatch(newIndex);

    // Update highlight styling
    document.querySelectorAll('mark[data-find-highlight]').forEach((mark) => {
      const idx = parseInt(mark.getAttribute('data-match-index') || '0', 10);
      if (idx === newIndex - 1) {
        mark.className = 'bg-primary text-primary-foreground rounded px-0.5';
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        mark.className = 'bg-yellow-200 dark:bg-yellow-800 rounded px-0.5';
      }
    });
  }, [currentMatch, totalMatches]);

  const replaceOne = useCallback(() => {
    const currentMark = document.querySelector(`mark[data-match-index="${currentMatch - 1}"]`);
    if (currentMark) {
      const textNode = document.createTextNode(replaceText);
      currentMark.parentNode?.replaceChild(textNode, currentMark);
      findMatches();
    }
  }, [currentMatch, replaceText, findMatches]);

  const replaceAll = useCallback(() => {
    document.querySelectorAll('mark[data-find-highlight]').forEach((mark) => {
      const textNode = document.createTextNode(replaceText);
      mark.parentNode?.replaceChild(textNode, mark);
    });
    setTotalMatches(0);
    setCurrentMatch(0);
    setHighlights([]);
  }, [replaceText]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        if (e.shiftKey) {
          goToMatch('prev');
        } else {
          goToMatch('next');
        }
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (e.shiftKey) {
          goToMatch('prev');
        } else {
          goToMatch('next');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToMatch]);

  // Auto-search on text change
  useEffect(() => {
    const timeout = setTimeout(findMatches, 300);
    return () => clearTimeout(timeout);
  }, [findText, matchCase, wholeWord, findMatches]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
        >
          <div className="p-3 space-y-2">
            {/* Find Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Find..."
                  className="w-64 pl-9 pr-16 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {findText && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {totalMatches > 0 ? `${currentMatch}/${totalMatches}` : 'No results'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMatchCase(!matchCase)}
                  className={`p-1.5 rounded transition-colors ${matchCase ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                  title="Match Case"
                >
                  <CaseSensitive className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWholeWord(!wholeWord)}
                  className={`p-1.5 rounded transition-colors ${wholeWord ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                  title="Whole Word"
                >
                  <WholeWord className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 border-l border-border pl-2">
                <button
                  onClick={() => goToMatch('prev')}
                  disabled={totalMatches === 0}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous (Shift+Enter)"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToMatch('next')}
                  disabled={totalMatches === 0}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Next (Enter)"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowReplace(!showReplace)}
                className={`p-1.5 rounded transition-colors ${showReplace ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                title="Toggle Replace"
              >
                <Replace className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Replace Row */}
            <AnimatePresence>
              {showReplace && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <div className="relative flex-1">
                    <Replace className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      placeholder="Replace with..."
                      className="w-64 pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <button
                    onClick={replaceOne}
                    disabled={totalMatches === 0}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    onClick={replaceAll}
                    disabled={totalMatches === 0}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Replace All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FindReplace;
