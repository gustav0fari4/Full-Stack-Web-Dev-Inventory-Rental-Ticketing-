import pool from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    serialNumber,
    firstName,
    lastName,
    address,
    mobile,
    email,
    eircode,
    applianceType,
    brand,
    modelNumber,
    purchaseDate,
    warrantyDate,
    costOfAppliance,
  } = req.body;

  try {
    const db = await pool.getConnection();
    try {
      const [applianceRows] = await db.query(
        `SELECT * FROM Appliance WHERE SerialNumber = ?`,
        [serialNumber]
      );

      if (applianceRows.length === 0) {
        return res.status(404).json({ message: "Appliance not found" });
      }

      const appliance = applianceRows[0];
      const userId = appliance.UserID; // cuidado: UserID com ID maiúsculo!

      // Update Appliance
      await db.query(
        `UPDATE Appliance SET 
          ApplianceType = ?, 
          Brand = ?, 
          ModelNumber = ?, 
          PurchaseDate = ?, 
          WarrantyExpirationDate = ?, 
          CostOfAppliance = ?
         WHERE SerialNumber = ?`,
        [
          applianceType,
          brand,
          modelNumber,
          purchaseDate,
          warrantyDate,
          costOfAppliance,
          serialNumber
        ]
      );

      // Update User
      await db.query(
        `UPDATE User SET 
          FirstName = ?, 
          LastName = ?, 
          Address = ?, 
          Mobile = ?, 
          Email = ?, 
          Eircode = ?
         WHERE UserID = ?`,
        [
          firstName,
          lastName,
          address,
          mobile,
          email,
          eircode,
          userId
        ]
      );

      res.status(200).json({ message: "Appliance updated successfully" });

    } finally {
      db.release();
    }
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
