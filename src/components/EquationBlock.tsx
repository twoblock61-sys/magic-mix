import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EquationBlockProps {
  content: string;
  onChange: (content: string) => void;
}

const EquationBlock = ({ content, onChange }: EquationBlockProps) => {
  const [isEditing, setIsEditing] = useState(true);
  const [copiedFormula, setCopiedFormula] = useState(false);

  const renderLatex = (latex: string): string => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        strict: false,
      });
    } catch {
      return "";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const insertFormula = (formula: string) => {
    onChange(formula);
    setIsEditing(true);
  };

  const commonFormulas = [
    { name: "Quadratic", formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
    { name: "Pythagorean", formula: "a^2 + b^2 = c^2" },
    { name: "Distance", formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" },
    { name: "Circle", formula: "A = \\pi r^2" },
    { name: "Euler", formula: "e^{i\\pi} + 1 = 0" },
    { name: "Integral", formula: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}" },
  ];

  const hasValidLatex = content.trim().length > 0;
  const renderedLatex = renderLatex(content);

  return (
    <div className="py-2 space-y-2">
      {/* Quick Formula Buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {commonFormulas.map((formula) => (
          <button
            key={formula.name}
            onClick={() => insertFormula(formula.formula)}
            className="px-2 py-1.5 text-[11px] font-medium bg-muted/50 hover:bg-primary/20 hover:text-primary rounded transition-colors border border-transparent hover:border-primary/30"
          >
            {formula.name}
          </button>
        ))}
      </div>

      {/* Editor/Preview Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-muted/30 rounded-lg p-1">
          <button
            onClick={() => setIsEditing(true)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              isEditing
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              !isEditing
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>
        {content && (
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="Copy LaTeX"
          >
            {copiedFormula ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Editor/Preview Content */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-muted/30 rounded-lg border border-border p-3"
          >
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
              className="w-full h-[80px] bg-transparent outline-none resize-none font-mono text-sm placeholder:text-muted-foreground/50"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-center min-h-[80px]"
          >
            {hasValidLatex && renderedLatex ? (
              <div
                dangerouslySetInnerHTML={{ __html: renderedLatex }}
                className="text-center"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Enter a formula to see preview</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquationBlock;
