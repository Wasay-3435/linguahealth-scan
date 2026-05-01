from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.database import get_db, Assessment

router = APIRouter()

class DemographicData(BaseModel):
    name: str
    age: int
    gender: str
    education: str
    languages: str

class SIASData(BaseModel):
    assessment_id: int
    responses: list[int]  # 20 items, each 0-4

class LDQData(BaseModel):
    assessment_id: int
    responses: list[int]  # 10 items, each 0-10

@router.post("/demographics")
def submit_demographics(data: DemographicData, db: Session = Depends(get_db)):
    assessment = Assessment(
        name=data.name,
        age=data.age,
        gender=data.gender,
        education=data.education,
        languages=data.languages,
        sias_score=0,
        ldq_score=0,
        brain_health_index=0,
        risk_category="Pending"
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return {"assessment_id": assessment.id, "message": "Demographics saved"}

@router.post("/sias")
def submit_sias(data: SIASData, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == data.assessment_id).first()
    if not assessment:
        return {"error": "Assessment not found"}
    sias_score = sum(data.responses)
    assessment.sias_score = sias_score
    db.commit()
    return {"sias_score": sias_score, "message": "SIAS recorded"}

@router.post("/ldq")
def submit_ldq(data: LDQData, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == data.assessment_id).first()
    if not assessment:
        return {"error": "Assessment not found"}
    ldq_score = sum(data.responses)
    assessment.ldq_score = ldq_score
    db.commit()
    return {"ldq_score": ldq_score, "message": "LDQ recorded"}