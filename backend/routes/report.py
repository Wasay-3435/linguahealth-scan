from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from models.database import get_db, Assessment
from services.scoring import calculate_brain_health_index
from services.pdf_generator import generate_pdf_report

router = APIRouter()

@router.get("/pdf/{assessment_id}")
def download_pdf(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        return {"error": "Assessment not found"}
    
    text_features = {
        "lexical_diversity": assessment.lexical_diversity or 0.5,
        "syntactic_depth": assessment.syntactic_complexity or 2.0,
        "coherence_score": 0.5,
        "word_count": len((assessment.text_sample or "").split()),
    }
    speech_features = {
        "silence_ratio": 0.2,
        "pitch_variability": 40,
    }
    
    result = calculate_brain_health_index(
        text_features, speech_features,
        assessment.sias_score or 0,
        assessment.ldq_score or 0
    )
    
    report_data = {
        "name": assessment.name,
        "age": assessment.age,
        "gender": assessment.gender,
        "education": assessment.education,
        "brain_health_index": result["brain_health_index"],
        "risk_category": result["risk_category"],
        "interpretation": result["interpretation"],
        "celf_domains": result["celf_domains"],
        "sias_score": assessment.sias_score,
        "ldq_score": assessment.ldq_score,
    }
    
    pdf_bytes = generate_pdf_report(report_data)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=LinguaHealth_Report_{assessment_id}.pdf"}
    )