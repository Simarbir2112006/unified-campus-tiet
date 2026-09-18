import json

import pytest
from sqlmodel import Session, delete, select

from app.db.session import engine
from app.models.professor import Professor
from seed.seed_professors import SeedDataError, load_seed_records, seed_professors

TEST_EMAILS = ["seed.alpha@example.com", "seed.beta@example.com"]


@pytest.fixture(autouse=True)
def cleanup_seeded_professors():
    """Removes any professor rows this test file creates, by email, so the
    seed tests never leave real-looking rows behind in the dev database.
    """
    yield

    with Session(engine) as session:
        session.exec(delete(Professor).where(Professor.official_email.in_(TEST_EMAILS)))
        session.commit()


def _write_seed_file(tmp_path, records):
    path = tmp_path / "professors.json"
    path.write_text(json.dumps(records))
    return path


def test_load_seed_records_fills_optional_defaults(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [
            {
                "name": "Seed Alpha",
                "department": "Computer Science",
                "designation": "Professor",
                "official_email": TEST_EMAILS[0],
            }
        ],
    )

    records = load_seed_records(path)

    assert len(records) == 1
    assert records[0]["name"] == "Seed Alpha"
    assert records[0]["phone"] is None
    assert records[0]["other_links"] is None


def test_load_seed_records_missing_required_field(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [{"name": "Seed Alpha", "department": "Computer Science"}],
    )

    with pytest.raises(SeedDataError, match="missing required field"):
        load_seed_records(path)


def test_load_seed_records_rejects_invalid_other_links(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [
            {
                "name": "Seed Alpha",
                "department": "Computer Science",
                "designation": "Professor",
                "official_email": TEST_EMAILS[0],
                "other_links": ["not-an-object"],
            }
        ],
    )

    with pytest.raises(SeedDataError, match="other_links must be a list of objects"):
        load_seed_records(path)


def test_load_seed_records_rejects_non_array_root(tmp_path):
    path = tmp_path / "professors.json"
    path.write_text(json.dumps({"not": "a list"}))

    with pytest.raises(SeedDataError, match="must contain a JSON array"):
        load_seed_records(path)


def test_seed_professors_creates_new_record(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [
            {
                "name": "Seed Alpha",
                "department": "Computer Science",
                "designation": "Professor",
                "official_email": TEST_EMAILS[0],
                "subjects": "Testing",
            }
        ],
    )

    with Session(engine) as session:
        summary = seed_professors(session, load_seed_records(path))
        assert summary == {"created": 1, "updated": 0, "unchanged": 0}

        row = session.exec(
            select(Professor).where(Professor.official_email == TEST_EMAILS[0])
        ).first()
        assert row is not None
        assert row.subjects == "Testing"


def test_seed_professors_is_idempotent_and_never_duplicates(tmp_path):
    path = _write_seed_file(
        tmp_path,
        [
            {
                "name": "Seed Alpha",
                "department": "Computer Science",
                "designation": "Professor",
                "official_email": TEST_EMAILS[0],
            }
        ],
    )
    records = load_seed_records(path)

    with Session(engine) as session:
        first_run = seed_professors(session, records)
        second_run = seed_professors(session, records)

    assert first_run == {"created": 1, "updated": 0, "unchanged": 0}
    assert second_run == {"created": 0, "updated": 0, "unchanged": 1}

    with Session(engine) as session:
        rows = session.exec(
            select(Professor).where(Professor.official_email == TEST_EMAILS[0])
        ).all()
        assert len(rows) == 1


def test_seed_professors_updates_changed_fields_without_duplicating(tmp_path):
    original = _write_seed_file(
        tmp_path,
        [
            {
                "name": "Seed Alpha",
                "department": "Computer Science",
                "designation": "Assistant Professor",
                "official_email": TEST_EMAILS[0],
            }
        ],
    )

    with Session(engine) as session:
        seed_professors(session, load_seed_records(original))

    updated = _write_seed_file(
        tmp_path,
        [
            {
                "name": "Seed Alpha",
                "department": "Computer Science",
                "designation": "Professor",
                "official_email": TEST_EMAILS[0],
            }
        ],
    )

    with Session(engine) as session:
        summary = seed_professors(session, load_seed_records(updated))
        assert summary == {"created": 0, "updated": 1, "unchanged": 0}

        rows = session.exec(
            select(Professor).where(Professor.official_email == TEST_EMAILS[0])
        ).all()
        assert len(rows) == 1
        assert rows[0].designation == "Professor"


def test_seed_professors_leaves_unrelated_rows_alone():
    with Session(engine) as session:
        session.add(
            Professor(
                name="Seed Beta",
                department="Mechanical",
                designation="Professor",
                official_email=TEST_EMAILS[1],
            )
        )
        session.commit()

        summary = seed_professors(session, [])
        assert summary == {"created": 0, "updated": 0, "unchanged": 0}

        row = session.exec(
            select(Professor).where(Professor.official_email == TEST_EMAILS[1])
        ).first()
        assert row is not None
