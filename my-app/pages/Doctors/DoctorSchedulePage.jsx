import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';

const days = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 0, name: 'Sunday' }
];

export const DoctorSchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [msg, setMsg] = useState('');

  const [newEntry, setNewEntry] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
  });

  useEffect(() => {
    const load = async () => {
      const profile = await doctorService.getMyProfile();
      setSchedule(profile.workingHours || []);
    };
    load();
  }, []);

  const handleAdd = () => {
    setSchedule((s) => [...s, newEntry]);
  };

  const handleRemove = (index) => {
    setSchedule((s) => s.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const updated = await doctorService.updateMyWorkingHours(schedule);
    setMsg('Working hours updated successfully.');
    setSchedule(updated.workingHours);
  };

  return (
    <section>
      <h2>My Schedule</h2>
      <p>Manage your working days and available hours.</p>

      {msg && <p className="success">{msg}</p>}

      <h3>Current Working Hours</h3>

      <ul className="schedule-list">
        {schedule.map((s, index) => (
          <li key={index} className="schedule-item">
            <strong>{days.find((d) => d.id === s.dayOfWeek)?.name}</strong>:{' '}
            {s.startTime} - {s.endTime}
            <button className="btn-danger small" onClick={() => handleRemove(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h3>Add New Working Day</h3>

      <div className="working-form">
        <label>
          Day:
          <select
            value={newEntry.dayOfWeek}
            onChange={(e) =>
              setNewEntry((n) => ({ ...n, dayOfWeek: Number(e.target.value) }))
            }
          >
            {days.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start:
          <input
            type="time"
            value={newEntry.startTime}
            onChange={(e) =>
              setNewEntry((n) => ({ ...n, startTime: e.target.value }))
            }
          />
        </label>

        <label>
          End:
          <input
            type="time"
            value={newEntry.endTime}
            onChange={(e) =>
              setNewEntry((n) => ({ ...n, endTime: e.target.value }))
            }
          />
        </label>

        <button className="btn" onClick={handleAdd}>
          Add Day
        </button>
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Save Schedule
      </button>
    </section>
  );
};