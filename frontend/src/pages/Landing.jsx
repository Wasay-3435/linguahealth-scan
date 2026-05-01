import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{
        minHeight: '88vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 24px', position: 'relative',
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute', width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(91,82,240,0.10) 0%, transparent 70%)',
          top: '40%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px',
          background: 'rgba(91,82,240,0.12)', border: '1px solid rgba(91,82,240,0.25)',
          borderRadius: 999, fontSize: 12, color: 'var(--accent-secondary)',
          fontWeight: 600, marginBottom: 32, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent-secondary)', display: 'inline-block',
          }} />
          AI-Powered Neuropsycholinguistic Screening
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(38px, 5.5vw, 68px)',
          fontWeight: 800, lineHeight: 1.08, marginBottom: 22,
          background: 'linear-gradient(135deg, #eeeeff 25%, #8b83ff 60%, #00c8e0)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Unlocking Brain Health<br />Through Language
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: 17,
          maxWidth: 520, lineHeight: 1.75, marginBottom: 44,
        }}>
          LinguaHealth-Scan uses artificial intelligence to analyze how you speak
          and write — detecting early signs of cognitive, neurological, and mental
          health changes through subtle linguistic patterns.
        </p>

        <button className="btn-primary"
          style={{ fontSize: 16, padding: '15px 38px', borderRadius: 12 }}
          onClick={() => navigate('/demographics')}>
          Begin Free Screening
        </button>

        <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 14, letterSpacing: 0.3 }}>
          5–8 minutes &nbsp;·&nbsp; Non-invasive &nbsp;·&nbsp; Not a clinical diagnosis
        </p>
      </div>

      {/* Feature cards */}
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" stroke="#5b52f0" strokeWidth="1.5"/>
                  <path d="M10 14 Q14 9 18 14 Q14 19 10 14Z" fill="#5b52f0" opacity="0.7"/>
                </svg>
              ),
              title: 'Speech Analysis',
              desc: 'Prosody, pitch, pauses, and vocal biomarkers extracted from your voice',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="6" y="8" width="16" height="2" rx="1" fill="#00c8e0"/>
                  <rect x="6" y="13" width="12" height="2" rx="1" fill="#00c8e0" opacity="0.7"/>
                  <rect x="6" y="18" width="14" height="2" rx="1" fill="#00c8e0" opacity="0.4"/>
                </svg>
              ),
              title: 'Text Analysis',
              desc: 'Syntax complexity, vocabulary richness, and semantic coherence scored by AI',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="9" stroke="#8b83ff" strokeWidth="1.5" fill="none"/>
                  <path d="M14 5 A9 9 0 0 1 23 14" stroke="#8b83ff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Brain Health Index',
              desc: 'A 0–100 composite score summarizing your overall linguistic-cognitive profile',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="7" y="4" width="14" height="20" rx="3" stroke="#22c97e" strokeWidth="1.5"/>
                  <rect x="10" y="9" width="8" height="1.5" rx="0.75" fill="#22c97e" opacity="0.8"/>
                  <rect x="10" y="13" width="6" height="1.5" rx="0.75" fill="#22c97e" opacity="0.5"/>
                  <rect x="10" y="17" width="7" height="1.5" rx="0.75" fill="#22c97e" opacity="0.3"/>
                </svg>
              ),
              title: 'PDF Report',
              desc: 'Clinician-ready downloadable report with full linguistic biomarker breakdown',
            },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: '24px 22px' }}>
              <div style={{ marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}