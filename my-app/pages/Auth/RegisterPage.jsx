import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { validateEmail, validatePassword, validatePasswordMatch, validateName, sanitizeString } from '../../utils/validation';

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

    // Validate all fields
    const firstNameValidation = validateName(form.firstName, t.auth.firstName || 'First Name');
    if (!firstNameValidation.valid) {
      setFieldErrors(prev => ({ ...prev, firstName: firstNameValidation.error }));
    }

    const lastNameValidation = validateName(form.lastName, t.auth.lastName || 'Last Name');
    if (!lastNameValidation.valid) {
      setFieldErrors(prev => ({ ...prev, lastName: lastNameValidation.error }));
    }

    const emailValidation = validateEmail(form.email);
    if (!emailValidation.valid) {
      setFieldErrors(prev => ({ ...prev, email: emailValidation.error }));
    }

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.valid) {
      setFieldErrors(prev => ({ ...prev, password: passwordValidation.error }));
    }

    const passwordMatchValidation = validatePasswordMatch(form.password, form.repeatPassword);
    if (!passwordMatchValidation.valid) {
      setFieldErrors(prev => ({ ...prev, repeatPassword: passwordMatchValidation.error }));
    }

    // If any validation failed, don't submit
    if (Object.keys(fieldErrors).length > 0 || 
        !firstNameValidation.valid || !lastNameValidation.valid || 
        !emailValidation.valid || !passwordValidation.valid || !passwordMatchValidation.valid) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstName: sanitizeString(form.firstName),
        lastName: sanitizeString(form.lastName),
        email: sanitizeString(form.email),
        password: form.password, // Don't trim password
      };

      const data = await authService.register(payload);
      
      if (!data || !data.user || !data.token) {
        throw new Error('Invalid response from server');
      }

      // API returns { user, token }
      login(data.user, data.token);

      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = t.auth.registerError;
      
      if (err.response) {
        if (err.response.status === 409 || err.response.status === 400) {
          errorMessage = err.response.data?.message || t.auth.emailExists || 'Email already exists';
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
            disabled={loading}
            className={fieldErrors.firstName ? 'input-error' : ''}
            maxLength={50}
          />
          {fieldErrors.firstName && <small className="field-error">{fieldErrors.firstName}</small>}
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
            disabled={loading}
            className={fieldErrors.lastName ? 'input-error' : ''}
            maxLength={50}
          />
          {fieldErrors.lastName && <small className="field-error">{fieldErrors.lastName}</small>}
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
            disabled={loading}
            className={fieldErrors.email ? 'input-error' : ''}
            maxLength={255}
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
            placeholder="Minimum 6 characters"
            required
            minLength={6}
            maxLength={128}
            disabled={loading}
            className={fieldErrors.password ? 'input-error' : ''}
          />
          {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
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
            disabled={loading}
            className={fieldErrors.repeatPassword ? 'input-error' : ''}
            maxLength={128}
          />
          {fieldErrors.repeatPassword && <small className="field-error">{fieldErrors.repeatPassword}</small>}
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? (t.common?.loading || 'Loading...') : t.auth.register}
        </button>

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