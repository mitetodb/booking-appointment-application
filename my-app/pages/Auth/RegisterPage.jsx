import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
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

    if (form.password !== form.repeatPassword) {
      return setError("Паролите не съвпадат.");
    }

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };

      const data = await authService.register(payload);

      // API returns { user, token }
      login(data.user, data.token);

      navigate('/');
    } catch (err) {
      setError(t.auth.registerError);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-form-header">
          <h2>{t.auth.register}</h2>
          <p>{t.auth.registerSubtitle}</p>
        </div>

        <label>
          {t.auth.firstName}
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder={t.auth.firstNamePlaceholder}
            required
          />
        </label>

        <label>
          {t.auth.lastName}
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder={t.auth.lastNamePlaceholder}
            required
          />
        </label>

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
            placeholder="Minimum 6 characters"
            required
            minLength={6}
          />
        </label>

        <label>
          {t.auth.repeatPassword}
          <input
            type="password"
            name="repeatPassword"
            value={form.repeatPassword}
            onChange={handleChange}
            placeholder={t.auth.repeatPasswordPlaceholder}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">{t.auth.register}</button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
          {t.auth.haveAccount}{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            {t.auth.signIn}
          </Link>
        </p>
      </form>
    </section>
  );
};