from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io

def generate_pdf_report(assessment_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)

    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle('Title', parent=styles['Title'],
                                  fontSize=26, textColor=colors.HexColor('#1a1a2e'),
                                  spaceAfter=4, alignment=1)
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'],
                                     fontSize=12, textColor=colors.HexColor('#5b52f0'),
                                     spaceAfter=20, alignment=1)

    story.append(Paragraph("LinguaHealth-Scan", title_style))
    story.append(Paragraph("Neuropsycholinguistic Health Screening Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#5b52f0')))
    story.append(Spacer(1, 24))

    section_style = ParagraphStyle('Section', parent=styles['Heading2'],
                                    fontSize=14, textColor=colors.HexColor('#1a1a2e'),
                                    spaceBefore=18, spaceAfter=10)
    body_style = ParagraphStyle('Body', parent=styles['Normal'],
                                 fontSize=11, leading=17,
                                 textColor=colors.HexColor('#333333'))

    story.append(Paragraph("Patient Information", section_style))
    info_data = [
        ["Name",      assessment_data.get("name", "N/A")],
        ["Age",       str(assessment_data.get("age", "N/A"))],
        ["Gender",    assessment_data.get("gender", "N/A")],
        ["Education", assessment_data.get("education", "N/A")],
    ]
    info_table = Table(info_data, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND',   (0, 0), (0, -1), colors.HexColor('#f0f0f8')),
        ('FONTNAME',     (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE',     (0, 0), (-1, -1), 11),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [colors.white, colors.HexColor('#f8f8ff')]),
        ('GRID',         (0, 0), (-1, -1), 0.5, colors.HexColor('#d0d0e0')),
        ('PADDING',      (0, 0), (-1, -1), 8),
        ('TEXTCOLOR',    (0, 0), (-1, -1), colors.HexColor('#1a1a2e')),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 24))

    story.append(Paragraph("Brain Health Index", section_style))

    bhi  = assessment_data.get("brain_health_index", 0)
    risk = assessment_data.get("risk_category", "Unknown")
    risk_hex = {"Low": "#22c97e", "Moderate": "#f0a020", "High": "#e85555"}.get(risk, "#888888")
    risk_color = colors.HexColor(risk_hex)

    score_style = ParagraphStyle('Score', parent=styles['Normal'],
                                  fontSize=48, alignment=1,
                                  textColor=risk_color,
                                  spaceAfter=0, spaceBefore=0,
                                  leading=60)
    story.append(Paragraph(f"{bhi}/100", score_style))
    story.append(Spacer(1, 8))

    risk_style = ParagraphStyle('Risk', parent=styles['Normal'],
                                 fontSize=15, alignment=1,
                                 textColor=risk_color,
                                 spaceBefore=0, spaceAfter=14,
                                 fontName='Helvetica-Bold')
    story.append(Paragraph(f"Risk Category: {risk}", risk_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph(assessment_data.get("interpretation", ""), body_style))
    story.append(Spacer(1, 24))

    story.append(Paragraph("CELF-Aligned Linguistic Domains", section_style))
    celf = assessment_data.get("celf_domains", {})
    celf_data = [["Domain", "Score"]] + [[k, f"{v}/100"] for k, v in celf.items()]
    celf_table = Table(celf_data, colWidths=[3.5*inch, 2.5*inch])
    celf_table.setStyle(TableStyle([
        ('BACKGROUND',   (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR',    (0, 0), (-1, 0), colors.white),
        ('FONTNAME',     (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8f8ff')]),
        ('GRID',         (0, 0), (-1, -1), 0.5, colors.HexColor('#d0d0e0')),
        ('PADDING',      (0, 0), (-1, -1), 9),
        ('FONTSIZE',     (0, 0), (-1, -1), 11),
        ('ALIGN',        (1, 0), (1, -1), 'CENTER'),
        ('TEXTCOLOR',    (0, 1), (-1, -1), colors.HexColor('#1a1a2e')),
    ]))
    story.append(celf_table)
    story.append(Spacer(1, 24))

    story.append(Paragraph("Psychometric Profile", section_style))
    psych_data = [
        ["SIAS Score (Social Anxiety)",     f"{assessment_data.get('sias_score', 0):.0f}/80"],
        ["LDQ Score (Language Difficulty)", f"{assessment_data.get('ldq_score', 0):.0f}/100"],
    ]
    psych_table = Table(psych_data, colWidths=[3.5*inch, 2.5*inch])
    psych_table.setStyle(TableStyle([
        ('BACKGROUND',   (0, 0), (0, -1), colors.HexColor('#f0f0f8')),
        ('FONTNAME',     (0, 0), (0, -1), 'Helvetica-Bold'),
        ('GRID',         (0, 0), (-1, -1), 0.5, colors.HexColor('#d0d0e0')),
        ('PADDING',      (0, 0), (-1, -1), 9),
        ('FONTSIZE',     (0, 0), (-1, -1), 11),
        ('TEXTCOLOR',    (0, 0), (-1, -1), colors.HexColor('#1a1a2e')),
    ]))
    story.append(psych_table)
    story.append(Spacer(1, 32))

    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#d0d0e0')))
    story.append(Spacer(1, 12))
    disclaimer_style = ParagraphStyle('Disclaimer', parent=styles['Normal'],
                                       fontSize=9, textColor=colors.HexColor('#888888'),
                                       leading=14)
    story.append(Paragraph(
        "DISCLAIMER: This report is generated by an AI-powered screening tool and is NOT a clinical "
        "diagnosis. Results should be reviewed by a qualified healthcare professional. "
        "LinguaHealth-Scan is intended for early screening purposes only.",
        disclaimer_style
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()