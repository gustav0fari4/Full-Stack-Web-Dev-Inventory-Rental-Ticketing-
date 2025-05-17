import pool from "../../../../lib/db";         // Import the database connection pool
import { parse } from "cookie";               // Parse cookies from incoming requests

export default async function handler(req, res) {
  // Parse session cookie from the request
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  // Restrict access to admin users only
  if (!session || session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  // =========================
  // GET: Return all users (id, name, email, role)
  // =========================
  if (req.method === "GET") {
    try {
      const [users] = await pool.query("SELECT id, name, email, role FROM users");
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch users" });
    }
  }

  // =========================
  // DELETE: Delete a user by ID
  // =========================
  if (req.method === "DELETE") {
    const { id } = req.body;

    // Basic validation
    if (!id) return res.status(400).json({ message: "Missing user ID" });

    try {
      console.log("Deleting user with ID:", id);
      await pool.query("DELETE FROM users WHERE id = ?", [parseInt(id)]);
      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.error("DELETE error:", error);
      return res.status(500).json({ message: "Failed to delete user" });
    }
  }

  // =========================
  // PUT: Update user role (Tenant <-> Landlord)
  // =========================
  if (req.method === "PUT") {
    const { id, role } = req.body;

    // Validate input fields
    if (!id || !role) {
      return res.status(400).json({ message: "Missing user ID or role" });
    }

    try {
      // Check current user role
      const [userRows] = await pool.query("SELECT role FROM users WHERE id = ?", [id]);
      const currentRole = userRows[0]?.role;

      // Prevent changing role of an admin
      if (currentRole === "admin") {
        return res.status(400).json({ message: "Cannot change role of an admin" });
      }

      // Validate new role
      if (!["tenant", "landlord"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Update role in the database
      await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
      return res.status(200).json({ message: "User role updated" });
    } catch (error) {
      console.error("UPDATE error:", error);
      return res.status(500).json({ message: "Failed to update user role" });
    }
  }

  // =========================
  // Default: Method not allowed
  // =========================
  return res.status(405).json({ message: "Method Not Allowed" });
}
