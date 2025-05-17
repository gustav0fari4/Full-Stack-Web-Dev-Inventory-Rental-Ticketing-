import pool from "../../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  // Parse cookies to extract session data
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  // Only tenants are authorized to access this endpoint
  if (!session || session.role !== "tenant") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Extract tenant ID from the session
  const tenantId = session.id;

  // ✅ POST: Submit an application to a property
  if (req.method === "POST") {
    const { property_id } = req.body;

    // Validate request body
    if (!property_id) {
      return res.status(400).json({ message: "Missing property ID" });
    }

    try {
      // Insert application into the database
      await pool.query(
        "INSERT INTO applications (property_id, tenant_id) VALUES (?, ?)",
        [property_id, tenantId]
      );
      return res.status(201).json({ message: "Application submitted" });
    } catch (error) {
      console.error("POST /applications error:", error);
      return res.status(500).json({ message: "Failed to apply" });
    }
  }

  // ✅ GET: Fetch all applications submitted by this tenant
  if (req.method === "GET") {
    try {
      // Query joined data from applications and properties
      const [applications] = await pool.query(
        `SELECT a.*, p.title, p.location
         FROM applications a
         JOIN properties p ON a.property_id = p.id
         WHERE a.tenant_id = ?`,
        [tenantId]
      );
      return res.status(200).json(applications);
    } catch (error) {
      console.error("GET /applications error:", error);
      return res.status(500).json({ message: "Failed to fetch applications" });
    }
  }

  // ❌ Handle unsupported HTTP methods
  return res.status(405).json({ message: "Method Not Allowed" });
}

