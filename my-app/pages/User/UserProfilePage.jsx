import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { ErrorBox } from '../../components/common/ErrorBox';

export const UserProfilePage = () => {
  const { user, login } = useAuth();
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
      } catch (err) {
        console.error(err);
        setLoadError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      
      setMsg('Profile updated successfully.');
    } catch (err) {
      setError('Update failed.');
    }
  };

  const handlePwdChange = (e) => {
    setPwdForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (pwdForm.newPassword !== pwdForm.repeatPassword) {
      setError("New passwords don't match.");
      return;
    }

    try {
      await userService.updatePassword({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      });
      setMsg('Password updated successfully.');
      setPwdForm({ oldPassword: '', newPassword: '', repeatPassword: '' });
    } catch (err) {
      setError('Password change failed.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (loadError) return <ErrorBox message={loadError} />;
  if (!profile) return <ErrorBox message="Profile not found." />;

  return (
    <section className="profile-page">
      <h2>User Profile</h2>

      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          First name:
          <input name="firstName" value={form.firstName} onChange={handleChange} />
        </label>

        <label>
          Last name:
          <input name="lastName" value={form.lastName} onChange={handleChange} />
        </label>

        <label>
          Image URL:
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </label>

        <label>
          Country:
          <input name="country" value={form.country} onChange={handleChange} />
        </label>

        <label>
          Address:
          <input name="address" value={form.address} onChange={handleChange} />
        </label>

        <button type="submit">Save Changes</button>
      </form>

      <h3>Change Password</h3>

      <form className="profile-form" onSubmit={handleChangePassword}>
        <label>
          Old Password:
          <input
            type="password"
            name="oldPassword"
            value={pwdForm.oldPassword}
            onChange={handlePwdChange}
          />
        </label>

        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={pwdForm.newPassword}
            onChange={handlePwdChange}
          />
        </label>

        <label>
          Repeat New Password:
          <input
            type="password"
            name="repeatPassword"
            value={pwdForm.repeatPassword}
            onChange={handlePwdChange}
          />
        </label>

        <button type="submit">Update Password</button>
      </form>
    </section>
  );
};
