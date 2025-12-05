import { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { BookingSlots } from './BookingSlots';
import { toLocalDateTimeString } from '../../utils/dateUtils';

export const AppointmentEditModal = ({ appointment, doctor, onClose, onSaved }) => {
  const [selectedSlot, setSelectedSlot] = useState(
    new Date(appointment.dateTime)
  );
  const [type, setType] = useState(appointment.type);
  const [payment, setPayment] = useState(appointment.paymentType);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        dateTime: toLocalDateTimeString(selectedSlot),
        type,
        paymentType: payment
      };

      // Debug: log payload being sent
      console.debug('Updating appointment payload:', payload);

      const updated = await appointmentService.update(appointment.id, payload);
      console.debug('Update response:', updated);
      onSaved(updated);
    } catch (err) {
      console.error('Failed to update appointment', err);

      // Try to extract useful message from error response
      const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
      setError(typeof serverMsg === 'string' ? serverMsg : 'Failed to update appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Appointment</h3>

        <BookingSlots
          doctor={doctor}
          onSelect={(slot) => setSelectedSlot(slot)}
        />

        <div className="modal-section">
          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="PRIMARY">Primary</option>
              <option value="FOLLOW_UP">Follow-up</option>
            </select>
          </label>

          <label>
            Payment:
            <select value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option value="PRIVATE">Private</option>
              {doctor.worksWithHealthInsurance && <option value="NHIF">NHIF</option>}
            </select>
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={loading} onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
