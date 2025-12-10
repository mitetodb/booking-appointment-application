import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Praxis Booking</h4>
          <p>{t.footer.description}</p>
        </div>

        <div className="footer-section">
          <h4>{t.footer.quickLinks}</h4>
          <Link to="/doctors">{t.nav.doctors}</Link>
          <Link to="/">{t.home.title}</Link>
          <Link to="/login">{t.nav.login}</Link>
          <Link to="/register">{t.nav.register}</Link>
        </div>

        <div className="footer-section">
          <h4>{t.footer.information}</h4>
          <p>{t.footer.workingHours}</p>
          <p>{t.footer.support}</p>
          <p>{t.footer.phone}</p>
        </div>

        <div className="footer-section">
          <h4>{t.footer.useful}</h4>
          <p>{t.footer.howToBook}</p>
          <p>{t.footer.faq}</p>
          <p>{t.footer.terms}</p>
          <p>{t.footer.privacy}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Praxis Booking Application. {t.footer.copyright}</p>
      </div>
    </footer>
  );
};