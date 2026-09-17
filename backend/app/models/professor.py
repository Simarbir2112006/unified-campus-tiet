from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class Professor(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    department: str = Field(index=True)
    designation: str
    official_email: str = Field(unique=True, index=True)

    phone: str | None = None
    cabin: str | None = None
    subjects: str | None = None

    google_scholar_url: str | None = None
    personal_website_url: str | None = None
    linkedin_url: str | None = None
    other_links: list[dict] | None = Field(default=None, sa_column=Column(JSON))
