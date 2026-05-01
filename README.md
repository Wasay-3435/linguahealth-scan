# 🧠 LinguaHealth-Scan

### Unlocking Brain Health Through Language

LinguaHealth-Scan is an AI-powered neuropsycholinguistic screening tool that analyzes speech and writing to detect early indicators of cognitive, neurological, and mental health conditions through subtle linguistic patterns.

---

## What It Does

- 🎙️ **Speech Analysis** — Extracts acoustic biomarkers: pitch, prosody, pauses, energy
- ✍️ **Text Analysis** — Analyzes syntax complexity, vocabulary richness, and semantic coherence
- 📊 **Brain Health Index** — Generates a 0–100 composite cognitive-linguistic score
- 📋 **CELF-Aligned Scoring** — Rates expressive, receptive, semantic, and morphosyntactic domains
- 🧠 **Psychometric Integration** — Includes SIAS (social anxiety) and LDQ (language difficulty) questionnaires
- 📄 **PDF Report** — Produces a downloadable clinician-ready report

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| NLP | spaCy, TextBlob |
| Audio | Librosa |
| Database | SQLite + SQLAlchemy |
| PDF | ReportLab |

---

## Getting Started

### Prerequisites
- Python 3.11
- Node.js 20+

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Screening Flow

1. **Demographics** — Age, gender, education, languages spoken
2. **SIAS** — 20-item Social Interaction Anxiety Scale
3. **LDQ** — 10-item Language Difficulty Questionnaire
4. **Speech Task** — 60–90 second free speech recording
5. **Text Task** — Written response to a structured prompt
6. **Results** — Brain Health Index, domain scores, PDF report

---

## Disclaimer

This tool is intended for early screening purposes only and does **not** constitute a clinical diagnosis. Results should always be reviewed by a qualified healthcare professional.

---

## License

MIT License — feel free to use, modify, and build on this project.