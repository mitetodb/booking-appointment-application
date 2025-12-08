import { useEffect, useState } from "react";
import { assistantService } from "../../services/assistantService";
import { doctorService } from "../../services/doctorService";
import { useParams } from "react-router-dom";

import { AddAppointmentModal } from "../../components/assistant/AddAppointmentModal";
import { EditAppointmentModal } from "../../components/assistant/EditAppointmentModal";
import { AppointmentCancelModal } from "../../components/appointments/AppointmentCancelModal";

export const AssistantDoctorAppointmentsPage = () => {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const doc = await doctorService.getById(doctorId);
      setDoctor(doc);

      const apps = await assistantService.getDoctorAppointments(doctorId);
      setAppointments(apps);

      setLoading(false);
    };
    load();
  }, [doctorId]);

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

  if (loading) return <p>Loading appointments...</p>;

  return (
    <section>
      <h2>
        Appointments for Dr. {doctor.firstName} {doctor.lastName}
      </h2>

      <button className="btn-primary" onClick={() => setAddModal(true)}>
        + Add Appointment
      </button>

      <ul className="appointments-list" style={{ marginTop: "1rem" }}>
        {appointments.map((a) => (
          <li key={a.id} className="appointment-item">
            <div>
              <strong>{a.patientName}</strong>
              <div>
                {new Date(a.dateTime).toLocaleDateString()}{" "}
                {new Date(a.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>{a.type}</div>
            </div>

            <div>
              <button className="btn small" onClick={() => setEditModal(a)}>
                Edit
              </button>
              <button
                className="btn-danger small"
                onClick={() => setCancelId(a.id)}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>

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
        />
      )}
    </section>
  );
};
