import { InstalledPlugin } from "./types";

/**
 * Execute a headless plugin in a Web Worker.
 * The worker imports the plugin as an ES module via a Blob URL and calls `run(input)`.
 * Worker is terminated after completion or timeout.
 */
export function runHeadless(plugin: InstalledPlugin, input: unknown, timeoutMs = 5000): Promise<unknown> {
  if (plugin.kind !== "headless") return Promise.reject(new Error("Not a headless plugin"));

  const moduleBlob = new Blob([plugin.entry], { type: "text/javascript" });
  const moduleUrl = URL.createObjectURL(moduleBlob);

  const workerCode = `
    import('${moduleUrl}').then(async (mod) => {
      try {
        if (typeof mod.run !== 'function') throw new Error('Plugin has no exported run() function');
        const result = await mod.run(${JSON.stringify(input)});
        self.postMessage({ ok: true, data: result });
      } catch (e) {
        self.postMessage({ ok: false, error: e.message || String(e) });
      }
    }).catch((e) => self.postMessage({ ok: false, error: e.message || String(e) }));
  `;
  const workerBlob = new Blob([workerCode], { type: "text/javascript" });
  const workerUrl = URL.createObjectURL(workerBlob);
  const worker = new Worker(workerUrl, { type: "module" });

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      URL.revokeObjectURL(moduleUrl);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Plugin timed out"));
    }, timeoutMs);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      cleanup();
      if (e.data?.ok) resolve(e.data.data);
      else reject(new Error(e.data?.error || "Plugin error"));
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      cleanup();
      reject(new Error(e.message || "Worker error"));
    };
  });
}
