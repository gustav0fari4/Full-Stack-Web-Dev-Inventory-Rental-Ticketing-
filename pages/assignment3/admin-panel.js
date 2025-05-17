import { useEffect, useState } from "react";
import NavbarAssignment3 from "/components/navbar-assignment3";
import Link from "next/link";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users when the component loads
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/assignment3/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle user deletion with confirmation
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch("/api/assignment3/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchUsers();
  };

  // Handle user role update (promote/demote)
  const updateRole = async (id, role) => {
    const res = await fetch("/api/assignment3/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) fetchUsers();
  };

  // Initial load: get user list
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <NavbarAssignment3 />
      <div className="container">
        <h1>Admin Panel - User Management</h1>

        {/* Navigation to Manage Applications */}
        <Link href="/assignment3/manage-applications">
          <button style={{ marginBottom: "20px" }}>Manage Applications</button>
        </Link>

        {/* Error message if fetch fails */}
        {error && <p className="error">{error}</p>}

        {/* User list table or fallback message */}
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {/* Delete user button */}
                    <button onClick={() => deleteUser(u.id)}>Delete</button>{" "}

                    {/* Role controls (Admin role is fixed) */}
                    {u.role === "tenant" && (
                      <button onClick={() => updateRole(u.id, "landlord")}>Promote</button>
                    )}
                    {u.role === "landlord" && (
                      <button onClick={() => updateRole(u.id, "tenant")}>Demote</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

