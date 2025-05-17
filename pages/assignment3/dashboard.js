import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch session details on component mount
    async function fetchSession() {
      try {
        const res = await fetch("/api/assignment3/session", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();

        // Redirect the user based on their role
        if (data.role === "tenant") {
          router.push("/assignment3/property-listings");
        } else if (data.role === "admin") {
          router.push("/assignment3/admin-panel");
        } else if (data.role === "landlord") {
          router.push("/assignment3/my-properties");
        } else {
          throw new Error("Unknown role");
        }
      } catch (err) {
        // If session is invalid or missing, redirect to login
        router.push("/assignment3/login");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [router]);

  // Show loading message while session is being verified
  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return null; // User is redirected, so nothing to render
}


