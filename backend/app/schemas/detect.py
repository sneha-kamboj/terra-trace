from pydantic import BaseModel


class Verdict(BaseModel):
    label: str
    confidence: float
    deforested_area_percent: float
    deforested_area_sqm: float
    risk_level: str


class Images(BaseModel):
    before_url: str
    after_url: str
    mask_url: str
    overlay_url: str


class Metadata(BaseModel):
    image_width_px: int
    image_height_px: int
    pixel_resolution_m: int
    model_version: str
    processed_at: str
    processing_time_ms: int


class DetectResponse(BaseModel):
    request_id: str
    status: str
    verdict: Verdict
    images: Images
    metadata: Metadata