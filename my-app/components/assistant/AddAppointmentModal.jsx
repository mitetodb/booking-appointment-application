import { useState, useEffect } from "react";
import { assistantService } from "../../services/assistantService";
import { BookingSlots } from "../appointments/BookingSlots";
import { toLocalDateTimeString } from "../../utils/dateUtils";
import { useTranslation } from "../../hooks/useTranslation";
import { UserSelector } from "../common/UserSelector";
import { validateDate, validateAppointmentType, validatePaymentType, validateUUID } from "../../utils/validation";

export const AddAppointmentModal = ({ doctor, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [type, setType] = useState("PRIMARY");
  const [paymentType, setPaymentType] = useState("PRIVATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const usersList = await assistantService.getAllUsers();
        const usersArray = Array.isArray(usersList) ? usersList : (usersList?.data || usersList?.users || []);
        setUsers(usersArray);
      } catch (err) {
        console.error("Error loading users:", err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;
  const patientName = selectedUser 
    ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() 
    : '';

  const handleCreate = async () => {
    setError("");
    
    // Validate inputs
    if (!selectedSlot) {
      setError(t.assistant?.selectTimeError || "Please select a time slot.");
      return;
    }

    if (!selectedUserId) {
      setError(t.assistant?.selectPatientError || "Please select a patient.");
      return;
    }

    if (!doctor || !doctor.id) {
      setError("Doctor information is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Validate date
      const dateValidation = validateDate(selectedSlot);
      if (!dateValidation.valid) {
        setError(t.assistant?.invalidDateError || "Invalid date selected.");
        setLoading(false);
        return;
      }

      // Validate appointment type and payment type
      const typeValidation = validateAppointmentType(type);
      if (!typeValidation.valid) {
        setError(typeValidation.error);
        setLoading(false);
        return;
      }

      const paymentValidation = validatePaymentType(paymentType);
      if (!paymentValidation.valid) {
        setError(paymentValidation.error);
        setLoading(false);
        return;
      }

      // Check if doctor accepts NHIF if that payment type is selected
      if (paymentType === 'NHIF' && !doctor.worksWithHealthInsurance) {
        setError(t.assistant?.nhifNotAvailable || "This doctor does not accept NHIF payments.");
        setLoading(false);
        return;
      }

      // Validate UUIDs
      const doctorIdValidation = validateUUID(doctor.id);
      if (!doctorIdValidation.valid) {
        setError("Invalid doctor ID.");
        setLoading(false);
        return;
      }

      const patientIdValidation = validateUUID(selectedUserId);
      if (!patientIdValidation.valid) {
        setError("Invalid patient ID.");
        setLoading(false);
        return;
      }

      const dateTimeString = toLocalDateTimeString(selectedSlot);
      
      // Send both patientId and patientName for backend to properly link the appointment
      const newAppointment = await assistantService.createAppointment(
        doctor.id,
        {
          patientId: selectedUserId, // Backend needs patientId to link appointment to user
          patientName, // Keep patientName for display purposes
          dateTime: dateTimeString,
          type,
          paymentType,
        }
      );

      if (!newAppointment || !newAppointment.id) {
        throw new Error('Invalid response from server');
      }

      onSuccess(newAppointment);
    } catch (err) {
      console.error("Error creating appointment:", err);
      let errorMsg = t.assistant?.createError || "Failed to create appointment.";
      
      if (err.response) {
        if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.status === 400) {
          errorMsg = t.assistant?.validationError || "Invalid appointment data. Please check your selections.";
        } else if (err.response.status === 409) {
          errorMsg = t.assistant?.slotTakenError || "This time slot is already taken. Please select another time.";
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
    <div className="modal-backdrop">
      <div className="modal" style={{ width: "430px" }}>
        <div className="modal-header">
          <h3>{t.assistant?.createAppointment || "Create New Appointment"}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <BookingSlots doctor={doctor} onSelect={(slot) => setSelectedSlot(slot)} />

          <div className="form-group">
            <label>
              {t.assistant?.patientName || "Patient"}
              <UserSelector
                value={selectedUserId}
                onChange={setSelectedUserId}
                placeholder={t.assistant?.selectPatient || "Select patient"}
                disabled={loadingUsers}
                users={users}
              />
            </label>
            {loadingUsers && (
              <small className="form-hint" style={{ color: 'var(--primary)' }}>
                {t.common?.loading || 'Loading patients...'}
              </small>
            )}
          </div>

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

          <button className="btn-primary" disabled={loading} onClick={handleCreate}>
            {loading ? (t.common?.loading || "Loading...") : (t.assistant?.create || "Create")}
          </button>
        </div>
      </div>
    </div>
  );
};
