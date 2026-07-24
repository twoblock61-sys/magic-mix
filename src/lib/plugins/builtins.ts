import { PluginManifest } from "./types";

/** Shared boilerplate injected into every UI plugin so it can talk to the host. */
const BRIDGE_JS = `
<script>
  const pending = new Map();
  let seq = 0;
  window.host = {
    call(action, payload) {
      return new Promise((resolve, reject) => {
        const id = 'r' + (++seq) + '-' + Date.now();
        pending.set(id, { resolve, reject });
        window.parent.postMessage({ __plugin: true, id, action, payload }, '*');
        setTimeout(() => {
          if (pending.has(id)) { pending.delete(id); reject(new Error('timeout')); }
        }, 8000);
      });
    }
  };
  window.addEventListener('message', (e) => {
    const msg = e.data;
    if (!msg || !msg.__plugin || !msg.id) return;
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.ok) p.resolve(msg.data); else p.reject(new Error(msg.error || 'error'));
  });
<\/script>
`;

const BASE_STYLES = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
    background: #fafafa; color: #1c1c1e;
    -webkit-font-smoothing: antialiased;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #1c1c1e; color: #f5f5f7; }
  }
  button {
    font: inherit; cursor: pointer; border: none;
    background: #007aff; color: white; padding: 8px 14px; border-radius: 10px;
    font-weight: 500; transition: transform .12s ease, filter .12s ease;
  }
  button:hover { filter: brightness(1.05); }
  button:active { transform: scale(0.97); }
  .card {
    background: rgba(255,255,255,.7); backdrop-filter: blur(20px);
    border-radius: 18px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.05);
  }
  @media (prefers-color-scheme: dark) {
    .card { background: rgba(44,44,46,.7); }
  }
