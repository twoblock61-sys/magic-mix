import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Folder as FolderIcon, Check, Plus, X } from "lucide-react";
import { useNotesContext } from "@/contexts/NotesContext";

interface FolderPickerProps {
  noteId: string;
  currentFolderId: string | null;
  trigger?: "chip" | "icon";
  align?: "left" | "right";
}

const colorClass: Record<string, string> = {
  green: "bg-primary/10 text-primary",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  pink: "bg-pink-100 text-pink-600",
};

const FolderPicker = ({ noteId, currentFolderId, trigger = "chip", align = "left" }: FolderPickerProps) => {
  const { folders, updateNote, createFolder } = useNotesContext();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const current = folders.find((f) => f.id === currentFolderId) || null;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const assign = (folderId: string | null) => {
    updateNote(noteId, { folderId });
    setOpen(false);
  };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const f = createFolder(name);
    updateNote(noteId, { folderId: f.id });
    setNewName("");
    setCreating(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={
          trigger === "chip"
            ? `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                current ? colorClass[current.color] || colorClass.green : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`
            : "p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
        }
        title={current ? `In ${current.name}` : "Add to folder"}
      >
        {trigger === "chip" ? (
          <>
            <FolderOpen className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{current ? current.name : "Unfiled"}</span>
          </>
        ) : (
          <FolderOpen className="w-4 h-4" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-50 mt-1.5 w-64 bg-popover border border-border rounded-xl shadow-xl overflow-hidden ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="px-3 py-2 border-b border-border/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Move to folder
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-thin py-1">
              <button
                onClick={() => assign(null)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                  <FolderIcon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm flex-1">Unfiled</span>
                {!currentFolderId && <Check className="w-4 h-4 text-primary" />}
              </button>
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => assign(f.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted transition-colors text-left"
                >
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${colorClass[f.color] || colorClass.green}`}>
                    <FolderOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm flex-1 truncate">{f.name}</span>
                  {currentFolderId === f.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
              {folders.length === 0 && !creating && (
                <p className="px-3 py-2 text-xs text-muted-foreground">No folders yet</p>
              )}
            </div>
            <div className="border-t border-border/60 p-2">
              {creating ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                      if (e.key === "Escape") {
                        setCreating(false);
                        setNewName("");
                      }
                    }}
                    placeholder="New folder name"
                    className="flex-1 px-2.5 py-1.5 rounded-md bg-muted border border-border outline-none focus:border-primary text-sm"
                  />
                  <button
                    onClick={handleCreate}
                    className="p-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewName("");
                    }}
                    className="p-1.5 rounded-md hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New folder
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FolderPicker;
