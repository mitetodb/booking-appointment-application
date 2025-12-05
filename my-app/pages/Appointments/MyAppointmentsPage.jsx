import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';

export const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Loading my appointments...</p>;

  return (
    <section>
      <h2>My Appointments</h2>

      {appointments.length === 0 && <p>You have no appointments.</p>}

      <ul className="appointments-list">
        {appointments.map((a) => (
          <li key={a.id} className="appointment-item">
            <strong>{a.doctorName}</strong>
            <div>
              {new Date(a.dateTime).toLocaleDateString()} -{" "}
              {new Date(a.dateTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <span>{a.type}</span>
            <span>{a.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};