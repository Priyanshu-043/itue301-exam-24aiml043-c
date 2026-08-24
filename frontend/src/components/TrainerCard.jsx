const availabilityMap = { true: 'Available', false: 'Fully Booked' };

export default function TrainerCard({ name, specialization, available }) {
  const availability = availabilityMap[available];

  return (
    <article className="trainer-card">
      <div>
        <h3>{name}</h3>
        <p>{specialization}</p>
      </div>
      <span className={`availability ${available ? 'available' : 'unavailable'}`}>
        {availability}
      </span>
    </article>
  );
}
