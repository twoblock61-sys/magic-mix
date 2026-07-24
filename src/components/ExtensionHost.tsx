import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { InstalledPlugin } from "@/lib/plugins/types";

interface Props {
  plugin: InstalledPlugin;
  onFrameRef?: (win: Window | null) => void;
  height?: number;
}

/** Renders a UI plugin inside a sandboxed iframe. */
const ExtensionHost = ({ plugin, onFrameRef, height = 320 }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onFrameRef?.(iframeRef.current?.contentWindow ?? null);
    return () => onFrameRef?.(null);
  }, [plugin.id, onFrameRef]);

  if (plugin.kind !== "ui") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 bg-muted/40 rounded-xl">
        <AlertTriangle className="w-4 h-4" />
        This is a headless plugin — run it from the Plugins page.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
        Plugin failed to load: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden ring-1 ring-border/60 bg-background shadow-sm"
      style={{ height }}
    >
      <iframe
        ref={iframeRef}
        title={plugin.name}
        sandbox="allow-scripts"
        srcDoc={plugin.entry}
        onError={() => setError("Load error")}
        className="w-full h-full block border-0 bg-transparent"
      />
    </motion.div>
  );
};

export default ExtensionHost;
