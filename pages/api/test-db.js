import pool from "../../lib/db";

export default async function handler(req, res) {
  try {
    const db = await pool.getConnection();
    try {
      const [rows] = await db.query("SELECT 1 + 1 AS result");
      res.status(200).json({ success: true, result: rows[0].result });
    } finally {
      db.release(); // Return connection to pool
    }
  } catch (err) {
    console.error("DB Test Error:", err);
    res.status(500).json({ success: false, error: "DB connection failed" });
  }
}

