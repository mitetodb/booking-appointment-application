import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Roles } from '../../constants/role.js';
import { NotificationBell } from '../notifications/NotificationBell';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useTranslation } from '../../hooks/useTranslation';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
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
          <NavLink to="/doctors" onClick={() => setMenuOpen(false)}>{t.nav.doctors}</NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/appointments" onClick={() => setMenuOpen(false)}>{t.nav.myAppointments}</NavLink>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>{t.nav.profile}</NavLink>
            </>
          )}
          
          {isAuthenticated && user?.role === Roles.DOCTOR && (
            <>
              <NavLink to="/doctor/appointments" onClick={() => setMenuOpen(false)}>{t.nav.myPatients}</NavLink>
              <NavLink to="/doctor/schedule" onClick={() => setMenuOpen(false)}>{t.nav.schedule}</NavLink>
            </>
          )}
          
          {isAuthenticated && user?.role === Roles.ASSISTANT && (
            <NavLink to="/assistant" onClick={() => setMenuOpen(false)}>{t.nav.assistantDashboard}</NavLink>
          )}
          
          {isAuthenticated && user?.role === Roles.ADMIN && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>{t.nav.admin}</NavLink>
          )}
        </nav>
      </div>

      <div className="header-right">
        {!isAuthenticated && (
          <>
            <NavLink to="/login" className="btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>{t.nav.login}</NavLink>
            <NavLink to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px' }}>{t.nav.register}</NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            <NotificationBell />
            <div className="user-info">
              <span style={{ color: 'var(--text-secondary)' }}>
                {user.firstName} {user.lastName}
              </span>
              <button onClick={logout}>{t.nav.logout}</button>
            </div>
          </>
        )}

        <LanguageSwitcher />
      </div>
    </header>
  );
};