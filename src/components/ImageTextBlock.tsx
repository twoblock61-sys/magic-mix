import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, ArrowLeftRight, ZoomIn, Trash2, Upload } from "lucide-react";

interface ImageTextBlockProps {
  imageUrl: string;
  title: string;
  description: string;
  layout: "imageLeft" | "imageRight";
  onUpdate: (updates: {
    imageTextUrl?: string;
    imageTextTitle?: string;
    imageTextDescription?: string;
    imageTextLayout?: "imageLeft" | "imageRight";
  }) => void;
  onOpenLightbox?: (images: { url: string }[], index: number) => void;
}

const ImageTextBlock = ({ imageUrl, title, description, layout, onUpdate, onOpenLightbox }: ImageTextBlockProps) => {
  const [hoverImage, setHoverImage] = useState(false);
  const [hoverCard, setHoverCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLeft = layout === "imageLeft";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const text = e.dataTransfer.getData("text");
    if (text) onUpdate({ imageTextUrl: text });
  };

  return (
    <div className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-2xl overflow-hidden bg-card border border-border/20 shadow-sm hover:shadow-lg transition-shadow duration-500"
        onMouseEnter={() => setHoverCard(true)}
        onMouseLeave={() => setHoverCard(false)}
      >
        <div className={`flex flex-col sm:flex-row ${!isLeft ? "sm:flex-row-reverse" : ""} min-h-[220px]`}>
          {/* Image side */}
          <div
            className="sm:w-[45%] relative overflow-hidden bg-muted/30"
            onMouseEnter={() => setHoverImage(true)}
            onMouseLeave={() => setHoverImage(false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imageUrl ? (
              <>
                <motion.img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover min-h-[220px] cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onClick={() => onOpenLightbox?.([{ url: imageUrl }], 0)}
                />
                {/* Hover overlay with actions */}
                <AnimatePresence>
                  {hoverImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-3"
                    >
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.05 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLightbox?.([{ url: imageUrl }], 0);
                        }}
                        className="p-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/10 transition-colors"
                        title="View full size"
                      >
                        <ZoomIn className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdate({ imageTextUrl: "" });
                        }}
                        className="p-3 rounded-xl bg-white/15 hover:bg-red-500/60 backdrop-blur-md border border-white/10 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                className={`flex flex-col items-center justify-center h-full min-h-[220px] p-8 transition-colors duration-300 cursor-pointer ${
                  isDragging
                    ? "bg-primary/10 border-2 border-dashed border-primary/40"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => inputRef.current?.focus()}
                whileHover={{ scale: 1.01 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4"
                  animate={isDragging ? { scale: 1.1, rotate: 5 } : {}}
                >
                  {isDragging ? (
                    <Upload className="w-7 h-7 text-primary" />
                  ) : (
                    <ImagePlus className="w-7 h-7 text-muted-foreground/40" />
                  )}
                </motion.div>
                <p className="text-sm text-muted-foreground/50 mb-3 font-medium">
                  {isDragging ? "Drop image here" : "Add an image"}
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Paste image URL…"
                  className="text-xs text-center bg-muted/40 rounded-lg px-4 py-2 outline-none text-muted-foreground placeholder:text-muted-foreground/30 w-full max-w-[220px] focus:ring-2 focus:ring-primary/20 transition-all"
                  onBlur={(e) => {
                    if (e.target.value) onUpdate({ imageTextUrl: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdate({ imageTextUrl: (e.target as HTMLInputElement).value });
                    }
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Text side */}
          <div className="sm:w-[55%] p-8 flex flex-col justify-center relative">
            {/* Subtle accent line */}
            <div className={`absolute top-8 ${isLeft ? "left-8" : "right-8"} w-10 h-1 rounded-full bg-primary/20`} />

            <input
              value={title}
              onChange={(e) => onUpdate({ imageTextTitle: e.target.value })}
              className="w-full bg-transparent outline-none text-2xl font-bold text-foreground tracking-tight placeholder:text-muted-foreground/25 mb-3 mt-4"
              placeholder="Add a title…"
            />
            <textarea
              value={description}
              onChange={(e) => onUpdate({ imageTextDescription: e.target.value })}
              className="w-full bg-transparent outline-none text-[15px] text-muted-foreground leading-relaxed resize-none placeholder:text-muted-foreground/20"
              placeholder="Write your content here…"
              rows={4}
            />
          </div>
        </div>

        {/* Layout toggle - floating pill */}
        <AnimatePresence>
          {hoverCard && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-3 right-3"
            >
              <motion.button
                onClick={() =>
                  onUpdate({ imageTextLayout: isLeft ? "imageRight" : "imageLeft" })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/40 text-muted-foreground hover:text-foreground transition-all shadow-md text-xs font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftRight className="w-3 h-3" />
                Swap
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ImageTextBlock;
