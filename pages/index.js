
import styles from "/styles/Home.module.css"; 
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Gustavo Faria - 3122562
      </h1>
      <h2 style={{ fontSize: "28px", marginBottom: "30px" }}>
        Side Web Development
      </h2>
      <p style={{ fontSize: "18px", marginBottom: "40px" }}>
        Select an Assignment:
      </p>

      <div style={{ display: "flex", gap: "30px" }}>
        <Link href="/assignment1" legacyBehavior>
          <a
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: "15px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "18px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
          >
            Assignment 1
          </a>
        </Link>

        <Link href="/assignment2" legacyBehavior>
          <a
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: "15px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "18px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
          >
            Assignment 2
          </a>
        </Link>

        <Link href="/assignment3" legacyBehavior>
          <a
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: "15px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "18px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
          >
            Assignment 3
          </a>
        </Link>
      </div>
    </div>
  );
}
