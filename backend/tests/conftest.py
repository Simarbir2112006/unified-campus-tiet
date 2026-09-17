import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, delete

from app.db.session import engine
from app.main import app
from app.models.professor import Professor


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def sample_professors():
    """Creates clearly-fake, @example.com professor rows for the duration of a
    test and deletes them afterwards. Never touches real professor data -
    this is test-only fixture data, not seed data for the dev database.
    """
    professors = [
        Professor(
            name="Test Professor Alpha",
            department="Computer Science",
            designation="Professor",
            official_email="alpha.test@example.com",
            subjects="Testing, Quality Assurance",
        ),
        Professor(
            name="Test Professor Beta",
            department="Mechanical",
            designation="Assistant Professor",
            official_email="beta.test@example.com",
            subjects="Thermodynamics",
        ),
    ]

    with Session(engine) as session:
        for professor in professors:
            session.add(professor)
        session.commit()
        for professor in professors:
            session.refresh(professor)

    yield professors

    with Session(engine) as session:
        session.exec(
            delete(Professor).where(
                Professor.official_email.in_([p.official_email for p in professors])
            )
        )
        session.commit()
