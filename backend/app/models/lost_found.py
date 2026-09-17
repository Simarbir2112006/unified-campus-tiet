from datetime import date as date_, datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class ReportType(str, Enum):
    LOST = "LOST"
    FOUND = "FOUND"


class ReportStatus(str, Enum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"


class LostFoundReport(SQLModel, table=True):
    __tablename__ = "lost_found_report"

    id: int | None = Field(default=None, primary_key=True)

    type: ReportType = Field(index=True)
    item_name: str
    description: str
    location: str
    date: date_
    photo: str | None = None

    reporter_name: str
    roll_number: str
    contact_number: str

    status: ReportStatus = Field(default=ReportStatus.OPEN, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
