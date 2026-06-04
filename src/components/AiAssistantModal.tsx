import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  KeyRound,
  Wand2,
  BookOpen,
  Layers as LayersIcon,
  HelpCircle,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { Note, NoteBlock } from "@/contexts/NotesContext";
import { noteToMarkdown } from "@/lib/noteToMarkdown";
import {
  AI_PROVIDERS,
  AiProviderId,
  callAi,
  extractJson,
  loadKeys,
  saveKey,
} from "@/lib/aiProviders";
import { toast } from "@/hooks/use-toast";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
  onAppendBlocks: (blocks: NoteBlock[]) => void;
}

type Mode = "external" | "byok";
type Task = "summary" | "flashcards" | "quiz";

const TASKS: { id: Task; label: string; description: string; icon: typeof BookOpen; accent: string }[] = [
  { id: "summary", label: "Summary", description: "Concise key takeaways", icon: BookOpen, accent: "from-sky-500/20 to-indigo-500/20" },
  { id: "flashcards", label: "Flashcards", description: "Question · Answer cards", icon: LayersIcon, accent: "from-amber-500/20 to-rose-500/20" },
  { id: "quiz", label: "Quiz · FAQ", description: "Test yourself", icon: HelpCircle, accent: "from-emerald-500/20 to-teal-500/20" },
];

const SYSTEM_PROMPTS: Record<Task, string> = {
  summary:
    "You are a precise study assistant. Read the provided note (in Markdown) and produce a concise, well-structured summary in Markdown. Use short paragraphs and bullet points. No preamble.",
  flashcards:
    "You are a precise study assistant. Read the provided note (in Markdown) and produce 8-15 high-quality flashcards. Respond ONLY with a JSON array of objects of the form {\"question\": string, \"answer\": string}. No prose, no markdown fences.",
  quiz:
    "You are a precise study assistant. Read the provided note (in Markdown) and produce 6-12 quiz questions in FAQ form. Respond ONLY with a JSON array of objects of the form {\"question\": string, \"answer\": string}. No prose, no markdown fences.",
};

const DEFAULT_USER_PROMPT =
  "Remember the full context. Use only the material I paste below. Be accurate, concise, and helpful. When unsure, say so.";

