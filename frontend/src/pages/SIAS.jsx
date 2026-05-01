import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

const SIAS_QUESTIONS = [
  "I feel tense when I am talking with people I don't know well.",
  "I am afraid of being embarrassed in social situations.",
  "I feel tense when meeting new people.",
  "I feel anxious when speaking in front of others.",
  "I feel worried about saying something embarrassing.",
  "I feel nervous when I am in a group of people.",
  "I feel tense when I am the center of attention.",
  "I become anxious when I have to talk with others.",
  "I feel uncomfortable in social gatherings.",
  "I am afraid to talk to people I don't know.",
  "I feel nervous about meeting with other people.",
  "I feel anxious when I speak with people in authority.",
  "I feel tense when talking on the phone.",
  "I feel nervous when talking with people about myself.",
  "I feel uncomfortable expressing opinions in public.",
  "I feel anxious when I must perform or speak in public.",
  "I feel tense when I am criticized by others.",
  "I feel nervous in social situations.",
  "I feel anxious about going to social events.",
  "I am afraid of making a mistake in social situations.",
];

const LABELS = ['Not at all', 'Slightly', 'Somewhat', 'Very much', 'Extremely'];

export default function SIAS() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(new Array(20).fill(null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (i, v) => {
    const r = [...responses]; r[i] = v; setResponses(r);
  };

  const submit = async () => {
    if (responses.includes(null)) { setError('Please answer all questions.'); return; }
    setLoading(true);
    const assessment_id = parseInt(localStorage.getItem('assessment_id'));
    try {
      await axios.post('http://localhost:8000/api/questionnaire/sias', { assessment_id, responses });
      navigate('/ldq');
    } catch { setError('Error saving responses.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Social Interaction Anxiety Scale</h1>
          <p>Rate how often each statement applies to you. There are no right or wrong answers.</p>
        </div>
        <ProgressBar currentStep={1} />
        {SIAS_QUESTIONS.map((q, i) => (
          <div key={i} className="card" style={{ padding: '20px 24px' }}>
            <p style={{ marginBottom: 14, fontWeight: 500, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent-secondary)', fontFamily: 'Syne', fontWeight: 700 }}>
                {i + 1}.
              </span>{' '}{q}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LABELS.map((label, v) => (
                <button key={v} onClick={() => set(i, v)}
                  style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    background: responses[i] === v ? 'var(--gradient)' : 'var(--bg-secondary)',
                    border: `1px solid ${responses[i] === v ? 'transparent' : 'var(--border-color)'}`,
                    color: responses[i] === v ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.15s', fontFamily: 'DM Sans',
                  }}>
                  {v} – {label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {error && <p className="error-msg">{error}</p>}
        <div className="step-actions" style={{ marginBottom: 48 }}>
          <button className="btn-secondary" onClick={() => navigate('/demographics')}>← Back</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Saving...' : 'Next: Language Questionnaire →'}
          </button>
        </div>
      </div>
    </>
  );
}