import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { Roles } from "../../constants/role";
import { useTranslation } from "../../hooks/useTranslation";

export const EditUserModal = ({ user, onClose, onSaved }) => {
  const { t } = useTranslation();
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update state when user prop changes
  useEffect(() => {
    setRole(user.role);
    setStatus(user.status);
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const updated = await adminService.updateUser(user.id, {
        role,
        status,
      });

      onSaved(updated);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || t.admin?.updateError || "Cannot update user.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal admin-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t.admin?.editUser || "Edit User"}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="user-info-display">
            <p className="user-info-name">
              <strong>{user.firstName} {user.lastName}</strong>
            </p>
            <p className="user-info-email">{user.email}</p>
          </div>

          <div className="modal-form">
            <div className="form-group">
              <label>
                {t.admin?.role || "Role"}
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value={Roles.ADMIN}>{t.admin?.roleAdmin || "Admin"}</option>
                  <option value={Roles.DOCTOR}>{t.admin?.roleDoctor || "Doctor"}</option>
                  <option value={Roles.ASSISTANT}>{t.admin?.roleAssistant || "Assistant"}</option>
                  <option value={Roles.USER}>{t.admin?.roleUser || "User"}</option>
                </select>
              </label>
            </div>

            <div className="form-group">
              <label>
                {t.admin?.status || "Status"}
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="ACTIVE">{t.admin?.statusActive || "Active"}</option>
                  <option value="INACTIVE">{t.admin?.statusInactive || "Inactive"}</option>
                  <option value="BLOCKED">{t.admin?.statusBlocked || "Blocked"}</option>
                  <option value="PENDING">{t.admin?.statusPending || "Pending"}</option>
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
            {t.common?.close || "Close"}
          </button>
          <button 
            className="btn-primary" 
            disabled={loading} 
            onClick={handleSave}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (t.common?.loading || "Saving...") : (t.common?.save || "Save")}
          </button>
        </div>
      </div>
    </div>
  );
};
