import pool from "../../../lib/db"; // Import the MySQL connection pool

export default async function handler(req, res) {
  // Allow only GET requests to fetch public property listings
  if (req.method === "GET") {
    try {
      // Query the database for basic public property data
      const [properties] = await pool.query(
        "SELECT id, title, description, price FROM properties"
      );

      // Return the list of properties with a 200 OK response
      return res.status(200).json(properties);
    } catch (error) {
      // Log any errors and respond with a 500 Internal Server Error
      console.error("GET error:", error);
      return res.status(500).json({ message: "Failed to fetch properties" });
    }
  }

  // Respond with 405 if method is not GET
  return res.status(405).json({ message: "Method Not Allowed" });
}

