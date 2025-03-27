"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./components/LoadingSpinner";
import "../../styles/global.scss";
import useAuthCheck from "./hooks/useAuthCheck";
import LoginPage from "./login/page";

export default function RootLayout({ children }) {
  const { isAuthenticated} = useAuthCheck();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); // Redirect authenticated users to dashboard
    }
  }, [isAuthenticated, router]);

  return (
    <html lang="en">
      <body>
        {isAuthenticated === null ? (
          <LoadingSpinner /> // Show while checking authentication
        ) : isAuthenticated ? (
          
          <div className="container">{children}</div> // Show content if authenticated
        ) : (
          <LoginPage /> // Show login if not authenticated
        )}
      </body>
    </html>
  );
}
