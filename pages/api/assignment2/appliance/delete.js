import pool from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { serialNumber } = req.body;

  try {
    const db = await pool.getConnection();
    try {
      // Check if it exists
      const [result] = await db.query(
        `SELECT * FROM Appliance WHERE SerialNumber = ?`,
        [serialNumber]
      );

      if (result.length === 0) {
        return res.status(404).json({ message: "Appliance not found" });
      }

      // Delete it
      await db.query(`DELETE FROM Appliance WHERE SerialNumber = ?`, [serialNumber]);

      return res.status(200).json({ message: "Appliance deleted successfully" });
    } finally {
      db.release();
    }
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
