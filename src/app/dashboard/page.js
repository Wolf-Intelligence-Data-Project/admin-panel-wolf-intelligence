// /app/dashboard/page.js

"use client"; // This tells Next.js to treat this component as a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter to handle routing
import axios from 'axios';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Now this works because the component is client-side

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Making request to /api/auth/status with credentials enabled...");
  
        const res = await axios.get("http://localhost:5000/api/auth/status", {
          withCredentials: true, // Ensure credentials (cookies) are sent
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          },
        });
  
        console.log("Authentication check response:", res.data);
        setIsAuthenticated(res.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
  
        // Log the response error details
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }
        
        setIsAuthenticated(false); // If there's an error, mark as unauthenticated
      }
    };
  
    checkAuth(); // Run on mount
  }, []);
  


  if (!isAuthenticated) {
    return <div>You are not authenticated. Please log in.</div>; // Show error message if not authenticated
  }

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      {/* Your dashboard content goes here */}
    </div>
  );
}
