import { useEffect, useState } from "react";
import { doctorService } from "../../services/doctorService";
import { useLanguage } from "../../contexts/LanguageContext";
import { getLocaleFromLanguage, toLocalDateTimeString } from "../../utils/dateUtils";
import { Loading } from "../../components/common/Loading";
import { ErrorBox } from "../../components/common/ErrorBox";
import { useTranslation } from "../../hooks/useTranslation";

export const DoctorAppointmentsPage = () => {
  const { language } = useLanguage();
  const locale = getLocaleFromLanguage(language);
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
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

  const move = async (appointment, direction) => {
    try {
      const date = new Date(appointment.dateTime);
      const newDate = new Date(
        date.getTime() + direction * 20 * 60 * 1000 // +/- 20 minutes
      );

      // Format dateTime without timezone (backend expects LocalDateTime format)
      const newDateTimeString = toLocalDateTimeString(newDate);

      const updated = await doctorService.moveAppointment(appointment.id, {
        newDateTime: newDateTimeString,
      });

      setAppointments((apps) =>
        apps.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (err) {
      console.error("Error moving appointment:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to move appointment.";
      setError(errorMsg);
    }
  };

  const moveUp = (a) => move(a, -1);
  const moveDown = (a) => move(a, 1);

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
                  {a.type && (
                    <span className="doctor-appointment-type">{a.type}</span>
                  )}
                </div>

                <div className="doctor-actions">
                  <button className="btn btn-small" onClick={() => moveUp(a)}>
                    ↑ {t.schedule?.moveUp || "Move Up"}
                  </button>
                  <button className="btn btn-small" onClick={() => moveDown(a)}>
                    ↓ {t.schedule?.moveDown || "Move Down"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};