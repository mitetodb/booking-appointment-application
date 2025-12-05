import { appointmentService } from '../../services/appointmentService';
import { useState } from 'react';

export const AppointmentCancelModal = ({ appointmentId, onClose, onCanceled }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await appointmentService.cancel(appointmentId);
    setLoading(false);
    onCanceled();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Cancel Appointment?</h3>
        <p>This action cannot be undone.</p>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Back</button>

          <button
            className="btn-danger"
            disabled={loading}
            onClick={handleCancel}
          >
            {loading ? 'Canceling...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
