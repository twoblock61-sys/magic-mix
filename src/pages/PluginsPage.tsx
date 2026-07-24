import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Puzzle,
  Play,
  Trash2,
  Power,
  Shield,
  Search,
  Upload,
  X,
  Sparkles,
  Cpu,
  LayoutGrid,
} from "lucide-react";
import { useNotesContext } from "@/contexts/NotesContext";
import { bootstrapPlugins, installPlugin, listPlugins, togglePlugin, uninstallPlugin } from "@/lib/plugins/registry";
import { installBridge, HostContext } from "@/lib/plugins/bridge";
import { runHeadless } from "@/lib/plugins/headlessRunner";
import { InstalledPlugin, PluginManifest } from "@/lib/plugins/types";
import ExtensionHost from "@/components/ExtensionHost";
import { toast } from "@/hooks/use-toast";

const PluginsPage = () => {
  const { notes, createNote, updateNote } = useNotesContext();
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ui" | "headless">("all");
  const [installOpen, setInstallOpen] = useState(false);
  const [installText, setInstallText] = useState("");
  const [headlessInput, setHeadlessInput] = useState("");
  const [headlessOutput, setHeadlessOutput] = useState<string>("");

  // Track iframe windows so bridge can identify sender → plugin
  const frameRegistry = useRef<Map<Window, string>>(new Map());
  const activeNoteIdRef = useRef<string | null>(null);
  const notesRef = useRef(notes);
  notesRef.current = notes;

  useEffect(() => {
    setPlugins(bootstrapPlugins());
  }, []);

  const setTheme = (mode: "light" | "dark" | "system") => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else if (mode === "light") root.classList.remove("dark");
    else {
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefers);
    }
    localStorage.setItem("elephant.theme", mode);
  };

  useEffect(() => {
    const ctx: HostContext = {
      getActiveNote: () => {
        const id = activeNoteIdRef.current || notesRef.current[0]?.id;
        return notesRef.current.find((n) => n.id === id) ?? null;
      },
      getAllNotes: () => notesRef.current,
      createNote: (data) => {
        const n = createNote();
        if (data?.title || data?.content) {
          updateNote(n.id, {
            title: data.title || n.title,
          });
        }
        return n;
      },
      setTheme,
    };
    const resolve = (source: MessageEventSource | null) => {
      if (!source) return null;
      const id = frameRegistry.current.get(source as Window);
      if (!id) return null;
      return plugins.find((p) => p.id === id) ?? null;
    };
    return installBridge(resolve, ctx);
  }, [plugins, createNote, updateNote]);

  const refresh = () => setPlugins(listPlugins());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plugins.filter((p) => {
      if (filter !== "all" && p.kind !== filter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });
  }, [plugins, search, filter]);

  const active = plugins.find((p) => p.id === activeId) || null;
  activeNoteIdRef.current = notes[0]?.id ?? null;

  const handleInstall = () => {
    try {
      const parsed = JSON.parse(installText) as PluginManifest;
      if (!parsed.id || !parsed.name || !parsed.kind || !parsed.entry) {
        throw new Error("Manifest missing required fields (id, name, kind, entry)");
      }
      installPlugin(parsed);
      setInstallOpen(false);
      setInstallText("");
      refresh();
      toast({ title: "Plugin installed", description: parsed.name });
    } catch (err: any) {
      toast({ title: "Install failed", description: err.message, variant: "destructive" });
    }
  };

  const handleRunHeadless = async () => {
    if (!active || active.kind !== "headless") return;
    setHeadlessOutput("Running…");
    try {
      const parsed = headlessInput.trim() ? tryParse(headlessInput) : { text: "" };
      const result = await runHeadless(active, parsed);
      setHeadlessOutput(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setHeadlessOutput("Error: " + err.message);
    }
  };

  const tryParse = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return { text: s };
    }
  };

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-background">
      {/* List */}
      <div className="w-[380px] flex-shrink-0 border-r border-border flex flex-col h-full">
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <Puzzle className="w-6 h-6 text-primary" /> Plugins
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Local-first extensions, sandboxed & permission-gated.
              </p>
            </div>
            <motion.button
              onClick={() => setInstallOpen(true)}
              className="p-2 rounded-lg bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Install manifest"
            >
              <Upload className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plugins…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/60 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex gap-1 text-xs">
            {(["all", "ui", "headless"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md capitalize transition ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                }`}
              >
                {f === "ui" ? "Widgets" : f === "headless" ? "Headless" : "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4 space-y-2">
          {filtered.map((p) => (
            <motion.button
              key={p.id}
              layout
              onClick={() => setActiveId(p.id)}
              className={`w-full text-left p-3 rounded-xl transition group ${
                activeId === p.id ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted/60"
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    p.color || "from-slate-500 to-slate-700"
                  } flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}
                >
                  {p.icon || "🧩"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{p.name}</span>
                    {!p.enabled && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        off
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground">
                    {p.kind === "ui" ? (
                      <LayoutGrid className="w-3 h-3" />
                    ) : (
                      <Cpu className="w-3 h-3" />
                    )}
                    <span>{p.kind === "ui" ? "Widget" : "Headless"}</span>
                    <span>·</span>
                    <span>v{p.version}</span>
                    {p.builtin && (
                      <>
                        <span>·</span>
                        <span>Built-in</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              No plugins match.
            </div>
          )}
        </div>
      </div>

      {/* Detail pane */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!active ? (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div>
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h2 className="text-lg font-semibold">Select a plugin</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Choose an extension from the left to preview, run, or manage its permissions.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  active.color || "from-slate-500 to-slate-700"
                } flex items-center justify-center text-3xl shadow-md`}
              >
                {active.icon || "🧩"}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">{active.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{active.author || "Unknown author"}</span>
                  <span>·</span>
                  <span>v{active.version}</span>
                  <span>·</span>
                  <span className="font-mono">{active.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => {
                    togglePlugin(active.id, !active.enabled);
                    refresh();
                  }}
                  className={`p-2 rounded-lg ${
                    active.enabled ? "bg-primary/10 text-primary" : "bg-muted"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={active.enabled ? "Disable" : "Enable"}
                >
                  <Power className="w-4 h-4" />
                </motion.button>
                {!active.builtin && (
                  <motion.button
                    onClick={() => {
                      uninstallPlugin(active.id);
                      setActiveId(null);
                      refresh();
                    }}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Uninstall"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Permissions */}
            <div className="p-4 rounded-2xl bg-muted/40 ring-1 ring-border/60">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
                <Shield className="w-3.5 h-3.5" /> Declared Permissions
              </div>
              {active.permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">None — pure computation, no host access.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {active.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2.5 py-1 rounded-md bg-background text-xs font-mono ring-1 ring-border/60"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Runtime */}
            {active.kind === "ui" && active.enabled ? (
              <ExtensionHost
                plugin={active}
                height={380}
                onFrameRef={(win) => {
                  if (win) frameRegistry.current.set(win, active.id);
                }}
              />
            ) : active.kind === "headless" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Input (JSON or plain text)
                  </label>
                  <textarea
                    value={headlessInput}
                    onChange={(e) => setHeadlessInput(e.target.value)}
                    placeholder='{"text": "Hello  world\\n\\n\\nfoo"}'
                    className="w-full mt-1 p-3 rounded-xl bg-muted/40 ring-1 ring-border/60 outline-none focus:ring-primary/40 font-mono text-sm min-h-[100px]"
                  />
                </div>
                <motion.button
                  onClick={handleRunHeadless}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-3.5 h-3.5" /> Run in Worker
                </motion.button>
                {headlessOutput && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">Output</label>
                    <pre className="mt-1 p-3 rounded-xl bg-muted/40 ring-1 ring-border/60 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                      {headlessOutput}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-muted/40 text-center text-sm text-muted-foreground">
                Plugin disabled. Turn it on to run.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Install modal */}
      <AnimatePresence>
        {installOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInstallOpen(false)}
          >
            <motion.div
              className="bg-card rounded-2xl shadow-xl w-full max-w-lg p-6 ring-1 ring-border"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Install Plugin</h2>
                <button onClick={() => setInstallOpen(false)} className="p-1 rounded hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Paste a plugin manifest JSON with fields:{" "}
                <code className="font-mono">id, name, version, description, kind, permissions, entry</code>.
              </p>
              <textarea
                value={installText}
                onChange={(e) => setInstallText(e.target.value)}
                placeholder='{"id":"com.example.foo", "name":"Foo", "version":"1.0.0", "kind":"headless", "permissions":[], "entry":"export function run(i){return i}"}'
                className="w-full h-64 p-3 rounded-lg bg-muted/40 ring-1 ring-border/60 outline-none focus:ring-primary/40 font-mono text-xs"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setInstallOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Install
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PluginsPage;
