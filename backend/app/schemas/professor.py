from sqlmodel import SQLModel


class ProfessorRead(SQLModel):
    id: int
    name: str
    department: str
    designation: str
    official_email: str

    phone: str | None = None
    cabin: str | None = None
    subjects: str | None = None

    google_scholar_url: str | None = None
    personal_website_url: str | None = None
    linkedin_url: str | None = None
    other_links: list[dict] | None = None
