import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, ArrowLeftRight } from "lucide-react";

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
}

const ImageTextBlock = ({ imageUrl, title, description, layout, onUpdate }: ImageTextBlockProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const isLeft = layout === "imageLeft";

  return (
    <div className="py-3">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden group"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        <div className={`flex flex-col sm:flex-row ${!isLeft ? "sm:flex-row-reverse" : ""} min-h-[180px]`}>
          {/* Image side */}
          <div className="sm:w-2/5 bg-muted/40 flex items-center justify-center relative min-h-[140px]">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 p-6">
                <ImagePlus className="w-8 h-8 text-muted-foreground/30" />
                <input
                  type="text"
                  placeholder="Paste image URL…"
                  className="text-xs text-center bg-transparent outline-none text-muted-foreground placeholder:text-muted-foreground/30 w-full max-w-[200px]"
                  onBlur={(e) => {
                    if (e.target.value) onUpdate({ imageTextUrl: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdate({ imageTextUrl: (e.target as HTMLInputElement).value });
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Text side */}
          <div className="sm:w-3/5 p-6 flex flex-col justify-center">
            <input
              value={title}
              onChange={(e) => onUpdate({ imageTextTitle: e.target.value })}
              className="w-full bg-transparent outline-none text-xl font-bold text-foreground tracking-tight placeholder:text-muted-foreground/30 mb-2"
              placeholder="Title…"
            />
            <textarea
              value={description}
              onChange={(e) => onUpdate({ imageTextDescription: e.target.value })}
              className="w-full bg-transparent outline-none text-sm text-muted-foreground leading-relaxed resize-none placeholder:text-muted-foreground/25"
              placeholder="Write your content here…"
              rows={3}
            />
          </div>
        </div>

        {/* Layout toggle */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2"
            >
              <motion.button
                onClick={() =>
                  onUpdate({ imageTextLayout: isLeft ? "imageRight" : "imageLeft" })
                }
                className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/40 text-muted-foreground hover:text-foreground transition-all shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Swap layout"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ImageTextBlock;
