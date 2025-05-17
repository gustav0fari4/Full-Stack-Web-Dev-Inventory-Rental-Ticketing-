import pool from "../../../lib/db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export default async function handler(req, res) {
  // ❌ Reject any method that is not POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    // 🔍 Look for a user with the provided email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    // ❌ If user not found, return error
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 Compare submitted password with the hashed one in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Create session payload with user id and role
    const sessionData = JSON.stringify({ id: user.id, role: user.role });

    // 🍪 Serialize and set session cookie
    const cookie = serialize("session", sessionData, {
      path: "/",
      httpOnly: true,             // Not accessible from JavaScript
      sameSite: "lax",            // CSRF protection
      secure: process.env.NODE_ENV === "production", // Only HTTPS in production
      maxAge: 60 * 60 * 24        // Cookie expires in 1 day
    });

    // 🔁 Send cookie and success message
    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    // ⚠️ Handle unexpected server/database errors
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

