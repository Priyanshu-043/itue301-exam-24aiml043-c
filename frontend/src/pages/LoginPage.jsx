import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', membershipType: 'basic' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/signup';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { email: form.email, password: form.password }
            : form
        )
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      login(data);
      navigate('/classes', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">FIT<span>ZONE</span></div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="muted">Book trainer-led classes without the WhatsApp chaos.</p>

        <div className="tabs">
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')}>Sign In</button>
          <button className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => setMode('signup')}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="form-grid">
          {mode === 'signup' && (
            <>
              <label>Name<input name="name" value={form.name} onChange={updateField} required /></label>
              <label>Phone<input name="phone" value={form.phone} onChange={updateField} required /></label>
              <label>Membership
                <select name="membershipType" value={form.membershipType} onChange={updateField}>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="platinum">Platinum</option>
                </select>
              </label>
            </>
          )}
          <label>Email<input type="email" name="email" value={form.email} onChange={updateField} required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={updateField} minLength={6} required /></label>
          {error && <div className="alert error">{error}</div>}
          <button className="button primary full" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </section>
    </div>
  );
}
