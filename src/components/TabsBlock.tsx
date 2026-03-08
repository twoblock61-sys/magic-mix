import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, GripHorizontal, Pencil, Check } from "lucide-react";
import { NoteBlock } from "@/contexts/NotesContext";

interface TabItem {
  id: string;
  label: string;
  content: string; // HTML content
}

interface TabsBlockProps {
  tabs: TabItem[];
  onChange: (tabs: TabItem[]) => void;
}

const TabsBlock = ({ tabs, onChange }: TabsBlockProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<Set<string>>(new Set());
  const editInputRef = useRef<HTMLInputElement>(null);

  // Keep active tab valid
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  // Sync content when switching tabs
  useEffect(() => {
    initializedRef.current.delete(activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const addTab = () => {
    const newTab: TabItem = {
      id: crypto.randomUUID(),
      label: `Tab ${tabs.length + 1}`,
      content: "",
    };
    onChange([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const deleteTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    onChange(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0]?.id || "");
    }
    initializedRef.current.delete(tabId);
  };

  const updateTabContent = (tabId: string, content: string) => {
    onChange(tabs.map(t => t.id === tabId ? { ...t, content } : t));
  };

  const renameTab = (tabId: string, newLabel: string) => {
    onChange(tabs.map(t => t.id === tabId ? { ...t, label: newLabel || t.label } : t));
    setEditingTabId(null);
  };

  return (
    <div className="py-2">
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        {/* Tab Headers */}
        <div className="flex items-end bg-muted/40 border-b border-border overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group/tab relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium cursor-pointer transition-all select-none border-b-2 min-w-0 ${
                activeTabId === tab.id
                  ? "bg-card text-foreground border-primary shadow-[0_1px_0_0_hsl(var(--card))]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border-transparent"
              }`}
              onClick={() => {
                if (editingTabId !== tab.id) {
                  // Save current tab content before switching
                  if (contentRef.current && activeTab) {
                    const html = contentRef.current.innerHTML || "";
                    if (html !== activeTab.content) {
                      updateTabContent(activeTab.id, html);
                    }
                  }
                  setActiveTabId(tab.id);
                }
              }}
              onDoubleClick={() => {
                setEditingTabId(tab.id);
                setEditLabel(tab.label);
              }}
            >
              {editingTabId === tab.id ? (
                <input
                  ref={editInputRef}
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onBlur={() => renameTab(tab.id, editLabel)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") renameTab(tab.id, editLabel);
                    if (e.key === "Escape") setEditingTabId(null);
                  }}
                  className="bg-transparent outline-none text-sm font-medium w-20 border-b border-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="truncate max-w-[120px]">{tab.label}</span>
              )}
              
              {tabs.length > 1 && activeTabId === tab.id && editingTabId !== tab.id && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(tab.id);
                  }}
                  className="ml-1 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </div>
          ))}

          {/* Add Tab Button */}
          <motion.button
            onClick={addTab}
            className="flex items-center gap-1 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Add tab"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="p-4 min-h-[100px]"
            >
              <div
                ref={(el) => {
                  if (el) {
                    contentRef.current = el;
                    if (!initializedRef.current.has(activeTab.id)) {
                      el.innerHTML = activeTab.content || "";
                      initializedRef.current.add(activeTab.id);
                    }
                  }
                }}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const html = e.currentTarget.innerHTML || "";
                  updateTabContent(activeTab.id, html);
                }}
                onBlur={(e) => {
                  const html = e.currentTarget.innerHTML || "";
                  updateTabContent(activeTab.id, html);
                }}
                className="outline-none min-h-[80px] text-sm leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
                data-placeholder="Start writing in this tab... (supports bold, italic, colors, links via text selection)"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer hint */}
        <div className="px-4 py-1.5 border-t border-border/50 bg-muted/20">
          <p className="text-[10px] text-muted-foreground/50">
            Double-click tab name to rename • Select text for formatting toolbar
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabsBlock;
