import { appointmentService } from '../../services/appointmentService';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export const AppointmentCancelModal = ({ appointmentId, onClose, onCanceled, cancelFunction }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const cancelFn = cancelFunction || appointmentService.cancel.bind(appointmentService);

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError('');
      await cancelFn(appointmentId);
      onCanceled();
    } catch (err) {
      console.error('Error canceling appointment:', err);
      const errorMsg = err.response?.data?.message || err.message || t.appointments?.cancelError || 'Failed to cancel appointment.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{t.appointments?.cancelTitle || 'Cancel Appointment?'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <p>{t.appointments?.cancelMessage || 'This action cannot be undone.'}</p>

          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            {t.common?.back || 'Back'}
          </button>

          <button
            className="btn-danger"
            disabled={loading}
            onClick={handleCancel}
          >
            {loading ? (t.appointments?.canceling || 'Canceling...') : (t.appointments?.confirmCancel || 'Confirm Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
