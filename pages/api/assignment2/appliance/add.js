import pool from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    firstName,
    lastName,
    address,
    mobile,
    email,
    eircode,
    applianceType,
    brand,
    modelNumber,
    serialNumber,
    purchaseDate,
    warrantyDate,
    costOfAppliance
  } = req.body;

  try {
    const db = await pool.getConnection();
    try {
      // 1. Check if user exists
      const [existingUser] = await db.query("SELECT UserID FROM User WHERE Email = ?", [email]);

      let userId;

      if (existingUser.length > 0) {
        userId = existingUser[0].UserID;
      } else {
        // 2. Insert user if not found
        const [userResult] = await db.query(
          `INSERT INTO User (FirstName, LastName, Address, Mobile, Email, Eircode)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [firstName, lastName, address, mobile, email, eircode]
        );
        userId = userResult.insertId;
      }

      // 3. Check if appliance with the same serial number exists
      const [existingAppliance] = await db.query(
        "SELECT * FROM Appliance WHERE SerialNumber = ?",
        [serialNumber]
      );

      if (existingAppliance.length > 0) {
        return res.status(400).json({ message: "Appliance already exists" });
      }

      // 4. Insert appliance
      await db.query(
        `INSERT INTO Appliance
         (ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpirationDate, CostOfAppliance, UserID)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          applianceType,
          brand,
          modelNumber,
          serialNumber,
          purchaseDate,
          warrantyDate,
          costOfAppliance,
          userId
        ]
      );

      return res.status(201).json({ message: "Appliance added successfully" });

    } finally {
      db.release();
    }

  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
