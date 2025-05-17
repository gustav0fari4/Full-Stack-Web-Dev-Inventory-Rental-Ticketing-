import { useState } from "react";
import NavbarAssignment2 from "/components/navbar-assignment2";

export default function AddAppliance() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    email: "",
    eircode: "",
    applianceType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyDate: "",
    costOfAppliance: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/assignment2/appliance/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Appliance added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          address: "",
          mobile: "",
          email: "",
          eircode: "",
          applianceType: "",
          brand: "",
          modelNumber: "",
          serialNumber: "",
          purchaseDate: "",
          warrantyDate: "",
          costOfAppliance: ""
        });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <div>
      <NavbarAssignment2 />
      <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
        <h2>Add Appliance</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <h4>User Info</h4>
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="eircode" placeholder="Eircode" value={formData.eircode} onChange={handleChange} required />

          <h4>Appliance Info</h4>
          <input name="applianceType" placeholder="Type (e.g. Washer)" value={formData.applianceType} onChange={handleChange} required />
          <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
          <input name="modelNumber" placeholder="Model Number" value={formData.modelNumber} onChange={handleChange} required />
          <input name="serialNumber" placeholder="Serial Number" value={formData.serialNumber} onChange={handleChange} required />
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
          <input type="date" name="warrantyDate" value={formData.warrantyDate} onChange={handleChange} required />
          <input type="number" step="0.01" name="costOfAppliance" placeholder="Cost (€)" value={formData.costOfAppliance} onChange={handleChange} required />

          <button type="submit" style={{ marginTop: "1rem" }}>Add Appliance</button>
        </form>
      </div>
    </div>
  );
}
