import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import type { NoteBlock } from "@/contexts/NotesContext";

/**
 * Peer-to-peer collaboration via Yjs + WebRTC.
 *
 * Architecture:
 *  - No backend. Public Yjs signaling servers only relay encrypted WebRTC
 *    offers; they cannot read note contents.
 *  - All payloads are E2E-encrypted with a per-room password derived key
 *    (handled by y-webrtc). The password is shared via URL hash, which
 *    browsers never send to servers.
 *  - Document state lives in a Y.Doc. Blocks are mirrored into a single
 *    Y.Map key for last-write-wins simplicity that still merges across peers.
 */

export interface CollabSession {
  doc: Y.Doc;
  provider: WebrtcProvider;
  roomId: string;
  password: string;
  destroy: () => void;
}

const SIGNALING = [
  "wss://signaling.yjs.dev",
  "wss://y-webrtc-eu.fly.dev",
];

const randomToken = (len = 16) => {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, len);
};

export const generateRoom = () => ({
  roomId: `elephant-${randomToken(12)}`,
  password: randomToken(20),
});

export const buildInviteLink = (roomId: string, password: string, title?: string) => {
  const params = new URLSearchParams({ room: roomId, key: password });
  if (title) params.set("t", title);
  // Hash is never sent to servers — keeps the password client-side only.
  return `${window.location.origin}${window.location.pathname}#collab=${params.toString()}`;
};

export const parseInviteHash = (): { roomId: string; password: string; title?: string } | null => {
  const h = window.location.hash;
  const m = h.match(/^#collab=(.+)$/);
  if (!m) return null;
  try {
    const params = new URLSearchParams(m[1]);
    const roomId = params.get("room");
    const password = params.get("key");
    if (!roomId || !password) return null;
    return { roomId, password, title: params.get("t") || undefined };
  } catch {
    return null;
  }
};

export const clearInviteHash = () => {
  if (window.location.hash.startsWith("#collab=")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
};

export const startSession = (
  roomId: string,
  password: string,
  user: { name: string; color: string }
): CollabSession => {
  const doc = new Y.Doc();
  const provider = new WebrtcProvider(roomId, doc, {
    password,
    signaling: SIGNALING,
    maxConns: 20,
  } as any);
  provider.awareness.setLocalStateField("user", user);
  return {
    doc,
    provider,
    roomId,
    password,
    destroy: () => {
      try { provider.awareness.setLocalState(null); } catch {}
      try { provider.destroy(); } catch {}
      try { doc.destroy(); } catch {}
    },
  };
};

const BLOCKS_KEY = "blocks";
const TITLE_KEY = "title";

export const getSharedMap = (doc: Y.Doc) => doc.getMap<any>("note");

export const pushLocalBlocks = (doc: Y.Doc, blocks: NoteBlock[]) => {
  const map = getSharedMap(doc);
  // Compare to skip needless writes
  const current = map.get(BLOCKS_KEY);
  const next = JSON.stringify(blocks);
  if (current === next) return;
  doc.transact(() => map.set(BLOCKS_KEY, next), "local");
};

export const pushLocalTitle = (doc: Y.Doc, title: string) => {
  const map = getSharedMap(doc);
  if (map.get(TITLE_KEY) === title) return;
  doc.transact(() => map.set(TITLE_KEY, title), "local");
};

export const readRemoteBlocks = (doc: Y.Doc): NoteBlock[] | null => {
  const raw = getSharedMap(doc).get(BLOCKS_KEY);
  if (typeof raw !== "string") return null;
  try { return JSON.parse(raw) as NoteBlock[]; } catch { return null; }
};

export const readRemoteTitle = (doc: Y.Doc): string | null => {
  const raw = getSharedMap(doc).get(TITLE_KEY);
  return typeof raw === "string" ? raw : null;
};

export interface PeerUser { name: string; color: string; }
export const peersFromAwareness = (provider: WebrtcProvider): PeerUser[] => {
  const out: PeerUser[] = [];
  provider.awareness.getStates().forEach((s: any, clientId) => {
    if (clientId === provider.awareness.clientID) return;
    if (s?.user) out.push(s.user);
  });
  return out;
};

const PEER_COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#A78BFA", "#FB923C", "#34D399", "#60A5FA", "#F472B6"];
export const randomPeerColor = () => PEER_COLORS[Math.floor(Math.random() * PEER_COLORS.length)];

const NAME_KEY = "elephant-collab-name";
export const getDisplayName = () => localStorage.getItem(NAME_KEY) || "";
export const setDisplayName = (n: string) => localStorage.setItem(NAME_KEY, n);
