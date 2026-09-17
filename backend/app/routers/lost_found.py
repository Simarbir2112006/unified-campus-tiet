from datetime import date as date_type

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, or_, select

from app.core.storage import save_photo
from app.db.session import get_session
from app.models.lost_found import LostFoundReport, ReportStatus, ReportType
from app.schemas.lost_found import (
    LostFoundReportDetail,
    LostFoundReportSummary,
    StatusUpdate,
)

router = APIRouter(prefix="/lost-found/reports", tags=["lost-found"])


@router.post("", response_model=LostFoundReportDetail, status_code=201)
async def create_report(
    type: ReportType = Form(...),
    item_name: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    date: date_type = Form(...),
    reporter_name: str = Form(...),
    roll_number: str = Form(...),
    contact_number: str = Form(...),
    photo: UploadFile | None = File(None),
    session: Session = Depends(get_session),
):
    photo_path = None
    if photo is not None and photo.filename:
        photo_path = await save_photo(photo)

    report = LostFoundReport(
        type=type,
        item_name=item_name,
        description=description,
        location=location,
        date=date,
        reporter_name=reporter_name,
        roll_number=roll_number,
        contact_number=contact_number,
        photo=photo_path,
    )

    try:
        session.add(report)
        session.commit()
        session.refresh(report)
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Could not save report")

    return report


@router.get("", response_model=list[LostFoundReportSummary])
def list_reports(
    type: ReportType | None = None,
    search: str | None = None,
    status: ReportStatus | None = None,
    session: Session = Depends(get_session),
):
    query = select(LostFoundReport)

    if type is not None:
        query = query.where(LostFoundReport.type == type)

    if status is not None:
        query = query.where(LostFoundReport.status == status)

    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                LostFoundReport.item_name.ilike(pattern),
                LostFoundReport.description.ilike(pattern),
                LostFoundReport.location.ilike(pattern),
            )
        )

    try:
        return session.exec(query.order_by(LostFoundReport.created_at.desc())).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Could not retrieve reports")


@router.get("/{report_id}", response_model=LostFoundReportDetail)
def get_report(report_id: int, session: Session = Depends(get_session)):
    try:
        report = session.get(LostFoundReport, report_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Could not retrieve report")

    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    return report


@router.patch("/{report_id}/status", response_model=LostFoundReportDetail)
def update_status(
    report_id: int,
    payload: StatusUpdate,
    session: Session = Depends(get_session),
):
    try:
        report = session.get(LostFoundReport, report_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Could not update report")

    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = payload.status

    try:
        session.add(report)
        session.commit()
        session.refresh(report)
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Could not update report")

    return report
