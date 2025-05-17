import { useState } from "react";
import NavbarAssignment2 from "/components/navbar-assignment2";

export default function DeleteAppliance() {
  const [serialNumber, setSerialNumber] = useState("");
  const [appliance, setAppliance] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setMessage("");
    setAppliance(null);
    const res = await fetch(`/api/assignment2/appliance/search?serialNumber=${serialNumber}`);
    const data = await res.json();
    if (res.ok) {
      setAppliance(data.appliance);
    } else {
      setMessage("❌ Appliance not found.");
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/assignment2/appliance/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serialNumber }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Appliance deleted.");
      setAppliance(null);
      setSerialNumber("");
    } else {
      setMessage(`❌ ${data.message || "Delete failed."}`);
    }
  };

  return (
    <div>
      <NavbarAssignment2 />
      <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
        <h2>Delete Appliance</h2>

        <input
          type="text"
          placeholder="Enter Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {message && <p>{message}</p>}

        {appliance && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Are you sure you want to delete this appliance?</h4>
            <p>
              <strong>{appliance.ApplianceType}</strong> - {appliance.Brand} <br />
              Serial: {appliance.SerialNumber} <br />
              User: {appliance.FirstName} {appliance.LastName}
            </p>
            <button onClick={handleDelete} style={{ background: "red", color: "white" }}>
              Yes, Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
