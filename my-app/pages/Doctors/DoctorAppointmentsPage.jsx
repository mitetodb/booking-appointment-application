import { useEffect, useState } from "react";
import { doctorService } from "../../services/doctorService";
import { useLanguage } from "../../contexts/LanguageContext";
import { getLocaleFromLanguage } from "../../utils/dateUtils";
import { Loading } from "../../components/common/Loading";
import { ErrorBox } from "../../components/common/ErrorBox";
import { useTranslation } from "../../hooks/useTranslation";
import { AppointmentEditModal } from "../../components/appointments/AppointmentEditModal";
import { AppointmentCancelModal } from "../../components/appointments/AppointmentCancelModal";

export const DoctorAppointmentsPage = () => {
  const { language } = useLanguage();
  const locale = getLocaleFromLanguage(language);
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        // Load doctor profile and working hours (needed for edit modal)
        const [doctorData, workingHours] = await Promise.all([
          doctorService.getMyProfile(),
          doctorService.getMyWorkingHours().catch(() => [])
        ]);
        
        setDoctor({
          ...doctorData,
          workingHours: Array.isArray(workingHours) ? workingHours : (workingHours?.workingHours || [])
        });
        
        const data = await doctorService.getMyAppointments();
        setAppointments(data || []);
      } catch (err) {
        console.error("Error loading appointments:", err);
        const errorMsg = err.response?.data?.message || err.message || t.appointments?.loadError || "Failed to load appointments.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

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

  const handleEditSuccess = (updated) => {
    setAppointments((apps) =>
      apps.map((a) => (a.id === updated.id ? updated : a))
    );
    setEditModal(null);
  };

  const handleCancelSuccess = () => {
    setAppointments((apps) => apps.filter((a) => a.id !== cancelId));
    setCancelId(null);
  };

  if (loading) return <Loading />;
  if (error && !appointments.length) return <ErrorBox message={error} />;

  return (
    <section className="doctor-appointments-page">
      <div className="doctor-appointments-header">
        <h2>{t.nav?.myPatients || "My Patients Today"}</h2>
        <p className="doctor-appointments-subtitle">
          {t.appointments?.subtitle || "Manage your appointments for today."}
        </p>
      </div>

      {error && (
        <div className="doctor-appointments-message error-message">
          <span className="message-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="empty-appointments">
          <span className="empty-icon">📋</span>
          <h3>{t.appointments?.noAppointments || "No Appointments"}</h3>
          <p>{t.appointments?.noAppointmentsDesc || "You don't have any appointments scheduled for today."}</p>
        </div>
      ) : (
        <div className="doctor-appointments-list">
          {appointments.map((a) => (
            <div key={a.id} className="doctor-appointment-card">
              <div className="doctor-appointment-content">
                <div className="doctor-appointment-info">
                  <h4 className="doctor-appointment-patient">{a.patientName}</h4>
                  <div className="doctor-appointment-datetime">
                    <span className="doctor-appointment-date">
                      📅 {new Date(a.dateTime).toLocaleDateString(locale, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="doctor-appointment-time">
                      🕐 {new Date(a.dateTime).toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="doctor-appointment-meta">
                    {a.type && (
                      <span className="appointment-type-badge">
                        {translateAppointmentType(a.type)}
                      </span>
                    )}
                    {a.paymentType && (
                      <span className="appointment-payment-badge">
                        {translatePaymentType(a.paymentType)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="doctor-actions">
                  <button className="btn btn-small" onClick={() => setEditModal(a)}>
                    {t.appointments?.edit || "Edit"}
                  </button>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => setCancelId(a.id)}
                  >
                    {t.appointments?.cancel || "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editModal && doctor && (
        <AppointmentEditModal
          appointment={editModal}
          doctor={doctor}
          onClose={() => setEditModal(null)}
          onSaved={handleEditSuccess}
          updateFunction={doctorService.updateAppointment.bind(doctorService)}
        />
      )}

      {cancelId && (
        <AppointmentCancelModal
          appointmentId={cancelId}
          onClose={() => setCancelId(null)}
          onCanceled={handleCancelSuccess}
          cancelFunction={doctorService.cancelAppointment.bind(doctorService)}
        />
      )}
    </section>
  );
};