"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "../context/authContext"; // Adjust the import path
import LoadingSpinner from "./components/LoadingSpinner";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "../../styles/global.scss";
import { staticMetadata, generateDynamicMetadata } from './metadata';

// Root Layout
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
    <AuthProvider>  {/* Wrap the whole app with the AuthProvider */}
      <AuthWrapper metadata={metadata}>{children}</AuthWrapper>
    </AuthProvider>
  );
}

// AuthWrapper component
function AuthWrapper({ children, metadata }) {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === null) {
      setLoading(true); // Show loading while checking authentication
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated === false && pathname !== "/" && pathname !== "/password-change") {
        router.replace("/"); // Redirect to home if not authenticated
      } else if (isAuthenticated === true && pathname === "/") {
        router.replace("/dashboard"); // Redirect to dashboard if authenticated
      }
  
      // Example of role-based redirect or access control
      if (isAuthenticated && userRole !== "admin" && pathname.startsWith("/admin")) {
        router.replace("/"); // Prevent non-admin users from accessing admin routes
      }
    }
  }, [isAuthenticated, userRole, loading, pathname, router]);

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
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
