import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { UsersTable } from "../../components/admin/UsersTable";
import { EditUserModal } from "../../components/admin/EditUserModal";
import { Loading } from "../../components/common/Loading";
import { ErrorBox } from "../../components/common/ErrorBox";
import { useTranslation } from "../../hooks/useTranslation";

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError(t.admin?.loadError || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const handleEditSaved = (updated) => {
    setUsers((all) =>
      all.map((u) => (u.id === updated.id ? updated : u))
    );
    setEditUser(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.admin?.deleteConfirm || "Delete this user?")) return;

    try {
      await adminService.deleteUser(id);
      setUsers((u) => u.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      setError(t.admin?.deleteSuccess || "Failed to delete user.");
    }
  };

  if (loading) return <Loading />;
  if (error && !users.length) return <ErrorBox message={error} />;

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2>{t.admin?.title || "Admin Panel"}</h2>
        <p className="admin-subtitle">{t.admin?.subtitle || "Manage users, roles and system access"}</p>
      </div>

      {error && (
        <div className="admin-message error-message">
          <span className="message-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <UsersTable
        users={users}
        onEditClick={(u) => setEditUser(u)}
        onDeleteClick={handleDelete}
      />

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={handleEditSaved}
        />
      )}
    </section>
  );
};
