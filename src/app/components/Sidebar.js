"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../../../styles/components/_sidebar.scss";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.delete("/api/auth/logout", {
        withCredentials: true, // Ensure cookies are sent
      });

      if (res.status === 200) {
        router.push("/login"); // Redirect to login page after logout
      } else {
        alert(res.data?.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred during logout.");
    }
  };

  return (
    <div className="sidebar">
      <p>Wolf Intelligence</p>
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
      </ul>
      <button className="button-negative" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}
