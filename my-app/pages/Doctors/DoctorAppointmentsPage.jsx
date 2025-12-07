import { useEffect, useState } from "react";
import { doctorService } from "../../services/doctorService";

export const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await doctorService.getMyAppointments();
      setAppointments(data);
      setLoading(false);
    };
    load();
  }, []);

  const move = async (appointment, direction) => {
    const date = new Date(appointment.dateTime);
    const newDate = new Date(
      date.getTime() + direction * 20 * 60 * 1000 // +/- 20 мин.
    );

    const updated = await doctorService.moveAppointment(appointment.id, {
      newDateTime: newDate.toISOString(),
    });

    setAppointments((apps) =>
      apps.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const moveUp = (a) => move(a, -1);
  const moveDown = (a) => move(a, 1);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <section>
      <h2>My Patients Today</h2>
      <p>Manage your appointments for today.</p>

      <ul className="appointments-list">
        {appointments.map((a) => (
          <li key={a.id} className="appointment-item">
            <div>
              <strong>{a.patientName}</strong>
              <div>
                {new Date(a.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="doctor-actions">
              <button className="btn small" onClick={() => moveUp(a)}>
                ↑ Move Up
              </button>
              <button className="btn small" onClick={() => moveDown(a)}>
                ↓ Move Down
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};