import { useEffect, useState } from "react";
import NavbarAssignment3 from "/components/navbar-assignment3";

export default function ApplyPage() {
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all available properties on mount
  useEffect(() => {
    fetch("/api/assignment3/all-properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Failed to load properties", err));
  }, []);

  // Handle application submission for a property
  const handleApply = async (propertyId) => {
    setMessage("");

    const res = await fetch("/api/assignment3/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ property_id: propertyId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ Applied to property ID ${propertyId}`);
    } else {
      setMessage(`❌ ${data.message}`);
    }

    // Auto-clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <NavbarAssignment3 />
      <div className="container" style={{ textAlign: "center" }}>
        <h1>Apply for Properties</h1>

        {/* Success or error message */}
        {message && <p className={message.startsWith("❌") ? "error" : "success"}>{message}</p>}

        {/* Fallback message when no properties found */}
        {properties.length === 0 ? (
          <p>No available properties found.</p>
        ) : (
          properties.map((prop) => (
            <div key={prop.id} className="card" style={{ marginBottom: "20px" }}>
              <h3>{prop.title}</h3>
              <p><strong>Location:</strong> {prop.location}</p>
              <p>{prop.description}</p>
              <button onClick={() => handleApply(prop.id)}>Apply</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
