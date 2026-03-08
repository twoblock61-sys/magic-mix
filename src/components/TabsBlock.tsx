import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

interface TabItem {
  id: string;
  label: string;
  content: string;
}

interface TabsBlockProps {
  tabs: TabItem[];
  onChange: (tabs: TabItem[]) => void;
}

const tabAccents = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-pink-400",
  "from-sky-500 to-indigo-400",
  "from-lime-500 to-green-400",
];

const TabsBlock = ({ tabs, onChange }: TabsBlockProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<Set<string>>(new Set());
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

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
  const activeIndex = tabs.findIndex(t => t.id === activeTabId);

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

  const getAccent = (index: number) => tabAccents[index % tabAccents.length];

  return (
    <div className="py-3">
      <div className="relative">
        {/* Tab Headers */}
        <div className="flex items-center gap-1 pb-px overflow-x-auto scrollbar-thin">
          {tabs.map((tab, index) => {
            const isActive = activeTabId === tab.id;
            const accent = getAccent(index);
            return (
              <motion.div
                key={tab.id}
                layout
                className="relative flex-shrink-0"
              >
                <motion.button
                  onClick={() => {
                    if (editingTabId !== tab.id) {
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
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/70 hover:text-muted-foreground"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Active indicator gradient line */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full bg-gradient-to-r ${accent}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Subtle active background */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-t-xl bg-muted/50"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    {/* Color dot */}
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${accent} ${isActive ? "opacity-100" : "opacity-40"} transition-opacity`} />

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
                        className="bg-transparent outline-none text-sm font-medium w-20"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate max-w-[100px]">{tab.label}</span>
                    )}

                    {tabs.length > 1 && isActive && editingTabId !== tab.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTab(tab.id);
                        }}
                        className="p-0.5 rounded-md hover:bg-foreground/10 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}

          {/* Add Tab */}
          <motion.button
            onClick={addTab}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50 transition-all flex-shrink-0 ml-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Add tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Subtle separator */}
        <div className="h-px bg-border/40" />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pt-4 pb-2 px-1"
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
                className="outline-none min-h-[80px] text-sm leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 empty:before:italic"
                data-placeholder="Write here... select text for formatting options"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabsBlock;
