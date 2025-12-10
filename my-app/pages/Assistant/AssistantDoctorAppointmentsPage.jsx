import { useEffect, useState } from "react";
import { assistantService } from "../../services/assistantService";
import { doctorService } from "../../services/doctorService";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getLocaleFromLanguage } from "../../utils/dateUtils";
import { useTranslation } from "../../hooks/useTranslation";
import { Loading } from "../../components/common/Loading";
import { ErrorBox } from "../../components/common/ErrorBox";

import { AddAppointmentModal } from "../../components/assistant/AddAppointmentModal";
import { EditAppointmentModal } from "../../components/assistant/EditAppointmentModal";
import { AppointmentCancelModal } from "../../components/appointments/AppointmentCancelModal";

export const AssistantDoctorAppointmentsPage = () => {
  const { doctorId } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const locale = getLocaleFromLanguage(language);

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [cancelId, setCancelId] = useState(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const doc = await doctorService.getById(doctorId);
        setDoctor(doc);

        const apps = await assistantService.getDoctorAppointments(doctorId);
        const appointmentsList = Array.isArray(apps) ? apps : (apps?.data || apps?.appointments || []);
        setAppointments(appointmentsList);
      } catch (err) {
        console.error("Error loading appointments:", err);
        const errorMsg = err.response?.data?.message || err.message || t.assistant?.loadError || "Failed to load appointments.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [doctorId, t]);

  const handleAddSuccess = (newAppointment) => {
    setAppointments((a) => [...a, newAppointment]);
    setAddModal(false);
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
  if (error && !doctor) return <ErrorBox message={error} />;
  if (!doctor) return <ErrorBox message={t.doctors?.notFound || "Doctor not found."} />;

  const doctorName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
  const appointmentsTitle = t.assistant?.appointmentsTitle?.replace('{name}', doctorName) || 
    `${t.assistant?.appointmentsTitleDefault || 'Appointments'} for Dr. ${doctorName}`;

  return (
    <section className="assistant-appointments-page">
      <div className="assistant-appointments-header">
        <h2>{appointmentsTitle}</h2>
        <p className="assistant-appointments-subtitle">
          {t.assistant?.subtitle || "Manage appointments for this doctor"}
        </p>
      </div>

      {error && (
        <div className="assistant-appointments-message error-message">
          <span className="message-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="assistant-appointments-actions">
        <button className="btn-primary" onClick={() => setAddModal(true)}>
          + {t.assistant?.addAppointment || "Add Appointment"}
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-appointments">
          <span className="empty-icon">📋</span>
          <h3>{t.appointments?.noAppointments || "No Appointments"}</h3>
          <p>{t.appointments?.noAppointmentsDesc || "No appointments scheduled."}</p>
        </div>
      ) : (
        <div className="assistant-appointments-list">
          {appointments.map((a) => (
            <div key={a.id} className="assistant-appointment-card">
              <div className="assistant-appointment-content">
                <div className="assistant-appointment-info">
                  <h4 className="assistant-appointment-patient">{a.patientName}</h4>
                  <div className="assistant-appointment-datetime">
                    <span className="assistant-appointment-date">
                      📅 {new Date(a.dateTime).toLocaleDateString(locale, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="assistant-appointment-time">
                      🕐 {new Date(a.dateTime).toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="assistant-appointment-meta">
                    <span className="appointment-type-badge">
                      {translateAppointmentType(a.type)}
                    </span>
                    <span className="appointment-payment-badge">
                      {translatePaymentType(a.paymentType)}
                    </span>
                  </div>
                </div>
                <div className="assistant-appointment-actions">
                  <button className="btn btn-small" onClick={() => setEditModal(a)}>
                    {t.assistant?.edit || "Edit"}
                  </button>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => setCancelId(a.id)}
                  >
                    {t.assistant?.cancel || "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {addModal && (
        <AddAppointmentModal
          doctor={doctor}
          onClose={() => setAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {editModal && (
        <EditAppointmentModal
          doctor={doctor}
          appointment={editModal}
          onClose={() => setEditModal(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {cancelId && (
        <AppointmentCancelModal
          appointmentId={cancelId}
          onClose={() => setCancelId(null)}
          onCanceled={handleCancelSuccess}
          cancelFunction={assistantService.cancelAppointment.bind(assistantService)}
        />
      )}
    </section>
  );
};
