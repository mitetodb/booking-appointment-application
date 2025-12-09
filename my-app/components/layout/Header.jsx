import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Roles } from '../../constants/role.js';
import { NotificationBell } from '../notifications/NotificationBell';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          Praxis Booking
        </Link>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/appointments" onClick={() => setMenuOpen(false)}>My Appointments</NavLink>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink>
            </>
          )}
          
          {isAuthenticated && user?.role === Roles.DOCTOR && (
            <>
              <NavLink to="/doctor/appointments" onClick={() => setMenuOpen(false)}>My Patients</NavLink>
              <NavLink to="/doctor/schedule" onClick={() => setMenuOpen(false)}>Schedule</NavLink>
            </>
          )}
          
          {isAuthenticated && user?.role === Roles.ASSISTANT && (
            <NavLink to="/assistant" onClick={() => setMenuOpen(false)}>Assistant Dashboard</NavLink>
          )}
          
          {isAuthenticated && user?.role === Roles.ADMIN && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
        </nav>
      </div>

      <div className="header-right">
        {!isAuthenticated && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}

        {isAuthenticated && <NotificationBell />}

        {isAuthenticated && (
          <div className="user-info">
            <span>
              {user.firstName} {user.lastName} ({user.role})
            </span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};