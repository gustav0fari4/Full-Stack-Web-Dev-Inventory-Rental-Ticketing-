export default function handler(req, res) {
  // ✅ Handle only POST requests
  if (req.method === "POST") {
    // 🍪 Clear the session cookie by setting it with an expired max age
    res.setHeader("Set-Cookie", "session=; Max-Age=0; Path=/");

    // 🔁 Return a success response
    return res.status(200).json({ message: "Logged out" });
  }

  // ❌ Reject all other HTTP methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
