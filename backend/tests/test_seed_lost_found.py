import json
from datetime import date
from pathlib import Path

import pytest
from sqlmodel import Session, delete, select

from app.core.config import get_settings
from app.db.session import engine
from app.models.lost_found import LostFoundReport, ReportStatus, ReportType
from seed.seed_lost_found import (
    DEMO_PHOTOS_DIR,
    SeedDataError,
    load_seed_records,
    seed_lost_found,
)

# Distinct prefix from the real demo dataset's "DEMO-LOST-.../DEMO-FOUND-..."
# roll numbers, so this fixture's cleanup can never touch the real seed data.
TEST_ROLL_NUMBERS = ["DEMO-TEST-ALPHA-901", "DEMO-TEST-BETA-902"]


@pytest.fixture(autouse=True)
def cleanup_seeded_reports():
    """Removes any report rows this test file creates, by roll_number, so the
    seed tests never leave test-only rows behind in the dev database.
    """
    yield

    with Session(engine) as session:
        session.exec(
            delete(LostFoundReport).where(
                LostFoundReport.roll_number.in_(TEST_ROLL_NUMBERS)
            )
        )
        session.commit()


def _base_record(demo_key="demo-test-alpha-901", roll_number="DEMO-TEST-ALPHA-901", **overrides):
    record = {
        "demo_key": demo_key,
        "type": "LOST",
        "item_name": "Test Item",
        "description": "A fixture-only test record.",
        "location": "Test Location",
        "date": "2026-09-01",
        "photo": None,
        "reporter_name": "Test Reporter",
        "roll_number": roll_number,
        "contact_number": "9000000000",
        "status": "OPEN",
    }
    record.update(overrides)
    return record


def _write_seed_file(tmp_path, records):
    path = tmp_path / "lost_found_reports.json"
    path.write_text(json.dumps(records))
    return path


def test_load_seed_records_returns_exactly_ten_records():
    records = load_seed_records()
    assert len(records) == 10


def test_load_seed_records_has_five_lost_and_five_found():
    records = load_seed_records()
    lost = [r for r in records if r["type"] == ReportType.LOST]
    found = [r for r in records if r["type"] == ReportType.FOUND]
    assert len(lost) == 5
    assert len(found) == 5


def test_load_seed_records_has_mixed_status_and_photo_presence():
    records = load_seed_records()
    statuses = {r["status"] for r in records}
    assert ReportStatus.OPEN in statuses
    assert ReportStatus.RESOLVED in statuses

    with_photo = [r for r in records if r["photo"] is not None]
    without_photo = [r for r in records if r["photo"] is None]
    assert len(with_photo) > 0
    assert len(without_photo) > 0


def test_load_seed_records_rejects_duplicate_demo_key(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [
            _base_record(demo_key="dup", roll_number="DEMO-TEST-ALPHA-901"),
            _base_record(demo_key="dup", roll_number="DEMO-TEST-BETA-902"),
        ],
    )

    with pytest.raises(SeedDataError, match="Duplicate demo_key"):
        load_seed_records(path)


def test_load_seed_records_rejects_non_demo_roll_number(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [_base_record(roll_number="102203999")],
    )

    with pytest.raises(SeedDataError, match="must start with 'DEMO-'"):
        load_seed_records(path)


def test_seed_lost_found_creates_new_record(tmp_path):
    path = _write_seed_file(tmp_path, [_base_record()])

    with Session(engine) as session:
        summary = seed_lost_found(session, load_seed_records(path))
        assert summary == {"created": 1, "updated": 0, "unchanged": 0}

        row = session.exec(
            select(LostFoundReport).where(
                LostFoundReport.roll_number == "DEMO-TEST-ALPHA-901"
            )
        ).first()
        assert row is not None
        assert row.item_name == "Test Item"
        assert row.status == ReportStatus.OPEN


def test_seed_lost_found_is_idempotent_and_never_duplicates(tmp_path):
    path = _write_seed_file(tmp_path, [_base_record()])
    records = load_seed_records(path)

    with Session(engine) as session:
        first_run = seed_lost_found(session, records)
        second_run = seed_lost_found(session, records)

    assert first_run == {"created": 1, "updated": 0, "unchanged": 0}
    assert second_run == {"created": 0, "updated": 0, "unchanged": 1}

    with Session(engine) as session:
        rows = session.exec(
            select(LostFoundReport).where(
                LostFoundReport.roll_number == "DEMO-TEST-ALPHA-901"
            )
        ).all()
        assert len(rows) == 1


def test_seed_lost_found_updates_changed_fields_without_duplicating(tmp_path):
    original = _write_seed_file(tmp_path, [_base_record(status="OPEN")])

    with Session(engine) as session:
        seed_lost_found(session, load_seed_records(original))

    updated_file = _write_seed_file(tmp_path, [_base_record(status="RESOLVED")])

    with Session(engine) as session:
        summary = seed_lost_found(session, load_seed_records(updated_file))
        assert summary == {"created": 0, "updated": 1, "unchanged": 0}

        rows = session.exec(
            select(LostFoundReport).where(
                LostFoundReport.roll_number == "DEMO-TEST-ALPHA-901"
            )
        ).all()
        assert len(rows) == 1
        assert rows[0].status == ReportStatus.RESOLVED


def test_seed_lost_found_leaves_unrelated_rows_alone():
    with Session(engine) as session:
        session.add(
            LostFoundReport(
                type=ReportType.FOUND,
                item_name="Someone Else's Real Report",
                description="Not part of the demo dataset.",
                location="Real Location",
                date=date(2026, 9, 1),
                reporter_name="Real Student",
                roll_number="102203999",
                contact_number="9876543210",
            )
        )
        session.commit()

        summary = seed_lost_found(session, [])
        assert summary == {"created": 0, "updated": 0, "unchanged": 0}

        row = session.exec(
            select(LostFoundReport).where(LostFoundReport.roll_number == "102203999")
        ).first()
        assert row is not None

        session.delete(row)
        session.commit()


def test_seed_lost_found_photo_is_copied_and_path_resolves(tmp_path):
    photo_name = "demo-wallet.png"
    assert (DEMO_PHOTOS_DIR / photo_name).is_file(), (
        "Expected demo photo fixture missing from backend/seed/demo_photos/"
    )

    path = _write_seed_file(tmp_path, [_base_record(photo=photo_name)])

    with Session(engine) as session:
        seed_lost_found(session, load_seed_records(path))

        row = session.exec(
            select(LostFoundReport).where(
                LostFoundReport.roll_number == "DEMO-TEST-ALPHA-901"
            )
        ).first()

    assert row is not None
    assert row.photo == f"/uploads/{photo_name}"

    served_path = Path(get_settings().upload_dir) / photo_name
    assert served_path.is_file()
