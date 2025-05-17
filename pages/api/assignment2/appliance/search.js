import pool from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { serialNumber } = req.query;

  try {
    const db = await pool.getConnection();
    try {
      const [rows] = await db.query(
        `SELECT 
           a.ApplianceType, a.Brand, a.ModelNumber, a.SerialNumber, 
           a.PurchaseDate, a.WarrantyExpirationDate, a.CostOfAppliance,
           u.FirstName, u.LastName, u.Address, u.Mobile, u.Email, u.Eircode
         FROM Appliance a
         JOIN User u ON a.UserID = u.UserID
         WHERE a.SerialNumber = ?`,
        [serialNumber]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Appliance not found" });
      }

      const appliance = rows[0];

      // Send mapped keys for frontend form
      return res.status(200).json({
        appliance: {  
          ApplianceType: appliance.ApplianceType,
          Brand: appliance.Brand,
          ModelNumber: appliance.ModelNumber,
          SerialNumber: appliance.SerialNumber,
          PurchaseDate: appliance.PurchaseDate,
          WarrantyExpirationDate: appliance.WarrantyExpirationDate,
          CostOfAppliance: appliance.CostOfAppliance,
          FirstName: appliance.FirstName,
          LastName: appliance.LastName,
          Address: appliance.Address,
          Mobile: appliance.Mobile,
          Email: appliance.Email,
          Eircode: appliance.Eircode
        }
      });

    } finally {
      db.release();
    }

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
