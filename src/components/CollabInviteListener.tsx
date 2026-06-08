import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Sparkles } from "lucide-react";
import { useNotesContext } from "@/contexts/NotesContext";
import { parseInviteHash, clearInviteHash } from "@/lib/collaboration";

/**
 * Listens for #collab=... invite links. On accept, creates a new note locally
 * and stores the room/key on it so the editor auto-joins the session.
 */
interface Props {
  onOpenNote: (noteId: string) => void;
}

const CollabInviteListener = ({ onOpenNote }: Props) => {
  const { createNote, updateNote } = useNotesContext();
  const [invite, setInvite] = useState<{ roomId: string; password: string; title?: string } | null>(null);

  useEffect(() => {
    const check = () => {
      const i = parseInviteHash();
      if (i) setInvite(i);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const accept = () => {
    if (!invite) return;
    const note = createNote();
    updateNote(note.id, {
      title: invite.title ? `${invite.title} (shared)` : "Shared note",
      // Stash collab info inside tags so the editor can auto-join.
      // Using a hidden tag avoids schema changes.
      tags: [
        { id: "collab-room", label: `__collab:${invite.roomId}`, color: "gray" },
        { id: "collab-key", label: `__key:${invite.password}`, color: "gray" },
      ],
    });
    clearInviteHash();
    onOpenNote(note.id);
    setInvite(null);
  };

  const dismiss = () => { clearInviteHash(); setInvite(null); };

  return (
    <AnimatePresence>
      {invite && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="w-full max-w-sm bg-card/95 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">You're invited</h3>
                  <p className="text-xs text-muted-foreground">to a live collaboration session</p>
                </div>
                <button onClick={dismiss} className="ml-auto p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {invite.title && (
                <p className="text-sm text-foreground/80 mb-4 px-3 py-2 rounded-lg bg-muted/40 truncate">
                  "{invite.title}"
                </p>
              )}
              <p className="text-[12.5px] text-muted-foreground mb-5 leading-relaxed">
                A new note will be created on this device, then connected peer-to-peer to the inviter. Nothing
                touches a server — content is end-to-end encrypted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={dismiss}
                  className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:bg-muted transition"
                >
                  Not now
                </button>
                <button
                  onClick={accept}
                  className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> Join
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollabInviteListener;
