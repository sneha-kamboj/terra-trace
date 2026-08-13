import { generateScenario } from "../utils/generateSatelliteImage";


export function classify(deforestedAreaPercent) {
  if (deforestedAreaPercent < 5) {
    return { label: "no_deforestation", risk_level: "low" };
  }
  if (deforestedAreaPercent <= 15) {
    return { label: "possible_deforestation", risk_level: "medium" };
  }
  return { label: "likely_illegal_logging", risk_level: "high" };
}


export const SAMPLE_LOCATIONS = [
  {
    id: "amazon-01",
    location_name: "Amazon Basin — Sector 14",
    seed: 7,
    deforested_area_percent: 2.1,
  },
  {
    id: "borneo-01",
    location_name: "Borneo — Kalimantan Ridge",
    seed: 23,
    deforested_area_percent: 11.4,
  },
  {
    id: "congo-01",
    location_name: "Congo Basin — Sector 7",
    seed: 41,
    deforested_area_percent: 27.8,
  },
];

function buildResult({ id, location_name, seed, deforested_area_percent }) {
  const { beforeUrl, afterUrl, maskUrl } = generateScenario({
    seed,
    clearedPercent: deforested_area_percent,
  });
  const { label, risk_level } = classify(deforested_area_percent);
  const pixelResolutionM = 10;
  const totalAreaSqm = 512 * 512 * pixelResolutionM * pixelResolutionM;

  return {
    request_id: `${id}-${Date.now()}`,
    status: "success",
    verdict: {
      label,
      confidence: Math.min(1, +(0.52 + deforested_area_percent / 40).toFixed(2)),
      deforested_area_percent,
      deforested_area_sqm: Math.round((deforested_area_percent / 100) * totalAreaSqm),
      risk_level,
    },
    images: {
      before_url: beforeUrl,
      after_url: afterUrl,
      mask_url: maskUrl,
      overlay_url: afterUrl,
    },
    metadata: {
      image_width_px: 512,
      image_height_px: 512,
      pixel_resolution_m: pixelResolutionM,
      model_version: "unet-v1-mock",
      processed_at: new Date().toISOString(),
      processing_time_ms: 900 + Math.round(Math.random() * 600),
    },
    location_name,
  };
}

export function getMockSampleImages() {
  return SAMPLE_LOCATIONS.map((loc) => {
    const { beforeUrl, afterUrl } = generateScenario({
      seed: loc.seed,
      clearedPercent: loc.deforested_area_percent,
    });
    return {
      id: loc.id,
      label: loc.location_name,
      before_url: beforeUrl,
      after_url: afterUrl,
    };
  });
}

export function getMockDetectionResult(sampleId) {
  const loc = SAMPLE_LOCATIONS.find((l) => l.id === sampleId);
  if (!loc) {
    throw { code: "RESULT_NOT_FOUND", message: "Sample location not found." };
  }
  return buildResult(loc);
}

export function getMockUploadResult(beforeFile, afterFile) {
  const seed = (beforeFile.size + afterFile.size) % 97;
  const deforestedPercent = +(((seed * 37) % 300) / 10).toFixed(1);
  return buildResult({
    id: "upload",
    location_name: "Custom upload",
    seed,
    deforested_area_percent: deforestedPercent,
  });
}
