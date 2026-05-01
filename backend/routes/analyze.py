from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from models.database import get_db, Assessment
from services.text_analysis import analyze_text
from services.speech_analysis import analyze_speech
from services.scoring import calculate_brain_health_index
import aiofiles
import os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/text")
async def analyze_text_sample(
    assessment_id: int = Form(...),
    text: str = Form(...),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        return {"error": "Assessment not found"}
    
    features = analyze_text(text)
    assessment.text_sample = text
    assessment.lexical_diversity = features["lexical_diversity"]
    assessment.sentiment_score = features["sentiment_polarity"]
    assessment.syntactic_complexity = features["syntactic_depth"]
    db.commit()
    
    return {"text_features": features, "message": "Text analyzed"}

@router.post("/speech")
async def analyze_speech_sample(
    assessment_id: int = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        return {"error": "Assessment not found"}
    
    audio_path = os.path.join(UPLOAD_DIR, f"audio_{assessment_id}.wav")
    async with aiofiles.open(audio_path, 'wb') as f:
        content = await audio.read()
        await f.write(content)
    
    features = analyze_speech(audio_path)
    assessment.audio_path = audio_path
    assessment.speech_rate = features.get("zero_crossing_rate", 0)
    db.commit()
    
    return {"speech_features": features, "message": "Speech analyzed"}

@router.post("/finalize")
def finalize_assessment(
    assessment_id: int,
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        return {"error": "Assessment not found"}
    
    text_features = {
        "lexical_diversity": assessment.lexical_diversity or 0.5,
        "syntactic_depth": assessment.syntactic_complexity or 2.0,
        "coherence_score": 0.5,
        "word_count": len((assessment.text_sample or "").split()),
        "sentiment_polarity": assessment.sentiment_score or 0,
    }
    speech_features = {
        "silence_ratio": 0.2,
        "pitch_variability": 40,
        "zero_crossing_rate": assessment.speech_rate or 0.05,
    }
    
    result = calculate_brain_health_index(
        text_features, speech_features,
        assessment.sias_score or 0,
        assessment.ldq_score or 0
    )
    
    assessment.brain_health_index = result["brain_health_index"]
    assessment.risk_category = result["risk_category"]
    db.commit()
    
    return {
        "assessment_id": assessment_id,
        "brain_health_index": result["brain_health_index"],
        "risk_category": result["risk_category"],
        "risk_color": result["risk_color"],
        "celf_domains": result["celf_domains"],
        "interpretation": result["interpretation"],
        "name": assessment.name,
        "age": assessment.age,
        "gender": assessment.gender,
        "education": assessment.education,
        "sias_score": assessment.sias_score,
        "ldq_score": assessment.ldq_score,
    }