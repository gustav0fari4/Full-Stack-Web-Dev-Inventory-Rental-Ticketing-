import pool from "../../../lib/db";         // Import MySQL database connection pool
import bcrypt from "bcrypt";                // Import bcrypt for password hashing

export default async function handler(req, res) {
  // Allow only POST requests for registration
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract data from request body
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if a user with the given email already exists
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the users table
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    // Respond with success message
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    // Log and return server error message
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
}

