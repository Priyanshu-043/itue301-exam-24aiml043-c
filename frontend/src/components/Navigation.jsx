import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { member, role, logout } = useAuth();
  return (
    <header className="navbar">
      <div className="brand">FitZone</div>
      <nav>
        <NavLink to="/classes">Classes</NavLink>
        {role === 'Member' && <NavLink to="/my-bookings">My Bookings</NavLink>}
        {role === 'Trainer' && <NavLink to="/trainer">My Commitments</NavLink>}
        {role === 'Admin' && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-user"><span>{member?.name}</span><span className="role-chip">{role}</span><button className="button secondary" onClick={logout}>Logout</button></div>
    </header>
  );
}
