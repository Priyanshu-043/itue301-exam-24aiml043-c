import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TrainerCard from '../components/TrainerCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const emptyForm = { name: '', email: '', specialization: '', password: '', available: true };

export default function AdminPanel() {
  const { token, role } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTrainers();
  }, []);

  async function loadTrainers() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/v1/trainers`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load trainers');
      setTrainers(data.trainers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function addTrainer(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/v1/trainers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.errors?.join(', ') || 'Unable to add trainer');

      setMessage(`${data.trainer.name} was added successfully.`);
      setForm(emptyForm);
      setTrainers((current) => [...current, data.trainer].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (role !== 'Admin') {
    return (
      <section>
        <p className="eyebrow">ADMIN</p>
        <h1>Access denied</h1>
        <p className="muted">Only an admin can manage the trainer roster.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="admin-header">
        <div>
          <p className="eyebrow">ADMIN PANEL</p>
          <h1>Trainer Management</h1>
          <p className="muted">Add trainers and manage the roster used by members when booking classes.</p>
        </div>
        <div className="admin-role">Admin</div>
      </div>

      <div className="admin-layout">
        <form className="admin-card form-grid" onSubmit={addTrainer}>
          <div>
            <h2>Add Trainer</h2>
            <p className="muted">Create a trainer record for the FitZone roster.</p>
          </div>
          <label>Trainer Name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. John Smith" required /></label>
          <label>Trainer Email<input type="email" name="email" value={form.email} onChange={updateField} placeholder="trainer@fitzone.com" required /></label>
          <label>Login Password<input type="password" name="password" value={form.password} onChange={updateField} minLength={6} placeholder="Minimum 6 characters" required /></label>
          <label>Specialization<input name="specialization" value={form.specialization} onChange={updateField} placeholder="e.g. Strength Training" required /></label>
          <label className="checkbox-label">
            <input type="checkbox" name="available" checked={form.available} onChange={updateField} />
            Available for bookings
          </label>
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
          <button className="button primary" disabled={saving}>
            {saving ? 'Adding Trainer...' : 'Add Trainer'}
          </button>
        </form>

        <div className="admin-card roster-card">
          <div className="roster-header">
            <div>
              <h2>Trainer Roster</h2>
              <p className="muted">{trainers.length} trainer{trainers.length === 1 ? '' : 's'} registered</p>
            </div>
            <button className="button secondary" onClick={loadTrainers} disabled={loading}>Refresh</button>
          </div>
          {loading && <div className="status">Loading trainers...</div>}
          {!loading && trainers.length === 0 && <div className="status">No trainers have been added yet.</div>}
          {!loading && trainers.length > 0 && (
            <div className="trainer-grid compact">
              {trainers.map((trainer) => (
                <TrainerCard
                  key={trainer._id}
                  name={trainer.name}
                  specialization={trainer.specialization}
                  available={trainer.available}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
