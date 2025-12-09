import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { AppointmentEditModal } from '../../components/appointments/AppointmentEditModal';
import { AppointmentCancelModal } from '../../components/appointments/AppointmentCancelModal';
import { ErrorBox } from '../../components/common/ErrorBox';

export const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleEditClick = async (appointment) => {
    const doc = await doctorService.getById(appointment.doctorId);
    setEditingDoctor(doc);
    setEditing(appointment);
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

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <ErrorBox message={error} />;
  if (!appointments || appointments.length === 0) return <ErrorBox message="You have no appointments." />;

  return (
    <section>
      <h2>My Appointments</h2>

      {upcoming && (
        <div className="upcoming-box">
          <h3>Upcoming appointment</h3>
          <p>
            With <strong>{upcoming.doctorName}</strong> on{' '}
            <strong>
              {new Date(upcoming.dateTime).toLocaleDateString()}{' '}
              {new Date(upcoming.dateTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>
          </p>
        </div>
      )}

      <ul className="appointments-list">
        {appointments.map((a) => (
          <li key={a.id} className="appointment-item card">
            <div>
              <strong>{a.doctorName}</strong>
              <div>
                {new Date(a.dateTime).toLocaleDateString()} -{' '}
                {new Date(a.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="appointment-actions">
              {a.status === 'BOOKED' && (
                <>
                  <button className="btn" onClick={() => handleEditClick(a)}>
                    Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => setCancelId(a.id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

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