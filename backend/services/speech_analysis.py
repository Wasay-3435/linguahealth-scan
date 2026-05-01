import librosa
import numpy as np

def analyze_speech(audio_path: str) -> dict:
    """Extract acoustic biomarkers from audio file."""
    try:
        y, sr = librosa.load(audio_path, sr=None)
        
        # Duration
        duration = librosa.get_duration(y=y, sr=sr)
        
        # Speech rate estimate (zero-crossing rate as proxy)
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        
        # Energy / loudness
        rms = np.mean(librosa.feature.rms(y=y))
        
        # Pitch (fundamental frequency)
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_values = pitches[magnitudes > np.median(magnitudes)]
        avg_pitch = float(np.mean(pitch_values)) if len(pitch_values) > 0 else 0.0
        pitch_variability = float(np.std(pitch_values)) if len(pitch_values) > 0 else 0.0
        
        # MFCCs (spectral features)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_means = np.mean(mfccs, axis=1).tolist()
        
        # Pause detection (silent segments)
        intervals = librosa.effects.split(y, top_db=30)
        speech_duration = sum((end - start) for start, end in intervals) / sr
        silence_ratio = 1 - (speech_duration / max(duration, 1))

        return {
            "duration_seconds": round(duration, 2),
            "avg_pitch_hz": round(avg_pitch, 2),
            "pitch_variability": round(pitch_variability, 2),
            "energy_rms": round(float(rms), 4),
            "zero_crossing_rate": round(float(zcr), 4),
            "silence_ratio": round(silence_ratio, 3),
            "mfcc_features": [round(m, 3) for m in mfcc_means],
        }

    except Exception as e:
        return {
            "duration_seconds": 0,
            "avg_pitch_hz": 0,
            "pitch_variability": 0,
            "energy_rms": 0,
            "zero_crossing_rate": 0,
            "silence_ratio": 0,
            "mfcc_features": [],
            "error": str(e)
        }