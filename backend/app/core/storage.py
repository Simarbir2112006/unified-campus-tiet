import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.core.config import get_settings

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}


async def save_photo(photo: UploadFile) -> str:
    """Validates and saves an uploaded image, returning its public /uploads path.

    The saved filename/extension is derived strictly from the validated
    content-type, never from the client-supplied filename, so a spoofed
    content-type cannot be used to plant a file with an executable extension.
    """
    settings = get_settings()

    if photo.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Photo must be a JPEG, PNG, WEBP or GIF image",
        )

    contents = await photo.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded photo is empty")

    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"Photo must be smaller than {settings.max_upload_size_mb}MB",
        )

    extension = ALLOWED_CONTENT_TYPES[photo.content_type]
    filename = f"{uuid.uuid4().hex}{extension}"

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(contents)

    return f"/uploads/{filename}"
