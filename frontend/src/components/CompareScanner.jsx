import { useCallback, useRef, useState } from "react";

export default function CompareScanner({ beforeUrl, afterUrl, maskUrl, status, showMask, onToggleMask }) {
  const [split, setSplit] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(97, Math.max(3, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const stopDrag = () => (dragging.current = false);

  return (
    <div className="rounded-xl border border-canopy-border bg-canopy-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-canopy-border/70">
        <div className="flex items-center gap-4 font-mono text-[11px] text-canopy-muted uppercase tracking-wide">
          <span className="text-canopy-bright">◀ before</span>
          <span>after ▶</span>
        </div>
        {maskUrl && (
          <button
            onClick={onToggleMask}
            className="focus-ring text-[11px] font-mono px-2.5 py-1 rounded border border-canopy-border text-canopy-muted hover:text-canopy-bright hover:border-canopy-bright/50 transition-colors"
          >
            {showMask ? "hide" : "show"} loss mask
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        className="relative aspect-square w-full select-none cursor-ew-resize touch-none"
      >
        {/* After image (full, base layer) */}
        <img
          src={afterUrl}
          alt="After satellite capture"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before image, clipped to split % */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <img
            src={beforeUrl}
            alt="Before satellite capture"
            draggable={false}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mask overlay */}
        {maskUrl && showMask && (
          <img
            src={maskUrl}
            alt="Detected loss mask"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70 animate-fadeUp"
          />
        )}

        {/* Divider handle */}
        <div
          className="absolute top-0 bottom-0 w-px bg-canopy-cyan/80 shadow-[0_0_12px_2px_rgba(100,217,201,0.5)]"
          style={{ left: `${split}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-canopy-surfacealt border border-canopy-cyan/60 flex items-center justify-center text-canopy-cyan text-[10px] font-mono">
            ⇔
          </div>
        </div>

        {/* Scan sweep during analysis */}
        {status === "analyzing" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-canopy-bright/25 to-transparent animate-scan" />
            <div className="absolute inset-0 bg-canopy-bg/20" />
          </div>
        )}

        {/* Grid overlay for instrument feel */}
        <div className="absolute inset-0 bg-grid bg-gridsize pointer-events-none opacity-40" />
      </div>
    </div>
  );
}
