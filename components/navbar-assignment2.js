import Link from "next/link";

export default function NavbarAssignment2() {
  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li><Link href="/" style={linkStyle}>Home</Link></li>
        <li><Link href="/assignment2/add-appliance" style={linkStyle}>Add Appliance</Link></li>
        <li><Link href="/assignment2/search-appliance" style={linkStyle}>Search Appliance</Link></li>
        <li><Link href="/assignment2/update-appliance" style={linkStyle}>Update Appliance</Link></li>
        <li><Link href="/assignment2/delete-appliance" style={linkStyle}>Delete Appliance</Link></li>
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
