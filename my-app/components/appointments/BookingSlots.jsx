import { useState, useEffect } from 'react';
import { generateDailySlots } from '../../utils/generateSlots';

export const BookingSlots = ({ doctor, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (doctor?.workingHours) {
      const generated = generateDailySlots(selectedDate, doctor.workingHours);
      setSlots(generated);
    }
  }, [selectedDate, doctor]);

  const handleDateChange = (e) => {
    const d = new Date(e.target.value);
    setSelectedDate(d);
  };

  return (
    <section className="booking-slots">
      <h4>Select date</h4>

      <input
        type="date"
        value={selectedDate.toISOString().substring(0, 10)}
        onChange={handleDateChange}
      />

      <h4>Select time slot</h4>

      <div className="slots-grid">
        {slots.length === 0 && <p>No available slots for this day.</p>}

        {slots.map((slot) => {
          const time = slot.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <button
              key={slot.toISOString()}
              className="slot-btn"
              onClick={() => onSelect(slot)}
            >
              {time}
            </button>
          );
        })}
      </div>
    </section>
  );
};
