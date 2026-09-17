from datetime import date

from sqlmodel import SQLModel

from app.models.lost_found import ReportStatus, ReportType


class LostFoundReportSummary(SQLModel):
    """Public listing shape. Deliberately excludes reporter_name, contact_number
    and roll_number - the listing is browsable by anyone, contact details are
    only revealed on the detail page, and roll_number is never exposed publicly.
    """

    id: int
    type: ReportType
    item_name: str
    description: str
    location: str
    date: date
    photo: str | None = None
    status: ReportStatus


class LostFoundReportDetail(LostFoundReportSummary):
    """Detail shape. Adds reporter_name + contact_number so a finder/owner can
    be reached, per the V1 privacy decision - but still never roll_number.
    """

    reporter_name: str
    contact_number: str


class StatusUpdate(SQLModel):
    status: ReportStatus
