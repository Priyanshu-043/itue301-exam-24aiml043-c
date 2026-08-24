import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TrainerDashboard() {
  const { token, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCommitments() {
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_URL}/api/v1/trainers/me/commitments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load commitments');
      setBookings(data.bookings || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadCommitments(); }, []);

  if (role !== 'Trainer') return <section><p className="eyebrow">TRAINER</p><h1>Access denied</h1><p className="muted">Only trainers can view this dashboard.</p></section>;

  return (
    <section>
      <div className="admin-header">
        <div><p className="eyebrow">TRAINER DASHBOARD</p><h1>My Commitments</h1><p className="muted">View the members and class slots assigned to your schedule.</p></div>
        <div className="admin-role">Trainer</div>
      </div>
      {loading && <div className="status">Loading your commitments...</div>}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && bookings.length === 0 && <div className="status">You have no class commitments yet.</div>}
      {!loading && !error && bookings.length > 0 && (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-card" key={booking._id}>
              <div>
                <p className="eyebrow">{new Date(booking.date).toLocaleDateString()} · {booking.timeSlot}</p>
                <h3>{booking.className}</h3>
                <p><strong>Member:</strong> {booking.memberId?.name || 'Unknown member'}</p>
                <p><strong>Email:</strong> {booking.memberId?.email || '—'}</p>
              </div>
              <div className="booking-actions"><span className={`status-badge ${booking.status}`}>{booking.status}</span></div>
            </article>
          ))}
        </div>
      )}
      {!loading && <button className="button secondary refresh-button" onClick={loadCommitments}>Refresh Schedule</button>}
    </section>
  );
}
