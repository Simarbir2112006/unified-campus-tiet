"""Idempotently loads Professor records from seed/professors.json into the database.

Run with: docker compose exec backend python -m seed.seed_professors
"""

import json
from pathlib import Path

from sqlmodel import Session, select

from app.db.session import engine
from app.models.professor import Professor

SEED_FILE = Path(__file__).parent / "professors.json"

REQUIRED_FIELDS = ("name", "department", "designation", "official_email")
OPTIONAL_FIELDS = (
    "phone",
    "cabin",
    "subjects",
    "google_scholar_url",
    "personal_website_url",
    "linkedin_url",
    "other_links",
)


class SeedDataError(ValueError):
    """Raised when a seed record is missing required fields or has the wrong shape."""


def _validate(record: dict, index: int) -> dict:
    missing = [field for field in REQUIRED_FIELDS if not record.get(field)]
    if missing:
        raise SeedDataError(
            f"Record #{index} is missing required field(s): {', '.join(missing)}"
        )

    other_links = record.get("other_links")
    if other_links is not None and not (
        isinstance(other_links, list) and all(isinstance(link, dict) for link in other_links)
    ):
        raise SeedDataError(
            f"Record #{index} ('{record['official_email']}'): "
            "other_links must be a list of objects"
        )

    return {
        **{field: record[field] for field in REQUIRED_FIELDS},
        **{field: record.get(field) for field in OPTIONAL_FIELDS},
    }


def load_seed_records(path: Path = SEED_FILE) -> list[dict]:
    raw = json.loads(path.read_text())

    if not isinstance(raw, list):
        raise SeedDataError(f"{path} must contain a JSON array of professor records")

    return [_validate(record, index) for index, record in enumerate(raw)]


def seed_professors(session: Session, records: list[dict]) -> dict[str, int]:
    """Upserts professor records by official_email. Never deletes existing rows."""
    created = updated = unchanged = 0

    for record in records:
        existing = session.exec(
            select(Professor).where(Professor.official_email == record["official_email"])
        ).first()

        if existing is None:
            session.add(Professor(**record))
            created += 1
            continue

        changed = False
        for field, value in record.items():
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
        summary = seed_professors(session, records)

    print(
        f"Seed complete: {summary['created']} created, "
        f"{summary['updated']} updated, {summary['unchanged']} unchanged "
        f"(from {len(records)} record(s) in {SEED_FILE.name})."
    )


if __name__ == "__main__":
    main()
