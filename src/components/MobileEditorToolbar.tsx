import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  Plus,
  X,
  ChevronDown,
  Search,
  CheckSquare,
  List,
  Heading2,
} from "lucide-react";

export type MobileBlockDef = {
  type: string;
  icon: React.ElementType;
  label: string;
  description: string;
  category: string;
};

interface MobileEditorToolbarProps {
  onConvertBlock: (type: string) => void;
  isEditing: boolean;
  blockTypes: ReadonlyArray<MobileBlockDef>;
}

const CATEGORY_ORDER = ["basic", "lists", "media", "advanced"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  basic: "Basic",
  lists: "Lists",
  media: "Media & Embeds",
  advanced: "Advanced",
};

const MobileEditorToolbar = ({ onConvertBlock, isEditing, blockTypes }: MobileEditorToolbarProps) => {
  const [bottomOffset, setBottomOffset] = useState(0);
  const [showBlockSheet, setShowBlockSheet] = useState(false);
  const [filter, setFilter] = useState("");
  const lastScrollEl = useRef<Element | null>(null);

  // Keep the toolbar pinned just above the on-screen keyboard.
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    const updateOffset = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setBottomOffset(offset);
    };
    updateOffset();
    vv.addEventListener("resize", updateOffset);
    vv.addEventListener("scroll", updateOffset);
    return () => {
      vv.removeEventListener("resize", updateOffset);
      vv.removeEventListener("scroll", updateOffset);
    };
  }, []);

  // Auto-scroll the focused block into view above the toolbar/keyboard.
  useEffect(() => {
    if (!isEditing) return;
    const TOOLBAR_HEIGHT = 56;
    const PADDING = 12;
    const ensureVisible = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || !(el as any).getBoundingClientRect) return;
      const editable =
        el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA";
      if (!editable) return;
      const rect = el.getBoundingClientRect();
      const vv = (window as any).visualViewport as VisualViewport | undefined;
      const viewportBottom = vv ? vv.height + vv.offsetTop : window.innerHeight;
      const safeBottom = viewportBottom - TOOLBAR_HEIGHT - PADDING;
      if (rect.bottom > safeBottom) {
        const delta = rect.bottom - safeBottom;
        let parent: HTMLElement | null = el.parentElement;
        while (parent) {
          const style = window.getComputedStyle(parent);
          const overflowY = style.overflowY;
          if (
            (overflowY === "auto" || overflowY === "scroll") &&
            parent.scrollHeight > parent.clientHeight
          ) {
            parent.scrollBy({ top: delta, behavior: "smooth" });
            lastScrollEl.current = parent;
            return;
          }
          parent = parent.parentElement;
        }
        window.scrollBy({ top: delta, behavior: "smooth" });
      }
    };
    const onFocusIn = () => requestAnimationFrame(ensureVisible);
    const onSelectionChange = () => requestAnimationFrame(ensureVisible);
    const onResize = () => setTimeout(ensureVisible, 50);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("selectionchange", onSelectionChange);
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    vv?.addEventListener("resize", onResize);
    setTimeout(ensureVisible, 100);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("selectionchange", onSelectionChange);
      vv?.removeEventListener("resize", onResize);
    };
  }, [isEditing]);

  const exec = useCallback((cmd: "bold" | "italic" | "underline") => {
    document.execCommand(cmd, false);
  }, []);

  const handleConvert = (type: string) => {
    onConvertBlock(type);
    setShowBlockSheet(false);
    setFilter("");
  };

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return blockTypes;
    return blockTypes.filter(
      (b) => b.label.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)
    );
  }, [filter, blockTypes]);

  const grouped = useMemo(() => {
    const map: Record<string, MobileBlockDef[]> = {};
    filtered.forEach((b) => {
      (map[b.category] ||= []).push(b);
    });
    return map;
  }, [filtered]);

  if (!isEditing && bottomOffset === 0) return null;

  return (
    <>
      <AnimatePresence>
        {showBlockSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBlockSheet(false)}
              className="fixed inset-0 z-[9998] bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              style={{ bottom: bottomOffset, maxHeight: "75vh" }}
              className="fixed left-0 right-0 z-[9999] bg-card border-t border-border rounded-t-2xl shadow-2xl pb-[env(safe-area-inset-bottom)] flex flex-col"
            >
              <div className="relative flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30 absolute left-1/2 -translate-x-1/2 top-1.5" />
                <span className="text-sm font-semibold text-foreground mt-1">Insert block</span>
                <button
                  onClick={() => setShowBlockSheet(false)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-3 pb-2 shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter blocks..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="overflow-y-auto px-2 pb-5">
                {CATEGORY_ORDER.map((cat) => {
                  const items = grouped[cat];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={cat} className="mt-2">
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {CATEGORY_LABELS[cat] || cat}
                      </p>
                      <div className="flex flex-col">
                        {items.map((b) => (
                          <button
                            key={b.type}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleConvert(b.type)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted active:bg-muted transition-colors text-left"
                          >
                            <div className="p-2 rounded-lg bg-muted shrink-0">
                              <b.icon className="w-4 h-4 text-foreground" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium block truncate">{b.label}</span>
                              <span className="text-xs text-muted-foreground block truncate">
                                {b.description}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-sm text-muted-foreground text-center">
                    No blocks found
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ y: 0 }}
        style={{ bottom: bottomOffset }}
        className="fixed left-0 right-0 z-[9997] bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => {
          const t = e.target as HTMLElement;
          if (!t.closest("input, textarea")) e.preventDefault();
        }}
      >
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setShowBlockSheet(true)}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium shrink-0"
          >
            <Plus className="w-4 h-4" />
            Block
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          <div className="w-px h-5 bg-border mx-1 shrink-0" />

          <ToolbarIcon icon={Bold} label="Bold" onClick={() => exec("bold")} />
          <ToolbarIcon icon={Italic} label="Italic" onClick={() => exec("italic")} />
          <ToolbarIcon icon={Underline} label="Underline" onClick={() => exec("underline")} />

          <div className="w-px h-5 bg-border mx-1 shrink-0" />

          <ToolbarIcon icon={CheckSquare} label="To-do" onClick={() => onConvertBlock("todo")} />
          <ToolbarIcon icon={List} label="Bullet" onClick={() => onConvertBlock("bullet")} />
          <ToolbarIcon icon={Heading2} label="Heading" onClick={() => onConvertBlock("heading2")} />
        </div>
      </motion.div>

      <div aria-hidden style={{ height: 56 + bottomOffset }} />
    </>
  );
};

const ToolbarIcon = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) => (
  <button
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    aria-label={label}
    className="h-9 w-9 flex items-center justify-center rounded-lg text-foreground hover:bg-muted active:scale-95 transition-all shrink-0"
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default MobileEditorToolbar;
