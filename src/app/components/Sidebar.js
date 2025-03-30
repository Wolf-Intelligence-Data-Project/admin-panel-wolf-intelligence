"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Get the current path
import axios from "axios";
import { useAuth } from "../../context/authContext"; 

export default function Sidebar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); 
  const pathname = usePathname(); // ✅ Get the current URL path

  const handleLogout = async () => {
    try {
      const res = await axios.delete("/api/auth/logout", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsAuthenticated(false);
        router.push("/");
      } else {
        alert(res.data?.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred during logout.");
    }
  };

  if (!isAuthenticated) return null; 

  return (
    <div className="sidebar">
     <h3><Link href='/dashboard'>Wolf Intelligence</Link></h3>
      <ul>
      <Link href="/dashboard">
  <span className={pathname === "/dashboard" ? "active" : ""}>Översikt</span>
</Link>
<Link href="/moderators">
  <span className={pathname === "/moderators" ? "active" : ""}>Moderatorhantering</span>
</Link>
<Link href="/users">
  <span className={pathname === "/users" ? "active" : ""}>Användarhantering</span>
</Link>
<Link href="/orders">
  <span className={pathname === "/orders" ? "active" : ""}>Orderhantering</span>
</Link>
<Link href="/data">
  <span className={pathname === "/data" ? "active" : ""}>Datahantering</span>
</Link>
      </ul>
      <footer>
        <a onClick={handleLogout}>Logga ut</a>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} <b>Wolf Intelligence AB</b>.</p>
          <p>All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}