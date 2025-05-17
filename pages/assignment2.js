import NavbarAssignment2 from "../components/navbar-assignment2";
import Link from "next/link";

export default function Assignment2() {
  return (
    <>
      <div style={containerStyle}>
        <h1>Assignment 2</h1>
        <p>Choose an option:</p>
        <div style={buttonContainer}>
          <Link href="/assignment2/add-appliance" style={buttonStyle}>Add Appliance</Link>
          <Link href="/assignment2/search-appliance" style={buttonStyle}>Search Appliance</Link>
          <Link href="/assignment2/update-appliance" style={buttonStyle}>Update Appliance</Link>
          <Link href="/assignment2/delete-appliance" style={buttonStyle}>Delete Appliance</Link>
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
