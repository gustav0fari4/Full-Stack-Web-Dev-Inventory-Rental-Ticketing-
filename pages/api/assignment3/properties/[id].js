import pool from "../../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  // 🔍 Extract property ID from the URL query
  const { id } = req.query;

  // 🍪 Parse cookies and retrieve session
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  // 🔐 Ensure the user is logged in and is a landlord
  if (!session || session.role !== "landlord") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const landlordId = session.id;

  // ✅ PUT: Update an existing property
  if (req.method === "PUT") {
    const { title, description, location, price } = req.body;

    try {
      await pool.query(
        "UPDATE properties SET title = ?, description = ?, location = ?, price = ? WHERE id = ? AND owner_id = ?",
        [title, description, location, price, id, landlordId]
      );
      return res.status(200).json({ message: "Property updated" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update property" });
    }
  }

  // 🗑️ DELETE: Remove a property owned by the landlord
  else if (req.method === "DELETE") {
    try {
      console.log("Deleting property ID:", id, "by owner:", landlordId); // Debugging log

      const [result] = await pool.query(
        "DELETE FROM properties WHERE id = ? AND owner_id = ?",
        [id, landlordId]
      );

      // If no property was deleted, it either doesn't exist or isn't owned by this landlord
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Property not found or not owned by you" });
      }

      return res.status(200).json({ message: "Property deleted" });
    } catch (error) {
      console.error("DELETE ERROR:", error); // Server-side log for debugging
      return res.status(500).json({ message: "Failed to delete property" });
    }
  }

  // ❌ Reject unsupported HTTP methods
  else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
