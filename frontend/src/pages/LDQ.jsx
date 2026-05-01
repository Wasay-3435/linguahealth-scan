import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

const LDQ_QUESTIONS = [
  "I have difficulty finding the right word when speaking.",
  "I often lose track of what I was saying mid-sentence.",
  "I have trouble understanding complex sentences.",
  "I mix up similar-sounding words.",
  "I have difficulty organizing my thoughts when writing.",
  "I forget names of familiar people or objects.",
  "I have trouble following rapid conversations.",
  "I feel my speech has slowed down recently.",
  "I repeat myself without realizing it.",
  "I have difficulty reading and retaining information.",
];

export default function LDQ() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(new Array(10).fill(5));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (i, v) => {
    const r = [...responses]; r[i] = parseInt(v); setResponses(r);
  };

  const submit = async () => {
    setLoading(true);
    const assessment_id = parseInt(localStorage.getItem('assessment_id'));
    try {
      await axios.post('http://localhost:8000/api/questionnaire/ldq', { assessment_id, responses });
      navigate('/speech');
    } catch { setError('Error saving responses.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Language Difficulty Questionnaire</h1>
          <p>Rate each statement from 0 (Never) to 10 (Always). Be as honest as possible.</p>
        </div>
        <ProgressBar currentStep={2} />
        {LDQ_QUESTIONS.map((q, i) => (
          <div key={i} className="card" style={{ padding: '20px 24px' }}>
            <p style={{ marginBottom: 14, fontWeight: 500, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent-secondary)', fontFamily: 'Syne', fontWeight: 700 }}>{i + 1}.</span>{' '}{q}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 45 }}>Never</span>
              <input type="range" min="0" max="10" value={responses[i]}
                onChange={e => set(i, e.target.value)}
                style={{ flex: 1, accentColor: '#6c63ff' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 45, textAlign: 'right' }}>Always</span>
              <span style={{
                minWidth: 36, height: 36, borderRadius: 8, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--gradient)', color: 'white', fontWeight: 700, fontSize: 15,
              }}>{responses[i]}</span>
            </div>
          </div>
        ))}
        {error && <p className="error-msg">{error}</p>}
        <div className="step-actions" style={{ marginBottom: 48 }}>
          <button className="btn-secondary" onClick={() => navigate('/sias')}>← Back</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Saving...' : 'Next: Speech Task →'}
          </button>
        </div>
      </div>
    </>
  );
}