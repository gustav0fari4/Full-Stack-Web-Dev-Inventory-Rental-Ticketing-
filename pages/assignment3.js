import Link from "next/link";

export default function Assignment3() {
  return (
    <>
      <div style={containerStyle}>
        <h1>Assignment 3</h1>
        <p>Choose an option:</p>

        {/* Navigation buttons to Register and Login */}
        <div style={buttonContainer}>
          <Link href="/assignment3/register" style={buttonStyle}>Register</Link>
          <Link href="/assignment3/login" style={buttonStyle}>Login</Link>
        </div>
      </div>
    </>
  );
}

// Container styling for centering content
const containerStyle = {
  textAlign: "center",
  marginTop: "50px",
};

// Vertical button group styling
const buttonContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  marginTop: "20px",
};

// Shared style for buttons
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "18px",
  backgroundColor: "#333",
  color: "white",
  textDecoration: "none",
  borderRadius: "5px",
  transition: "background-color 0.3s ease",
};
