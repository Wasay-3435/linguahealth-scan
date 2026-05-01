import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

export default function SpeechTask() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    } catch {
      setError('Microphone access denied. Please allow microphone access in your browser.');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach(t => t.stop());
    clearInterval(timerRef.current);
    setRecording(false);
  };

  const submit = async () => {
    if (!audioBlob) { setError('Please record your speech first.'); return; }
    setLoading(true);
    const assessment_id = localStorage.getItem('assessment_id');
    const formData = new FormData();
    formData.append('assessment_id', assessment_id);
    formData.append('audio', audioBlob, 'recording.wav');
    try {
      await axios.post('http://localhost:8000/api/analyze/speech', formData);
      navigate('/text');
    } catch { setError('Error uploading audio. You can skip this step.'); }
    finally { setLoading(false); }
  };

  const fmt = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Speech Recording</h1>
          <p>Speak freely for 60–90 seconds about your day, a recent memory, or anything on your mind.</p>
        </div>
        <ProgressBar currentStep={3} />
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48,
            background: recording
              ? 'rgba(248,113,113,0.15)' : 'rgba(108,99,255,0.1)',
            border: `2px solid ${recording ? 'var(--danger)' : 'var(--border-color)'}`,
            animation: recording ? 'pulse 1.5s infinite' : 'none',
          }}>
            🎙️
          </div>
          <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }`}</style>

          {recording && (
            <div style={{ fontSize: 32, fontFamily: 'Syne', fontWeight: 700, color: 'var(--danger)', marginBottom: 16 }}>
              {fmt(elapsed)}
            </div>
          )}

          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            <b>Prompt:</b> "Please describe what you did this morning, how you're feeling today,
            and something you're looking forward to."
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {!recording && !audioBlob && (
              <button className="btn-primary" onClick={startRecording}>🔴 Start Recording</button>
            )}
            {recording && (
              <button className="btn-primary" onClick={stopRecording}
                style={{ background: 'var(--danger)', backgroundImage: 'none' }}>
                ⏹ Stop Recording
              </button>
            )}
            {audioBlob && !recording && (
              <button className="btn-secondary" onClick={() => { setAudioBlob(null); setAudioUrl(null); }}>
                🔄 Re-record
              </button>
            )}
          </div>

          {audioUrl && (
            <div style={{ marginTop: 24 }}>
              <p style={{ color: 'var(--success)', marginBottom: 12 }}>✅ Recording complete!</p>
              <audio controls src={audioUrl} style={{ width: '100%' }} />
            </div>
          )}
          {error && <p className="error-msg" style={{ marginTop: 12 }}>{error}</p>}
        </div>

        <div className="step-actions" style={{ marginBottom: 48 }}>
          <button className="btn-secondary" onClick={() => navigate('/ldq')}>← Back</button>
          <button className="btn-secondary" onClick={() => navigate('/text')}>Skip Speech →</button>
          {audioBlob && (
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Uploading...' : 'Submit & Continue →'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}