import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Type, Heading1, Heading2, List, ListOrdered,
  CheckSquare, Quote, Code, Minus, GripVertical, Trash2,
} from "lucide-react";
import { NoteBlock } from "@/hooks/useNotes";

interface TabItem {
  id: string;
  label: string;
  content: string;
  blocks?: NoteBlock[];
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

const nestedBlockTypes = [
  { type: "text" as const, icon: Type, label: "Text" },
  { type: "heading1" as const, icon: Heading1, label: "Heading 1" },
  { type: "heading2" as const, icon: Heading2, label: "Heading 2" },
  { type: "bullet" as const, icon: List, label: "Bullet List" },
  { type: "numbered" as const, icon: ListOrdered, label: "Numbered List" },
  { type: "todo" as const, icon: CheckSquare, label: "To-do" },
  { type: "quote" as const, icon: Quote, label: "Quote" },
  { type: "code" as const, icon: Code, label: "Code" },
  { type: "divider" as const, icon: Minus, label: "Divider" },
];

const TabsBlock = ({ tabs, onChange }: TabsBlockProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeBlocks = activeTab?.blocks || [];

  const updateTabBlocks = (tabId: string, blocks: NoteBlock[]) => {
    onChange(tabs.map(t => t.id === tabId ? { ...t, blocks } : t));
  };

  const addBlockToTab = (type: NoteBlock["type"]) => {
    if (!activeTab) return;
    const newBlock: NoteBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
      checked: type === "todo" ? false : undefined,
    };
    updateTabBlocks(activeTab.id, [...activeBlocks, newBlock]);
    setShowAddMenu(false);
    // Focus new block after render
    setTimeout(() => {
      const el = blockRefs.current.get(newBlock.id);
      if (el) el.focus();
    }, 50);
  };

  const updateNestedBlock = (blockId: string, updates: Partial<NoteBlock>) => {
    if (!activeTab) return;
    updateTabBlocks(
      activeTab.id,
      activeBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
    );
  };

  const deleteNestedBlock = (blockId: string) => {
    if (!activeTab) return;
    const filtered = activeBlocks.filter(b => b.id !== blockId);
    updateTabBlocks(activeTab.id, filtered.length > 0 ? filtered : []);
  };

  const handleNestedKeyDown = (e: React.KeyboardEvent, block: NoteBlock, index: number) => {
    if (e.key === "Enter" && !e.shiftKey && block.type !== "code") {
      e.preventDefault();
      const newBlock: NoteBlock = {
        id: crypto.randomUUID(),
        type: block.type === "divider" ? "text" : block.type,
        content: "",
        checked: block.type === "todo" ? false : undefined,
      };
      const newBlocks = [...activeBlocks];
      newBlocks.splice(index + 1, 0, newBlock);
      updateTabBlocks(activeTab!.id, newBlocks);
      setTimeout(() => {
        const el = blockRefs.current.get(newBlock.id);
        if (el) el.focus();
      }, 50);
    }
    if (e.key === "Backspace" && block.content === "" && activeBlocks.length > 1) {
      e.preventDefault();
      deleteNestedBlock(block.id);
      // Focus previous block
      if (index > 0) {
        setTimeout(() => {
          const prevBlock = activeBlocks[index - 1];
          const el = blockRefs.current.get(prevBlock.id);
          if (el) el.focus();
        }, 50);
      }
    }
  };

