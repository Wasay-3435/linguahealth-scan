import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

export default function Demographics() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', gender: '', education: '', languages: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.age || !form.gender || !form.education || !form.languages) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/questionnaire/demographics', {
        ...form, age: parseInt(form.age)
      });
      localStorage.setItem('assessment_id', res.data.assessment_id);
      navigate('/sias');
    } catch {
      setError('Connection error. Make sure the backend is running.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Tell Us About Yourself</h1>
          <p>This helps us create a personalized baseline for your linguistic profile.</p>
        </div>
        <ProgressBar currentStep={0} />
        <div className="card">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Enter your name" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handle} placeholder="e.g. 35" min="10" max="120" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handle}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Highest Education Level</label>
            <select name="education" value={form.education} onChange={handle}>
              <option value="">Select education</option>
              <option>Primary School</option>
              <option>High School</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>Doctoral Degree</option>
            </select>
          </div>
          <div className="form-group">
            <label>Languages Spoken</label>
            <input name="languages" value={form.languages} onChange={handle} placeholder="e.g. English, Spanish" />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="step-actions">
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Saving...' : 'Next: Anxiety Questionnaire →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}