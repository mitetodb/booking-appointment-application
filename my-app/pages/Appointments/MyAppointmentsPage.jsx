import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { AppointmentEditModal } from '../../components/appointments/AppointmentEditModal';
import { AppointmentCancelModal } from '../../components/appointments/AppointmentCancelModal';

export const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
      setLoading(false);
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

  if (loading) return <p>Loading appointments...</p>;

  return (
    <section>
      <h2>My Appointments</h2>

      <ul className="appointments-list">
        {appointments.map((a) => (
          <li key={a.id} className="appointment-item">
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