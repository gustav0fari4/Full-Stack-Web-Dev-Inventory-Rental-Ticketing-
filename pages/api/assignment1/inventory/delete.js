import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "inventory.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;

    try {
      const data = fs.readFileSync(filePath, "utf8");
      const inventory = JSON.parse(data);

      const updatedInventory = inventory.filter(item => item.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(updatedInventory, null, 2));

      return res.status(200).json({ message: "Item deleted successfully." });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ message: "Error deleting item." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

