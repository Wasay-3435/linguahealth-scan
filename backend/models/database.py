from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./linguahealth.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    education = Column(String)
    languages = Column(String)
    sias_score = Column(Float)
    ldq_score = Column(Float)
    text_sample = Column(Text)
    audio_path = Column(String, nullable=True)
    lexical_diversity = Column(Float, nullable=True)
    sentiment_score = Column(Float, nullable=True)
    syntactic_complexity = Column(Float, nullable=True)
    speech_rate = Column(Float, nullable=True)
    brain_health_index = Column(Float)
    risk_category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()