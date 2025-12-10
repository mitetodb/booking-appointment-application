import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useTranslation } from '../../hooks/useTranslation';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authService.login(form.email, form.password);
      login(data.user, data.token);

      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo);
    } catch (err) {
      setError(t.auth.loginError);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-form-header">
          <h2>{t.auth.login}</h2>
          <p>{t.auth.loginSubtitle}</p>
        </div>

        <label>
          {t.auth.email}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t.auth.emailPlaceholder}
            required
          />
        </label>

        <label>
          {t.auth.password}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t.auth.passwordPlaceholder}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">{t.auth.login}</button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
          {t.auth.noAccount}{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            {t.auth.signUp}
          </Link>
        </p>
      </form>
    </section>
  );
};