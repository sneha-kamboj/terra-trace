import { useEffect, useState } from "react";
import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import SampleGallery from "./components/SampleGallery";
import CompareScanner from "./components/CompareScanner";
import ResultStats from "./components/ResultStats";
import ErrorBanner from "./components/ErrorBanner";
import EmptyState from "./components/EmptyState";
import { getSampleImages, detect, detectFromSample } from "./api/client";

export default function App() {
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [status, setStatus] = useState("idle"); 
  const [preview, setPreview] = useState(null); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showMask, setShowMask] = useState(true);

  useEffect(() => {
    getSampleImages()
      .then((data) => setSamples(data.samples))
      .catch(() => setSamples([]));
  }, []);

  const runAnalysis = async (task) => {
    setStatus("analyzing");
    setError(null);
    setResult(null);
    try {
      const data = await task();
      setResult(data);
      setStatus("result");
      setShowMask(true);
    } catch (e) {
      setError({ code: e.code || "INTERNAL_ERROR", message: e.message });
      setStatus("error");
    }
  };

  const handleSampleSelect = (sample) => {
    setSelectedSampleId(sample.id);
    setPreview({ beforeUrl: sample.beforeUrl, afterUrl: sample.afterUrl });
    runAnalysis(() => detectFromSample(sample.id));
  };

  const handleFilesReady = (before, after) => {
    setSelectedSampleId(null);
    const beforeUrl = URL.createObjectURL(before);
    const afterUrl = URL.createObjectURL(after);
    setPreview({ beforeUrl, afterUrl });
    runAnalysis(() => detect(before, after));
  };

  const activeBefore = result?.images?.beforeUrl || preview?.beforeUrl;
  const activeAfter = result?.images?.afterUrl || preview?.afterUrl;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl px-6 py-10 mx-auto space-y-8">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-canopy-bright mb-2">
            change detection · sentinel-2
          </p>
          <h2 className="max-w-xl text-2xl font-semibold leading-tight font-display sm:text-3xl text-canopy-text">
            Compare two captures of the same forest. Flag what changed.
          </h2>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <div className="space-y-6">
            <div className="p-5 space-y-5 border rounded-xl border-canopy-border bg-canopy-surface">
              <UploadPanel
                onFilesReady={handleFilesReady}
                disabled={status === "analyzing"}
                onError={setError}
              />
              <SampleGallery
                samples={samples}
                onSelect={handleSampleSelect}
                selectedId={selectedSampleId}
                disabled={status === "analyzing"}
              />
            </div>

            {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

            {status === "result" && result && <ResultStats result={result} />}
          </div>

          <div>
            {activeBefore && activeAfter ? (
              <CompareScanner
                beforeUrl={activeBefore}
                afterUrl={activeAfter}
                maskUrl={result?.images?.maskUrl}
                status={status}
                showMask={showMask}
                onToggleMask={() => setShowMask((v) => !v)}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-6xl px-6 pb-10 mx-auto">
        <p className="text-[11px] font-mono text-canopy-muted border-t border-canopy-border/60 pt-4">
          Verdicts are pattern-based inference from canopy loss, not verified legal
          determinations. Built for demo purposes.
        </p>
      </footer>
    </div>
  );
}
