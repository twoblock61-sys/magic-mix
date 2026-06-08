import { useEffect, useRef, useState, useCallback } from "react";
import type { NoteBlock } from "@/contexts/NotesContext";
import {
  CollabSession,
  startSession,
  pushLocalBlocks,
  pushLocalTitle,
  readRemoteBlocks,
  readRemoteTitle,
  peersFromAwareness,
  PeerUser,
  randomPeerColor,
  getDisplayName,
  setDisplayName,
} from "@/lib/collaboration";

interface UseCollabArgs {
  active: boolean;
  roomId: string | null;
  password: string | null;
  blocks: NoteBlock[];
  title: string;
  onRemote: (updates: { blocks?: NoteBlock[]; title?: string }) => void;
}

export const useCollabSession = ({
  active,
  roomId,
  password,
  blocks,
  title,
  onRemote,
}: UseCollabArgs) => {
  const sessionRef = useRef<CollabSession | null>(null);
  const applyingRemoteRef = useRef(false);
  const [peers, setPeers] = useState<PeerUser[]>([]);
  const [connected, setConnected] = useState(false);

  // Start / stop session
  useEffect(() => {
    if (!active || !roomId || !password) return;
    const name = getDisplayName() || `Guest-${Math.floor(Math.random() * 9000) + 1000}`;
    setDisplayName(name);
    const user = { name, color: randomPeerColor() };
    const session = startSession(roomId, password, user);
    sessionRef.current = session;

    const map = session.doc.getMap("note");
    const onChange = (_evt: any, tx: any) => {
      if (tx.origin === "local") return;
      applyingRemoteRef.current = true;
      const updates: { blocks?: NoteBlock[]; title?: string } = {};
      const rb = readRemoteBlocks(session.doc);
      if (rb) updates.blocks = rb;
      const rt = readRemoteTitle(session.doc);
      if (rt !== null) updates.title = rt;
      if (Object.keys(updates).length) onRemote(updates);
      queueMicrotask(() => { applyingRemoteRef.current = false; });
    };
    map.observe(onChange);

    const onAwareness = () => setPeers(peersFromAwareness(session.provider));
    session.provider.awareness.on("change", onAwareness);

    const onStatus = (e: any) => setConnected(e.connected ?? true);
    session.provider.on("status", onStatus);
    setConnected(true);

    // Seed the doc with current local state so joiners receive it.
    // Delay slightly so we don't overwrite remote on the first sync.
    const seedTimer = setTimeout(() => {
      if (!sessionRef.current) return;
      const existing = readRemoteBlocks(session.doc);
      if (!existing) pushLocalBlocks(session.doc, blocks);
      const existingT = readRemoteTitle(session.doc);
      if (existingT === null) pushLocalTitle(session.doc, title);
    }, 600);

    return () => {
      clearTimeout(seedTimer);
      map.unobserve(onChange);
      session.provider.awareness.off("change", onAwareness);
      session.provider.off("status", onStatus);
      session.destroy();
      sessionRef.current = null;
      setPeers([]);
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, roomId, password]);

  // Push local blocks/title changes to peers
  useEffect(() => {
    if (!sessionRef.current || applyingRemoteRef.current) return;
    pushLocalBlocks(sessionRef.current.doc, blocks);
  }, [blocks]);

  useEffect(() => {
    if (!sessionRef.current || applyingRemoteRef.current) return;
    pushLocalTitle(sessionRef.current.doc, title);
  }, [title]);

  const renameSelf = useCallback((name: string) => {
    if (!sessionRef.current) return;
    setDisplayName(name);
    const prev = sessionRef.current.provider.awareness.getLocalState() as any;
    sessionRef.current.provider.awareness.setLocalStateField("user", {
      ...(prev?.user || {}),
      name,
    });
  }, []);

  return { peers, connected, renameSelf };
};
