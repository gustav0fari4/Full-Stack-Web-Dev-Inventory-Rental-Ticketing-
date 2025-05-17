import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarAssignment3 from "/components/navbar-assignment3";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Fetch properties when page loads
  useEffect(() => {
    fetchProperties();
  }, []);

  // GET request to load current user's properties
  const fetchProperties = async () => {
    const res = await fetch("/api/assignment3/properties");
    if (res.ok) {
      const data = await res.json();
      setProperties(data);
    } else if (res.status === 403) {
      router.push("/assignment3/login");
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form for either add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = editingId
      ? `/api/assignment3/properties/${editingId}` 
      : "/api/assignment3/properties";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(editingId ? "✅ Property updated!" : "✅ Property added!");
      fetchProperties();
      setForm({ title: "", description: "", location: "", address: "", price: "" });
      setEditingId(null);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const data = await res.json();
      setError(data.message || "Operation failed");
    }
  };

  // Load property details into form for editing
  const handleEdit = (property) => {
    setForm(property);
    setEditingId(property.id);
  };

  // DELETE request to remove property
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    const res = await fetch(`/api/assignment3/properties/${id}`, {
      method: "DELETE",
    });

    if (res.ok) fetchProperties();
  };

  return (
    <div className="container" style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <NavbarAssignment3 />
      <h1>Manage My Properties</h1>

      {/* Success or error feedback */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Form for adding/editing property */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update Property" : "Add Property"}
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>My Listings</h2>

      {/* Display message if no properties */}
      {properties.length === 0 && <p>No properties listed yet.</p>}

      {/* Property listing cards */}
      {properties.map((prop) => (
        <div
          key={prop.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            backgroundColor: "#fff",
          }}
        >
          <h3>{prop.title}</h3>
          <p><strong>Location:</strong> {prop.location}</p>
          <p>{prop.description}</p>
          <p><strong>Price:</strong> €{prop.price}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => handleEdit(prop)}>Edit</button>
            <button onClick={() => handleDelete(prop.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

