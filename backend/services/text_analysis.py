import spacy
from textblob import TextBlob
import re

nlp = spacy.load("en_core_web_sm")

def analyze_text(text: str) -> dict:
    """Analyze text for linguistic markers."""
    doc = nlp(text)
    blob = TextBlob(text)

    # Lexical diversity (Type-Token Ratio)
    words = [token.text.lower() for token in doc if token.is_alpha]
    if len(words) == 0:
        return _empty_result()
    
    unique_words = set(words)
    ttr = len(unique_words) / len(words)

    # Sentence complexity (average words per sentence)
    sentences = list(doc.sents)
    avg_sentence_length = len(words) / max(len(sentences), 1)

    # Syntactic depth (average dependency tree depth)
    def get_depth(token):
        depth = 0
        while token.head != token:
            token = token.head
            depth += 1
        return depth
    
    depths = [get_depth(token) for token in doc if token.is_alpha]
    avg_depth = sum(depths) / max(len(depths), 1)

    # Sentiment
    sentiment = blob.sentiment.polarity      # -1 to 1
    subjectivity = blob.sentiment.subjectivity  # 0 to 1

    # Coherence estimate (ratio of pronouns to nouns — lower = better coherence)
    nouns = [t for t in doc if t.pos_ == "NOUN"]
    pronouns = [t for t in doc if t.pos_ == "PRON"]
    coherence = len(nouns) / max(len(pronouns) + len(nouns), 1)

    # Word count
    word_count = len(words)

    return {
        "word_count": word_count,
        "lexical_diversity": round(ttr, 3),
        "avg_sentence_length": round(avg_sentence_length, 2),
        "syntactic_depth": round(avg_depth, 2),
        "sentiment_polarity": round(sentiment, 3),
        "subjectivity": round(subjectivity, 3),
        "coherence_score": round(coherence, 3),
        "sentence_count": len(sentences),
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