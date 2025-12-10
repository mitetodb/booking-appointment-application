import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

export const UsersTable = ({ users, onEditClick, onDeleteClick }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const full = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      full.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getRoleLabel = (role) => {
    const roleMap = {
      'ADMIN': t.admin?.roleAdmin || 'Admin',
      'DOCTOR': t.admin?.roleDoctor || 'Doctor',
      'ASSISTANT': t.admin?.roleAssistant || 'Assistant',
      'USER': t.admin?.roleUser || 'User',
    };
    return roleMap[role] || role;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'ACTIVE': t.admin?.statusActive || 'Active',
      'INACTIVE': t.admin?.statusInactive || 'Inactive',
      'BLOCKED': t.admin?.statusBlocked || 'Blocked',
      'PENDING': t.admin?.statusPending || 'Pending',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      'ACTIVE': 'status-active',
      'INACTIVE': 'status-inactive',
      'BLOCKED': 'status-blocked',
      'PENDING': 'status-pending',
    };
    return statusClassMap[status] || '';
  };

  return (
    <div className="users-table-wrapper">
      <div className="users-table-header">
        <h3>{t.admin?.users || "Users"}</h3>

        <input
          type="text"
          placeholder={t.admin?.searchUsers || "Search users..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="users-search-input"
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>{t.admin?.name || "Name"}</th>
              <th>{t.admin?.email || "Email"}</th>
              <th>{t.admin?.role || "Role"}</th>
              <th>{t.admin?.status || "Status"}</th>
              <th className="actions-column">{t.admin?.actions || "Actions"}</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td className="user-name">
                  {user.firstName} {user.lastName}
                </td>
                <td className="user-email">{user.email}</td>
                <td>
                  <span className="role-badge">{getRoleLabel(user.role)}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(user.status)}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="user-actions">
                  <button className="btn btn-small" onClick={() => onEditClick(user)}>
                    {t.common?.edit || "Edit"}
                  </button>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => onDeleteClick(user.id)}
                  >
                    {t.common?.delete || "Delete"}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="no-users-message">
                  {t.admin?.noUsers || "No users match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
