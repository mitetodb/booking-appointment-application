import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { getSpecialtyById, getSpecialtyIdByName } from '../../constants/specialties';

export const DoctorCard = ({ doctor }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  if (!doctor || !doctor.id) {
    return null;
  }
  
  const getSpecialtyDisplay = () => {
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

  const specialtyDisplay = getSpecialtyDisplay();

  return (
    <article className="doctor-card card">
      <div className="doctor-card-avatar">
        <img
          src={doctor.imageUrl || 'https://via.placeholder.com/80?text=Dr'}
          alt={`${doctor.firstName} ${doctor.lastName}`}
        />
      </div>

      <div className="doctor-card-main">
        <h3>
          {doctor.title ? `${doctor.title} ` : ''}
          {doctor.firstName} {doctor.lastName}
        </h3>
        {specialtyDisplay && <p className="doctor-specialty">{specialtyDisplay}</p>}

        {doctor.practiceAddress && (
          <p className="doctor-address">{doctor.practiceAddress}</p>
        )}

        <div className="doctor-meta">
          {doctor.worksWithHealthInsurance && (
            <span className="badge badge-nhif">{t.doctors.healthInsurance}</span>
          )}

          {doctor.pricePrivate && (
            <span className="badge">
              {t.doctors.privateVisit}: {doctor.pricePrivate} {language === 'bg' ? 'лв' : language === 'de' ? 'BGN' : 'BGN'}
            </span>
          )}
        </div>
      </div>

      <div className="doctor-card-actions">
        <Link 
          to={`/doctors/${doctor.id}`} 
          className="btn-primary"
          state={{ from: '/doctors' }}
        >
          {isAuthenticated ? t.doctors.viewDetails : (t.doctors.loginToView || 'Login to View Details')}
        </Link>
      </div>
    </article>
  );
};