import { getMockSampleImages, getMockDetectionResult, getMockUploadResult } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const USE_MOCK = !API_BASE_URL;


function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamel(v),
      ])
    );
  }
  return obj;
}

class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

async function handleResponse(res) {
  const body = await res.json();
  if (!res.ok || body.status === "error") {
    throw new ApiError(body?.error?.code || "INTERNAL_ERROR", body?.error?.message || "Something went wrong.");
  }
  return toCamel(body);
}

export async function checkHealth() {
  if (USE_MOCK) return { status: "ok", modelLoaded: true, version: "mock-1.0.0" };
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}

export async function getSampleImages() {
  if (USE_MOCK) return { samples: toCamel(getMockSampleImages()) };
  const res = await fetch(`${API_BASE_URL}/sample-images`);
  return handleResponse(res);
}

export async function detectFromSample(sampleId) {
  if (USE_MOCK) {
    await simulateLatency();
    try {
      return toCamel(getMockDetectionResult(sampleId));
    } catch (e) {
      throw new ApiError(e.code, e.message);
    }
  }
  
  throw new ApiError("NOT_IMPLEMENTED", "Wire sample-to-detect flow once backend is live.");
}

export async function detect(beforeFile, afterFile, locationName) {
  if (!beforeFile || !afterFile) {
    throw new ApiError("MISSING_IMAGE", "Both before and after images are required.");
  }
  if (USE_MOCK) {
    await simulateLatency();
    return toCamel(getMockUploadResult(beforeFile, afterFile));
  }
  const form = new FormData();
  form.append("before_image", beforeFile);
  form.append("after_image", afterFile);
  if (locationName) form.append("location_name", locationName);

  const res = await fetch(`${API_BASE_URL}/detect`, { method: "POST", body: form });
  return handleResponse(res);
}

export async function getResult(requestId) {
  if (USE_MOCK) throw new ApiError("RESULT_NOT_FOUND", "Mock mode does not persist past results.");
  const res = await fetch(`${API_BASE_URL}/detect/${requestId}`);
  return handleResponse(res);
}

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 1400 + Math.random() * 800));
}

export { ApiError, USE_MOCK };
