import Link from "next/link";

export default function NavbarAssignment1() {
  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li><Link href="/" style={linkStyle}>Home</Link></li>
        <li><Link href="/assignment1/cinema-tickets" style={linkStyle}>Cinema Tickets</Link></li>
        <li><Link href="/assignment1/inventory" style={linkStyle}>Inventory Part B</Link></li>
        <li><Link href="/assignment1/inventory-enhanced" style={linkStyle}>Inventory Part C</Link></li>
        <li><Link href="/assignment1/inventory-list" style={linkStyle}>Inventory List</Link></li>
      </ul>
    </nav>
  );
}

const navStyle = {
  backgroundColor: "#333",
  padding: "15px 30px",
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const ulStyle = {
  listStyle: "none",
  display: "flex",
  justifyContent: "center",
  gap: "30px",
  padding: 0,
  margin: 0,
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  padding: "10px 20px",
  borderRadius: "5px",
  transition: "all 0.3s ease-in-out",
  display: "inline-block",
};
