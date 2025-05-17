import { parse } from "cookie"; // Utility to parse cookies from the request header

export default function handler(req, res) {
  // Parse the session cookie from the request headers
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session;

  // If there is no session cookie, return an unauthorized response
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Parse the session JSON string to get the user data
    const user = JSON.parse(session); // Expected format: { id, role }

    // Respond with the user's role
    res.status(200).json({ role: user.role });
  } catch (error) {
    // If parsing the session fails, respond with a bad request error
    res.status(400).json({ message: "Invalid session format" });
  }
}

