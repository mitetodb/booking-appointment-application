import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';
import { ErrorBox } from '../../components/common/ErrorBox';
import { Loading } from '../../components/common/Loading';
import { useTranslation } from '../../hooks/useTranslation';
import { Roles } from '../../constants/role';
import { SpecialtySelector } from '../../components/common/SpecialtySelector';

export const UserProfilePage = () => {
  const { user, login } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    imageUrl: '',
    country: '',
    address: ''
  });

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [specialtyId, setSpecialtyId] = useState(null);
  const [updatingSpecialty, setUpdatingSpecialty] = useState(false);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    repeatPassword: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.getProfile();
        if (!data) {
          setLoadError('Profile not found.');
          return;
        }
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          imageUrl: data.imageUrl || '',
          country: data.country || '',
          address: data.address || ''
        });

        // If user is a doctor, load doctor profile for specialty
        if (data.role === Roles.DOCTOR) {
          try {
            const doctorData = await doctorService.getMyProfile();
            setDoctorProfile(doctorData);
            // Backend returns specialtyId as number: { id: "...", specialtyId: 8 }
            if (doctorData.specialtyId !== undefined && doctorData.specialtyId !== null) {
              setSpecialtyId(Number(doctorData.specialtyId));
            }
          } catch (doctorErr) {
            console.warn('Could not load doctor profile:', doctorErr);
            // Don't fail the whole page if doctor profile fails
          }
        }
      } catch (err) {
        console.error(err);
        setLoadError(t.profile?.loadError || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const updated = await userService.updateProfile(form);
      
      // safely read stored token
      let storedToken = null;
      try {
        const stored = localStorage.getItem('booking_app_auth');
        const parsed = stored ? JSON.parse(stored) : null;
        storedToken = parsed?.token || null;
      } catch (e) {
        // ignore parse errors
        storedToken = null;
      }

      login(updated, storedToken);
      
      setMsg(t.profile?.updateSuccess || 'Profile updated successfully.');
    } catch (err) {
      setError(t.profile?.updateError || 'Update failed.');
    }
  };

  const handlePwdChange = (e) => {
    setPwdForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (pwdForm.newPassword !== pwdForm.repeatPassword) {
      setError(t.profile?.passwordMismatch || "New passwords don't match.");
      return;
    }

    try {
      await userService.updatePassword({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      });
      setMsg(t.profile?.passwordSuccess || 'Password updated successfully.');
      setPwdForm({ oldPassword: '', newPassword: '', repeatPassword: '' });
      setError('');
    } catch (err) {
      setError(t.profile?.passwordError || 'Password change failed.');
    }
  };

  const handleSpecialtyChange = async (newSpecialtyId) => {
    if (newSpecialtyId === specialtyId) return;

    setUpdatingSpecialty(true);
    setError('');

    try {
      const updated = await doctorService.updateMySpecialty(newSpecialtyId);
      setSpecialtyId(newSpecialtyId);
      if (updated) {
        setDoctorProfile(updated);
      }
      setMsg(t.profile?.specialtyUpdateSuccess || 'Specialty updated successfully.');
    } catch (err) {
      console.error('Failed to update specialty:', err);
      const errorMsg = err.response?.data?.message || err.message || t.profile?.specialtyUpdateError || 'Failed to update specialty.';
      setError(errorMsg);
    } finally {
      setUpdatingSpecialty(false);
    }
  };

  if (loading) return <Loading />;
  if (loadError) return <ErrorBox message={loadError} />;
  if (!profile) return <ErrorBox message={t.profile?.notFound || "Profile not found."} />;

  return (
    <section className="profile-page">
      <div className="profile-header">
        <h2>{t.profile?.title || 'User Profile'}</h2>
        <p className="profile-subtitle">{t.profile?.subtitle || 'Manage your personal information and account settings'}</p>
      </div>

      {msg && (
        <div className="profile-message success-message">
          <span className="message-icon">✓</span>
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="profile-message error-message">
          <span className="message-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="profile-content">
        {/* Profile Picture & Basic Info Card */}
        <div className="profile-card profile-info-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              {form.imageUrl ? (
                <img 
                  src={form.imageUrl} 
                  alt={`${form.firstName} ${form.lastName}`}
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="profile-avatar-placeholder" style={{ display: form.imageUrl ? 'none' : 'flex' }}>
                <span className="avatar-icon">👤</span>
              </div>
            </div>
            <div className="profile-name-display">
              <h3>{form.firstName || user?.firstName} {form.lastName || user?.lastName}</h3>
              <p className="profile-role">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>{t.profile?.personalInfo || 'Personal Information'}</h3>
            <p className="card-subtitle">{t.profile?.personalInfoDesc || 'Update your personal details'}</p>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  {t.profile?.firstName || 'First Name'}
                  <input 
                    type="text"
                    name="firstName" 
                    value={form.firstName} 
                    onChange={handleChange}
                    placeholder={t.profile?.firstNamePlaceholder || 'Enter your first name'}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  {t.profile?.lastName || 'Last Name'}
                  <input 
                    type="text"
                    name="lastName" 
                    value={form.lastName} 
                    onChange={handleChange}
                    placeholder={t.profile?.lastNamePlaceholder || 'Enter your last name'}
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>
                {t.profile?.imageUrl || 'Profile Image URL'}
                <input 
                  type="url"
                  name="imageUrl" 
                  value={form.imageUrl} 
                  onChange={handleChange}
                  placeholder={t.profile?.imageUrlPlaceholder || 'https://example.com/your-image.jpg'}
                />
                <small className="form-hint">{t.profile?.imageUrlHint || 'Enter a URL to your profile picture'}</small>
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  {t.profile?.country || 'Country'}
                  <input 
                    type="text"
                    name="country" 
                    value={form.country} 
                    onChange={handleChange}
                    placeholder={t.profile?.countryPlaceholder || 'Enter your country'}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  {t.profile?.address || 'Address'}
                  <input 
                    type="text"
                    name="address" 
                    value={form.address} 
                    onChange={handleChange}
                    placeholder={t.profile?.addressPlaceholder || 'Enter your address'}
                  />
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {t.profile?.saveChanges || 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Doctor Specialty Card - Only for Doctors */}
        {user?.role === Roles.DOCTOR && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>{t.profile?.specialty || 'Medical Specialty'}</h3>
              <p className="card-subtitle">{t.profile?.specialtyDesc || 'Select your medical specialty'}</p>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>
                  {t.profile?.specialty || 'Specialty'}
                  <SpecialtySelector
                    value={specialtyId}
                    onChange={handleSpecialtyChange}
                    placeholder={t.profile?.selectSpecialty || 'Select specialty'}
                    disabled={updatingSpecialty}
                  />
                </label>
                {updatingSpecialty && (
                  <small className="form-hint" style={{ color: 'var(--primary)' }}>
                    {t.common?.loading || 'Updating...'}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Change Password Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>{t.profile?.changePassword || 'Change Password'}</h3>
            <p className="card-subtitle">{t.profile?.changePasswordDesc || 'Update your password to keep your account secure'}</p>
          </div>

          <form className="profile-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>
                {t.profile?.oldPassword || 'Current Password'}
                <input
                  type="password"
                  name="oldPassword"
                  value={pwdForm.oldPassword}
                  onChange={handlePwdChange}
                  placeholder={t.profile?.oldPasswordPlaceholder || 'Enter your current password'}
                />
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  {t.profile?.newPassword || 'New Password'}
                  <input
                    type="password"
                    name="newPassword"
                    value={pwdForm.newPassword}
                    onChange={handlePwdChange}
                    placeholder={t.profile?.newPasswordPlaceholder || 'Enter new password'}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  {t.profile?.repeatPassword || 'Confirm New Password'}
                  <input
                    type="password"
                    name="repeatPassword"
                    value={pwdForm.repeatPassword}
                    onChange={handlePwdChange}
                    placeholder={t.profile?.repeatPasswordPlaceholder || 'Confirm new password'}
                  />
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {t.profile?.updatePassword || 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
