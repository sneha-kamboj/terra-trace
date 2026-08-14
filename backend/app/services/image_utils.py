from pathlib import Path
import shutil

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.config import settings


def validate_extension(filename: str) -> None:
    """
    Validate that the uploaded filename has an allowed extension.
    """

    if not filename or "." not in filename:
        raise ValueError("File has no valid extension.")

    extension = filename.rsplit(".", 1)[1].lower()

    if extension not in settings.allowed_extensions:
        raise ValueError(
            f"Unsupported image format: {extension}"
        )


def save_upload(
    upload: UploadFile,
    destination: Path,
) -> None:
    """
    Save an uploaded file to disk.
    """

    with destination.open("wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)


def open_image(path: Path) -> Image.Image:
    """
    Open and fully load an image.

    Raises:
        ValueError: if the image is corrupted or unreadable.
    """

    try:
        image = Image.open(path)
        image.load()
        return image

    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError(
            "The uploaded file is corrupted or unreadable."
        ) from exc


def get_image_size(image: Image.Image) -> tuple[int, int]:
    """
    Return image dimensions as (width, height).
    """

    return image.width, image.height


def validate_image_size(
    image: Image.Image,
) -> None:
    """
    Validate basic image dimensions.
    """

    width, height = get_image_size(image)

    if width <= 0 or height <= 0:
        raise ValueError("Image dimensions are invalid.")

    aspect_ratio = width / height

    if aspect_ratio > 2.0 or aspect_ratio < 0.5:
        raise ValueError(
            "Image aspect ratio is too extreme."
        )


def preprocess_image(
    image: Image.Image,
) -> Image.Image:
    """
    Convert image to RGB and resize it to the
    configured model input size.
    """

    image = image.convert("RGB")

    target_size = settings.DEFAULT_IMAGE_SIZE

    image = image.resize(
        (target_size, target_size),
        Image.Resampling.BILINEAR,
    )

    return image


def save_processed_image(
    image: Image.Image,
    destination: Path,
) -> None:
    """
    Save a preprocessed image as PNG.
    """

    image.save(
        destination,
        format="PNG",
    )