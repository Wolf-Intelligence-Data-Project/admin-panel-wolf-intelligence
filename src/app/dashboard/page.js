// /app/dashboard/page.js

"use client"; // This tells Next.js to treat this component as a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter to handle routing
import axios from 'axios';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Now this works because the component is client-side



  if (!isAuthenticated) {
    return <div>You are not authenticated. Please log in.</div>; // Show error message if not authenticated
  }

  return (
    <>
      <h1>Welcome to your Dashboard</h1>
      {/* Your dashboard content goes here */}
    </>
  );
}
