import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Paperclip, ExternalLink, FileText, Image, Film, Music, 
  File, Trash2, Download, Eye, EyeOff, AlertTriangle, 
  Link2, ChevronDown, ChevronUp
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

const getFileColor = (type: FileType) => {
  switch (type) {
    case "pdf": return "text-red-500 bg-red-500/10";
    case "image": return "text-blue-500 bg-blue-500/10";
    case "video": return "text-purple-500 bg-purple-500/10";
    case "audio": return "text-orange-500 bg-orange-500/10";
    case "document": return "text-emerald-500 bg-emerald-500/10";
    default: return "text-muted-foreground bg-muted";
  }
};

const FileBlock = ({ fileUrl, fileName, onUpdate }: FileBlockProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hover, setHover] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const fileType = fileUrl ? detectFileType(fileUrl) : "unknown";
  const Icon = getFileIcon(fileType);
  const colorClass = getFileColor(fileType);

  const handleSubmitUrl = useCallback((url: string) => {
    if (!url.trim()) return;
    const name = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "File");
    onUpdate({ fileUrl: url.trim(), fileName: name });
    setInputUrl("");
    setPdfError(false);
    setImageError(false);
  }, [onUpdate]);

  const renderPreview = () => {
    if (!showPreview) return null;

    switch (fileType) {
      case "pdf":
        if (pdfError) {
          return (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 rounded-xl border border-border bg-muted/20 p-6 flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-foreground">PDF preview unavailable</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                This PDF doesn't allow embedding. You can still open it in a new tab.
              </p>
              <motion.a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in new tab
              </motion.a>
            </motion.div>
          );
        }
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 rounded-xl overflow-hidden border border-border bg-muted/10"
          >
            <iframe
              src={fileUrl}
              className="w-full h-[500px] rounded-xl"
              title={fileName}
              onError={() => setPdfError(true)}
              onLoad={(e) => {
                try {
                  const iframe = e.target as HTMLIFrameElement;
                  // If we can't access contentDocument, it's cross-origin (blocked)
                  if (iframe.contentDocument === null && iframe.contentWindow === null) {
                    setPdfError(true);
                  }
                } catch {
                  // Cross-origin error means PDF loaded but we can't access it — that's fine
                }
              }}
            />
          </motion.div>
        );

      case "image":
        if (imageError) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 rounded-xl border border-border bg-muted/20 p-6 flex flex-col items-center gap-2"
            >
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <p className="text-xs text-muted-foreground">Image failed to load</p>
            </motion.div>
          );
        }
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 rounded-xl overflow-hidden border border-border"
          >
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full max-h-[400px] object-contain bg-muted/20"
              onError={() => setImageError(true)}
            />
          </motion.div>
        );

      case "video":
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 rounded-xl overflow-hidden border border-border bg-black"
          >
            <video
              src={fileUrl}
              controls
              className="w-full max-h-[400px]"
              preload="metadata"
            />
          </motion.div>
        );

      case "audio":
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 rounded-xl border border-border bg-muted/10 p-4"
          >
            <audio src={fileUrl} controls className="w-full" preload="metadata" />
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 rounded-xl border border-border bg-muted/10 p-5 flex flex-col items-center gap-2"
          >
            <File className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Preview not available for this file type
            </p>
            <motion.a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
              whileHover={{ scale: 1.03 }}
            >
              <ExternalLink className="w-3 h-3" />
              Open file
            </motion.a>
          </motion.div>
        );
    }
  };

  // Empty state — URL input
  if (!fileUrl) {
    return (
      <div className="py-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-muted-foreground/15 bg-muted/5 p-8 flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center mb-4">
            <Link2 className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-muted-foreground/60 mb-4">
            Attach a file link
          </p>
          <div className="w-full max-w-sm relative">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste file URL and press Enter…"
              className="w-full px-4 py-2.5 bg-muted/30 rounded-xl outline-none text-sm text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitUrl(inputUrl);
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Filled state — file card + preview
  return (
    <div className="py-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* File header */}
        <div className="flex items-center gap-3.5 p-4">
          <div className={`p-3 rounded-xl ${colorClass} flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[15px] text-foreground truncate tracking-tight">
              {fileName || "Attached file"}
            </p>
            <p className="text-xs text-muted-foreground/60 truncate mt-0.5 font-mono">
              {fileUrl}
            </p>
          </div>

          {/* Actions */}
          <AnimatePresence>
            {hover && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-1"
              >
                <motion.button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
                <motion.a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
                <motion.button
                  onClick={() => {
                    onUpdate({ fileUrl: "", fileName: "" });
                    setPdfError(false);
                    setImageError(false);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle preview bar */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-muted/20 hover:bg-muted/40 text-xs text-muted-foreground font-medium transition-colors border-t border-border/30"
        >
          {showPreview ? (
            <>
              <ChevronUp className="w-3 h-3" /> Hide preview
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Show preview
            </>
          )}
        </button>

        {/* Preview area */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="px-4 pb-4 overflow-hidden"
            >
              {renderPreview()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FileBlock;
