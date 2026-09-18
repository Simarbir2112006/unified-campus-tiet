"""Idempotently loads fictional demo Lost & Found reports into the database.

Run with: docker compose exec backend python -m seed.seed_lost_found

Demo records are matched (never duplicated) by `roll_number`, which for every
record in lost_found_reports.json is a deterministic, obviously-fake value
derived from that record's `demo_key` (e.g. "DEMO-LOST-WALLET-001"). This
avoids adding a schema column solely to track seed identity: `demo_key` exists
only in the JSON, for human-readable provenance, while `roll_number` already
exists on the model and is guaranteed unique across this dataset by
construction. Real student roll numbers never take this "DEMO-..." form, so
this script can never match, update, or delete a real report.
"""

import json
from datetime import date as date_
from pathlib import Path

from sqlmodel import Session, select

from app.core.config import get_settings
from app.db.session import engine
from app.models.lost_found import LostFoundReport, ReportStatus, ReportType

SEED_FILE = Path(__file__).parent / "lost_found_reports.json"
DEMO_PHOTOS_DIR = Path(__file__).parent / "demo_photos"

REQUIRED_FIELDS = (
    "demo_key",
    "type",
    "item_name",
    "description",
    "location",
    "date",
    "reporter_name",
    "roll_number",
    "contact_number",
    "status",
)
OPTIONAL_FIELDS = ("photo",)

DB_FIELDS = (
    "type",
    "item_name",
    "description",
    "location",
    "date",
    "reporter_name",
    "roll_number",
    "contact_number",
    "status",
    "photo",
)


class SeedDataError(ValueError):
    """Raised when a seed record is missing required fields or has the wrong shape."""


def _validate(record: dict, index: int) -> dict:
    missing = [field for field in REQUIRED_FIELDS if not record.get(field)]
    if missing:
        raise SeedDataError(
            f"Record #{index} is missing required field(s): {', '.join(missing)}"
        )

    demo_key = record["demo_key"]

    try:
        report_type = ReportType(record["type"])
    except ValueError as exc:
        raise SeedDataError(
            f"Record '{demo_key}': invalid type '{record['type']}'"
        ) from exc

    try:
        status = ReportStatus(record["status"])
    except ValueError as exc:
        raise SeedDataError(
            f"Record '{demo_key}': invalid status '{record['status']}'"
        ) from exc

    try:
        record_date = date_.fromisoformat(record["date"])
    except ValueError as exc:
        raise SeedDataError(
            f"Record '{demo_key}': invalid date '{record['date']}'"
        ) from exc

    if not record["roll_number"].startswith("DEMO-"):
        raise SeedDataError(
            f"Record '{demo_key}': roll_number must start with 'DEMO-' "
            "so this seed can never match a real student record"
        )

    photo = record.get("photo")
    if photo is not None and not isinstance(photo, str):
        raise SeedDataError(f"Record '{demo_key}': photo must be a string filename or null")

    return {
        "demo_key": demo_key,
        "type": report_type,
        "item_name": record["item_name"],
        "description": record["description"],
        "location": record["location"],
        "date": record_date,
        "reporter_name": record["reporter_name"],
        "roll_number": record["roll_number"],
        "contact_number": record["contact_number"],
        "status": status,
        "photo": photo,
    }


def load_seed_records(path: Path = SEED_FILE) -> list[dict]:
    raw = json.loads(path.read_text())

    if not isinstance(raw, list):
        raise SeedDataError(f"{path} must contain a JSON array of report records")

    records = [_validate(record, index) for index, record in enumerate(raw)]

    seen_keys = set()
    seen_rolls = set()
    for record in records:
        if record["demo_key"] in seen_keys:
            raise SeedDataError(f"Duplicate demo_key: {record['demo_key']}")
        if record["roll_number"] in seen_rolls:
            raise SeedDataError(f"Duplicate roll_number: {record['roll_number']}")
        seen_keys.add(record["demo_key"])
        seen_rolls.add(record["roll_number"])

    return records


def _seed_photo(filename: str, photos_dir: Path = DEMO_PHOTOS_DIR) -> str:
    """Copies a demo photo into the upload volume and returns its /uploads path.

    Uses the same filename inside the upload directory (not a random uuid,
    unlike the multipart upload path) since the demo set is small, fixed, and
    namespaced with a "demo-" prefix - there is no realistic collision risk
    with real uploads, which are always uuid-named.
    """
    source = photos_dir / filename
    if not source.is_file():
        raise SeedDataError(f"Demo photo not found: {source}")

    upload_dir = Path(get_settings().upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(source.read_bytes())

    return f"/uploads/{filename}"


def seed_lost_found(
    session: Session, records: list[dict], photos_dir: Path = DEMO_PHOTOS_DIR
) -> dict[str, int]:
    """Upserts demo reports by roll_number. Never deletes existing rows."""
    created = updated = unchanged = 0

    for record in records:
        photo_field = (
            _seed_photo(record["photo"], photos_dir) if record["photo"] else None
        )
        fields = {field: record[field] for field in DB_FIELDS}
        fields["photo"] = photo_field

        existing = session.exec(
            select(LostFoundReport).where(
                LostFoundReport.roll_number == record["roll_number"]
            )
        ).first()

        if existing is None:
            session.add(LostFoundReport(**fields))
            created += 1
            continue

        changed = False
        for field, value in fields.items():
            if getattr(existing, field) != value:
                setattr(existing, field, value)
                changed = True

        if changed:
            session.add(existing)
            updated += 1
        else:
            unchanged += 1

    session.commit()
    return {"created": created, "updated": updated, "unchanged": unchanged}


def main() -> None:
    records = load_seed_records()

    if not records:
        print(f"No records found in {SEED_FILE} - nothing to seed.")
        return

    with Session(engine) as session:
        summary = seed_lost_found(session, records)

    print(
        f"Seed complete: {summary['created']} created, "
        f"{summary['updated']} updated, {summary['unchanged']} unchanged "
        f"(from {len(records)} record(s) in {SEED_FILE.name})."
    )


if __name__ == "__main__":
    main()
