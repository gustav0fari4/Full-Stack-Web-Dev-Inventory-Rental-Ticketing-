import { useState } from "react";
import NavbarAssignment2 from "/components/navbar-assignment2";

export default function UpdateAppliance() {
  const [serialNumber, setSerialNumber] = useState("");
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSearch = async () => {
    setMessage("");
    setShowForm(false);

    try {
      const response = await fetch(`/api/assignment2/appliance/search?serialNumber=${serialNumber}`);
      const data = await response.json();

      if (response.ok) {
        setForm({ ...data.appliance }); // Pre-fill form
        setShowForm(true);
      } else {
        setMessage("❌ Appliance not found");
      }
    } catch (err) {
      setMessage("❌ Search failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      serialNumber,
      firstName: form.FirstName,
      lastName: form.LastName,
      address: form.Address,
      mobile: form.Mobile,
      email: form.Email,
      eircode: form.Eircode,
      applianceType: form.ApplianceType,
      brand: form.Brand,
      modelNumber: form.ModelNumber,
      purchaseDate: form.PurchaseDate?.substring(0, 10), 
      warrantyDate: form.WarrantyExpirationDate?.substring(0, 10),
      costOfAppliance: form.CostOfAppliance,
    };

    try {
      const response = await fetch("/api/assignment2/appliance/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Appliance has been updated!");
      } else {
        setMessage(`❌ ${data.message || "Update failed"}`);
      }
    } catch (err) {
      setMessage("❌ Update failed");
    }
  };

  return (
    <div>
      <NavbarAssignment2 />
      <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
        <h2>Update Appliance</h2>

        <input
          type="text"
          placeholder="Enter Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {message && <p>{message}</p>}

        {showForm && (
          <form onSubmit={handleUpdate} style={{ marginTop: "2rem" }}>
            <h4>User Info</h4>
            <input name="FirstName" placeholder="First Name" value={form.FirstName || ""} onChange={handleChange} required />
            <input name="LastName" placeholder="Last Name" value={form.LastName || ""} onChange={handleChange} required />
            <input name="Address" placeholder="Address" value={form.Address || ""} onChange={handleChange} required />
            <input name="Mobile" placeholder="Mobile" value={form.Mobile || ""} onChange={handleChange} required />
            <input name="Email" placeholder="Email" value={form.Email || ""} onChange={handleChange} required />
            <input name="Eircode" placeholder="Eircode" value={form.Eircode || ""} onChange={handleChange} required />

            <h4>Appliance Info</h4>
            <input name="ApplianceType" placeholder="Appliance Type" value={form.ApplianceType || ""} onChange={handleChange} required />
            <input name="Brand" placeholder="Brand" value={form.Brand || ""} onChange={handleChange} required />
            <input name="ModelNumber" placeholder="Model Number" value={form.ModelNumber || ""} onChange={handleChange} required />
            <input type="date" name="PurchaseDate" value={form.PurchaseDate?.substring(0, 10) || ""} onChange={handleChange} required />
            <input type="date" name="WarrantyExpirationDate" value={form.WarrantyExpirationDate?.substring(0, 10) || ""} onChange={handleChange} required />
            <input name="CostOfAppliance" placeholder="Cost Of Appliance" value={form.CostOfAppliance || ""} onChange={handleChange} required />

            <button type="submit" style={{ marginTop: "1rem" }}>Update</button>
          </form>
        )}
      </div>
    </div>
  );
}