  const addTab = () => {
    const newTab: TabItem = {
      id: crypto.randomUUID(),
      label: `Tab ${tabs.length + 1}`,
      content: "",
      blocks: [{ id: crypto.randomUUID(), type: "text", content: "" }],
    };
    onChange([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const deleteTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    onChange(newTabs);
    if (activeTabId === tabId) setActiveTabId(newTabs[0]?.id || "");
  };

  const renameTab = (tabId: string, newLabel: string) => {
    onChange(tabs.map(t => t.id === tabId ? { ...t, label: newLabel || t.label } : t));
    setEditingTabId(null);
  };

  const getAccent = (index: number) => tabAccents[index % tabAccents.length];

  const renderNestedBlock = (block: NoteBlock, index: number) => {
    const baseClass = "outline-none w-full text-sm leading-relaxed placeholder:text-muted-foreground/30";

    if (block.type === "divider") {
      return (
        <div className="group/nested flex items-center gap-1 py-1">
          <div className="flex-1 h-px bg-border/60" />
          <button
            onClick={() => deleteNestedBlock(block.id)}
            className="opacity-0 group-hover/nested:opacity-100 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      );
    }

    if (block.type === "todo") {
      return (
        <div className="group/nested flex items-start gap-2 py-0.5">
          <input
            type="checkbox"
            checked={block.checked || false}
            onChange={(e) => updateNestedBlock(block.id, { checked: e.target.checked })}
            className="mt-1 rounded border-border accent-primary"
          />
          <div
            ref={(el) => { if (el) blockRefs.current.set(block.id, el); }}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => updateNestedBlock(block.id, { content: e.currentTarget.textContent || "" })}
            onKeyDown={(e) => handleNestedKeyDown(e, block, index)}
            className={`${baseClass} flex-1 ${block.checked ? "line-through text-muted-foreground/50" : ""}`}
            data-placeholder="To-do..."
          >
            {block.content}
          </div>
          <button
            onClick={() => deleteNestedBlock(block.id)}
            className="opacity-0 group-hover/nested:opacity-100 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-all mt-0.5"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      );
    }

    const typeStyles: Record<string, string> = {
      text: "",
      heading1: "text-xl font-bold",
      heading2: "text-lg font-semibold",
      bullet: "pl-4",
      numbered: "pl-4",
      quote: "border-l-2 border-primary/30 pl-3 italic text-muted-foreground",
      code: "font-mono text-xs bg-muted/50 rounded-lg p-3 whitespace-pre-wrap",
    };

    const prefix = block.type === "bullet" ? "• " : block.type === "numbered" ? `${index + 1}. ` : "";

    return (
      <div className="group/nested flex items-start gap-1 py-0.5">
        {block.type === "bullet" && (
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0" />
        )}
        {block.type === "numbered" && (
          <span className="text-sm text-muted-foreground/60 font-medium mt-px flex-shrink-0 w-5">{index + 1}.</span>
        )}
        <div
          ref={(el) => { if (el) blockRefs.current.set(block.id, el); }}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => updateNestedBlock(block.id, { content: e.currentTarget.textContent || "" })}
          onKeyDown={(e) => handleNestedKeyDown(e, block, index)}
          className={`${baseClass} flex-1 ${typeStyles[block.type] || ""}`}
          data-placeholder={
            block.type === "heading1" ? "Heading 1" :
            block.type === "heading2" ? "Heading 2" :
            block.type === "code" ? "Code..." :
            block.type === "quote" ? "Quote..." :
            "Type something..."
          }
        >
          {block.content}
        </div>
        <button
          onClick={() => deleteNestedBlock(block.id)}
          className="opacity-0 group-hover/nested:opacity-100 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-all mt-0.5"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="py-3">
      <div className="relative">
        {/* Tab Headers */}
        <div className="flex items-center gap-1 pb-px overflow-x-auto scrollbar-thin">
          {tabs.map((tab, index) => {
            const isActive = activeTabId === tab.id;
            const accent = getAccent(index);
            return (
              <motion.div key={tab.id} layout className="relative flex-shrink-0">
                <motion.button
                  onClick={() => {
                    if (editingTabId !== tab.id) setActiveTabId(tab.id);
                  }}
                  onDoubleClick={() => {
                    setEditingTabId(tab.id);
                    setEditLabel(tab.label);
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full bg-gradient-to-r ${accent}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-t-xl bg-muted/50"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
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
                        onClick={(e) => { e.stopPropagation(); deleteTab(tab.id); }}
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

        <div className="h-px bg-border/40" />

        {/* Tab Content with nested blocks */}
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pt-3 pb-2 px-1"
            >
              {/* Render nested blocks */}
              <div className="space-y-0.5 min-h-[60px]">
                {activeBlocks.length === 0 ? (
                  <div
                    className="text-sm text-muted-foreground/30 italic cursor-pointer py-2"
                    onClick={() => addBlockToTab("text")}
                  >
                    Click + to add content blocks...
                  </div>
                ) : (
                  activeBlocks.map((block, index) => (
                    <div key={block.id}>
                      {renderNestedBlock(block, index)}
                    </div>
                  ))
                )}
              </div>

              {/* Add block button */}
              <div className="relative mt-2">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors py-1 px-1 rounded-lg hover:bg-muted/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add block</span>
                </button>

                <AnimatePresence>
                  {showAddMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-1 bg-popover border border-border rounded-xl shadow-lg p-1.5 z-50 min-w-[180px]"
                    >
                      {nestedBlockTypes.map(bt => {
                        const Icon = bt.icon;
                        return (
                          <button
                            key={bt.type}
                            onClick={() => addBlockToTab(bt.type)}
                            className="flex items-center gap-2.5 w-full px-3 py-1.5 text-sm text-foreground/80 hover:bg-accent rounded-lg transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                            {bt.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabsBlock;
