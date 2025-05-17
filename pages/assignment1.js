import NavbarAssignment1 from"/components/navbar-assignment1";
import Link from "next/link";

export default function Assignment1() {
  return (
    <>
      <div style={containerStyle}>
        <h1>Assignment 1</h1>
        <p>Choose an option:</p>
        <div style={buttonContainer}>
          <Link href="/assignment1/cinema-tickets" style={buttonStyle}>Cinema Tickets</Link>
          <Link href="/assignment1/inventory" style={buttonStyle}>Inventory Part B</Link>
          <Link href="/assignment1/inventory-enhanced" style={buttonStyle}>Inventory Part C</Link>
          <Link href="/assignment1/inventory-list" style={buttonStyle}>Inventory List</Link>
        </div>
      </div>
    </>
  );
}

const containerStyle = {
  textAlign: "center",
  marginTop: "50px",
};

const buttonContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  marginTop: "20px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "18px",
  backgroundColor: "#333",
  color: "white",
  textDecoration: "none",
  borderRadius: "5px",
  transition: "background-color 0.3s ease",
};

