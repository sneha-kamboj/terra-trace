import time
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter
from fastapi import File
from fastapi import UploadFile
from fastapi import HTTPException

from app.config import settings
from app.schemas.detect import DetectResponse
from app.services.image_utils import (
    validate_extension,
    save_upload,
    open_image,
    get_image_size,
    validate_image_size,
    preprocess_image,
    save_processed_image,
) 

router = APIRouter(
    prefix="/detect",
    tags=["Detection"],
)

@router.post(
    "",
    response_model=DetectResponse,
)
async def detect(
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
):
        start = time.time()
        request_id = str(uuid.uuid4())

        try:

            validate_extension(before_image.filename)

            validate_extension(after_image.filename)

        except ValueError as e:

            raise HTTPException(
                status_code=400,
                detail=str(e),
            )


        upload_folder = settings.upload_path / request_id

        upload_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        before_path = upload_folder / "before.png"

        after_path = upload_folder / "after.png"

        save_upload(before_image, before_path)

        save_upload(after_image, after_path)


        try:
            before = open_image(before_path)
            after = open_image(after_path)

            validate_image_size(before)
            validate_image_size(after)

        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=str(exc),
            )


        before_processed = preprocess_image(before)
        after_processed = preprocess_image(after)


        before_processed_path = upload_folder / "before_processed.png"
        after_processed_path = upload_folder / "after_processed.png"


        save_processed_image(
            before_processed,
            before_processed_path,
        )

        save_processed_image(
            after_processed,
            after_processed_path,
        )


        width, height = get_image_size(before_processed)
        processing_time = int(
            (time.time() - start) * 1000)


        return {

            "request_id": request_id,

            "status": "success",

            "verdict": {
                "label": "possible_deforestation",
                "confidence": 0.91,
                "deforested_area_percent": 12.4,
                "deforested_area_sqm": 124500,
                "risk_level": "medium",
            },

            "images": {
                "before_url": f"/uploads/{request_id}/before.png",
                "after_url": f"/uploads/{request_id}/after.png",
                "mask_url": "",
                "overlay_url": "",
            },

            "metadata": {
                "image_width_px": width,
                "image_height_px": height,
                "pixel_resolution_m": settings.PIXEL_RESOLUTION_METERS,
                "model_version": "dummy-v1",
                "processed_at": datetime.utcnow().isoformat(),
                "processing_time_ms": processing_time,
            },
        }
