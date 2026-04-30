import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, FileText, Image, Film, Music, 
  File, Trash2, Eye, EyeOff, AlertTriangle, 
  Link2, ChevronDown, ChevronUp, Sparkles, Globe, Upload, HardDrive
} from "lucide-react";

interface FileBlockProps {
  fileUrl: string;
  fileName: string;
  onUpdate: (updates: { fileUrl?: string; fileName?: string }) => void;
}

type FileType = "pdf" | "image" | "video" | "audio" | "document" | "unknown";

const detectFileType = (url: string): FileType => {
  const lower = url.toLowerCase();
  if (/\.(pdf)(\?|$)/.test(lower)) return "pdf";
  if (/\.(jpe?g|png|gif|webp|svg|bmp|ico)(\?|$)/.test(lower)) return "image";
  if (/\.(mp4|webm|ogg|mov)(\?|$)/.test(lower)) return "video";
  if (/\.(mp3|wav|ogg|flac|aac|m4a)(\?|$)/.test(lower)) return "audio";
  if (/\.(docx?|xlsx?|pptx?|csv|txt|md|rtf)(\?|$)/.test(lower)) return "document";
  return "unknown";
};

const getFileIcon = (type: FileType) => {
  switch (type) {
    case "pdf": return FileText;
    case "image": return Image;
    case "video": return Film;
    case "audio": return Music;
    case "document": return FileText;
    default: return File;
  }
};

const getFileAccent = (type: FileType) => {
  switch (type) {
    case "pdf": return { bg: "bg-destructive/8", text: "text-destructive", ring: "ring-destructive/20", gradient: "from-destructive/10 to-destructive/5" };
    case "image": return { bg: "bg-primary/8", text: "text-primary", ring: "ring-primary/20", gradient: "from-primary/10 to-primary/5" };
    case "video": return { bg: "bg-accent/30", text: "text-accent-foreground", ring: "ring-accent/30", gradient: "from-accent/20 to-accent/10" };
    case "audio": return { bg: "bg-secondary/50", text: "text-secondary-foreground", ring: "ring-secondary/30", gradient: "from-secondary/30 to-secondary/10" };
    case "document": return { bg: "bg-primary/8", text: "text-primary", ring: "ring-primary/20", gradient: "from-primary/10 to-primary/5" };
    default: return { bg: "bg-muted/50", text: "text-muted-foreground", ring: "ring-border", gradient: "from-muted/30 to-muted/10" };
  }
};

const spring = { type: "spring", stiffness: 400, damping: 30 } as const;

