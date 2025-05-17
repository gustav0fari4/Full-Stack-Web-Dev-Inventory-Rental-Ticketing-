import { useState } from "react";
import { useRouter } from "next/router";
import NavbarAssignment3 from "/components/navbar-assignment3";

export default function LoginPage() {
  const router = useRouter();

  // Form state: holds email and password
  const [form, setForm] = useState({ email: "", password: "" });

  // Error message state
  const [error, setError] = useState("");

  // Handle input field changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/assignment3/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      // Redirect to dashboard if login is successful
      router.push("/assignment3/dashboard");
    } else {
      // Show error message if login fails
      setError(data.message);
    }
  };

  return (
    <>
      <NavbarAssignment3 />

      {/* Login container */}
      <div className="container" style={{ maxWidth: "400px", textAlign: "center" }}>
        <h1>Login</h1>

        {/* Display error if any */}
        {error && <p className="error">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
