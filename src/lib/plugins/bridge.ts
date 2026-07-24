import { InstalledPlugin, PluginPermission } from "./types";
import { toast } from "@/hooks/use-toast";

export interface HostContext {
  getActiveNote?: () => unknown;
  getAllNotes?: () => unknown[];
  createNote?: (data: { title?: string; content?: string }) => unknown;
  setTheme?: (mode: "light" | "dark" | "system") => void;
}

interface Handler {
  perm: PluginPermission | null;
  run: (payload: any, ctx: HostContext, plugin: InstalledPlugin) => Promise<any> | any;
}

const HANDLERS: Record<string, Handler> = {
  "notes:read": {
    perm: "notes:read",
    run: (payload, ctx) => {
      if (payload?.scope === "all") return ctx.getAllNotes?.() ?? [];
      return ctx.getActiveNote?.() ?? null;
    },
  },
  "notes:write": {
    perm: "notes:write",
    run: (payload, ctx) => ctx.createNote?.(payload || {}),
  },
  "ui:notify": {
    perm: "ui:notify",
    run: (payload) => {
      toast({
        title: payload?.title ?? "Plugin",
        description: String(payload?.message ?? ""),
        variant: payload?.variant === "error" ? "destructive" : "default",
      });
      return { ok: true };
    },
  },
  "ui:theme": {
    perm: "ui:theme",
    run: (payload, ctx) => {
      ctx.setTheme?.(payload?.mode || "system");
      return { ok: true };
    },
  },
  "storage:local": {
    perm: "storage:local",
    run: (payload, _ctx, plugin) => {
      const key = `elephant.plugin.${plugin.id}.kv`;
      const store = JSON.parse(localStorage.getItem(key) || "{}");
      if (payload?.op === "get") return { value: store[payload.key] ?? null };
      if (payload?.op === "set") {
        store[payload.key] = payload.value;
        localStorage.setItem(key, JSON.stringify(store));
        return { ok: true };
      }
      if (payload?.op === "delete") {
        delete store[payload.key];
        localStorage.setItem(key, JSON.stringify(store));
        return { ok: true };
      }
      throw new Error("Unknown storage op");
    },
  },
  "browser:open": {
    perm: "browser:open",
    run: (payload) => {
      const url = String(payload?.url || "");
      if (!/^https?:\/\//i.test(url)) throw new Error("Only http(s) URLs allowed");
      window.open(url, "_blank", "noopener,noreferrer");
      return { ok: true };
    },
  },
  "net:fetch": {
    perm: "net:fetch",
    run: async (payload) => {
      const url = String(payload?.url || "");
      if (!/^https:\/\//i.test(url)) throw new Error("Only https URLs allowed");
      const res = await fetch(url, {
        method: payload?.method || "GET",
        headers: payload?.headers || {},
        body: payload?.body,
      });
      const text = await res.text();
      return { status: res.status, body: text };
    },
  },
};

/** Install the global bridge listener. Call once, at app root. */
export function installBridge(
  resolvePlugin: (source: MessageEventSource | null) => InstalledPlugin | null,
  ctx: HostContext
) {
  const listener = async (e: MessageEvent) => {
    const msg = e.data;
    if (!msg || msg.__plugin !== true || !msg.id || !msg.action) return;

    const plugin = resolvePlugin(e.source);
    const respond = (ok: boolean, data?: unknown, error?: string) => {
      (e.source as Window | null)?.postMessage(
        { __plugin: true, id: msg.id, ok, data, error },
        { targetOrigin: "*" }
      );
    };

    if (!plugin) return respond(false, undefined, "Unknown plugin");
    if (!plugin.enabled) return respond(false, undefined, "Plugin disabled");

    const handler = HANDLERS[msg.action];
    if (!handler) return respond(false, undefined, `Unknown action: ${msg.action}`);
    if (handler.perm && !plugin.permissions.includes(handler.perm)) {
      return respond(false, undefined, `Permission denied: ${handler.perm}`);
    }
    try {
      const data = await handler.run(msg.payload, ctx, plugin);
      respond(true, data);
    } catch (err: any) {
      respond(false, undefined, err?.message || "Error");
    }
  };

  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
