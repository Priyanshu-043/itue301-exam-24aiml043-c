import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadBookings() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/v1/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load bookings');
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBookings(); }, []);

  async function cancelBooking(id) {
    const response = await fetch(`${API_URL}/api/v1/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'cancelled' })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Failed to cancel booking');
      return;
    }
    loadBookings();
  }

  return (
    <section>
      <p className="eyebrow">YOUR SCHEDULE</p>
      <h1>My Bookings</h1>
      <p className="muted">Track upcoming classes and cancel when needed.</p>
      {loading && <div className="status">Loading bookings...</div>}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && bookings.length === 0 && <div className="status">No bookings yet.</div>}
      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking._id}>
            <div>
              <h3>{booking.className}</h3>
              <p>{booking.trainerId?.name} · {booking.trainerId?.specialization}</p>
              <p>{booking.date} · {booking.timeSlot}</p>
            </div>
            <div className="booking-actions">
              <span className={`status-badge ${booking.status}`}>{booking.status}</span>
              {booking.status === 'booked' && <button className="button secondary" onClick={() => cancelBooking(booking._id)}>Cancel</button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
