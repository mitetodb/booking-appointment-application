import { useEffect, useState } from 'react';
import { assistantService } from '../../services/assistantService';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Loading } from '../../components/common/Loading';
import { ErrorBox } from '../../components/common/ErrorBox';
import { getSpecialtyById, getSpecialtyIdByName } from '../../constants/specialties';

export const AssistantDashboardPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await assistantService.getMyDoctors();
        const doctorsList = Array.isArray(data) ? data : (data?.doctors || data?.data || []);
        setDoctors(doctorsList);
        setError('');
      } catch (err) {
        console.error('Error loading doctors:', err);
        setError(t.assistant?.loadError || 'Failed to load doctors.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const getSpecialtyDisplay = (doctor) => {
    try {
      if (doctor.specialtyId) {
        return getSpecialtyById(doctor.specialtyId, language);
      } else if (doctor.specialty) {
        const id = getSpecialtyIdByName(doctor.specialty);
        if (id) {
          return getSpecialtyById(id, language);
        }
        return doctor.specialty;
      }
      return null;
    } catch (err) {
      console.warn('Error getting specialty display:', err);
      return doctor.specialty || null;
    }
  };

  if (loading) return <Loading />;
  if (error && !doctors.length) return <ErrorBox message={error} />;

  return (
    <section className="assistant-page">
      <div className="assistant-header">
        <h2>{t.assistant?.title || 'Assistant Panel'}</h2>
        <p className="assistant-subtitle">{t.assistant?.subtitle || 'Manage appointments for your assigned doctors'}</p>
      </div>

      {error && (
        <div className="assistant-message error-message">
          <span className="message-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {doctors.length === 0 ? (
        <div className="assistant-empty">
          <p>{t.assistant?.noDoctors || 'No doctors assigned.'}</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((d) => {
            const specialtyDisplay = getSpecialtyDisplay(d);
            return (
              <div key={d.id} className="doctor-card card">
                <div className="doctor-card-header">
                  <div className="doctor-card-avatar">
                    <img
                      src={d.imageUrl || 'https://via.placeholder.com/80?text=Dr'}
                      alt={`${d.firstName} ${d.lastName}`}
                    />
                  </div>
                  <div className="doctor-card-main">
                    <h3>
                      {d.title ? `${d.title} ` : 'Dr. '}
                      {d.firstName} {d.lastName}
                    </h3>
                    {specialtyDisplay && (
                      <div className="doctor-specialty">{specialtyDisplay}</div>
                    )}
                  </div>
                </div>
                <div className="doctor-card-actions">
                  <Link to={`/assistant/doctor/${d.id}`} className="btn-primary">
                    {t.assistant?.manageAppointments || 'Manage Appointments'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};