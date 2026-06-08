import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Copy, Check, Link2, Power, Shield, Wifi, WifiOff, UserCircle2 } from "lucide-react";
import { buildInviteLink, generateRoom, getDisplayName, setDisplayName, PeerUser } from "@/lib/collaboration";

interface CollaborateModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteTitle: string;
  active: boolean;
  roomId: string | null;
  password: string | null;
  peers: PeerUser[];
  connected: boolean;
  onStart: (roomId: string, password: string) => void;
  onStop: () => void;
  onRenameSelf: (name: string) => void;
}

const CollaborateModal = ({
  isOpen,
  onClose,
  noteTitle,
  active,
  roomId,
  password,
  peers,
  connected,
  onStart,
  onStop,
  onRenameSelf,
}: CollaborateModalProps) => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState(getDisplayName());

  useEffect(() => { if (isOpen) setName(getDisplayName()); }, [isOpen]);

  const link = useMemo(
    () => (active && roomId && password ? buildInviteLink(roomId, password, noteTitle) : ""),
    [active, roomId, password, noteTitle]
  );

  const handleStart = () => {
    const finalName = name.trim() || `Guest-${Math.floor(Math.random() * 9000) + 1000}`;
    setDisplayName(finalName);
    const { roomId: r, password: p } = generateRoom();
    onStart(r, p);
  };

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="w-full max-w-md bg-card/95 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground tracking-tight">Live Collaboration</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Peer-to-peer · end-to-end encrypted</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {!active ? (
                <>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/30">
                    <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                      No servers store your data. A short-lived signaling relay only helps peers discover each other —
                      content stays encrypted on your devices.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                      Your display name
                    </label>
                    <div className="mt-1.5 relative">
                      <UserCircle2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleStart}
                    className="w-full py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Power className="w-4 h-4" />
                    Start a live session
                  </button>
                </>
              ) : (
                <>
                  {/* Status row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {connected ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span className="text-xs font-medium text-foreground">Live</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Connecting…</span>
                        </>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {peers.length + 1} {peers.length === 0 ? "person" : "people"}
                    </span>
                  </div>

                  {/* Invite link */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                      Invite link
                    </label>
                    <div className="mt-1.5 flex items-stretch gap-2">
                      <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/40 border border-border/40 min-w-0">
                        <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-[12px] text-foreground/80 truncate font-mono">{link}</span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="px-3.5 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition flex items-center gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      The encryption key lives in the link's <span className="font-mono">#hash</span> — it never reaches any server.
                    </p>
                  </div>

                  {/* Peers */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                      In this session
                    </label>
                    <div className="mt-2 space-y-1.5">
                      <PeerRow
                        name={name || "You"}
                        color="#10b981"
                        isYou
                        onRename={(n) => { setName(n); onRenameSelf(n); }}
                      />
                      {peers.map((p, i) => (
                        <PeerRow key={i} name={p.name} color={p.color} />
                      ))}
                      {peers.length === 0 && (
                        <p className="text-[12px] text-muted-foreground italic pl-1 pt-1">
                          Share the link to invite others.
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onStop}
                    className="w-full py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition flex items-center justify-center gap-2"
                  >
                    <Power className="w-3.5 h-3.5" />
                    End session
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PeerRow = ({
  name, color, isYou, onRename,
}: { name: string; color: string; isYou?: boolean; onRename?: (n: string) => void }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(name);
  useEffect(() => setVal(name), [name]);
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-muted/40 transition group">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-semibold text-white shrink-0"
        style={{ backgroundColor: color }}
      >
        {(name || "?").slice(0, 1).toUpperCase()}
      </div>
      {isYou && editing ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => { onRename?.(val.trim() || "Guest"); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          className="flex-1 bg-transparent text-sm outline-none border-b border-border/50"
        />
      ) : (
        <button
          className="flex-1 text-left text-sm text-foreground truncate"
          onClick={() => isYou && setEditing(true)}
        >
          {name} {isYou && <span className="text-[10.5px] text-muted-foreground ml-1">(you)</span>}
        </button>
      )}
    </div>
  );
};

export default CollaborateModal;