const FileBlock = ({ fileUrl, fileName, onUpdate }: FileBlockProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hover, setHover] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localFileSize, setLocalFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLocalFile = fileUrl.startsWith("blob:");
  const fileType = fileUrl ? detectFileType(fileUrl || fileName) : "unknown";
  const Icon = getFileIcon(fileType);
  const accent = getFileAccent(fileType);

  const handleSubmitUrl = useCallback((url: string) => {
    if (!url.trim()) return;
    const name = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "File");
    onUpdate({ fileUrl: url.trim(), fileName: name });
    setInputUrl("");
    setPdfError(false);
    setImageError(false);
  }, [onUpdate]);

  const handleLocalFile = useCallback((file: File) => {
    const blobUrl = URL.createObjectURL(file);
    onUpdate({ fileUrl: blobUrl, fileName: file.name });
    setLocalFileSize(file.size);
    setPdfError(false);
    setImageError(false);
  }, [onUpdate]);

  const handleFilePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLocalFile(file);
    e.target.value = "";
  }, [handleLocalFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLocalFile(file);
  }, [handleLocalFile]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    if (fileType === "image" && !imageError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="rounded-2xl overflow-hidden bg-muted/10"
        >
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full max-h-[420px] object-contain"
            onError={() => setImageError(true)}
          />
        </motion.div>
      );
    }

    if (fileType === "image" && imageError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-muted/10 p-8 flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground/60 font-medium">Image couldn't be loaded</p>
        </motion.div>
      );
    }

    if (fileType === "audio") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className={`rounded-2xl bg-gradient-to-b ${accent.gradient} p-5 backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center`}>
              <Music className={`w-4.5 h-4.5 ${accent.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{fileName || "Audio"}</p>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5">Audio file</p>
            </div>
          </div>
          <audio src={fileUrl} controls className="w-full h-10 rounded-lg" preload="metadata" />
        </motion.div>
      );
    }

    // Iframe fallback error
    if (pdfError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="rounded-2xl bg-gradient-to-b from-muted/15 to-muted/5 p-10 flex flex-col items-center gap-4"
        >
          <motion.div
            className="w-16 h-16 rounded-[20px] bg-muted/20 flex items-center justify-center"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <AlertTriangle className="w-7 h-7 text-muted-foreground/40" />
          </motion.div>
          <div className="text-center space-y-1.5">
            <p className="text-[15px] font-semibold text-foreground tracking-tight">
              Preview unavailable
            </p>
            <p className="text-[13px] text-muted-foreground/50 max-w-[260px] leading-relaxed">
              This file doesn't support inline embedding
            </p>
          </div>
          <motion.a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-[13px] font-semibold tracking-tight hover:opacity-90 transition-all shadow-lg shadow-foreground/10"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in browser
          </motion.a>
        </motion.div>
      );
    }

    // Universal iframe preview
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        className="rounded-2xl overflow-hidden ring-1 ring-border/50 bg-background"
      >
        <iframe
          src={fileUrl}
          className="w-full h-[520px] border-0"
          title={fileName || "File preview"}
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onError={() => setPdfError(true)}
          onLoad={(e) => {
            try {
              const iframe = e.target as HTMLIFrameElement;
              if (iframe.contentDocument === null && iframe.contentWindow === null) {
                setPdfError(true);
              }
            } catch {
              // Cross-origin — fine
            }
          }}
        />
      </motion.div>
    );
  };

  // ─── Empty state ───
  if (!fileUrl) {
    return (
      <div className="py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative rounded-[20px] border-2 border-dashed transition-all duration-500
            ${isDragging
              ? "border-primary/60 bg-primary/[0.06] shadow-xl shadow-primary/10 scale-[1.01]"
              : inputFocused 
                ? "border-primary/30 bg-primary/[0.02] shadow-lg shadow-primary/5" 
                : "border-border/40 bg-muted/[0.03] hover:border-muted-foreground/20 hover:bg-muted/[0.06]"
            }
            p-10 flex flex-col items-center
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFilePick}
          />

          {/* Decorative glow */}
          <motion.div
            className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-primary/5 to-transparent opacity-0 pointer-events-none"
            animate={{ opacity: inputFocused || isDragging ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            className="relative w-16 h-16 rounded-[18px] bg-gradient-to-b from-muted/40 to-muted/20 flex items-center justify-center mb-5 shadow-sm"
            whileHover={{ scale: 1.05, rotate: -2 }}
            animate={isDragging ? { scale: 1.15, rotate: 6 } : {}}
            transition={spring}
          >
            {isDragging ? (
              <Upload className="w-7 h-7 text-primary" />
            ) : (
              <Link2 className="w-7 h-7 text-muted-foreground/35" />
            )}
          </motion.div>

          <p className="text-[15px] font-semibold text-foreground/70 mb-1.5 tracking-tight">
            {isDragging ? "Drop to upload" : "Attach a file"}
          </p>
          <p className="text-[13px] text-muted-foreground/40 mb-6">
            Drag & drop, choose from device, or paste a URL
          </p>

          <div className="w-full max-w-md relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Globe className={`w-4 h-4 transition-colors duration-300 ${inputFocused ? "text-primary/60" : "text-muted-foreground/25"}`} />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="https://..."
              className={`
                w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none text-[14px] text-foreground 
                placeholder:text-muted-foreground/25 transition-all duration-300
                bg-background/80 backdrop-blur-sm
                ring-1 ${inputFocused ? "ring-primary/30 shadow-md shadow-primary/5" : "ring-border/40"}
              `}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitUrl(inputUrl);
              }}
            />
            <AnimatePresence>
              {inputUrl.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={spring}
                  onClick={() => handleSubmitUrl(inputUrl)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-foreground text-background text-[12px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Embed
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Divider with "or" */}
          <div className="w-full max-w-md flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.15em]">or</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Upload from device */}
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-foreground text-background text-[13px] font-semibold tracking-tight hover:opacity-90 transition-opacity shadow-lg shadow-foreground/10"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <HardDrive className="w-3.5 h-3.5" />
            Upload from device
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── Filled state ───
  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          rounded-[20px] bg-card overflow-hidden transition-all duration-500
          ring-1 ${hover ? "ring-border/60 shadow-xl shadow-foreground/[0.04]" : "ring-border/30 shadow-sm"}
        `}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5">
          <motion.div
            className={`
              w-12 h-12 rounded-[14px] flex-shrink-0 flex items-center justify-center
              bg-gradient-to-b ${accent.gradient} ring-1 ${accent.ring}
            `}
            whileHover={{ scale: 1.08, rotate: -3 }}
            transition={spring}
          >
            <Icon className={`w-5 h-5 ${accent.text}`} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[15px] text-foreground truncate tracking-tight leading-snug">
                {fileName || "Attached file"}
              </p>
              {isLocalFile && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={spring}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                >
                  <HardDrive className="w-2.5 h-2.5" />
                  Local
                </motion.span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/40 truncate mt-1 font-mono leading-none">
              {isLocalFile
                ? `On this device${localFileSize ? ` · ${formatBytes(localFileSize)}` : ""}`
                : fileUrl.length > 60 ? fileUrl.slice(0, 60) + "…" : fileUrl}
            </p>
          </div>

          {/* Actions — always visible on hover */}
          <AnimatePresence>
            {hover && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={spring}
                className="flex items-center gap-0.5"
              >
                {[
                  { 
                    icon: showPreview ? EyeOff : Eye, 
                    label: showPreview ? "Hide" : "Show",
                    onClick: () => setShowPreview(!showPreview),
                    danger: false
                  },
                  { 
                    icon: ExternalLink, 
                    label: "Open",
                    onClick: () => window.open(fileUrl, "_blank"),
                    danger: false
                  },
                  { 
                    icon: Trash2, 
                    label: "Remove",
                    onClick: () => { onUpdate({ fileUrl: "", fileName: "" }); setPdfError(false); setImageError(false); },
                    danger: true
                  },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    onClick={action.onClick}
                    className={`
                      p-2 rounded-xl transition-colors duration-200
                      ${action.danger 
                        ? "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10" 
                        : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    title={action.label}
                  >
                    <action.icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle bar */}
        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] text-muted-foreground/50 font-medium transition-colors hover:text-muted-foreground hover:bg-muted/20 border-t border-border/20"
          whileTap={{ scale: 0.99 }}
        >
          <motion.span
            animate={{ rotate: showPreview ? 180 : 0 }}
            transition={spring}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
          {showPreview ? "Hide preview" : "Show preview"}
        </motion.button>

        {/* Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-2">
                {renderPreview()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FileBlock;
