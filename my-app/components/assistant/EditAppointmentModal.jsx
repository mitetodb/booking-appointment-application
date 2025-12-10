import { useState } from "react";
import { assistantService } from "../../services/assistantService";
import { BookingSlots } from "../appointments/BookingSlots";
import { toLocalDateTimeString } from "../../utils/dateUtils";
import { useTranslation } from "../../hooks/useTranslation";

export const EditAppointmentModal = ({ doctor, appointment, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [selectedSlot, setSelectedSlot] = useState(new Date(appointment.dateTime));
  const [type, setType] = useState(appointment.type);
  const [paymentType, setPaymentType] = useState(appointment.paymentType);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = async () => {
    if (!selectedSlot) {
      setError(t.assistant?.selectTimeAndPatient || "Please select a time slot.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const dateTimeString = toLocalDateTimeString(selectedSlot);
      
      const payload = {
        dateTime: dateTimeString,
        type,
        paymentType,
      };

      const updated = await assistantService.updateAppointment(appointment.id, payload);
      onSuccess(updated);
    } catch (err) {
      console.error("Error updating appointment:", err);
      const errorMsg = err.response?.data?.message || err.message || t.assistant?.updateError || "Failed to update appointment.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ width: "430px" }}>
        <div className="modal-header">
          <h3>{t.assistant?.editAppointment || "Edit Appointment"}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <BookingSlots 
            doctor={doctor} 
            onSelect={(slot) => setSelectedSlot(slot)}
            selectedSlot={selectedSlot}
          />

          <div className="form-group">
            <label>
              {t.assistant?.type || "Type"}
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="PRIMARY">{t.doctors?.primary || "Primary"}</option>
                <option value="FOLLOW_UP">{t.doctors?.followUp || "Follow-up"}</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              {t.assistant?.payment || "Payment"}
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                <option value="PRIVATE">{t.doctors?.private || "Private"}</option>
                {doctor.worksWithHealthInsurance && <option value="NHIF">{t.doctors?.nhif || "NHIF"}</option>}
              </select>
            </label>
          </div>

          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            {t.assistant?.close || "Close"}
          </button>
          <button className="btn-primary" disabled={loading} onClick={handleEdit}>
            {loading ? (t.common?.loading || "Loading...") : (t.assistant?.save || "Save")}
          </button>
        </div>
      </div>
    </div>
  );
};
