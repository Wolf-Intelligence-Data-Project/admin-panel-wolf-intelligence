"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../context/authContext"; // ✅ Use AuthContext here

export default function Sidebar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // ✅ Access auth state
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.delete("/api/auth/logout", {
        withCredentials: true, 
      });

      if (res.status === 200) {
        setIsAuthenticated(false); // ✅ Update auth state
        router.push("/"); // ✅ Redirect to login page
      } else {
        alert(res.data?.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred during logout.");
    }
  };

  if (!isAuthenticated) return null; // ✅ Hide Sidebar if not logged in


  return (
    <div className="sidebar">
      <h3>Wolf Intelligence</h3>
      <ul>
        <li>
          <Link href="/dashboard/moderators">Moderators Manager</Link>
        </li>
        <li>
          <Link href="/dashboard/users">Users Manager</Link>
        </li>
        <li>
          <Link href="/dashboard/orders">Orders Manager</Link>
        </li>
        <li>
          <Link href="/dashboard/products">Products Manager</Link>
        </li>
        <li onClick={handleLogout}>
        Sign Out
      </li>
      </ul>
    
    </div>
  );
}
