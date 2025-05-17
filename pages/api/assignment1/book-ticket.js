import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === "POST") {
    const { movie, showtime, phone } = req.body;

    const errors = {};

    if (!movie) errors.movie = "Movie selection is required.";
    if (!showtime) errors.showtime = "Showtime selection is required.";
    if (!phone || !/^\d{10}$/.test(phone)) {
      errors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: errors });
    }

    const newBooking = {
      id: Date.now(),
      movie,
      showtime,
      phone
    };

    const filePath = path.join(process.cwd(), 'tickets.json');

    try {
      // Read existing tickets
      const fileData = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf8')
        : '[]';

      const tickets = JSON.parse(fileData);

      // Add new booking
      tickets.push(newBooking);

      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2), 'utf8');

      return res.status(200).json({
        message: `Your booking for '${movie}' at ${showtime} has been confirmed. A confirmation text has been sent to ${phone}`
      });
    } catch (err) {
      console.error("Error saving ticket:", err);
      return res.status(500).json({ error: "Unable to save ticket booking." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

  