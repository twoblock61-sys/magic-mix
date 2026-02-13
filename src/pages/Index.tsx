import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Calendar, Share2, Network, Layers } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { NotesProvider } from "@/contexts/NotesContext";
import HomePage from "@/pages/HomePage";
import CalendarPage from "@/pages/CalendarPage";
import IdeasPage from "@/pages/IdeasPage";
import FolderPage from "@/pages/FolderPage";
import GraphPage from "@/pages/GraphPage";
import FlashcardsPage from "@/pages/FlashcardsPage";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const Index = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleNavigate = (nav: string, noteId?: string) => {
    setActiveNav(nav);
    if (noteId) {
      setSelectedNoteId(noteId);
    }
    if (isMobile) {
      setSidebarOpen(false);
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
        return (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Shared Notes</h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      case "setting":
        return (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <NotesProvider>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <motion.div 
          className="flex flex-col md:flex-row h-full w-full max-w-[1600px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Mobile Header */}
          {isMobile && (
            <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-xs">🐘</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  Eleph<span className="text-accent">ant</span>
                </span>
              </div>
            </header>
          )}

          {/* Desktop Sidebar */}
          {!isMobile && (
            <AppSidebar activeNav={activeNav} onNavChange={(nav) => handleNavigate(nav)} />
          )}

          {/* Mobile Sidebar Sheet */}
          {isMobile && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetContent side="left" className="p-0 w-64 border-none">
                <VisuallyHidden.Root>
                  <SheetTitle>Navigation</SheetTitle>
                </VisuallyHidden.Root>
                <AppSidebar activeNav={activeNav} onNavChange={(nav) => handleNavigate(nav)} />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Content */}
          <main className="flex-1 flex overflow-hidden pb-[env(safe-area-inset-bottom)]">
            {renderPage()}
          </main>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <nav className="flex-shrink-0 flex items-center justify-around px-2 py-2 border-t border-border sidebar-gradient">
              {[
                { id: "calendar", icon: Calendar, label: "Calendar" },
                { id: "shared", icon: Share2, label: "Shared" },
                { id: "graph", icon: Network, label: "Graph" },
                { id: "flashcards", icon: Layers, label: "Cards" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                    activeNav === item.id
                      ? "bg-white/20 text-white"
                      : "text-white/70"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </motion.div>
      </div>
    </NotesProvider>
  );
};

export default Index;
