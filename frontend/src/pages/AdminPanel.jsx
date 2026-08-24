import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPanel() {
  const { token, role } = useAuth();
  const [form, setForm] = useState({ name: '', specialization: '', available: true });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (role !== 'Admin') {
    return (
      <section>
        <p className="eyebrow">ADMIN</p>
        <h1>Access denied</h1>
        <p className="muted">Only an admin can manage the trainer roster.</p>
      </section>
    );
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function addTrainer(event) {
    event.preventDefault();
    setLoading(true);
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
      if (!response.ok) throw new Error(data.message || 'Unable to add trainer');

      setMessage(`${data.trainer.name} was added successfully.`);
      setForm({ name: '', specialization: '', available: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <p className="eyebrow">ADMIN</p>
      <h1>Manage Trainers</h1>
      <p className="muted">Add trainer-led classes to the FitZone roster.</p>

      <form className="admin-card form-grid" onSubmit={addTrainer}>
        <label>Trainer Name<input name="name" value={form.name} onChange={updateField} required /></label>
        <label>Specialization<input name="specialization" value={form.specialization} onChange={updateField} required /></label>
        <label className="checkbox-label">
          <input type="checkbox" name="available" checked={form.available} onChange={updateField} />
          Available for bookings
        </label>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <button className="button primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Trainer'}
        </button>
      </form>
    </section>
  );
}
