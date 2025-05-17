import pool from "../../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  if (!session || session.role !== "landlord") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const landlordId = session.id;

  if (req.method === "GET") {
    try {
      const [properties] = await pool.query(
        "SELECT * FROM properties WHERE owner_id = ?",
        [landlordId]
      );
      return res.status(200).json(properties);
    } catch (error) {
      console.error("GET error:", error);
      return res.status(500).json({ message: "Failed to fetch properties" });
    }
  }

  if (req.method === "POST") {
    const { title, description, location, address, price } = req.body;
    if (!title || !description || !location || !address || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    try {
      await pool.query(
        "INSERT INTO properties (title, description, location, address, price, owner_id) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, location, address, price, landlordId]
      );
      return res.status(200).json({ message: "Property added" });
    } catch (error) {
      console.error("POST error:", error);
      return res.status(500).json({ message: "Failed to add property" });
    }
  }

  // Fallback for other methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
