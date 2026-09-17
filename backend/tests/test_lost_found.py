import io
from datetime import date
from pathlib import Path

import pytest
from sqlmodel import Session, delete, select

from app.core.config import get_settings
from app.db.session import engine
from app.models.lost_found import LostFoundReport, ReportType

TEST_MARKER = "TESTFIX"

TEST_PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02"
    b"\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x03\x01"
    b"\x01\x00\x18\xdd\x8d\xb0\x00\x00\x00\x00IEND\xaeB`\x82"
)


def _report_payload(**overrides):
    payload = {
        "type": "LOST",
        "item_name": f"{TEST_MARKER} Black Wallet",
        "description": "Leather wallet with student ID cards",
        "location": "Library",
        "date": "2026-09-15",
        "reporter_name": "Test Reporter",
        "roll_number": "102203999",
        "contact_number": "9999999999",
    }
    payload.update(overrides)
    return payload


def _cleanup(*ids):
    """Deletes test rows (and any photo files they created) so the dev
    database/upload volume are left exactly as they were before the test."""
    if not ids:
        return

    settings = get_settings()
    with Session(engine) as session:
        reports = session.exec(
            select(LostFoundReport).where(LostFoundReport.id.in_(ids))
        ).all()

        for report in reports:
            if report.photo:
                filename = report.photo.rsplit("/", 1)[-1]
                (Path(settings.upload_dir) / filename).unlink(missing_ok=True)

        session.exec(delete(LostFoundReport).where(LostFoundReport.id.in_(ids)))
        session.commit()


@pytest.fixture()
def sample_reports():
    reports = [
        LostFoundReport(
            type=ReportType.LOST,
            item_name=f"{TEST_MARKER} Fixture Wallet",
            description="A lost fixture wallet for testing",
            location="Test Library",
            date=date(2026, 9, 10),
            reporter_name="Test Reporter One",
            roll_number="111111",
            contact_number="1111111111",
        ),
        LostFoundReport(
            type=ReportType.FOUND,
            item_name=f"{TEST_MARKER} Fixture AirPods",
            description="Found fixture airpods near cafeteria",
            location="Test Cafeteria",
            date=date(2026, 9, 11),
            reporter_name="Test Reporter Two",
            roll_number="222222",
            contact_number="2222222222",
        ),
    ]

    with Session(engine) as session:
        for report in reports:
            session.add(report)
        session.commit()
        for report in reports:
            session.refresh(report)

    yield reports

    _cleanup(*[r.id for r in reports])


# --- creation ---------------------------------------------------------


def test_create_lost_report(client):
    response = client.post("/lost-found/reports", data=_report_payload(type="LOST"))
    try:
        assert response.status_code == 201
        body = response.json()
        assert body["type"] == "LOST"
        assert body["status"] == "OPEN"
        assert "roll_number" not in body
    finally:
        _cleanup(response.json()["id"])


def test_create_found_report(client):
    response = client.post(
        "/lost-found/reports",
        data=_report_payload(type="FOUND", item_name=f"{TEST_MARKER} AirPods"),
    )
    try:
        assert response.status_code == 201
        assert response.json()["type"] == "FOUND"
    finally:
        _cleanup(response.json()["id"])


def test_create_report_missing_required_field(client):
    payload = _report_payload()
    del payload["item_name"]

    response = client.post("/lost-found/reports", data=payload)
    assert response.status_code == 422


def test_create_report_invalid_type(client):
    response = client.post("/lost-found/reports", data=_report_payload(type="MAYBE"))
    assert response.status_code == 422


def test_create_report_with_photo(client):
    files = {"photo": ("test.png", io.BytesIO(TEST_PNG_BYTES), "image/png")}

    response = client.post(
        "/lost-found/reports",
        data=_report_payload(item_name=f"{TEST_MARKER} Photo Item"),
        files=files,
    )

    try:
        assert response.status_code == 201
        body = response.json()
        assert body["photo"] is not None
        assert body["photo"].startswith("/uploads/")

        photo_response = client.get(body["photo"])
        assert photo_response.status_code == 200
        assert photo_response.headers["content-type"] == "image/png"
    finally:
        _cleanup(response.json()["id"])


