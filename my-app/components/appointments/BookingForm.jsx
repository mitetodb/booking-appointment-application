import { useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { toLocalDateTimeString, getLocaleFromLanguage } from '../../utils/dateUtils';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';

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
      const payload = {
        dateTime: toLocalDateTimeString(selectedSlot),
        type,
        paymentType: payment
      };

      const result = await appointmentService.book(doctor.id, payload);

      onSuccess(result);
    } catch (err) {
      console.error('Booking error:', err);
      const errorMsg = err.response?.data?.message || err.message || t.doctors?.bookingError || 'Failed to book appointment.';
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

      <div className="selected-time-display">
        <span className="time-label">{t.doctors?.selectedTime || 'Selected Time'}:</span>
        <div className="time-value">
          <span className="time-date">
            📅 {selectedSlot.toLocaleDateString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="time-hour">
            🕐 {selectedSlot.toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

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
