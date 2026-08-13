const CONFIG = {
  no_deforestation: {
    text: "No deforestation detected",
    dot: "bg-canopy-bright",
    ring: "ring-canopy-bright/30",
    bg: "bg-canopy-bright/10",
    fg: "text-canopy-bright",
  },
  possible_deforestation: {
    text: "Possible deforestation",
    dot: "bg-canopy-amber",
    ring: "ring-canopy-amber/30",
    bg: "bg-canopy-amber/10",
    fg: "text-canopy-amber",
  },
  likely_illegal_logging: {
    text: "Likely illegal logging",
    dot: "bg-canopy-red",
    ring: "ring-canopy-red/30",
    bg: "bg-canopy-red/10",
    fg: "text-canopy-red",
  },
  inconclusive: {
    text: "Inconclusive — cloud cover",
    dot: "bg-canopy-muted",
    ring: "ring-canopy-muted/30",
    bg: "bg-canopy-muted/10",
    fg: "text-canopy-muted",
  },
};

export default function VerdictBadge({ label, size = "md" }) {
  const cfg = CONFIG[label] || CONFIG.inconclusive;
  const sizing = size === "lg" ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full ring-1 font-display font-medium ${cfg.bg} ${cfg.fg} ${cfg.ring} ${sizing}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.text}
    </span>
  );
}
