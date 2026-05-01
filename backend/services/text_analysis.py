from textblob import TextBlob
import textstat

def analyze_text(text: str) -> dict:
    """Analyze text using TextBlob and textstat (no complex dependencies)."""
    blob = TextBlob(text)
    words = text.split()
    
    if len(words) == 0:
        return _empty_result()
    
    # Lexical diversity (Type-Token Ratio)
    unique_words = set(words)
    ttr = len(unique_words) / len(words)
    
    # Sentence complexity from textstat
    try:
        sentence_count = textstat.sentence_count(text)
        avg_sentence_length = len(words) / max(sentence_count, 1)
    except:
        avg_sentence_length = len(words) / max(text.count('.'), 1)
    
    # Sentiment
    sentiment = blob.sentiment.polarity  # -1 to 1
    subjectivity = blob.sentiment.subjectivity  # 0 to 1
    
    # Flesch Reading Ease as syntactic complexity proxy (0-100, higher = easier)
    try:
        flesch = textstat.flesch_reading_ease(text)
        syntactic_complexity = max(0, min(100, flesch))
    except:
        syntactic_complexity = 50
    
    # Coherence estimate (pronoun to noun ratio - simplified)
    nouns = len([w for w in words if w[0].isupper() and len(w) > 2])  # rough proxy
    pronouns = len([w for w in words if w.lower() in ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']])
    coherence = nouns / max(pronouns + nouns, 1)
    
    return {
        "word_count": len(words),
        "lexical_diversity": round(ttr, 3),
        "avg_sentence_length": round(avg_sentence_length, 2),
        "syntactic_depth": round(100 - syntactic_complexity, 2),  # invert to match old scale
        "sentiment_polarity": round(sentiment, 3),
        "subjectivity": round(subjectivity, 3),
        "coherence_score": round(coherence, 3),
        "sentence_count": sentence_count if 'sentence_count' in locals() else text.count('.'),
    }

def _empty_result():
    return {
        "word_count": 0,
        "lexical_diversity": 0,
        "avg_sentence_length": 0,
        "syntactic_depth": 0,
        "sentiment_polarity": 0,
        "subjectivity": 0,
        "coherence_score": 0,
        "sentence_count": 0,
    }