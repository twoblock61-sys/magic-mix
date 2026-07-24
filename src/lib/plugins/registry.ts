import { InstalledPlugin, PluginManifest } from "./types";
import { BUILTIN_PLUGINS } from "./builtins";

const STORAGE_KEY = "elephant.plugins.v1";

function read(): InstalledPlugin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InstalledPlugin[];
  } catch {
    return [];
  }
}

function write(list: InstalledPlugin[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** Ensure built-in plugins are always present. */
export function bootstrapPlugins(): InstalledPlugin[] {
  const existing = read();
  const existingIds = new Set(existing.map((p) => p.id));
  let changed = false;
  for (const b of BUILTIN_PLUGINS) {
    if (!existingIds.has(b.id)) {
      existing.push({ ...b, installedAt: Date.now(), enabled: true, builtin: true });
      changed = true;
    } else {
      // Refresh built-in code/manifest in case we ship updates
      const idx = existing.findIndex((p) => p.id === b.id);
      if (existing[idx].builtin) {
        existing[idx] = { ...existing[idx], ...b, builtin: true };
        changed = true;
      }
    }
  }
  if (changed) write(existing);
  return existing;
}

export function listPlugins(): InstalledPlugin[] {
  return read();
}

export function installPlugin(manifest: PluginManifest): InstalledPlugin {
  const list = read();
  if (list.some((p) => p.id === manifest.id)) {
    throw new Error(`Plugin ${manifest.id} already installed`);
  }
  const plugin: InstalledPlugin = {
    ...manifest,
    installedAt: Date.now(),
    enabled: true,
    builtin: false,
  };
  list.push(plugin);
  write(list);
  return plugin;
}

export function uninstallPlugin(id: string) {
  const list = read().filter((p) => p.id !== id || p.builtin);
  write(list);
}

export function togglePlugin(id: string, enabled: boolean) {
  const list = read();
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) {
    list[idx].enabled = enabled;
    write(list);
  }
}

export function getPlugin(id: string): InstalledPlugin | undefined {
  return read().find((p) => p.id === id);
}
