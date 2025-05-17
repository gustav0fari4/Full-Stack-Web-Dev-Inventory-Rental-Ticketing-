import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "inventory.json");

// Read inventory data from file
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return [];
  }
};

// Write data to file
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  if (req.method === "GET") {
    // Return existing inventory data
    return res.status(200).json(readData());
  }

  if (req.method === "POST") {
    const { eircode, applianceType, brand, modelNumber, serialNumber, purchaseDate, warrantyDate } = req.body;
    const errors = {};

    // Validate Eircode format
    const eircodePattern = /^[A-Za-z0-9]{3} ?[A-Za-z0-9]{4}$/;
    if (!eircodePattern.test(eircode)) errors.eircode = "Invalid Eircode format.";

    // Required fields validation
    if (!applianceType) errors.applianceType = "Appliance type is required.";
    if (!brand || brand.length > 50) errors.brand = "Brand name must be between 1-50 characters.";

    const alphanumericPattern = /^[A-Za-z0-9-]+$/;
    if (!alphanumericPattern.test(modelNumber)) errors.modelNumber = "Invalid model number format.";
    if (!alphanumericPattern.test(serialNumber)) errors.serialNumber = "Invalid serial number format.";

    // Date validation
    if (!purchaseDate || !warrantyDate) {
      errors.dates = "Both purchase and warranty dates are required.";
    } else if (new Date(warrantyDate) < new Date(purchaseDate)) {
      errors.warrantyDate = "Warranty expiration cannot be before the purchase date.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors, formData: req.body });
    }

    // Save valid data
    const inventory = readData();
    const newAppliance = { id: Date.now(), eircode, applianceType, brand, modelNumber, serialNumber, purchaseDate, warrantyDate };
    inventory.push(newAppliance);
    writeData(inventory);

    return res.status(201).json({ message: "Appliance registered successfully!", appliance: newAppliance });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

