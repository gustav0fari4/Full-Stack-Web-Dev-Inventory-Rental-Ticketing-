import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "inventory.json");

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const {
      eircode,
      applianceType,
      brand,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyDate,
    } = req.body;

    const errors = {};
    const eircodePattern = /^[A-Za-z0-9]{3} ?[A-Za-z0-9]{4}$/;
    const alphanumericPattern = /^[A-Za-z0-9-]+$/;

    if (!eircodePattern.test(eircode)) errors.eircode = "Invalid Eircode.";
    if (!applianceType) errors.applianceType = "Required.";
    if (!brand || brand.length > 50) errors.brand = "Max 50 characters.";
    if (!alphanumericPattern.test(modelNumber)) errors.modelNumber = "Invalid format.";
    if (!alphanumericPattern.test(serialNumber)) errors.serialNumber = "Invalid format.";

    if (!purchaseDate || !warrantyDate) {
      errors.purchaseDate = "Purchase and warranty dates required.";
    } else if (new Date(warrantyDate) < new Date(purchaseDate)) {
      errors.warrantyDate = "Warranty date must be after purchase.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const newItem = {
      id: Date.now(),
      eircode,
      applianceType,
      brand,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyDate,
    };

    const inventory = readData();
    inventory.push(newItem);
    writeData(inventory);

    return res.status(201).json({ message: "Success", appliance: newItem });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
