def calculate_brain_health_index(
    text_features: dict,
    speech_features: dict,
    sias_score: float,
    ldq_score: float
) -> dict:
    """
    Calculate Brain Health Index (0-100) and risk category.
    Higher score = healthier linguistic profile.
    """
    score = 100.0

    # --- TEXT ANALYSIS PENALTIES ---
    lex_div = text_features.get("lexical_diversity", 0.5)
    # Low lexical diversity → deduct points
    if lex_div < 0.3:
        score -= 20
    elif lex_div < 0.5:
        score -= 10
    elif lex_div > 0.7:
        score += 5  # Bonus for rich vocabulary

    syntactic_depth = text_features.get("syntactic_depth", 2)
    # Very shallow syntax → possible simplification
    if syntactic_depth < 1.5:
        score -= 15
    elif syntactic_depth < 2.5:
        score -= 5

    coherence = text_features.get("coherence_score", 0.5)
    if coherence < 0.3:
        score -= 10
    elif coherence > 0.6:
        score += 5

    word_count = text_features.get("word_count", 50)
    if word_count < 20:
        score -= 15  # Very short response is a flag

    # --- SPEECH ANALYSIS PENALTIES ---
    silence_ratio = speech_features.get("silence_ratio", 0)
    if silence_ratio > 0.5:
        score -= 15  # Excessive pausing
    elif silence_ratio > 0.3:
        score -= 7

    pitch_var = speech_features.get("pitch_variability", 50)
    if pitch_var < 10:
        score -= 10  # Flat/monotone speech
    
    # --- PSYCHOMETRIC ADJUSTMENTS ---
    # High SIAS (anxiety) score → may explain speech hesitations
    anxiety_adjustment = (sias_score / 80) * 10  # Max 10 point buffer
    score += anxiety_adjustment

    # High LDQ score → self-reported language difficulty
    ldq_penalty = (ldq_score / 100) * 15
    score -= ldq_penalty

    # Clamp score to 0-100
    score = max(0, min(100, score))

    # Risk Category
    if score >= 70:
        risk_category = "Low"
        risk_color = "green"
    elif score >= 45:
        risk_category = "Moderate"
        risk_color = "orange"
    else:
        risk_category = "High"
        risk_color = "red"

    # CELF-inspired domain scores
    celf_domains = {
        "Expressive Language": min(100, int(lex_div * 100 + syntactic_depth * 10)),
        "Receptive Language": min(100, int(coherence * 100)),
        "Semantic Index": min(100, int(lex_div * 120)),
        "Morphosyntactic Index": min(100, int(syntactic_depth * 25)),
        "Working Memory": min(100, max(0, int(100 - silence_ratio * 100))),
    }

    return {
        "brain_health_index": round(score, 1),
        "risk_category": risk_category,
        "risk_color": risk_color,
        "celf_domains": celf_domains,
        "interpretation": _get_interpretation(risk_category, score),
    }

def _get_interpretation(risk_category: str, score: float) -> str:
    if risk_category == "Low":
        return (
            "Your linguistic profile shows strong cognitive-linguistic functioning. "
            "No significant markers of concern detected at this time."
        )
    elif risk_category == "Moderate":
        return (
            "Some linguistic markers suggest mild variation from typical patterns. "
            "Consider follow-up screening or consultation with a specialist."
        )
    else:
        return (
            "Several linguistic markers indicate patterns that may warrant professional evaluation. "
            "We recommend consulting a neurologist or speech-language pathologist."
        )