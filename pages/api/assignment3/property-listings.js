import pool from "../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  // ✅ Only allow GET requests for this endpoint
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 🍪 Parse cookies to extract the session information
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    // 🔐 Check if session exists and is either a tenant or admin
    if (!session || (session.role !== "tenant" && session.role !== "admin")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 📦 Fetch all property listings from the database
    const [rows] = await pool.query("SELECT * FROM properties");

    // ✅ Send the list of properties back to the client
    res.status(200).json(rows);
  } catch (error) {
    // ❌ Log error and send server error message
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
}