# --- listing / search / filter -----------------------------------------


def test_list_reports_returns_created_rows(client, sample_reports):
    response = client.get("/lost-found/reports")
    assert response.status_code == 200
    names = {r["item_name"] for r in response.json()}
    assert {f"{TEST_MARKER} Fixture Wallet", f"{TEST_MARKER} Fixture AirPods"}.issubset(names)


def test_list_reports_excludes_private_fields(client, sample_reports):
    response = client.get("/lost-found/reports")
    for report in response.json():
        assert "roll_number" not in report
        assert "reporter_name" not in report
        assert "contact_number" not in report


def test_search_by_item_name(client, sample_reports):
    response = client.get("/lost-found/reports", params={"search": "Fixture Wallet"})
    names = [r["item_name"] for r in response.json()]
    assert names == [f"{TEST_MARKER} Fixture Wallet"]


def test_search_by_description(client, sample_reports):
    response = client.get("/lost-found/reports", params={"search": "cafeteria"})
    names = [r["item_name"] for r in response.json()]
    assert f"{TEST_MARKER} Fixture AirPods" in names


def test_search_by_location(client, sample_reports):
    response = client.get("/lost-found/reports", params={"search": "Test Library"})
    names = [r["item_name"] for r in response.json()]
    assert f"{TEST_MARKER} Fixture Wallet" in names


def test_filter_type_lost(client, sample_reports):
    response = client.get("/lost-found/reports", params={"type": "LOST"})
    names = [r["item_name"] for r in response.json()]
    assert f"{TEST_MARKER} Fixture Wallet" in names
    assert f"{TEST_MARKER} Fixture AirPods" not in names


def test_filter_type_found(client, sample_reports):
    response = client.get("/lost-found/reports", params={"type": "FOUND"})
    names = [r["item_name"] for r in response.json()]
    assert f"{TEST_MARKER} Fixture AirPods" in names
    assert f"{TEST_MARKER} Fixture Wallet" not in names


def test_filter_status_open(client, sample_reports):
    response = client.get("/lost-found/reports", params={"status": "OPEN"})
    names = {r["item_name"] for r in response.json()}
    assert {f"{TEST_MARKER} Fixture Wallet", f"{TEST_MARKER} Fixture AirPods"}.issubset(names)


# --- detail --------------------------------------------------------------


def test_get_report_detail_includes_contact_not_roll(client, sample_reports):
    target = sample_reports[0]
    response = client.get(f"/lost-found/reports/{target.id}")
    assert response.status_code == 200
    body = response.json()
    assert body["reporter_name"] == target.reporter_name
    assert body["contact_number"] == target.contact_number
    assert "roll_number" not in body


def test_get_report_not_found(client):
    response = client.get("/lost-found/reports/999999999")
    assert response.status_code == 404


# --- status updates --------------------------------------------------------


def test_update_status_to_resolved(client, sample_reports):
    target = sample_reports[0]

    response = client.patch(
        f"/lost-found/reports/{target.id}/status", json={"status": "RESOLVED"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "RESOLVED"

    filtered = client.get("/lost-found/reports", params={"status": "RESOLVED"})
    names = [r["item_name"] for r in filtered.json()]
    assert target.item_name in names


def test_update_status_invalid_value(client, sample_reports):
    target = sample_reports[0]
    response = client.patch(
        f"/lost-found/reports/{target.id}/status", json={"status": "BANANA"}
    )
    assert response.status_code == 422


def test_update_status_missing_report(client):
    response = client.patch(
        "/lost-found/reports/999999999/status", json={"status": "RESOLVED"}
    )
    assert response.status_code == 404
