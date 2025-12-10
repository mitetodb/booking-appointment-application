import { useState } from "react";
import { assistantService } from "../../services/assistantService";
import { BookingSlots } from "../appointments/BookingSlots";
import { toLocalDateTimeString } from "../../utils/dateUtils";

export const AddAppointmentModal = ({ doctor, onClose, onSuccess }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [type, setType] = useState("PRIMARY");
  const [paymentType, setPaymentType] = useState("PRIVATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!selectedSlot || !patientName) {
      setError("Please select time and enter patient name.");
      return;
    }

    try {
      setLoading(true);
      const dateTimeString = toLocalDateTimeString(selectedSlot);
      
      const newAppointment = await assistantService.createAppointment(
        doctor.id,
        {
          patientName,
          dateTime: dateTimeString,
          type,
          paymentType,
        }
      );

      onSuccess(newAppointment);
    } catch (err) {
      setError("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ width: "430px" }}>
        <h3>Create New Appointment</h3>

        <BookingSlots doctor={doctor} onSelect={(slot) => setSelectedSlot(slot)} />

        <label>
          Patient Name:
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </label>

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

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Close
          </button>

          <button className="btn-primary" disabled={loading} onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
