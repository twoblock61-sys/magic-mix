// Secure, passphrase-protected vault for AI provider API keys.
//
// Design goals:
//   1. Nothing readable lands in localStorage. Only ciphertext + salt + a
//      verifier blob live there. An attacker who copies localStorage cannot
//      recover any key without the master passphrase.
//   2. The derived AES key is held in a module-level variable (in memory only).
//      It is never written to disk or sessionStorage, and is wiped on lock,
//      idle timeout, page unload, and modal close.
//   3. PBKDF2-SHA256, 250k iterations, per-vault random salt. AES-GCM, fresh
//      96-bit IV per entry. Tamper detection comes free from GCM.
//   4. The verifier proves the passphrase is correct without revealing any
//      provider key, so wrong passphrases fail fast and cleanly.
//
// This is browser crypto — it cannot defeat a physically compromised machine,
// but it removes the "open devtools → copy plaintext" attack the user asked
// about and makes the local-first model honestly secure at rest.

import type { AiProviderId } from "./aiProviders";

const VAULT_KEY = "elephant.ai.vault.v2";
const LEGACY_PLAINTEXT_KEY = "elephant.ai.keys.v1";
const PBKDF2_ITER = 250_000;
const VERIFIER_PLAINTEXT = "elephant-vault-ok";
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // auto-lock after 10 min idle

interface VaultBlob {
  v: 2;
  salt: string; // base64
  verifier: { iv: string; ct: string }; // proves passphrase
  keys: Partial<Record<AiProviderId, { iv: string; ct: string }>>;
}

// ---- in-memory state (NEVER persisted) -------------------------------------

let memCryptoKey: CryptoKey | null = null;
let idleTimer: number | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const resetIdleTimer = () => {
  if (idleTimer) window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => lockVault(), IDLE_TIMEOUT_MS);
};

// ---- base64 helpers --------------------------------------------------------

const b64 = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s: string) =>
  Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// ---- vault storage ---------------------------------------------------------

const readBlob = (): VaultBlob | null => {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    return raw ? (JSON.parse(raw) as VaultBlob) : null;
  } catch {
    return null;
  }
};

const writeBlob = (b: VaultBlob) => {
  localStorage.setItem(VAULT_KEY, JSON.stringify(b));
};

export const hasVault = () => readBlob() !== null;
export const isUnlocked = () => memCryptoKey !== null;

// ---- key derivation --------------------------------------------------------

const deriveKey = async (passphrase: string, salt: Uint8Array) => {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITER, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

const encrypt = async (key: CryptoKey, plaintext: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return { iv: b64(iv.buffer), ct: b64(ct) };
};

const decrypt = async (key: CryptoKey, blob: { iv: string; ct: string }) => {
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(blob.iv) },
    key,
    unb64(blob.ct),
  );
  return new TextDecoder().decode(pt);
};

// ---- public API ------------------------------------------------------------

export const createVault = async (passphrase: string) => {
  if (passphrase.length < 8) {
    throw new Error("Passphrase must be at least 8 characters.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const verifier = await encrypt(key, VERIFIER_PLAINTEXT);
  const blob: VaultBlob = {
    v: 2,
    salt: b64(salt.buffer),
    verifier,
    keys: {},
  };
  writeBlob(blob);
  memCryptoKey = key;
  resetIdleTimer();
  // Best-effort migration: if a legacy plaintext store exists, wipe it.
  try { localStorage.removeItem(LEGACY_PLAINTEXT_KEY); } catch {}
  emit();
};

export const unlockVault = async (passphrase: string) => {
  const blob = readBlob();
  if (!blob) throw new Error("No vault exists yet.");
  const key = await deriveKey(passphrase, unb64(blob.salt));
  try {
    const check = await decrypt(key, blob.verifier);
    if (check !== VERIFIER_PLAINTEXT) throw new Error("bad");
  } catch {
    throw new Error("Incorrect passphrase.");
  }
  memCryptoKey = key;
  resetIdleTimer();
  emit();
};

export const lockVault = () => {
  memCryptoKey = null;
  if (idleTimer) {
    window.clearTimeout(idleTimer);
    idleTimer = null;
  }
  emit();
};

export const destroyVault = () => {
  localStorage.removeItem(VAULT_KEY);
  lockVault();
};

export const changePassphrase = async (oldPass: string, newPass: string) => {
  if (newPass.length < 8) throw new Error("Passphrase must be at least 8 characters.");
  const blob = readBlob();
  if (!blob) throw new Error("No vault exists yet.");
  const oldKey = await deriveKey(oldPass, unb64(blob.salt));
  // Decrypt every stored key with the old passphrase first.
  const decrypted: Partial<Record<AiProviderId, string>> = {};
  try {
    const check = await decrypt(oldKey, blob.verifier);
    if (check !== VERIFIER_PLAINTEXT) throw new Error("bad");
    for (const [pid, entry] of Object.entries(blob.keys)) {
      if (entry) decrypted[pid as AiProviderId] = await decrypt(oldKey, entry);
    }
  } catch {
    throw new Error("Incorrect current passphrase.");
  }
  // Re-encrypt with a fresh salt + derived key.
  const newSalt = crypto.getRandomValues(new Uint8Array(16));
  const newKey = await deriveKey(newPass, newSalt);
  const newKeys: VaultBlob["keys"] = {};
  for (const [pid, pt] of Object.entries(decrypted)) {
    if (pt) newKeys[pid as AiProviderId] = await encrypt(newKey, pt);
  }
  const verifier = await encrypt(newKey, VERIFIER_PLAINTEXT);
  writeBlob({ v: 2, salt: b64(newSalt.buffer), verifier, keys: newKeys });
  memCryptoKey = newKey;
  resetIdleTimer();
  emit();
};

export const setKey = async (provider: AiProviderId, plaintext: string) => {
  if (!memCryptoKey) throw new Error("Vault is locked.");
  const blob = readBlob();
  if (!blob) throw new Error("No vault.");
  if (!plaintext) {
    delete blob.keys[provider];
  } else {
    blob.keys[provider] = await encrypt(memCryptoKey, plaintext);
  }
  writeBlob(blob);
  resetIdleTimer();
  emit();
};

export const getKey = async (provider: AiProviderId): Promise<string | null> => {
  if (!memCryptoKey) throw new Error("Vault is locked.");
  const blob = readBlob();
  const entry = blob?.keys?.[provider];
  if (!entry) return null;
  resetIdleTimer();
  return decrypt(memCryptoKey, entry);
};

export const listSavedProviders = (): AiProviderId[] => {
  const blob = readBlob();
  if (!blob) return [];
  return Object.keys(blob.keys) as AiProviderId[];
};

export const hasLegacyPlaintextKeys = () => {
  try {
    const raw = localStorage.getItem(LEGACY_PLAINTEXT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
};

// Best-effort: lock when the tab is hidden for a while or unloaded.
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => lockVault());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // start the idle timer immediately rather than waiting on activity
      resetIdleTimer();
    }
  });
}
