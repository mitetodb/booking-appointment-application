import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { AppointmentEditModal } from '../../components/appointments/AppointmentEditModal';
import { AppointmentCancelModal } from '../../components/appointments/AppointmentCancelModal';
import { ErrorBox } from '../../components/common/ErrorBox';
import { Loading } from '../../components/common/Loading';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocaleFromLanguage } from '../../utils/dateUtils';

export const MyAppointmentsPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = getLocaleFromLanguage(language);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const translateAppointmentType = (type) => {
    if (!type) return '';
    const typeMap = {
      'PRIMARY': t.doctors?.primary || 'Primary',
      'FOLLOW_UP': t.doctors?.followUp || 'Follow-up',
    };
    return typeMap[type] || type;
  };

  const translatePaymentType = (paymentType) => {
    if (!paymentType) return '';
    const paymentMap = {
      'PRIVATE': t.doctors?.private || 'Private',
      'NHIF': t.doctors?.nhif || 'NHIF',
    };
    return paymentMap[paymentType] || paymentType;
  };

  const [editing, setEditing] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await appointmentService.getMyAppointments();
        setAppointments(data || []);
      } catch (err) {
        console.error(err);
        setError(t.appointments?.loadError || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const handleEditClick = async (appointment) => {
    try {
      const doc = await doctorService.getById(appointment.doctorId);
      setEditingDoctor(doc);
      setEditing(appointment);
    } catch (err) {
      setError(t.appointments?.loadError || 'Failed to load doctor information.');
    }
  };

  const handleSaved = (updated) => {
    setAppointments((apps) =>
      apps.map((a) => (a.id === updated.id ? updated : a))
    );
    setEditing(null);
    setEditingDoctor(null);
  };

  const handleCanceled = () => {
    setAppointments((apps) => apps.filter((a) => a.id !== cancelId));
    setCancelId(null);
  };

  const now = new Date();

  const upcoming = appointments
    .filter((a) => new Date(a.dateTime) > now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))[0];

  const past = appointments.filter((a) => new Date(a.dateTime) <= now);
  const future = appointments.filter((a) => new Date(a.dateTime) > now);

  if (loading) return <Loading />;
  if (error && !appointments.length) return <ErrorBox message={error} />;

  return (
    <section className="appointments-page">
      <div className="appointments-header">
        <h2>{t.appointments?.myAppointments || 'My Appointments'}</h2>
        <p className="appointments-subtitle">{t.appointments?.subtitle || 'View and manage your medical appointments'}</p>
      </div>

      {error && (
        <div className="appointments-message error-message">
          <span className="message-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {upcoming && (
        <div className="upcoming-appointment-card">
          <div className="upcoming-header">
            <span className="upcoming-icon">📅</span>
            <h3>{t.appointments?.upcoming || 'Upcoming Appointment'}</h3>
          </div>
          <div className="upcoming-content">
            <p className="upcoming-doctor">
              <strong>{upcoming.doctorName}</strong>
            </p>
            <p className="upcoming-time">
              {new Date(upcoming.dateTime).toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="upcoming-time-detail">
              {new Date(upcoming.dateTime).toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}

      {!appointments || appointments.length === 0 ? (
        <div className="empty-appointments">
          <span className="empty-icon">📋</span>
          <h3>{t.appointments?.noAppointments || 'No Appointments'}</h3>
          <p>{t.appointments?.noAppointmentsDesc || "You don't have any appointments yet. Book your first appointment with a doctor."}</p>
        </div>
      ) : (
        <div className="appointments-content">
          {future.length > 0 && (
            <div className="appointments-section">
              <h3 className="section-title">
                <span className="section-icon">🔜</span>
                {t.appointments?.upcoming || 'Upcoming'}
              </h3>
              <div className="appointments-list">
                {future.map((a) => (
                  <div key={a.id} className="appointment-card">
                    <div className="appointment-card-content">
                      <div className="appointment-info">
                        <h4 className="appointment-doctor">{a.doctorName}</h4>
                        <div className="appointment-datetime">
                          <span className="appointment-date">
                            📅 {new Date(a.dateTime).toLocaleDateString(locale, {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="appointment-time">
                            🕐 {new Date(a.dateTime).toLocaleTimeString(locale, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {a.type && (
                          <span className="appointment-type">{translateAppointmentType(a.type)}</span>
                        )}
                        {a.paymentType && (
                          <span className="appointment-payment">{translatePaymentType(a.paymentType)}</span>
                        )}
                      </div>
                      <div className="appointment-actions">
                        {a.status === 'BOOKED' && (
                          <>
                            <button className="btn" onClick={() => handleEditClick(a)}>
                              {t.appointments?.edit || 'Edit'}
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => setCancelId(a.id)}
                            >
                              {t.appointments?.cancel || 'Cancel'}
                            </button>
                          </>
                        )}
                        {a.status !== 'BOOKED' && (
                          <span className="appointment-status">{a.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="appointments-section">
              <h3 className="section-title">
                <span className="section-icon">📜</span>
                {t.appointments?.past || 'Past'}
              </h3>
              <div className="appointments-list">
                {past.map((a) => (
                  <div key={a.id} className="appointment-card past">
                    <div className="appointment-card-content">
                      <div className="appointment-info">
                        <h4 className="appointment-doctor">{a.doctorName}</h4>
                        <div className="appointment-datetime">
                          <span className="appointment-date">
                            📅 {new Date(a.dateTime).toLocaleDateString(locale, {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="appointment-time">
                            🕐 {new Date(a.dateTime).toLocaleTimeString(locale, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {a.type && (
                          <span className="appointment-type">{a.type}</span>
                        )}
                      </div>
                      <div className="appointment-actions">
                        <span className="appointment-status completed">{a.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {editing && editingDoctor && (
        <AppointmentEditModal
          appointment={editing}
          doctor={editingDoctor}
          onClose={() => {
            setEditing(null);
            setEditingDoctor(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {cancelId && (
        <AppointmentCancelModal
          appointmentId={cancelId}
          onClose={() => setCancelId(null)}
          onCanceled={handleCanceled}
        />
      )}
    </section>
  );
};