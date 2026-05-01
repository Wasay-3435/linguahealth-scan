import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,16,0.90)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 820, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 62,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo mark — pure CSS, no emoji */}
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M6 9 Q9 5 12 9 Q9 13 6 9Z" fill="white" opacity="0.85"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18,
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            LinguaHealth-Scan
          </span>
        </Link>
        <span style={{
          color: 'var(--text-secondary)', fontSize: 12,
          letterSpacing: 0.3, display: 'none',
        }}>
          AI Neuropsycholinguistic Screening
        </span>
      </div>
    </nav>
  );
}