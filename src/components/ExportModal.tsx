import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, FileCode, FileType, Download, Copy, Check } from "lucide-react";
import { Note, NoteBlock } from "@/contexts/NotesContext";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

type ExportFormat = 'markdown' | 'plaintext' | 'html';

const ExportModal = ({ isOpen, onClose, note }: ExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [copied, setCopied] = useState(false);

  const blockToMarkdown = useCallback((block: NoteBlock): string => {
    switch (block.type) {
      case 'heading1':
        return `# ${block.content}\n`;
      case 'heading2':
        return `## ${block.content}\n`;
      case 'heading3':
        return `### ${block.content}\n`;
      case 'text':
        return `${block.content}\n`;
      case 'bullet':
        return `- ${block.content}\n`;
      case 'numbered':
        return `1. ${block.content}\n`;
      case 'todo':
        return `- [${block.checked ? 'x' : ' '}] ${block.content}\n`;
      case 'quote':
        return `> ${block.content}\n`;
      case 'code':
        return `\`\`\`\n${block.content}\n\`\`\`\n`;
      case 'divider':
        return `---\n`;
      case 'toggle':
        return `<details>\n<summary>${block.content}</summary>\n${block.toggleContent || ''}\n</details>\n`;
      case 'callout':
        return `> 💡 ${block.content}\n`;
      case 'image':
        return `![Image](${block.content})\n`;
      case 'bookmark':
        return `[${block.content}](${block.content})\n`;
      case 'table':
        if (!block.tableData) return '';
        const header = block.tableData[0] || [];
        const separator = header.map(() => '---').join(' | ');
        const rows = block.tableData.map(row => row.join(' | ')).join('\n');
        return `${rows.split('\n')[0] || ''}\n${separator}\n${rows.split('\n').slice(1).join('\n')}\n`;
      default:
        return block.content ? `${block.content}\n` : '';
    }
  }, []);

  const blockToPlainText = useCallback((block: NoteBlock): string => {
    switch (block.type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return `${block.content.toUpperCase()}\n`;
      case 'bullet':
        return `• ${block.content}\n`;
      case 'numbered':
        return `- ${block.content}\n`;
      case 'todo':
        return `[${block.checked ? '✓' : ' '}] ${block.content}\n`;
      case 'quote':
        return `"${block.content}"\n`;
      case 'code':
        return `${block.content}\n`;
      case 'divider':
        return `────────────────────\n`;
      case 'toggle':
        return `${block.content}\n  ${block.toggleContent || ''}\n`;
      case 'table':
        if (!block.tableData) return '';
        return block.tableData.map(row => row.join('\t')).join('\n') + '\n';
      default:
        return block.content ? `${block.content}\n` : '';
    }
  }, []);

  const blockToHtml = useCallback((block: NoteBlock): string => {
    switch (block.type) {
      case 'heading1':
        return `<h1>${block.content}</h1>`;
      case 'heading2':
        return `<h2>${block.content}</h2>`;
      case 'heading3':
        return `<h3>${block.content}</h3>`;
      case 'text':
        return `<p>${block.content}</p>`;
      case 'bullet':
        return `<li>${block.content}</li>`;
      case 'numbered':
        return `<li>${block.content}</li>`;
      case 'todo':
        return `<div><input type="checkbox" ${block.checked ? 'checked' : ''}/> ${block.content}</div>`;
      case 'quote':
        return `<blockquote>${block.content}</blockquote>`;
      case 'code':
        return `<pre><code>${block.content}</code></pre>`;
      case 'divider':
        return `<hr/>`;
      case 'callout':
        return `<aside class="callout">${block.content}</aside>`;
      case 'image':
        return `<img src="${block.content}" alt="Image"/>`;
      case 'bookmark':
        return `<a href="${block.content}">${block.content}</a>`;
      case 'table':
        if (!block.tableData) return '';
        const rows = block.tableData.map((row, i) => {
          const cells = row.map(cell => i === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `<table>${rows}</table>`;
      default:
        return block.content ? `<p>${block.content}</p>` : '';
    }
  }, []);

  const generateExport = useCallback((): string => {
    const title = note.title || 'Untitled';
    
    switch (selectedFormat) {
      case 'markdown':
        const mdContent = note.blocks.map(blockToMarkdown).join('\n');
        return `# ${title}\n\n${mdContent}`;
      
      case 'plaintext':
        const txtContent = note.blocks.map(blockToPlainText).join('\n');
        return `${title.toUpperCase()}\n${'='.repeat(title.length)}\n\n${txtContent}`;
      
      case 'html':
        const htmlContent = note.blocks.map(blockToHtml).join('\n');
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1, h2, h3 { margin-top: 1.5em; }
    blockquote { border-left: 4px solid #ccc; margin: 1em 0; padding-left: 1em; }
    pre { background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .callout { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 1em; margin: 1em 0; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${htmlContent}
</body>
</html>`;
      
      default:
        return '';
    }
  }, [note, selectedFormat, blockToMarkdown, blockToPlainText, blockToHtml]);

  const handleCopy = useCallback(async () => {
    const content = generateExport();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateExport]);

  const handleDownload = useCallback(() => {
    const content = generateExport();
    const fileName = `${note.title || 'untitled'}.${selectedFormat === 'markdown' ? 'md' : selectedFormat === 'html' ? 'html' : 'txt'}`;
    const mimeType = selectedFormat === 'html' ? 'text/html' : 'text/plain';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateExport, note.title, selectedFormat]);

  const formats = [
    { id: 'markdown' as ExportFormat, label: 'Markdown', icon: FileText, ext: '.md', description: 'Best for documentation & GitHub' },
    { id: 'plaintext' as ExportFormat, label: 'Plain Text', icon: FileType, ext: '.txt', description: 'Universal compatibility' },
    { id: 'html' as ExportFormat, label: 'HTML', icon: FileCode, ext: '.html', description: 'Web-ready with styling' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Export Note</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Format Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Choose Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedFormat === format.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <format.icon className={`w-6 h-6 mx-auto mb-2 ${
                        selectedFormat === format.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="font-medium text-sm">{format.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{format.ext}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formats.find(f => f.id === selectedFormat)?.description}
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preview</label>
                <div className="relative">
                  <pre className="bg-muted/50 border border-border rounded-lg p-4 text-xs font-mono max-h-48 overflow-auto whitespace-pre-wrap">
                    {generateExport().slice(0, 500)}{generateExport().length > 500 ? '...' : ''}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
              <motion.button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
              <motion.button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;
