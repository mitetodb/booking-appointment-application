import { useState, useEffect } from "react";
import { assistantService } from "../../services/assistantService";
import { BookingSlots } from "../appointments/BookingSlots";
import { toLocalDateTimeString } from "../../utils/dateUtils";
import { useTranslation } from "../../hooks/useTranslation";
import { UserSelector } from "../common/UserSelector";

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
    if (!selectedSlot || !selectedUserId) {
      setError(t.assistant?.selectTimeAndPatient || "Please select time and patient.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const dateTimeString = toLocalDateTimeString(selectedSlot);
      
      const newAppointment = await assistantService.createAppointment(
        doctor.id,
        {
          patientId: selectedUserId,
          patientName, 
          dateTime: dateTimeString,
          type,
          paymentType,
        }
      );

      onSuccess(newAppointment);
    } catch (err) {
      console.error("Error creating appointment:", err);
      const errorMsg = err.response?.data?.message || err.message || t.assistant?.createError || "Failed to create appointment.";
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
