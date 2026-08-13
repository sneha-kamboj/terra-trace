import VerdictBadge from "./VerdictBadge";

function Stat({ label, value, unit }) {
  return (
    <div className="border border-canopy-border rounded-lg px-4 py-3 bg-canopy-surfacealt/50">
      <div className="text-[10px] font-mono uppercase tracking-wider text-canopy-muted mb-1">
        {label}
      </div>
      <div className="font-mono text-xl text-canopy-text">
        {value}
        {unit && <span className="text-sm text-canopy-muted ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default function ResultStats({ result }) {
  if (!result) return null;
  const { verdict, metadata, locationName } = result;

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-mono text-canopy-muted uppercase tracking-wide mb-1.5">
            {locationName || "Analysis result"}
          </p>
          <VerdictBadge label={verdict.label} size="lg" />
        </div>
        <div className="text-right font-mono text-[11px] text-canopy-muted">
          <div>{metadata.modelVersion}</div>
          <div>{metadata.processingTimeMs} ms</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Confidence" value={Math.round(verdict.confidence * 100)} unit="%" />
        <Stat label="Area cleared" value={verdict.deforestedAreaPercent} unit="%" />
        <Stat label="Area lost" value={(verdict.deforestedAreaSqm / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="ha" />
        <Stat label="Risk level" value={verdict.riskLevel} />
      </div>

      {verdict.label === "likely_illegal_logging" && (
        <p className="text-xs text-canopy-muted leading-relaxed border-l-2 border-canopy-red/50 pl-3">
          This flag is a pattern-based inference from sudden, large-scale canopy loss —
          not a verified legal determination. Cross-check against local permit records
          before acting on it.
        </p>
      )}
    </div>
  );
}
