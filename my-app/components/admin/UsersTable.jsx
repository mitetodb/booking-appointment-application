import { useState } from "react";

export const UsersTable = ({ users, onEditClick, onDeleteClick }) => {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const full = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      full.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="users-table-wrapper">
      <div className="users-table-header">
        <h3>Users</h3>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((user) => (
            <tr key={user.id}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td style={{ textAlign: "right" }}>
                <button className="btn" onClick={() => onEditClick(user)}>
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => onDeleteClick(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No users match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
