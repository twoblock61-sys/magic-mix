export type PluginPermission =
  | "notes:read"
  | "notes:write"
  | "ui:notify"
  | "ui:theme"
  | "storage:local"
  | "browser:open"
  | "net:fetch";

export type PluginKind = "ui" | "headless";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  icon?: string; // emoji
  kind: PluginKind;
  permissions: PluginPermission[];
  // UI: raw self-contained HTML. Headless: raw JS body exposing `run(input)`.
  entry: string;
  color?: string; // tailwind gradient/accent hint
  builtin?: boolean;
}

export interface InstalledPlugin extends PluginManifest {
  installedAt: number;
  enabled: boolean;
}

export interface BridgeRequest {
  __plugin: true;
  id: string;
  action: string;
  payload?: unknown;
}

export interface BridgeResponse {
  __plugin: true;
  id: string;
  ok: boolean;
  data?: unknown;
  error?: string;
}
