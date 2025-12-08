import { useEffect, useState } from 'react';
import { assistantService } from '../../services/assistantService';
import { Link } from 'react-router-dom';

export const AssistantDashboardPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await assistantService.getMyDoctors();
      setDoctors(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <section>
      <h2>Assistant Panel</h2>
      <p>Manage appointments for your assigned doctors.</p>

      <ul className="doctor-list">
        {doctors.map((d) => (
          <li key={d.id} className="doctor-item">
            <img
              src={d.imageUrl || 'https://via.placeholder.com/60'}
              alt={`${d.firstName} ${d.lastName}`}
            />
            <div>
              <strong>
                Dr. {d.firstName} {d.lastName}
              </strong>
              <div>{d.specialty}</div>
            </div>

            <Link to={`/assistant/doctor/${d.id}`} className="btn-primary">
              Manage Appointments
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};