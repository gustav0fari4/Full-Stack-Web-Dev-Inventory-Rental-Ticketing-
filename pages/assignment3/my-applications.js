import { useEffect, useState } from "react";
import NavbarAssignment3 from "/components/navbar-assignment3";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  // Fetch all applications submitted by the logged-in tenant
  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/assignment3/applications");
        console.log("FETCH STATUS:", res.status);

        if (!res.ok) throw new Error("Failed to load applications");

        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchApplications();
  }, []);

  return (
    <>
      <NavbarAssignment3 />
      <div className="container" style={{ textAlign: "center" }}>
        <h1>My Applications</h1>

        {/* Display error message if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Show message if no applications exist */}
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {applications.map((app) => (
              <li
                key={app.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  maxWidth: "600px",
                  marginInline: "auto",
                }}
              >
                <h3>{app.title}</h3>
                <p><strong>Location:</strong> {app.location}</p>
                <p><strong>Status:</strong> <em>{app.status}</em></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
