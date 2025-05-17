export default function handler(req, res) {
    if (req.method === 'POST') {
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
  
      // Simple backend validations
      if (!eircode || !/^[A-Za-z0-9]{3} ?[A-Za-z0-9]{4}$/.test(eircode)) {
        errors.eircode = 'Invalid Eircode format.';
      }
      if (!applianceType) {
        errors.applianceType = 'Please select an appliance type.';
      }
      if (!brand || brand.length > 50) {
        errors.brand = 'Brand is required and should be less than 50 characters.';
      }
      if (!modelNumber || !/^[A-Za-z0-9\-]+$/.test(modelNumber)) {
        errors.modelNumber = 'Model number must contain only letters, numbers, and dashes.';
      }
      if (!serialNumber || !/^[A-Za-z0-9\-]+$/.test(serialNumber)) {
        errors.serialNumber = 'Serial number must contain only letters, numbers, and dashes.';
      }
      if (!purchaseDate) {
        errors.purchaseDate = 'Purchase date is required.';
      }
      if (!warrantyDate) {
        errors.warrantyDate = 'Warranty expiration date is required.';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
  
      // Simulated DB save (in a real app, you'd insert into a DB)
      return res.status(200).json({ message: "Appliance registered successfully!" });
    } else {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  