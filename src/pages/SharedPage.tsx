import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, Copy, Download, FileText, Code, Globe, Search, 
  CheckCircle2, BookOpen, Clock, Tag
} from "lucide-react";
import { useNotesContext, Note } from "@/contexts/NotesContext";
import { useNoteExport } from "@/hooks/useNoteExport";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SharedPage = ({ onNavigate }: { onNavigate: (nav: string, noteId?: string) => void }) => {
  const { notes } = useNotesContext();
  const { exportNote } = useNoteExport();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.tags.some(t => t.label.toLowerCase().includes(q))
    );
  }, [notes, search]);

  const noteToMarkdown = (note: Note) => {
    const lines = [`# ${note.title}`, ""];
    note.blocks.forEach(block => {
      switch (block.type) {
        case "heading1": lines.push(`# ${block.content}`); break;
        case "heading2": lines.push(`## ${block.content}`); break;
        case "heading3": lines.push(`### ${block.content}`); break;
        case "bullet": lines.push(`- ${block.content}`); break;
        case "numbered": lines.push(`1. ${block.content}`); break;
        case "todo": lines.push(`- [${block.checked ? "x" : " "}] ${block.content}`); break;
        case "quote": lines.push(`> ${block.content}`); break;
        case "code": lines.push("```", block.content, "```"); break;
        case "divider": lines.push("---"); break;
        default: if (block.content) lines.push(block.content); break;
      }
      lines.push("");
    });
    return lines.join("\n");
  };

  const noteToPlainText = (note: Note) => {
    const lines = [note.title, "=".repeat(note.title.length), ""];
    note.blocks.forEach(block => {
      if (block.content) lines.push(block.content);
      lines.push("");
    });
    return lines.join("\n");
  };

  const handleCopyMarkdown = async (note: Note) => {
    await navigator.clipboard.writeText(noteToMarkdown(note));
    setCopiedId(note.id + "-md");
    toast({ title: "Copied as Markdown", description: `"${note.title}" copied to clipboard` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyText = async (note: Note) => {
    await navigator.clipboard.writeText(noteToPlainText(note));
    setCopiedId(note.id + "-txt");
    toast({ title: "Copied as text", description: `"${note.title}" copied to clipboard` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const wordCount = (note: Note) => 
    note.blocks.reduce((sum, b) => sum + (b.content?.split(/\s+/).filter(Boolean).length || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Share & Export</h1>
          <p className="text-muted-foreground mt-1">Copy, export, or share your notes</p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes to share..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-2xl border-border bg-card text-foreground"
            />
          </div>
        </motion.div>

        {/* Quick Export All */}
        <motion.div 
          className="rounded-2xl border border-border bg-card p-5 mb-8 flex items-center justify-between gap-4 flex-wrap"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Export all notes</p>
              <p className="text-xs text-muted-foreground">{notes.length} notes available</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={() => {
              notes.forEach(n => exportNote(n, "markdown"));
              toast({ title: "Exported", description: `${notes.length} notes exported as Markdown` });
            }} disabled={notes.length === 0}>
              <Code className="w-3.5 h-3.5" /> MD
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={() => {
              notes.forEach(n => exportNote(n, "html"));
              toast({ title: "Exported", description: `${notes.length} notes exported as HTML` });
            }} disabled={notes.length === 0}>
              <Globe className="w-3.5 h-3.5" /> HTML
            </Button>
          </div>
        </motion.div>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-1">
              {search ? "No matching notes" : "No notes yet"}
            </h3>
            <p className="text-sm text-muted-foreground/70">
              {search ? "Try a different search term" : "Create notes in Ideas to share them here"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note, i) => (
                <motion.div
                  key={note.id}
                  className="rounded-2xl border border-border bg-card p-5 group hover:border-primary/20 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  whileHover={{ y: -1, boxShadow: "0 4px 20px -6px hsl(var(--primary) / 0.1)" }}
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <button 
                      onClick={() => onNavigate("ideas", note.id)}
                      className="text-left flex-1 min-w-0"
                    >
                      <h3 className="text-base font-semibold text-foreground truncate hover:text-primary transition-colors">
                        {note.title || "Untitled"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(note.updatedAt)}
                        </span>
                        <span>{wordCount(note)} words</span>
                        <span>{note.blocks.length} blocks</span>
                      </div>
                    </button>
                  </div>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {note.tags.map(tag => (
                        <span 
                          key={tag.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {note.blocks.find(b => b.content)?.content || "Empty note"}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg gap-1.5 text-xs"
                      onClick={() => handleCopyMarkdown(note)}
                    >
                      {copiedId === note.id + "-md" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      Copy MD
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg gap-1.5 text-xs"
                      onClick={() => handleCopyText(note)}
                    >
                      {copiedId === note.id + "-txt" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      Copy Text
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg gap-1.5 text-xs"
                      onClick={() => exportNote(note, "markdown")}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedPage;
