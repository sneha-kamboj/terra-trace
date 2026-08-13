export default function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-canopy-border h-full min-h-[280px] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-10 h-10 rounded-full border border-canopy-border flex items-center justify-center mb-3">
        <span className="w-2 h-2 rounded-full bg-canopy-muted" />
      </div>
      <p className="text-sm text-canopy-text font-medium">No analysis yet</p>
      <p className="text-xs text-canopy-muted mt-1 max-w-[240px]">
        Upload a before/after pair or pick a sample to see the comparison and verdict here.
      </p>
    </div>
  );
}
