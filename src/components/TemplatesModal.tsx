import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { templates, Template } from "@/data/templates";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplatesModal = ({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplatesModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-3xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">Choose a Template</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Start with a pre-designed template to boost your productivity
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <motion.button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="text-left group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`bg-gradient-to-br ${template.color} border border-border/50 rounded-xl p-5 h-full transition-all group-hover:border-primary/50 group-hover:shadow-lg`}>
                      {/* Icon */}
                      <div className="text-3xl mb-3">{template.icon}</div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>

                      {/* Block Preview */}
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(template.blocks.map((b) => b.type))]
                          .slice(0, 5)
                          .map((blockType) => (
                            <span
                              key={blockType}
                              className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-full"
                            >
                              {blockType === "heading1"
                                ? "H1"
                                : blockType === "heading2"
                                ? "H2"
                                : blockType === "heading3"
                                ? "H3"
                                : blockType.charAt(0).toUpperCase() +
                                  blockType.slice(1)}
                            </span>
                          ))}
                        {template.blocks.length > 5 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{template.blocks.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground">
                You can edit or customize the template after selecting it
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TemplatesModal;