const AiAssistantModal = ({ isOpen, onClose, note, onAppendBlocks }: AiAssistantModalProps) => {
  const [mode, setMode] = useState<Mode>("external");
  const [prompt, setPrompt] = useState(DEFAULT_USER_PROMPT);
  const [copied, setCopied] = useState<"all" | "md" | null>(null);

  // BYOK state
  const [keys, setKeys] = useState<Record<AiProviderId, string>>({} as any);
  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>("gemini");
  const [showKey, setShowKey] = useState(false);
  const [task, setTask] = useState<Task>("summary");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (isOpen) setKeys(loadKeys());
  }, [isOpen]);

  const markdown = useMemo(() => noteToMarkdown(note), [note]);
  const combined = useMemo(
    () => `${prompt}\n\n---\n\n${markdown}`,
    [prompt, markdown],
  );

  const copyToClipboard = async (value: string, kind: "all" | "md") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      toast({ title: "Copy failed", description: "Clipboard access denied.", variant: "destructive" });
    }
  };

  const openProvider = async (url: string) => {
    // Copy the combined prompt so the user can paste it on the other side.
    await copyToClipboard(combined, "all");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSaveKey = (provider: AiProviderId, key: string) => {
    saveKey(provider, key.trim());
    setKeys((k) => ({ ...k, [provider]: key.trim() }));
  };

  const handleRun = async () => {
    const apiKey = keys[selectedProvider];
    if (!apiKey) {
      toast({ title: "Add an API key", description: "Paste a key for the selected provider first." });
      return;
    }
    setRunning(true);
    try {
      const raw = await callAi(
        selectedProvider,
        apiKey,
        SYSTEM_PROMPTS[task],
        `${prompt}\n\n--- NOTE START ---\n${markdown}\n--- NOTE END ---`,
      );

      const newBlocks: NoteBlock[] = [];
      newBlocks.push({
        id: crypto.randomUUID(),
        type: "divider",
        content: "",
      });
      newBlocks.push({
        id: crypto.randomUUID(),
        type: "heading2",
        content:
          task === "summary"
            ? "✨ AI Summary"
            : task === "flashcards"
            ? "✨ AI Flashcards"
            : "✨ AI Quiz",
      });

      if (task === "summary") {
        newBlocks.push({
          id: crypto.randomUUID(),
          type: "callout",
          content: raw.trim(),
        });
      } else if (task === "flashcards") {
        const items = extractJson(raw) as { question: string; answer: string }[];
        newBlocks.push({
          id: crypto.randomUUID(),
          type: "flashcard",
          content: "AI Flashcards",
          flashcards: items.map((it) => ({
            id: crypto.randomUUID(),
            content: `Q: ${it.question}\nA: ${it.answer}`,
            color: ["yellow", "blue", "pink", "green", "purple"][Math.floor(Math.random() * 5)],
          })),
        });
      } else {
        const items = extractJson(raw) as { question: string; answer: string }[];
        newBlocks.push({
          id: crypto.randomUUID(),
          type: "faq",
          content: "AI Quiz",
          faqItems: items.map((it) => ({
            id: crypto.randomUUID(),
            question: it.question,
            answer: it.answer,
          })),
        });
      }

      onAppendBlocks(newBlocks);
      toast({ title: "Added to note", description: "AI content appended at the end." });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Generation failed",
        description: err?.message?.slice(0, 200) || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const activeKey = keys[selectedProvider] || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-3xl max-h-[88vh] bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">AI Assistant</h2>
                    <p className="text-xs text-muted-foreground">Local-first. Your note stays yours.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Switch */}
              <div className="px-6 pt-4">
                <div className="inline-flex p-1 bg-muted/60 rounded-xl">
                  {(
                    [
                      { id: "external", label: "Copy & Open", icon: ExternalLink },
                      { id: "byok", label: "Bring Your Own Key", icon: KeyRound },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMode(opt.id)}
                      className={`relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        mode === opt.id
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode === opt.id && (
                        <motion.div
                          layoutId="ai-mode-pill"
                          className="absolute inset-0 bg-card border border-border/60 rounded-lg shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <opt.icon className="w-3.5 h-3.5 relative" />
                      <span className="relative">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
                {mode === "external" ? (
                  <ExternalMode
                    prompt={prompt}
                    setPrompt={setPrompt}
                    markdown={markdown}
                    combined={combined}
                    copied={copied}
                    onCopy={copyToClipboard}
                    onOpenProvider={openProvider}
                  />
                ) : (
                  <ByokMode
                    keys={keys}
                    activeKey={activeKey}
                    showKey={showKey}
                    setShowKey={setShowKey}
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                    onSaveKey={handleSaveKey}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    task={task}
                    setTask={setTask}
                    running={running}
                    onRun={handleRun}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------ External mode ----------------------------- */

const ExternalMode = ({
  prompt,
  setPrompt,
  markdown,
  combined,
  copied,
  onCopy,
  onOpenProvider,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  markdown: string;
  combined: string;
  copied: "all" | "md" | null;
  onCopy: (value: string, kind: "all" | "md") => void;
  onOpenProvider: (url: string) => void;
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Your prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="mt-2 w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none transition-all"
          placeholder="Tell the assistant what you want…"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Note markdown
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopy(markdown, "md")}
              className="text-xs px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              {copied === "md" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              Markdown only
            </button>
            <button
              onClick={() => onCopy(combined, "all")}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              {copied === "all" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              Copy prompt + note
            </button>
          </div>
        </div>
        <pre className="max-h-48 overflow-auto px-4 py-3 rounded-2xl bg-muted/30 border border-border/40 text-xs text-muted-foreground whitespace-pre-wrap font-mono scrollbar-thin">
          {markdown || "Empty note."}
        </pre>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Open in
        </label>
        <p className="text-xs text-muted-foreground/80 mt-1 mb-3">
          We copy the prompt + note to your clipboard and open the chat. Just paste.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenProvider(p.webUrl)}
              className="group relative overflow-hidden rounded-2xl border border-border/60 hover:border-border bg-card hover:bg-muted/40 transition-all p-4 text-left"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${p.accent} transition-opacity`} style={{ mixBlendMode: "overlay" }} />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Open chat</div>
                </div>
                <span className="text-lg opacity-70 group-hover:opacity-100">{p.icon}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------- BYOK mode ------------------------------- */

const ByokMode = ({
  keys,
  activeKey,
  showKey,
  setShowKey,
  selectedProvider,
  setSelectedProvider,
  onSaveKey,
  prompt,
  setPrompt,
  task,
  setTask,
  running,
  onRun,
}: {
  keys: Record<AiProviderId, string>;
  activeKey: string;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  selectedProvider: AiProviderId;
  setSelectedProvider: (p: AiProviderId) => void;
  onSaveKey: (p: AiProviderId, k: string) => void;
  prompt: string;
  setPrompt: (v: string) => void;
  task: Task;
  setTask: (t: Task) => void;
  running: boolean;
  onRun: () => void;
}) => {
  const [draft, setDraft] = useState(activeKey);
  useEffect(() => setDraft(activeKey), [activeKey, selectedProvider]);
  const provider = AI_PROVIDERS.find((p) => p.id === selectedProvider)!;

  return (
    <div className="space-y-5">
      {/* Provider picker */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Provider
        </label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {AI_PROVIDERS.map((p) => {
            const has = !!keys[p.id];
            const active = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id)}
                className={`relative rounded-xl border p-3 text-center transition-all ${
                  active
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="text-lg">{p.icon}</div>
                <div className="text-[11px] font-medium mt-1">{p.name}</div>
                {has && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* API Key */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {provider.name} API key
          </label>
          <span className="text-[11px] text-muted-foreground/70">Stored locally on this device</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type={showKey ? "text" : "password"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => onSaveKey(selectedProvider, draft)}
              placeholder={provider.keyHint}
              className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-muted/40 border border-border/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono"
            />
            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
              type="button"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {activeKey && (
            <button
              onClick={() => {
                onSaveKey(selectedProvider, "");
                setDraft("");
              }}
              className="p-2.5 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
              title="Remove key"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Custom prompt */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Extra instructions (optional)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="mt-2 w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
        />
      </div>

      {/* Task picker */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Generate
        </label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TASKS.map((t) => {
            const Icon = t.icon;
            const active = task === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTask(t.id)}
                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary shadow-sm bg-primary/5"
                    : "border-border/60 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-${active ? 100 : 0} transition-opacity`} />
                <div className="relative flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 text-foreground" />
                  <div>
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{t.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Run */}
      <motion.button
        onClick={onRun}
        disabled={running || !activeKey}
        whileHover={!running && activeKey ? { scale: 1.01 } : {}}
        whileTap={!running && activeKey ? { scale: 0.99 } : {}}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {running ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate & append to note
          </>
        )}
      </motion.button>
      <p className="text-[11px] text-center text-muted-foreground/70">
        Calls go directly from your browser to {provider.name}. No data passes through our servers.
      </p>
    </div>
  );
};

export default AiAssistantModal;
