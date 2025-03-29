"use client";  // Marking this file as a client-side component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, AuthProvider } from "../context/authContext";
import LoadingSpinner from "./components/LoadingSpinner";
import Sidebar from "./components/Sidebar";
import "../../styles/global.scss";
import { staticMetadata, generateDynamicMetadata } from './metadata'; // Import metadata

export default function RootLayout({ children, params }) {
  const [metadata, setMetadata] = useState(staticMetadata);  // Default to static metadata

  // Fetch dynamic metadata if necessary
  useEffect(() => {
    const fetchDynamicMetadata = async () => {
      const dynamicMetadata = await generateDynamicMetadata(params);  // Use params to generate dynamic metadata
      setMetadata(dynamicMetadata);  // Set dynamic metadata
    };

    // Call the function to set dynamic metadata
    fetchDynamicMetadata();
  }, [params]);  // Rerun the effect if params change

  return (
    <AuthProvider>
      <AuthWrapper metadata={metadata}>{children}</AuthWrapper>
    </AuthProvider>
  );
}

function AuthWrapper({ children, metadata }) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Use effect to check auth status when the page is loaded
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/status", { withCredentials: true });
        setIsAuthenticated(res.data.isAuthenticated); // Update the state
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated === null) {
      checkAuth(); // Call this function only once on initial load
    }
  }, [isAuthenticated, setIsAuthenticated]);

  useEffect(() => {
    if (isAuthenticated === true) {
      router.push("/dashboard"); // Redirect user to dashboard if authenticated
    }
  }, [isAuthenticated, router]);

  return (
    <html lang="en">
      <head>
      <title>{metadata.title}</title> {/* Use dynamic or static title */}
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <div className="wrapper">
          {isAuthenticated && <Sidebar />} {/* Show sidebar only when authenticated */}
          {loading ? (
            <LoadingSpinner /> // Show loading spinner while auth is being checked
          ) : (
            <div className="container">{children}</div>
          )}
        </div>
      </body>
    </html>
  );
}
