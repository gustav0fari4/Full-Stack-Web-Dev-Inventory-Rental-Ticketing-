import pool from "../../../../lib/db";         // Database connection pool
import { parse } from "cookie";               // To parse cookies from the request header

export default async function handler(req, res) {
  // Parse the session cookie
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  // Authorization check: only allow admin users
  if (!session || session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" }); // User is not authorized
  }

  // =========================
  // GET: Return all applications
  // =========================
  if (req.method === "GET") {
    try {
      const [apps] = await pool.query(`
        SELECT 
          a.id, 
          a.status, 
          p.title, 
          u.name AS tenant_name, 
          u.email AS tenant_email
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        JOIN users u ON a.tenant_id = u.id
      `);

      // Send applications list back to client
      return res.status(200).json(apps);
    } catch (error) {
      // Handle database errors
      return res.status(500).json({ message: "Failed to load applications" });
    }
  }

  // =========================
  // PUT: Update application status (approve or reject)
  // =========================
  if (req.method === "PUT") {
    const { id, status } = req.body;

    // Validate input
    if (!id || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    try {
      // Update status in the database
      await pool.query(
        "UPDATE applications SET status = ? WHERE id = ?", 
        [status, id]
      );
      return res.status(200).json({ message: "Status updated" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update status" });
    }
  }

  // If the method is neither GET nor PUT
  return res.status(405).json({ message: "Method Not Allowed" });
}
