import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Automatically log out the user on page load
    async function logoutUser() {
      try {
        await fetch("/api/assignment3/logout", { method: "POST" });
        router.push("/assignment3/login"); // Redirect to login after logout
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }

    logoutUser();
  }, [router]);

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Logging out...</p>
    </div>
  );
}
