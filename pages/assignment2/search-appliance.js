import { useState } from "react";
import NavbarAssignment2 from "/components/navbar-assignment2";

export default function SearchAppliance() {
  const [serialNumber, setSerialNumber] = useState("");
  const [appliance, setAppliance] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setAppliance(null);
    setMessage("");

    if (!serialNumber) {
      setMessage("Please enter a serial number.");
      return;
    }

    try {
      const res = await fetch(`/api/assignment2/appliance/search?serialNumber=${serialNumber}`);
      const data = await res.json();

      if (res.ok) {
        setAppliance(data.appliance);
      } else {
        setMessage(data.message || "Appliance not found.");
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <NavbarAssignment2 />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Search Appliance by Serial Number</h2>

        <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter serial number"
            style={{
              padding: "10px",
              width: "100%",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Search
          </button>
        </form>

        {message && <p style={{ color: "red" }}>{message}</p>}

        {appliance && (
          <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
            <h3>Appliance Info</h3>
            <p><strong>Type:</strong> {appliance.ApplianceType}</p>
            <p><strong>Brand:</strong> {appliance.Brand}</p>
            <p><strong>Model:</strong> {appliance.ModelNumber}</p>
            <p><strong>Serial:</strong> {appliance.SerialNumber}</p>
            <p><strong>Purchase Date:</strong> {appliance.PurchaseDate?.slice(0, 10)}</p>
            <p><strong>Warranty:</strong> {appliance.WarrantyExpirationDate?.slice(0, 10)}</p>
            <p><strong>Cost:</strong> €{appliance.CostOfAppliance}</p>

            <h4>Registered By</h4>
            <p>{appliance.FirstName} {appliance.LastName}</p>
            <p>{appliance.Email}</p>
            <p>Eircode: {appliance.Eircode}</p>
          </div>
        )}
      </div>
    </div>
  );
}
