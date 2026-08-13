import { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/tiff"];
const MAX_SIZE_MB = 10;

function Dropzone({ label, file, onFile, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const validateAndSet = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      onFile(null, { code: "INVALID_IMAGE", message: `${label}: unsupported file type.` });
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      onFile(null, { code: "IMAGE_TOO_LARGE", message: `${label}: file exceeds ${MAX_SIZE_MB}MB.` });
      return;
    }
    onFile(f, null);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled) validateAndSet(e.dataTransfer.files?.[0]);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative rounded-lg border border-dashed p-5 text-center cursor-pointer transition-colors ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      } ${
        dragOver
          ? "border-canopy-bright bg-canopy-bright/5"
          : "border-canopy-border hover:border-canopy-bright/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.tif,.tiff"
        className="hidden"
        disabled={disabled}
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />
      {file ? (
        <div className="flex items-center justify-center gap-2 text-canopy-bright text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-canopy-bright" />
          <span className="truncate max-w-[180px] font-mono text-xs">{file.name}</span>
        </div>
      ) : (
        <div className="text-canopy-muted">
          <p className="text-sm font-medium text-canopy-text">{label}</p>
          <p className="text-[11px] font-mono mt-1">drag & drop or click · jpg/png/tif</p>
        </div>
      )}
    </div>
  );
}

export default function UploadPanel({ onFilesReady, disabled, onError }) {
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);

  const handleFile = (setter) => (file, error) => {
    if (error) {
      onError(error);
      return;
    }
    setter(file);
    onError(null);
  };

  const bothReady = before && after;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Dropzone label="Before image" file={before} onFile={handleFile(setBefore)} disabled={disabled} />
        <Dropzone label="After image" file={after} onFile={handleFile(setAfter)} disabled={disabled} />
      </div>
      <button
        disabled={!bothReady || disabled}
        onClick={() => onFilesReady(before, after)}
        className="focus-ring w-full py-2.5 rounded-lg bg-canopy-primary text-canopy-text font-display font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-canopy-primary/80 transition-colors"
      >
        Run detection
      </button>
    </div>
  );
}
