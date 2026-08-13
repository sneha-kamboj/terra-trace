import { USE_MOCK } from "../api/client";

export default function Header() {
  return (
    <header className="border-b border-canopy-border/60 bg-canopy-bg/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-canopy-primary/20 border border-canopy-bright/40 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-canopy-bright animate-pulseSoft" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg tracking-tight text-canopy-text">
              Canopy Watch
            </h1>
            <p className="text-[11px] font-mono text-canopy-muted -mt-0.5">
              satellite change detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-canopy-muted">
          <span className={`w-1.5 h-1.5 rounded-full ${USE_MOCK ? "bg-canopy-amber" : "bg-canopy-bright"}`} />
          {USE_MOCK ? "mock mode" : "live backend"}
        </div>
      </div>
    </header>
  );
}
