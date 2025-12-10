import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { BookingSlots } from '../../components/appointments/BookingSlots';
import { BookingForm } from '../../components/appointments/BookingForm';
import { useAuth } from '../../hooks/useAuth';
import { ErrorBox } from '../../components/common/ErrorBox';
import { Loading } from '../../components/common/Loading';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { getSpecialtyById, getSpecialtyIdByName } from '../../constants/specialties';
import { validateUUID } from '../../utils/validation';

export const DoctorDetailsPage = () => {
  const { doctorId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError('');

      try {
        // Validate doctorId
        if (!doctorId) {
          throw new Error('Doctor ID is missing');
        }

        const doctorIdValidation = validateUUID(doctorId);
        if (!doctorIdValidation.valid) {
          throw new Error('Invalid doctor ID format');
        }

        const data = await doctorService.getById(doctorId);
        
        if (!data || !data.id) {
          throw new Error('Invalid doctor data received');
        }
        
        setDoctor(data);
      } catch (err) {
        console.error('Error loading doctor:', err);
        let errorMessage = t.doctors?.loadError || 'Failed to load doctor details.';
        
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = t.doctors?.notFound || 'Doctor not found.';
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (authReady && doctorId) {
      fetchDoctor();
    } else if (authReady && !doctorId) {
      setError('Doctor ID is required');
      setLoading(false);
    }
  }, [doctorId, authReady, t]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorBox message={error} />;
  }

  if (!loading && !doctor) {
    return <ErrorBox message={t.doctors?.notFound || "Doctor not found."} />;
  }

  return (
    <section className="doctor-details-page">
      {/* Back Button */}
      <Link to="/doctors" className="back-link">
        ← {t.doctors?.backToDoctors || 'Back to Doctors'}
      </Link>

      {/* Doctor Header Card */}
      <div className="doctor-details-card">
        <div className="doctor-details-header">
          <div className="doctor-avatar-large">
            <img
              src={doctor.imageUrl || 'https://via.placeholder.com/150?text=Dr'}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="doctor-avatar-placeholder" style={{ display: doctor.imageUrl ? 'none' : 'flex' }}>
              <span className="avatar-icon-large">👨‍⚕️</span>
            </div>
          </div>

          <div className="doctor-header-info">
            <h1>
              {doctor.title ? `${doctor.title} ` : ''}
              {doctor.firstName} {doctor.lastName}
            </h1>

            {(() => {
              let specialtyDisplay = null;
              if (doctor.specialtyId) {
                specialtyDisplay = getSpecialtyById(doctor.specialtyId, language);
              } else if (doctor.specialty) {
                const id = getSpecialtyIdByName(doctor.specialty);
                if (id) {
                  specialtyDisplay = getSpecialtyById(id, language);
                } else {
                  specialtyDisplay = doctor.specialty; // Fallback
                }
              }
              return specialtyDisplay ? (
                <p className="doctor-specialty-large">{specialtyDisplay}</p>
              ) : null;
            })()}

            {doctor.practiceAddress && (
              <p className="doctor-address-large">
                📍 {doctor.practiceAddress}
              </p>
            )}

            <div className="doctor-meta-large">
              {doctor.worksWithHealthInsurance && (
                <span className="badge badge-nhif">
                  {t.doctors?.healthInsurance || 'Health Insurance'}
                </span>
              )}
              {doctor.pricePrivate && (
                <span className="badge badge-price">
                  {t.doctors?.privateVisit || 'Private Visit'}: {doctor.pricePrivate} {language === 'bg' ? 'лв' : 'BGN'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {doctor.bio && (
        <div className="doctor-details-card">
          <div className="doctor-section-header">
            <h3>{t.doctors?.about || 'About the Doctor'}</h3>
          </div>
          <div className="doctor-bio">
            <p>{doctor.bio}</p>
          </div>
        </div>
      )}

      {/* Booking Section */}
      <div className="doctor-details-card">
        <div className="doctor-section-header">
          <h3>{t.doctors?.scheduleBooking || 'Schedule & Booking'}</h3>
          <p className="card-subtitle">{t.doctors?.scheduleBookingDesc || 'Select a date and time for your appointment'}</p>
        </div>

        {successMsg ? (
          <div className="booking-success-message">
            <span className="success-icon">✓</span>
            <div>
              <h4>{t.doctors?.bookingSuccess || 'Appointment Booked Successfully!'}</h4>
              <p>{successMsg}</p>
            </div>
            <Link to="/appointments" className="btn-primary">
              {t.doctors?.viewAppointments || 'View My Appointments'}
            </Link>
          </div>
        ) : !isAuthenticated ? (
          <div className="booking-auth-required">
            <p>{t.doctors?.loginRequired || 'Please log in to book an appointment.'}</p>
            <div className="auth-buttons">
              <Link to="/login" className="btn">
                {t.nav?.login || 'Login'}
              </Link>
              <Link to="/register" className="btn-primary">
                {t.nav?.register || 'Register'}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {!selectedSlot && (
              <BookingSlots
                doctor={doctor}
                onSelect={(slot) => setSelectedSlot(slot)}
              />
            )}

            {selectedSlot && (
              <div className="booking-form-wrapper">
                <button 
                  className="back-to-slots-btn"
                  onClick={() => setSelectedSlot(null)}
                >
                  ← {t.doctors?.changeTime || 'Change Time'}
                </button>
                <BookingForm
                  doctor={doctor}
                  selectedSlot={selectedSlot}
                  onSuccess={(res) => {
                    setSuccessMsg(t.doctors?.bookingSuccessMsg || 'Your appointment was successfully booked!');
                    setSelectedSlot(null);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};