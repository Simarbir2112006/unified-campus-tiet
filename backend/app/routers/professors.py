from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, or_, select

from app.db.session import get_session
from app.models.professor import Professor
from app.schemas.professor import ProfessorRead

router = APIRouter(prefix="/professors", tags=["professors"])


@router.get("", response_model=list[ProfessorRead])
def list_professors(
    search: str | None = None,
    department: str | None = None,
    session: Session = Depends(get_session),
):
    query = select(Professor)

    if department and department != "All":
        query = query.where(Professor.department == department)

    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                Professor.name.ilike(pattern),
                Professor.department.ilike(pattern),
                Professor.subjects.ilike(pattern),
            )
        )

    try:
        return session.exec(query.order_by(Professor.name)).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Could not retrieve professors")


@router.get("/departments", response_model=list[str])
def list_departments(session: Session = Depends(get_session)):
    try:
        departments = session.exec(
            select(Professor.department).distinct().order_by(Professor.department)
        ).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Could not retrieve departments")

    return departments


@router.get("/{professor_id}", response_model=ProfessorRead)
def get_professor(professor_id: int, session: Session = Depends(get_session)):
    try:
        professor = session.get(Professor, professor_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Could not retrieve professor")

    if professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")

    return professor
