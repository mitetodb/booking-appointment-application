import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useTranslation } from '../../hooks/useTranslation';
import { validateEmail, validatePassword, sanitizeString } from '../../utils/validation';

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
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate inputs
    const emailValidation = validateEmail(form.email);
    if (!emailValidation.valid) {
      setFieldErrors({ email: emailValidation.error });
      return;
    }

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.valid) {
      setFieldErrors({ password: passwordValidation.error });
      return;
    }

    try {
      setLoading(true);
      const sanitizedEmail = sanitizeString(form.email);
      const data = await authService.login(sanitizedEmail, form.password);
      
      if (!data || !data.user || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      login(data.user, data.token);

      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo);
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = t.auth.loginError;
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          errorMessage = t.auth.invalidCredentials || 'Invalid email or password';
        } else if (err.response.status === 403) {
          errorMessage = t.auth.accountDisabled || 'Account is disabled';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.request) {
        errorMessage = t.auth.networkError || 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            disabled={loading}
            className={fieldErrors.email ? 'input-error' : ''}
          />
          {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
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
            disabled={loading}
            className={fieldErrors.password ? 'input-error' : ''}
          />
          {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? (t.common?.loading || 'Loading...') : t.auth.login}
        </button>

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