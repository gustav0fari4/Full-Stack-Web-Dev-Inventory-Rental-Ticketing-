import { useState } from "react";
import { useRouter } from "next/router";
import NavbarAssignment3 from "/components/navbar-assignment3";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant", // Default role
  });
  const [error, setError] = useState("");

  // Update form state on input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/assignment3/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/assignment3/login"); // Redirect to login on success
    } else {
      setError(data.message);
    }
  };

  return (
    <>
      <NavbarAssignment3 />
      <div
        className="container"
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          textAlign: "center",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1>Register</h1>

        {/* Show error message */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Registration form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ cursor: "pointer" }}
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}


