import pool from "../../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  // 🔐 Parse the session cookie to get user session details
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  // 🚫 Only allow access to users with the 'admin' role
  if (!session || session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  // ✅ GET: Return all applications with tenant and property information
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(`
        SELECT 
          a.id, 
          a.status, 
          u.name AS tenant, 
          p.title AS property
        FROM applications a
        JOIN users u ON a.tenant_id = u.id
        JOIN properties p ON a.property_id = p.id
      `);

      return res.status(200).json(rows);
    } catch (err) {
      console.error("GET error:", err);
      return res.status(500).json({ message: "Failed to fetch applications" });
    }
  }

  // ✅ PUT: Update the status of an application (approve or reject)
  if (req.method === "PUT") {
    const { id, status } = req.body;

    // Validate input
    if (!id || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      await pool.query(
        "UPDATE applications SET status = ? WHERE id = ?",
        [status, id]
      );

      return res.status(200).json({ message: "Application updated" });
    } catch (err) {
      console.error("PUT error:", err);
      return res.status(500).json({ message: "Failed to update application" });
    }
  }

  // ❌ Unsupported HTTP methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
