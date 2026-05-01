from textblob import TextBlob

def analyze_text(text: str) -> dict:
    blob = TextBlob(text)
    words = text.split()
    
    if len(words) == 0:
        return _empty_result()
    
    # Simple lexical diversity
    unique_words = set([w.lower() for w in words])
    ttr = len(unique_words) / len(words)
    
    # Sentence count
    sentence_count = max(text.count('.'), text.count('!'), text.count('?'), 1)
    avg_sentence_length = len(words) / sentence_count
    
    # Sentiment
    sentiment = blob.sentiment.polarity
    
    return {
        "word_count": len(words),
        "lexical_diversity": round(ttr, 3),
        "avg_sentence_length": round(avg_sentence_length, 2),
        "syntactic_depth": round(10 - min(10, avg_sentence_length / 2), 2),
        "sentiment_polarity": round(sentiment, 3),
        "subjectivity": round(blob.sentiment.subjectivity, 3),
        "coherence_score": 0.5,
        "sentence_count": sentence_count,
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