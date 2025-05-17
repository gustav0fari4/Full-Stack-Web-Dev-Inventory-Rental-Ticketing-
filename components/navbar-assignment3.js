import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function NavbarAssignment3() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks if the user is logged in
  const router = useRouter();
  let timer; // Holds reference to the inactivity timer

  // Logs the user out and redirects to login page
  const logout = async () => {
    await fetch("/api/assignment3/logout");
    setIsLoggedIn(false);
    router.push("/assignment3/login");
  };

  // Resets the inactivity timer on user interaction
  const resetTimer = () => {
    clearTimeout(timer); // Clear any existing timer
    timer = setTimeout(logout, 30000); // Set timer to auto-logout after 30 seconds of inactivity
  };

  // Run once when the component mounts
  useEffect(() => {
    // Check if a session exists on mount
    async function checkSession() {
      try {
        const res = await fetch("/api/assignment3/session", {
          method: "GET",
          credentials: "include", // Ensures session cookie is sent
        });
        if (res.ok) setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    }

    checkSession();

    // If logged in, set up event listeners for activity
    if (isLoggedIn) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("scroll", resetTimer);
      resetTimer(); // Initialize the inactivity timer
    }

    // Cleanup listeners and timers on unmount or logout
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [isLoggedIn]); // Dependency ensures this logic reruns when login state changes

  // JSX for the navbar UI
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        {/* Always show home link */}
        <li><Link href="/" className="navbar-link">Home</Link></li>

        {/* Show login/register when not logged in */}
        {!isLoggedIn && (
          <>
            <li><Link href="/assignment3/register" className="navbar-link">Register</Link></li>
            <li><Link href="/assignment3/login" className="navbar-link">Login</Link></li>
          </>
        )}

        {/* Show logout when user is logged in */}
        {isLoggedIn && (
          <li><Link href="/assignment3/logout" className="navbar-link">Logout</Link></li>
        )}
      </ul>
    </nav>
  );
}

