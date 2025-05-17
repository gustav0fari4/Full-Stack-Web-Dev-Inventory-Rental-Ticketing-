import { useEffect, useState } from "react";
import NavbarAssignment3 from "/components/navbar-assignment3";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  // Fetch all tenant applications for admin to manage
  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/assignment3/admin/applications");
      const data = await res.json();
      if (res.ok) setApplications(data);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update application status to either 'approved' or 'rejected'
  const updateStatus = async (id, status) => {
    const res = await fetch("/api/assignment3/admin/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) fetchApplications();
  };

  // Initial load of applications
  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <NavbarAssignment3 />
      <div className="container" style={{ textAlign: "center" }}>
        <h1>Manage Applications</h1>

        {/* Show error if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* If no applications found */}
        {applications.length === 0 ? (
          <p>No applications to review.</p>
        ) : (
          <table style={{ margin: "auto", borderCollapse: "collapse", width: "100%", maxWidth: "900px" }}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Tenant</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.title}</td>
                  <td>
                    {app.tenant_name} ({app.tenant_email})
                  </td>
                  <td>{app.status}</td>
                  <td>
                    {app.status === "pending" ? (
                      <>
                        <button onClick={() => updateStatus(app.id, "approved")}>Approve</button>{" "}
                        <button onClick={() => updateStatus(app.id, "rejected")}>Reject</button>
                      </>
                    ) : (
                      <em>{app.status}</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

