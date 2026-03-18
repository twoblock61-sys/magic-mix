import { useState } from "react";
import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import { NotesProvider } from "@/contexts/NotesContext";
import HomePage from "@/pages/HomePage";
import CalendarPage from "@/pages/CalendarPage";
import IdeasPage from "@/pages/IdeasPage";
import FolderPage from "@/pages/FolderPage";
import GraphPage from "@/pages/GraphPage";
import FlashcardsPage from "@/pages/FlashcardsPage";
import SettingsPage from "@/pages/SettingsPage";
import SharedPage from "@/pages/SharedPage";

const Index = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();

  const handleNavigate = (nav: string, noteId?: string) => {
    setActiveNav(nav);
    if (noteId) {
      setSelectedNoteId(noteId);
    }
  };

  const renderPage = () => {
    switch (activeNav) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "calendar":
        return <CalendarPage onNavigate={handleNavigate} />;
      case "flashcards":
        return <FlashcardsPage />;
      case "ideas":
        return <IdeasPage initialNoteId={selectedNoteId} />;
      case "folder":
        return <FolderPage onNavigate={handleNavigate} />;
      case "graph":
        return <GraphPage onNavigate={handleNavigate} />;
      case "shared":
        return <SharedPage onNavigate={handleNavigate} />;
      case "setting":
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <NotesProvider>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <motion.div 
          className="flex h-full w-full max-w-[1600px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sidebar */}
          <AppSidebar activeNav={activeNav} onNavChange={(nav) => handleNavigate(nav)} />

          {/* Main Content */}
          <main className="flex-1 flex overflow-hidden">
            {renderPage()}
          </main>
        </motion.div>
      </div>
    </NotesProvider>
  );
};

export default Index;