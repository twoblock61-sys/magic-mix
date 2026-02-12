import { useState, useEffect, useCallback } from "react";
import { useNotesContext } from "@/contexts/NotesContext";
import NotesListPanel from "@/components/NotesListPanel";
import NoteEditorFull from "@/components/NoteEditorFull";
import { StickyNote, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeBack } from "@/hooks/useSwipeBack";

interface IdeasPageProps {
  initialNoteId?: string;
}

const IdeasPage = ({ initialNoteId }: IdeasPageProps) => {
  const { notes, createNote, updateNote, deleteNote } = useNotesContext();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(initialNoteId || null);
  const [focusMode, setFocusMode] = useState(false);
  const isMobile = useIsMobile();

  const activeNote = notes.find((n) => n.id === activeNoteId);

  useEffect(() => {
    if (initialNoteId) {
      setActiveNoteId(initialNoteId);
    }
  }, [initialNoteId]);

  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
    if (activeNoteId && !notes.find((n) => n.id === activeNoteId)) {
      setActiveNoteId(notes[0]?.id || null);
    }
  }, [notes, activeNoteId]);

  const handleCreateNote = () => {
    const note = createNote();
    setActiveNoteId(note.id);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode]);

  const handleGoBack = useCallback(() => setActiveNoteId(null), []);
  const swipeHandlers = useSwipeBack({ onSwipeBack: handleGoBack, enabled: isMobile && !!activeNoteId });

  // Mobile: show list or editor, not both
  const showListOnMobile = isMobile && !activeNoteId;
  const showEditorOnMobile = isMobile && activeNoteId;

  return (
    <div className="flex-1 h-full flex overflow-hidden relative">
      {/* Notes List */}
      <AnimatePresence>
        {!focusMode && (!isMobile || showListOnMobile) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={isMobile ? "w-full" : "overflow-hidden"}
          >
            <NotesListPanel
              title="All Ideas"
              notes={notes}
              activeNoteId={activeNoteId}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
              onCreateNote={handleCreateNote}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      {(!isMobile || showEditorOnMobile) && (
        <>
          {activeNote ? (
            <div className="flex-1 flex flex-col overflow-hidden" {...swipeHandlers}>
              {/* Mobile back button */}
              {isMobile && (
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card flex-shrink-0">
                  <button
                    onClick={() => setActiveNoteId(null)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <span className="text-sm font-medium text-foreground truncate">
                    {activeNote.title || "Untitled"}
                  </span>
                </div>
              )}
              <NoteEditorFull
                note={activeNote}
                onUpdate={(updates) => updateNote(activeNote.id, updates)}
                focusMode={focusMode}
                onToggleFocusMode={() => setFocusMode(!focusMode)}
              />
            </div>
          ) : (
            !isMobile && (
              <div className="flex-1 flex items-center justify-center bg-background">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <StickyNote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">No note selected</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a note from the list or create a new one
                  </p>
                  <motion.button
                    onClick={handleCreateNote}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create new note
                  </motion.button>
                </motion.div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default IdeasPage;
