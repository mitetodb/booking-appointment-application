import { useState } from "react";
import { assistantService } from "../../services/assistantService";
import { BookingSlots } from "../appointments/BookingSlots";
import { toLocalDateTimeString } from "../../utils/dateUtils";

export const EditAppointmentModal = ({ doctor, appointment, onClose, onSuccess }) => {
  const [selectedSlot, setSelectedSlot] = useState(new Date(appointment.dateTime));
  const [type, setType] = useState(appointment.type);
  const [paymentType, setPaymentType] = useState(appointment.paymentType);

  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    const dateTimeString = toLocalDateTimeString(selectedSlot);
    
    const payload = {
      dateTime: dateTimeString,
      type,
      paymentType,
    };

    const updated = await assistantService.updateAppointment(appointment.id, payload);
    onSuccess(updated);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ width: "430px" }}>
        <h3>Edit Appointment</h3>

        <BookingSlots doctor={doctor} onSelect={(slot) => setSelectedSlot(slot)} />

        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="PRIMARY">Primary</option>
            <option value="FOLLOW_UP">Follow-up</option>
          </select>
        </label>

        <label>
          Payment:
          <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
            <option value="PRIVATE">Private</option>
            {doctor.worksWithHealthInsurance && <option value="NHIF">NHIF</option>}
          </select>
        </label>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn-primary" disabled={loading} onClick={handleEdit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
