import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('assessment_id');
    axios.post(`http://localhost:8000/api/analyze/finalize?assessment_id=${id}`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const downloadPDF = () => {
    const id = localStorage.getItem('assessment_id');
    window.open(`http://localhost:8000/api/report/pdf/${id}`, '_blank');
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', paddingTop: 120 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          <img src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
            style={{ width: 64, opacity: 0.7 }} alt="analyzing" />
        </div>
        <h2 style={{ fontFamily: 'Syne', color: 'var(--accent-secondary)' }}>Analyzing your data...</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>This takes just a moment.</p>
      </div>
    </>
  );

  if (!data) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', paddingTop: 120 }}>
        <p style={{ color: 'var(--danger)' }}>Could not load results. Please try again.</p>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>Start Over</button>
      </div>
    </>
  );

  const riskColor = { Low: 'var(--success)', Moderate: 'var(--warning)', High: 'var(--danger)' }[data.risk_category] || '#888';
  const bhi = data.brain_health_index;
  const CELF_COLORS = ['#6c63ff', '#22d3ee', '#a78bfa', '#34d399', '#fbbf24'];

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingBottom: 60 }}>
        <div className="page-header">
          <h1>Your Results</h1>
          <p>Hi {data.name}, here is your LinguaHealth-Scan report.</p>
        </div>
        <ProgressBar currentStep={5} />

        {/* BHI Card — FIXED: score and label are now separate elements, no overlap */}
        <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <p style={{
            color: 'var(--text-secondary)', fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20,
          }}>
            Brain Health Index
          </p>

          {/* Gauge circle */}
          <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 16px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="74" fill="none"
                stroke="var(--border-color)" strokeWidth="12" />
              <circle cx="90" cy="90" r="74" fill="none"
                stroke={riskColor} strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 74 * bhi / 100} ${2 * Math.PI * 74}`}
                strokeLinecap="round"
                transform="rotate(-90 90 90)" />
            </svg>
            {/* Score text — absolutely centered inside svg */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 42, fontFamily: 'Syne', fontWeight: 800,
                color: riskColor, lineHeight: 1,
              }}>{bhi}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>/100</span>
            </div>
          </div>

          {/* Risk badge — separate from the gauge, no overlap possible */}
          <div style={{
            display: 'inline-block', padding: '6px 22px', borderRadius: 999,
            background: `${riskColor}22`,
            border: `1px solid ${riskColor}55`,
            color: riskColor, fontWeight: 700, fontSize: 15, marginBottom: 18,
          }}>
            {data.risk_category} Risk
          </div>

          <p style={{
            color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: 500, margin: '0 auto',
          }}>
            {data.interpretation}
          </p>
        </div>

        {/* CELF Domains */}
        <div className="card">
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 20 }}>
            Linguistic Domain Scores
          </h3>
          {Object.entries(data.celf_domains).map(([domain, score], i) => (
            <div key={domain} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{domain}</span>
                <span style={{ fontSize: 14, color: CELF_COLORS[i], fontWeight: 700 }}>{score}/100</span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 999, height: 8 }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: CELF_COLORS[i],
                  width: `${score}%`, transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Psychometric Summary */}
        <div className="card">
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 16 }}>
            Psychometric Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'SIAS — Social Anxiety', value: data.sias_score, unit: '/80' },
              { label: 'LDQ — Language Difficulty', value: data.ldq_score, unit: '/100' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--bg-secondary)', borderRadius: 12,
                padding: '18px 20px', border: '1px solid var(--border-color)',
              }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 30, fontFamily: 'Syne', fontWeight: 800, margin: 0 }}>
                  {Number(item.value || 0).toFixed(0)}
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>
                    {item.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'rgba(248,113,113,0.07)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> This is an AI-assisted screening tool, not a clinical diagnosis.
            Results should be reviewed by a qualified healthcare professional.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-secondary"
            onClick={() => { localStorage.clear(); navigate('/'); }}>
            Start New Screening
          </button>
          <button className="btn-primary" onClick={downloadPDF}>
            Download PDF Report
          </button>
        </div>
      </div>
    </>
  );
}