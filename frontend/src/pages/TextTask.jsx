import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

export default function TextTask() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const submit = async () => {
    if (wordCount < 30) { setError('Please write at least 30 words for a meaningful analysis.'); return; }
    setLoading(true);
    const assessment_id = localStorage.getItem('assessment_id');
    const formData = new FormData();
    formData.append('assessment_id', assessment_id);
    formData.append('text', text);
    try {
      await axios.post('http://localhost:8000/api/analyze/text', formData);
      // Finalize
      await axios.post(`http://localhost:8000/api/analyze/finalize?assessment_id=${assessment_id}`);
      navigate('/results');
    } catch { setError('Error submitting text. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Written Language Sample</h1>
          <p>Write freely in response to the prompt below. Aim for at least 3–5 sentences.</p>
        </div>
        <ProgressBar currentStep={4} />
        <div className="card">
          <div style={{
            background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 10, padding: '16px 20px', marginBottom: 20,
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--accent-secondary)', lineHeight: 1.7 }}>
              ✍️ <b>Prompt:</b> Describe a place that is meaningful to you and explain why it matters.
              Include what you see, feel, and remember about this place.
            </p>
          </div>
          <div className="form-group">
            <label>Your Response</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Start writing here..."
              style={{ minHeight: 180 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: 13,
              color: wordCount >= 30 ? 'var(--success)' : 'var(--text-secondary)'
            }}>
              {wordCount} words {wordCount >= 30 ? '✓' : `(${30 - wordCount} more needed)`}
            </span>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="step-actions" style={{ marginTop: 16 }}>
            <button className="btn-secondary" onClick={() => navigate('/speech')}>← Back</button>
            <button className="btn-primary" onClick={submit} disabled={loading || wordCount < 30}>
              {loading ? 'Analyzing...' : 'Analyze & View Results →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}