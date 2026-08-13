export default function SampleGallery({ samples, onSelect, selectedId, disabled }) {
  if (!samples?.length) return null;

  return (
    <div>
      <p className="text-[11px] font-mono uppercase tracking-wide text-canopy-muted mb-2.5">
        or load a sample pair
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {samples.map((s) => (
          <button
            key={s.id}
            disabled={disabled}
            onClick={() => onSelect(s)}
            className={`focus-ring group text-left rounded-lg border overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              selectedId === s.id
                ? "border-canopy-bright ring-1 ring-canopy-bright/40"
                : "border-canopy-border hover:border-canopy-bright/40"
            }`}
          >
            <div className="relative aspect-video bg-canopy-surfacealt">
              <img
                src={s.afterUrl}
                alt={s.label}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="px-3 py-2 bg-canopy-surface">
              <p className="text-xs font-medium text-canopy-text truncate">{s.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
