import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <section>
      <div className="hero-section">
        <div className="hero-content">
          <h1>{t.home.title}</h1>
          <p>{t.home.subtitle}</p>
          <div className="hero-cta">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn-hero">
                  {t.home.getStarted}
                </Link>
                <Link to="/doctors" className="btn-hero btn-hero-secondary">
                  {t.home.browseDoctors}
                </Link>
              </>
            ) : (
              <Link to="/doctors" className="btn-hero">
                {t.home.bookAppointment}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {t.home.whyChoose}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          {t.home.whyChooseSubtitle}
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>{t.home.onlineBooking}</h3>
            <p>{t.home.onlineBookingDesc}</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔔</span>
            <h3>{t.home.autoReminders}</h3>
            <p>{t.home.autoRemindersDesc}</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👨‍⚕️</span>
            <h3>{t.home.wideSelection}</h3>
            <p>{t.home.wideSelectionDesc}</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>{t.home.manageAppointments}</h3>
            <p>{t.home.manageAppointmentsDesc}</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>{t.home.security}</h3>
            <p>{t.home.securityDesc}</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>{t.home.fastEasy}</h3>
            <p>{t.home.fastEasyDesc}</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>500+</h3>
            <p>{t.home.satisfiedPatients}</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>{t.home.qualifiedDoctors}</p>
          </div>
          <div className="stat-item">
            <h3>1000+</h3>
            <p>{t.home.successfulVisits}</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>{t.home.access24_7}</p>
          </div>
        </div>
      </div>
    </section>
  );
};