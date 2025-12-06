import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { UsersTable } from "../../components/admin/UsersTable";
import { EditUserModal } from "../../components/admin/EditUserModal";

export const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await adminService.getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleEditSaved = (updated) => {
    setUsers((all) =>
      all.map((u) => (u.id === updated.id ? updated : u))
    );
    setEditUser(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    await adminService.deleteUser(id);
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <section>
      <h2>Admin Panel</h2>
      <p>Manage users, roles and system access.</p>

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
