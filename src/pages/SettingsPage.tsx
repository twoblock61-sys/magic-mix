import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Upload, Trash2, HardDrive, FileText, FolderOpen, 
  AlertTriangle, CheckCircle2, Database, RefreshCw, Shield
} from "lucide-react";
import { useNotesContext } from "@/contexts/NotesContext";
import { useNoteExport } from "@/hooks/useNoteExport";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const { notes, folders, createNote, deleteNote, updateNote } = useNotesContext();
  const { exportNote } = useNoteExport();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

  const storageStats = useMemo(() => {
    const notesData = JSON.stringify(notes);
    const foldersData = JSON.stringify(folders);
    const totalBytes = new Blob([notesData, foldersData]).size;
    const totalBlocks = notes.reduce((sum, n) => sum + n.blocks.length, 0);
    const totalTags = notes.reduce((sum, n) => sum + n.tags.length, 0);
    return {
      totalNotes: notes.length,
      totalFolders: folders.length,
      totalBlocks,
      totalTags,
      storageUsed: totalBytes,
      storageFormatted: totalBytes < 1024 
        ? `${totalBytes} B` 
        : totalBytes < 1048576 
          ? `${(totalBytes / 1024).toFixed(1)} KB` 
          : `${(totalBytes / 1048576).toFixed(2)} MB`,
      storagePercent: Math.min((totalBytes / (5 * 1048576)) * 100, 100), // 5MB localStorage limit
    };
  }, [notes, folders]);

  const handleExportAll = (format: "markdown" | "text" | "html" | "json") => {
    if (format === "json") {
      const data = JSON.stringify({ notes, folders, exportedAt: new Date().toISOString(), version: "1.0" }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `elephant-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Backup exported", description: `${notes.length} notes exported as JSON` });
    } else {
      notes.forEach(note => exportNote(note, format));
      toast({ title: "Notes exported", description: `${notes.length} notes exported as ${format.toUpperCase()}` });
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.notes && Array.isArray(data.notes)) {
            let imported = 0;
            data.notes.forEach((note: any) => {
              if (note.title && note.blocks) {
                const newNote = createNote(null);
                updateNote(newNote.id, {
                  title: note.title,
                  blocks: note.blocks,
                  tags: note.tags || [],
                  folderId: null,
                });
                imported++;
              }
            });
            setImportStatus("success");
            toast({ title: "Import successful", description: `${imported} notes imported` });
            setTimeout(() => setImportStatus("idle"), 3000);
          } else {
            throw new Error("Invalid format");
          }
        } catch {
          setImportStatus("error");
          toast({ title: "Import failed", description: "Invalid file format. Please use an Elephant backup file.", variant: "destructive" });
          setTimeout(() => setImportStatus("idle"), 3000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    notes.forEach(note => deleteNote(note.id));
    localStorage.removeItem("elephant-notes");
    localStorage.removeItem("elephant-folders");
    setShowClearDialog(false);
    toast({ title: "All data cleared", description: "Your notes and folders have been removed" });
  };

  const statCards = [
    { icon: FileText, label: "Notes", value: storageStats.totalNotes, color: "hsl(var(--primary))" },
    { icon: FolderOpen, label: "Folders", value: storageStats.totalFolders, color: "hsl(210, 80%, 55%)" },
    { icon: Database, label: "Blocks", value: storageStats.totalBlocks, color: "hsl(150, 60%, 45%)" },
    { icon: HardDrive, label: "Storage", value: storageStats.storageFormatted, color: "hsl(30, 80%, 55%)" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your data, exports, and storage</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -2, boxShadow: "0 8px 25px -8px hsl(var(--primary) / 0.15)" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Storage Bar */}
        <motion.div 
          className="rounded-2xl border border-border bg-card p-6 mb-8"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Local Storage Usage</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {storageStats.storageFormatted} / 5 MB
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))" }}
              initial={{ width: 0 }}
              animate={{ width: `${storageStats.storagePercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div 
          className="rounded-2xl border border-border bg-card p-6 mb-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Export Notes</h2>
              <p className="text-sm text-muted-foreground">Download your notes in various formats</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { format: "json" as const, label: "JSON Backup", desc: "Full backup" },
              { format: "markdown" as const, label: "Markdown", desc: ".md files" },
              { format: "html" as const, label: "HTML", desc: "Web pages" },
              { format: "text" as const, label: "Plain Text", desc: ".txt files" },
            ]).map((opt) => (
              <Button
                key={opt.format}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-1 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all"
                onClick={() => handleExportAll(opt.format)}
                disabled={notes.length === 0}
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.desc}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Import Section */}
        <motion.div 
          className="rounded-2xl border border-border bg-card p-6 mb-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Import Notes</h2>
              <p className="text-sm text-muted-foreground">Restore from an Elephant JSON backup file</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleImport}
            className="rounded-xl gap-2 hover:border-primary/40 hover:bg-primary/5"
          >
            {importStatus === "success" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
             importStatus === "error" ? <AlertTriangle className="w-4 h-4 text-destructive" /> :
             <RefreshCw className="w-4 h-4" />}
            Choose Backup File
          </Button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowClearDialog(true)}
            className="rounded-xl gap-2"
            disabled={notes.length === 0 && folders.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </motion.div>

        {/* Clear Confirmation Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Clear All Data
              </DialogTitle>
              <DialogDescription>
                This will permanently delete <strong>{notes.length} notes</strong> and <strong>{folders.length} folders</strong>. This action cannot be undone. Consider exporting a backup first.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowClearDialog(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearAll} className="rounded-xl gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SettingsPage;
