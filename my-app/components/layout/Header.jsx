import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Roles } from '../../constants/role.js';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          Praxis Booking
        </Link>

        <nav className="nav">
          <NavLink to="/doctors">Doctors</NavLink>
          {isAuthenticated && <NavLink to="/appointments">My Appointments</NavLink>}
          {/* Admin shortcut */}
          {isAuthenticated && user?.role === Roles.ADMIN && (
            <NavLink to="/admin">Admin</NavLink>
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