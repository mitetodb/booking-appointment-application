import { useState } from "react";
import { adminService } from "../../services/adminService";
import { Roles } from "../../constants/roles";

export const EditUserModal = ({ user, onClose, onSaved }) => {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.log(err);
      setError("Cannot update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ width: "420px" }}>
        <h3>Edit User</h3>

        <div className="modal-section">
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value={Roles.ADMIN}>Admin</option>
              <option value={Roles.DOCTOR}>Doctor</option>
              <option value={Roles.ASSISTANT}>Assistant</option>
              <option value={Roles.USER}>User</option>
            </select>
          </label>

          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" disabled={loading} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
