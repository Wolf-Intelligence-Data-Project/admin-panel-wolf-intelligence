'use client'; // Marking this file as a client-side component

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { useAuth, AuthProvider } from "../context/authContext";
import LoadingSpinner from "./components/LoadingSpinner";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "../../styles/global.scss";
import { staticMetadata, generateDynamicMetadata } from './metadata';
import axios from "axios"; // Ensure axios is imported

export default function RootLayout({ children, params }) {
  const [metadata, setMetadata] = useState(staticMetadata);

  useEffect(() => {
    const fetchDynamicMetadata = async () => {
      const dynamicMetadata = await generateDynamicMetadata(params);
      setMetadata(dynamicMetadata);
    };

    fetchDynamicMetadata();
  }, [params]);

  return (
    <AuthProvider>
      <AuthWrapper metadata={metadata}>{children}</AuthWrapper>
    </AuthProvider>
  );
}

function AuthWrapper({ children, metadata }) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/status", { withCredentials: true });
        setIsAuthenticated(res.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated === null) {
      checkAuth(); // Run only once on initial load
    }
  }, [isAuthenticated, setIsAuthenticated]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated === false && pathname !== "/") {
        router.replace("/"); // Redirect unauthenticated users to home ("/")
      } else if (isAuthenticated === true && pathname === "/") {
        router.replace("/dashboard"); // Redirect authenticated users to "/dashboard"
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  return (
    <html lang="sv">
     <head>
        <title>{metadata.title}</title> 
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="robots" content={metadata.robots} />
        <meta name="author" content="Wolf Intelligence" />
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <div className="wrapper">
          <Sidebar />
          <div className="main-content">
            <Header />

              <div className="container">
                {children} {/* Render page content */}
              </div>
          </div>
        </div>
      </body>
    </html>
  );
}
