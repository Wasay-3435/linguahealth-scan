const STEPS = ['Demographics', 'SIAS', 'LDQ', 'Speech', 'Text', 'Results'];

export default function ProgressBar({ currentStep }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {STEPS.map((step, i) => (
          <div key={step} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              margin: '0 auto 6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              background: i < currentStep
                ? 'linear-gradient(135deg, #6c63ff, #22d3ee)'
                : i === currentStep
                  ? 'var(--bg-secondary)'
                  : 'var(--bg-secondary)',
              border: i === currentStep
                ? '2px solid #6c63ff'
                : i < currentStep
                  ? 'none'
                  : '2px solid var(--border-color)',
              color: i <= currentStep ? 'white' : 'var(--text-secondary)',
            }}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <div style={{
              fontSize: 11, color: i <= currentStep ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontWeight: i === currentStep ? 600 : 400,
            }}>
              {step}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--border-color)', height: 3, borderRadius: 999, marginTop: 4 }}>
        <div style={{
          height: '100%', borderRadius: 999,
          background: 'linear-gradient(90deg, #6c63ff, #22d3ee)',
          width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}