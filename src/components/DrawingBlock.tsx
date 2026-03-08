import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Eraser, Pen, Undo2, Download, Palette } from "lucide-react";

interface DrawingBlockProps {
  drawingData?: string;
  onChange: (data: string) => void;
}

const penColors = [
  { name: "Black", value: "#1a1a1a" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Orange", value: "#f97316" },
  { name: "Purple", value: "#a855f7" },
];

const DrawingBlock = ({ drawingData, onChange }: DrawingBlockProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#1a1a1a");
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [showColors, setShowColors] = useState(false);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (drawingData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = drawingData;
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
    }

    saveHistory();
  }, [drawingData]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(data);
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      onChange(canvas.toDataURL());
    };
    img.src = historyRef.current[historyIndexRef.current];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveHistory();
    onChange(canvas.toDataURL());
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 5 : lineWidth;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistory();
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL());
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="py-3">
      <div className="space-y-2">
        {/* Toolbar */}
        <div className="flex items-center gap-1 flex-wrap">
          <motion.button
            onClick={() => setTool("pen")}
            className={`p-2 rounded-lg text-sm transition-all ${tool === "pen" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
            whileTap={{ scale: 0.95 }}
            title="Pen"
          >
            <Pen className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => setTool("eraser")}
            className={`p-2 rounded-lg text-sm transition-all ${tool === "eraser" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
            whileTap={{ scale: 0.95 }}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Color picker */}
          <div className="relative">
            <motion.button
              onClick={() => setShowColors(!showColors)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all flex items-center gap-1"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }} />
            </motion.button>
            {showColors && (
              <div className="absolute top-full left-0 mt-1 flex gap-1 p-2 bg-card rounded-lg shadow-xl border border-border z-10">
                {penColors.map(c => (
                  <button
                    key={c.value}
                    onClick={() => { setColor(c.value); setShowColors(false); }}
                    className="w-6 h-6 rounded-full hover:ring-2 ring-primary/30 transition-all"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Line width */}
          <input
            type="range"
            min="1"
            max="8"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-16 h-1 accent-primary"
          />

          <div className="w-px h-5 bg-border mx-1" />

          <motion.button onClick={undo} className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all" whileTap={{ scale: 0.95 }} title="Undo">
            <Undo2 className="w-4 h-4" />
          </motion.button>
          <motion.button onClick={clearCanvas} className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all" whileTap={{ scale: 0.95 }} title="Clear">
            <Eraser className="w-4 h-4" />
          </motion.button>
          <motion.button onClick={downloadDrawing} className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all ml-auto" whileTap={{ scale: 0.95 }} title="Download">
            <Download className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border border-border/50 bg-white">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none"
            style={{ height: "280px" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingBlock;
