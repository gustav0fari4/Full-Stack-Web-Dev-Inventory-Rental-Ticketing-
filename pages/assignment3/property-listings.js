import { useEffect, useState } from "react";
import NavbarAssignment3 from "/components/navbar-assignment3";
import Link from "next/link";

export default function PropertyListingsPage() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  // Function to apply to a property
  const handleApply = async (propertyId) => {
    try {
      const res = await fetch("/api/assignment3/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_id: propertyId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      alert("✅ Application submitted!");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  // Fetch all public properties
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/assignment3/public-properties");
        if (!res.ok) throw new Error("Failed to load properties");
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProperties();
  }, []);

  return (
    <>
      <NavbarAssignment3 />
      <div className="container" style={{ padding: "30px", textAlign: "center" }}>
        <h1>Available Properties</h1>

        {/* Button to go to tenant's applications */}
        <Link href="/assignment3/my-applications">
          <button style={{ marginBottom: "20px" }}>My Applications</button>
        </Link>

        {/* Error message if fetch fails */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Property cards */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {properties.map((property) => (
            <li
              key={property.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <strong>{property.title}</strong><br />
              {property.description}<br />
              <em>Price: €{property.price}</em><br />
              <button onClick={() => handleApply(property.id)} style={{ marginTop: "10px" }}>
                Apply
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