`;

const wrap = (title: string, body: string, extraStyle = "") => `<!doctype html>
<html><head><meta charset="utf-8"/><title>${title}</title>
<style>${BASE_STYLES}${extraStyle}</style>
${BRIDGE_JS}
</head><body>${body}</body></html>`;

// ─────────── Pomodoro Timer (UI) ───────────
const pomodoro = wrap(
  "Pomodoro",
  `
  <div class="card" style="text-align:center;">
    <div style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;opacity:.6;">Focus</div>
    <div id="time" style="font-size:64px;font-weight:600;letter-spacing:-.03em;margin:8px 0 16px;">25:00</div>
    <div style="display:flex;gap:8px;justify-content:center;">
      <button id="start">Start</button>
      <button id="reset" style="background:rgba(0,0,0,.08);color:inherit;">Reset</button>
    </div>
    <div style="margin-top:16px;display:flex;gap:6px;justify-content:center;">
      <button data-min="25" class="preset">25</button>
      <button data-min="15" class="preset">15</button>
      <button data-min="5" class="preset">5</button>
    </div>
  </div>
  <script>
    let total = 25*60, remaining = total, running = false, tick;
    const el = document.getElementById('time');
    const fmt = s => String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    const render = () => el.textContent = fmt(remaining);
    document.getElementById('start').onclick = () => {
      running = !running;
      document.getElementById('start').textContent = running ? 'Pause' : 'Start';
      if (running) tick = setInterval(() => {
        remaining--; render();
        if (remaining <= 0) {
          clearInterval(tick); running = false;
          document.getElementById('start').textContent = 'Start';
          host.call('ui:notify', { message: 'Pomodoro complete!', variant: 'success' }).catch(()=>{});
          remaining = total; render();
        }
      }, 1000);
      else clearInterval(tick);
    };
    document.getElementById('reset').onclick = () => { clearInterval(tick); running=false; remaining=total; render(); document.getElementById('start').textContent='Start'; };
    document.querySelectorAll('.preset').forEach(b => b.onclick = () => { total = +b.dataset.min*60; remaining = total; render(); });
    document.querySelectorAll('.preset').forEach(b => b.style.cssText='background:rgba(0,0,0,.08);color:inherit;padding:6px 12px;font-size:12px;');
  <\/script>
  `
);

// ─────────── Theme Switcher (UI) ───────────
const themeSwitcher = wrap(
  "Theme",
  `
  <div class="card">
    <div style="font-size:13px;opacity:.6;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Appearance</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
      <button data-mode="light" class="opt">☀️ Light</button>
      <button data-mode="dark" class="opt">🌙 Dark</button>
      <button data-mode="system" class="opt">✨ Auto</button>
    </div>
  </div>
  <script>
    document.querySelectorAll('.opt').forEach(b => {
      b.style.cssText = 'background:rgba(0,0,0,.06);color:inherit;padding:14px 8px;border-radius:14px;font-size:13px;';
      b.onclick = () => host.call('ui:theme', { mode: b.dataset.mode })
        .then(() => host.call('ui:notify', { message: 'Theme: ' + b.dataset.mode, variant: 'info' }))
        .catch(err => host.call('ui:notify', { message: err.message, variant: 'error' }));
    });
  <\/script>
  `
);

// ─────────── Quote of the Day (UI, net:fetch + browser:open) ───────────
const quoteOfDay = wrap(
  "Quote",
  `
  <div class="card">
    <div id="q" style="font-size:18px;line-height:1.5;font-weight:500;letter-spacing:-.01em;">Loading…</div>
    <div id="a" style="margin-top:10px;opacity:.6;font-size:13px;"></div>
    <div style="margin-top:16px;display:flex;gap:8px;">
      <button id="refresh">New Quote</button>
      <button id="search" style="background:rgba(0,0,0,.08);color:inherit;">Search Web</button>
    </div>
  </div>
  <script>
    const quotes = [
      { q: "Simplicity is the ultimate sophistication.", a: "Leonardo da Vinci" },
      { q: "Design is not just what it looks like. Design is how it works.", a: "Steve Jobs" },
      { q: "The details are not the details. They make the design.", a: "Charles Eames" },
      { q: "Make it work, make it right, make it fast.", a: "Kent Beck" },
      { q: "Perfection is achieved when nothing more can be taken away.", a: "Antoine de Saint-Exupéry" },
    ];
    const render = () => {
      const q = quotes[Math.floor(Math.random()*quotes.length)];
      document.getElementById('q').textContent = '"' + q.q + '"';
      document.getElementById('a').textContent = '— ' + q.a;
      window.__current = q;
    };
    render();
    document.getElementById('refresh').onclick = render;
    document.getElementById('search').onclick = () =>
      host.call('browser:open', { url: 'https://www.google.com/search?q=' + encodeURIComponent(window.__current.a) });
  <\/script>
  `
);

// ─────────── Note Stats (UI, notes:read) ───────────
const noteStats = wrap(
  "Note Stats",
  `
  <div class="card">
    <div style="font-size:13px;opacity:.6;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Active Note</div>
    <div id="title" style="font-size:16px;font-weight:600;margin-bottom:16px;">—</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <div><div id="w" style="font-size:24px;font-weight:600;">0</div><div style="opacity:.6;font-size:12px;">Words</div></div>
      <div><div id="c" style="font-size:24px;font-weight:600;">0</div><div style="opacity:.6;font-size:12px;">Chars</div></div>
      <div><div id="b" style="font-size:24px;font-weight:600;">0</div><div style="opacity:.6;font-size:12px;">Blocks</div></div>
    </div>
    <button id="r" style="margin-top:16px;background:rgba(0,0,0,.08);color:inherit;width:100%;">Refresh</button>
  </div>
  <script>
    async function load() {
      try {
        const note = await host.call('notes:read', { scope: 'active' });
        if (!note) { document.getElementById('title').textContent = 'No note open'; return; }
        document.getElementById('title').textContent = note.title || 'Untitled';
        const text = (note.blocks||[]).map(b => b.content||'').join(' ');
        document.getElementById('w').textContent = text.trim().split(/\\s+/).filter(Boolean).length;
        document.getElementById('c').textContent = text.length;
        document.getElementById('b').textContent = (note.blocks||[]).length;
      } catch(e) { document.getElementById('title').textContent = e.message; }
    }
    document.getElementById('r').onclick = load;
    load();
  <\/script>
  `
);

// ─────────── Headless: Markdown Cleanup ───────────
const markdownCleanup = `
export function run(input) {
  const text = String(input?.text || '');
  return text
    .replace(/\\r\\n/g, '\\n')
    .replace(/[ \\t]+$/gm, '')
    .replace(/\\n{3,}/g, '\\n\\n')
    .replace(/^\\s*[-*]\\s+/gm, '- ')
    .trim();
}
`;

// ─────────── Headless: Word Counter ───────────
const wordCounter = `
export function run(input) {
  const text = String(input?.text || '');
  const words = text.trim().split(/\\s+/).filter(Boolean).length;
  const chars = text.length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingMinutes };
}
`;

export const BUILTIN_PLUGINS: PluginManifest[] = [
  {
    id: "com.elephant.pomodoro",
    name: "Pomodoro Timer",
    version: "1.0.0",
    description: "Classic focus timer with break intervals.",
    icon: "🍅",
    kind: "ui",
    permissions: ["ui:notify"],
    entry: pomodoro,
    color: "from-rose-500 to-orange-500",
    builtin: true,
  },
  {
    id: "com.elephant.theme",
    name: "Theme Switcher",
    version: "1.0.0",
    description: "Toggle light, dark, and system appearance.",
    icon: "🎨",
    kind: "ui",
    permissions: ["ui:theme", "ui:notify"],
    entry: themeSwitcher,
    color: "from-indigo-500 to-purple-500",
    builtin: true,
  },
  {
    id: "com.elephant.quote",
    name: "Daily Quote",
    version: "1.0.0",
    description: "Inspirational quotes with one-tap web search.",
    icon: "💬",
    kind: "ui",
    permissions: ["browser:open"],
    entry: quoteOfDay,
    color: "from-amber-500 to-pink-500",
    builtin: true,
  },
  {
    id: "com.elephant.stats",
    name: "Note Stats",
    version: "1.0.0",
    description: "Word, character, and block counts for the active note.",
    icon: "📊",
    kind: "ui",
    permissions: ["notes:read"],
    entry: noteStats,
    color: "from-teal-500 to-emerald-500",
    builtin: true,
  },
  {
    id: "com.elephant.markdown-cleanup",
    name: "Markdown Cleanup",
    version: "1.0.0",
    description: "Normalize whitespace, list markers, and line breaks.",
    icon: "✨",
    kind: "headless",
    permissions: [],
    entry: markdownCleanup,
    color: "from-slate-500 to-slate-700",
    builtin: true,
  },
  {
    id: "com.elephant.word-counter",
    name: "Word Counter",
    version: "1.0.0",
    description: "Compute words, characters, and reading time.",
    icon: "🔢",
    kind: "headless",
    permissions: [],
    entry: wordCounter,
    color: "from-blue-500 to-cyan-500",
    builtin: true,
  },
];
