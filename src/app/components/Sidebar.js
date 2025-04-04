"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../context/authContext"; 
import { useRouter } from "next/navigation"; 
import { FaTachometerAlt, FaUsers, FaUserShield, FaBox, FaDatabase, FaCogs, FaSignOutAlt } from "react-icons/fa"; // Import icons

export default function Sidebar() {
  const { isAuthenticated, userRole, setIsAuthenticated } = useAuth(); 
  const pathname = usePathname(); 
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await axios.delete("../api/auth/logout", { withCredentials: true });
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="fixed-menu">
        <h3><Link href='/dashboard'>Wolf Intelligence</Link></h3>
        <ul>
          <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
              <FaTachometerAlt /><strong>Översikt</strong>
          </Link>

          {/* Only show if user is admin */}
          {userRole === "Admin" && (
            <Link href="/moderators" className={pathname === "/moderators" ? "active" : ""}>
                <FaUserShield /><strong>Moderatorhantering</strong>
            </Link>
          )}

          <Link href="/users" className={pathname === "/users" ? "active" : ""}>
              <FaUsers /> <strong>Användarhantering</strong>
          </Link>

          <Link href="/orders"className={pathname === "/orders" ? "active" : ""}>
            <FaBox /> <strong>Orderhantering</strong>
          </Link>

          <Link href="/data" className={pathname === "/data" ? "active" : ""}>
            <FaDatabase /> <strong>Datahantering</strong>
          </Link>
        </ul>
        <footer>
          <Link href="/settings" className={pathname === "/settings" ? "active" : ""}>

            <FaCogs /> <strong>Inställningar</strong>

          </Link>
          <a onClick={handleLogout}>
          <FaSignOutAlt /> Logga ut
          </a>
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} <b>Wolf Intelligence AB</b>.</p>
            <p>All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
