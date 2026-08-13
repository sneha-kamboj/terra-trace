const FRIENDLY = {
  MISSING_IMAGE: "Both images are required before running detection.",
  INVALID_IMAGE: "That file type isn't supported. Use JPG, PNG, or TIF.",
  CORRUPTED_IMAGE: "That image couldn't be read — it may be corrupted.",
  IMAGE_SIZE_MISMATCH: "The before/after images have very different dimensions.",
  IMAGE_TOO_LARGE: "That file is too large. Keep uploads under 10MB.",
  MODEL_INFERENCE_FAILED: "The detection model failed to process this pair. Try again.",
  PROCESSING_TIMEOUT: "This took too long to process and timed out.",
  RESULT_NOT_FOUND: "That result couldn't be found.",
  INTERNAL_ERROR: "Something went wrong on our end.",
};

export default function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  const message = FRIENDLY[error.code] || error.message || "Something went wrong.";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-canopy-red/40 bg-canopy-red/10 px-4 py-3 animate-fadeUp">
      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-canopy-red flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-canopy-text">{message}</p>
        <p className="text-[10px] font-mono text-canopy-muted mt-0.5">{error.code}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="focus-ring text-canopy-muted hover:text-canopy-text text-xs">
          dismiss
        </button>
      )}
    </div>
  );
}
