import { useEffect, useMemo, useState } from 'react';
import TrainerCard from '../components/TrainerCard';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ClassesPage() {
  const { token } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ trainerId: '', className: '', date: '', timeSlot: '' });
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    async function loadTrainers() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/v1/trainers`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load trainers');
        setTrainers(data.trainers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTrainers();
  }, []);

  const filteredTrainers = useMemo(
    () => trainers.filter((trainer) =>
      trainer.specialization.toLowerCase().includes(search.toLowerCase().trim())
    ),
    [trainers, search]
  );

  const selectedTrainer = trainers.find((trainer) => trainer._id === form.trainerId);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setBookingMessage('');
    setBookingError('');
  }

  async function createBooking(event) {
    event.preventDefault();
    setBookingMessage('');
    setBookingError('');

    try {
      const response = await fetch(`${API_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Booking failed');
      setBookingMessage('Class booked successfully.');
      setForm({ trainerId: '', className: '', date: '', timeSlot: '' });
    } catch (err) {
      setBookingError(err.message);
    }
  }

  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">TRAINER-LED CLASSES</p>
          <h1>Train with the right coach.</h1>
          <p>Pick a trainer, choose a slot, and reserve your place.</p>
        </div>
      </section>

      <section className="section-header">
        <div>
          <h2>Trainers</h2>
          <p className="muted">Search by specialization.</p>
        </div>
        <input className="search" placeholder="e.g. Yoga" value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>

      {loading && <div className="status">Loading trainers...</div>}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && filteredTrainers.length === 0 && <div className="status">No trainers found.</div>}
      {!loading && !error && filteredTrainers.length > 0 && (
        <div className="trainer-grid">
          {filteredTrainers.map((trainer) => (
            <TrainerCard key={trainer._id} {...trainer} />
          ))}
        </div>
      )}

      <section className="booking-panel">
        <div>
          <p className="eyebrow">NEW BOOKING</p>
          <h2>Reserve a class</h2>
          {selectedTrainer && <p className="selected-state">Selected trainer: <strong>{selectedTrainer.name}</strong></p>}
        </div>
        <form className="form-grid booking-form" onSubmit={createBooking}>
          <label>Trainer
            <select name="trainerId" value={form.trainerId} onChange={updateField} required>
              <option value="">Select trainer</option>
              {trainers.filter((trainer) => trainer.available).map((trainer) => (
                <option key={trainer._id} value={trainer._id}>{trainer.name} — {trainer.specialization}</option>
              ))}
            </select>
          </label>
          <label>Class name<input name="className" value={form.className} onChange={updateField} placeholder="Strength Training" required /></label>
          <label>Date<input type="date" name="date" value={form.date} onChange={updateField} required /></label>
          <label>Time slot<input name="timeSlot" value={form.timeSlot} onChange={updateField} placeholder="18:00 - 19:00" required /></label>
          {bookingError && <div className="alert error">{bookingError}</div>}
          {bookingMessage && <div className="alert success">{bookingMessage}</div>}
          <button className="button primary">Book Class</button>
        </form>
      </section>
    </div>
  );
}
