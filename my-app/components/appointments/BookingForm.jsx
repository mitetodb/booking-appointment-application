import { useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { toLocalDateTimeString } from '../../utils/dateUtils';

export const BookingForm = ({ doctor, selectedSlot, onSuccess }) => {
  const [type, setType] = useState('PRIMARY');
  const [payment, setPayment] = useState('PRIVATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        dateTime: toLocalDateTimeString(selectedSlot),
        type,
        paymentType: payment
      };

      const result = await appointmentService.book(doctor.id, payload);

      onSuccess(result);
    } catch (err) {
      setError('Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleBook}>
      <h4>Confirm your appointment</h4>

      <p>
        Selected time:{" "}
        <strong>
          {selectedSlot.toLocaleDateString()}{" "}
          {selectedSlot.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </strong>
      </p>

      <label>
        Type of examination:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="PRIMARY">Primary</option>
          <option value="FOLLOW_UP">Follow-up</option>
        </select>
      </label>

      <label>
        Payment:
        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="PRIVATE">Private</option>
          {doctor.worksWithHealthInsurance && (
            <option value="NHIF">NHIF</option>
          )}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button disabled={loading}>
        {loading ? 'Booking...' : 'Book appointment'}
      </button>
    </form>
  );
};
