import { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { BookingSlots } from './BookingSlots';
import { toLocalDateTimeString } from '../../utils/dateUtils';
import { useTranslation } from '../../hooks/useTranslation';

export const AppointmentEditModal = ({ appointment, doctor, onClose, onSaved, updateFunction }) => {
  const { t } = useTranslation();
  const [selectedSlot, setSelectedSlot] = useState(
    new Date(appointment.dateTime)
  );
  const [type, setType] = useState(appointment.type);
  const [payment, setPayment] = useState(appointment.paymentType);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateFn = updateFunction || appointmentService.update.bind(appointmentService);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (!selectedSlot) {
        setError(t.appointments?.selectTimeError || 'Please select a time slot.');
        setLoading(false);
        return;
      }

      if (!type || !payment) {
        setError(t.appointments?.fillAllFields || 'Please fill in all fields.');
        setLoading(false);
        return;
      }

      const slotDate = selectedSlot instanceof Date ? selectedSlot : new Date(selectedSlot);
      
      const dateTimeString = toLocalDateTimeString(slotDate);
      
      const payload = {
        dateTime: dateTimeString,
        type,
        paymentType: payment
      };

      console.debug('Updating appointment:', appointment.id);
      console.debug('Payload:', payload);
      console.debug('Formatted dateTime:', dateTimeString);

      const updated = await updateFn(appointment.id, payload);
      console.debug('Update response:', updated);
      
      if (updated && updated.id) {
        onSaved(updated);
      } else {
        throw new Error('Update response was invalid');
      }
    } catch (err) {
      console.error('Failed to update appointment', err);
      console.error('Error details:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message
      });

      let errorMessage = t.appointments?.updateError || 'Failed to update appointment.';
      
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (Array.isArray(err.response.data) && err.response.data.length > 0) {
          errorMessage = err.response.data[0];
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      if (err?.response?.status === 400) {
        errorMessage = (t.appointments?.validationError || 'Invalid data. Please check your input.') + (errorMessage !== (t.appointments?.updateError || 'Failed to update appointment.') ? ` (${errorMessage})` : '');
      } else if (err?.response?.status === 404) {
        errorMessage = t.appointments?.notFoundError || 'Appointment not found.';
      } else if (err?.response?.status === 403) {
        errorMessage = t.appointments?.permissionError || 'You do not have permission to update this appointment.';
      } else if (err?.response?.status >= 500) {
        errorMessage = t.appointments?.serverError || 'Server error. Please try again later.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal admin-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t.appointments?.editAppointment || 'Edit Appointment'}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-content">
          <BookingSlots
            doctor={doctor}
            onSelect={(slot) => {
              setSelectedSlot(slot);
              setError('');
            }}
            selectedSlot={selectedSlot}
          />

          <div className="modal-form">
            <div className="form-group">
              <label>
                {t.appointments?.type || t.doctors?.examinationType || 'Type'}
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="PRIMARY">{t.doctors?.primary || 'Primary'}</option>
                  <option value="FOLLOW_UP">{t.doctors?.followUp || 'Follow-up'}</option>
                </select>
              </label>
            </div>

            <div className="form-group">
              <label>
                {t.appointments?.payment || t.doctors?.payment || 'Payment'}
                <select 
                  value={payment} 
                  onChange={(e) => setPayment(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="PRIVATE">{t.doctors?.private || 'Private'}</option>
                  {doctor.worksWithHealthInsurance && (
                    <option value="NHIF">{t.doctors?.nhif || 'NHIF'}</option>
                  )}
                </select>
              </label>
            </div>
          </div>

          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            {t.common?.cancel || 'Cancel'}
          </button>
          <button 
            className="btn-primary" 
            disabled={loading} 
            onClick={handleSubmit}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (t.common?.loading || 'Saving...') : (t.appointments?.saveChanges || 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
};
