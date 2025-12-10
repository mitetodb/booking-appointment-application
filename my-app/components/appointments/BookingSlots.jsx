import { useState, useEffect } from 'react';
import { generateDailySlots } from '../../utils/generateSlots';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocaleFromLanguage } from '../../utils/dateUtils';

export const BookingSlots = ({ doctor, onSelect, selectedSlot }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = getLocaleFromLanguage(language);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (selectedSlot) {
      const d = new Date(selectedSlot);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (selectedSlot) {
      const slotDate = new Date(selectedSlot);
      slotDate.setHours(0, 0, 0, 0);
      const currentDate = new Date(selectedDate);
      currentDate.setHours(0, 0, 0, 0);
      
      if (slotDate.getTime() !== currentDate.getTime()) {
        setSelectedDate(slotDate);
      }
    }
  }, [selectedSlot]);

  useEffect(() => {
    if (doctor?.workingHours) {
      const generated = generateDailySlots(selectedDate, doctor.workingHours);
      setSlots(generated);
    } else {
      setSlots([]);
    }
  }, [selectedDate, doctor]);

  const handleDateChange = (e) => {
    const d = new Date(e.target.value);
    setSelectedDate(d);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-slots">
      <div className="booking-slots-header">
        <h4>{t.doctors?.selectDate || 'Select Date'}</h4>
        <input
          type="date"
          value={selectedDate.toISOString().substring(0, 10)}
          onChange={handleDateChange}
          min={minDate}
          className="date-picker"
        />
      </div>

      <div className="booking-slots-content">
        <h4>{t.doctors?.selectTime || 'Select Time Slot'}</h4>

        {!doctor?.workingHours || doctor.workingHours.length === 0 ? (
          <div className="no-schedule-message">
            <span className="no-schedule-icon">📅</span>
            <p>{t.doctors?.noSchedule || 'This doctor has not set their working hours yet.'}</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="no-slots-message">
            <span className="no-slots-icon">⏰</span>
            <p>{t.doctors?.noSlots || 'No available slots for this day.'}</p>
            <small>{t.doctors?.tryAnotherDay || 'Please try selecting another date.'}</small>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => {
              const time = slot.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit'
              });

              const isSelected = selectedSlot && 
                slot.getHours() === selectedSlot.getHours() && 
                slot.getMinutes() === selectedSlot.getMinutes() &&
                slot.getDate() === selectedSlot.getDate() &&
                slot.getMonth() === selectedSlot.getMonth() &&
                slot.getFullYear() === selectedSlot.getFullYear();

              return (
                <button
                  key={slot.toISOString()}
                  className={`slot-btn ${isSelected ? 'slot-btn-selected' : ''}`}
                  onClick={() => onSelect(slot)}
                  type="button"
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
