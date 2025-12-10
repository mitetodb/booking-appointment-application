import { useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { toLocalDateTimeString, getLocaleFromLanguage } from '../../utils/dateUtils';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { validateDate, validateAppointmentType, validatePaymentType, validateUUID } from '../../utils/validation';

export const BookingForm = ({ doctor, selectedSlot, onSuccess }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = getLocaleFromLanguage(language);
  const [type, setType] = useState('PRIMARY');
  const [payment, setPayment] = useState('PRIVATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!doctor || !doctor.id) {
        throw new Error('Doctor information is missing');
      }

      const doctorIdValidation = validateUUID(doctor.id);
      if (!doctorIdValidation.valid) {
        throw new Error('Invalid doctor ID');
      }

      if (!selectedSlot) {
        throw new Error(t.doctors?.selectTimeError || 'Please select a time slot');
      }

      const dateValidation = validateDate(selectedSlot);
      if (!dateValidation.valid) {
        throw new Error(t.doctors?.invalidDateError || 'Invalid date selected');
      }

      const typeValidation = validateAppointmentType(type);
      if (!typeValidation.valid) {
        throw new Error(typeValidation.error);
      }

      const paymentValidation = validatePaymentType(payment);
      if (!paymentValidation.valid) {
        throw new Error(paymentValidation.error);
      }

      // Check if doctor accepts NHIF if that payment type is selected
      if (payment === 'NHIF' && !doctor.worksWithHealthInsurance) {
        throw new Error(t.doctors?.nhifNotAvailable || 'This doctor does not accept NHIF payments');
      }

      const dateTimeString = toLocalDateTimeString(selectedSlot);
      const payload = {
        dateTime: dateTimeString,
        type,
        paymentType: payment
      };

      const result = await appointmentService.book(doctor.id, payload);
      
      if (!result || !result.id) {
        throw new Error('Invalid response from server');
      }

      onSuccess(result);
    } catch (err) {
      console.error('Booking error:', err);
      let errorMsg = t.doctors?.bookingError || 'Failed to book appointment.';
      
      if (err.response) {
        if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.status === 400) {
          errorMsg = t.doctors?.validationError || 'Invalid booking data. Please check your selections.';
        } else if (err.response.status === 409) {
          errorMsg = t.doctors?.slotTakenError || 'This time slot is already taken. Please select another time.';
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleBook}>
      <div className="booking-form-header">
        <h4>{t.doctors?.confirmAppointment || 'Confirm Your Appointment'}</h4>
      </div>

      {selectedSlot && (
        <div className="selected-time-display">
          <span className="time-label">{t.doctors?.selectedTime || 'Selected Time'}:</span>
          <div className="time-value">
            <span className="time-date">
              📅 {selectedSlot instanceof Date ? selectedSlot.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : new Date(selectedSlot).toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="time-hour">
              🕐 {selectedSlot instanceof Date ? selectedSlot.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit'
              }) : new Date(selectedSlot).toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      )}

      <div className="booking-form-fields">
        <div className="form-group">
          <label>
            {t.doctors?.examinationType || 'Type of Examination'}
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="form-select"
            >
              <option value="PRIMARY">{t.doctors?.primary || 'Primary'}</option>
              <option value="FOLLOW_UP">{t.doctors?.followUp || 'Follow-up'}</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            {t.doctors?.payment || 'Payment'}
            <select 
              value={payment} 
              onChange={(e) => setPayment(e.target.value)}
              className="form-select"
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
        <div className="booking-error-message">
          <span className="error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="booking-form-actions">
        <button 
          type="submit"
          className="btn-primary" 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? (t.doctors?.booking || 'Booking...') : (t.doctors?.bookAppointment || 'Book Appointment')}
        </button>
      </div>
    </form>
  );
};
