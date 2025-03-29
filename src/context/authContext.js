import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/status", { withCredentials: true });
        setIsAuthenticated(res.data.isAuthenticated); // Update state based on server response
      } catch (error) {
        setIsAuthenticated(false); // In case of error, set it to false
      }
    };

    checkAuth();
  }, []); // Runs only once on initial load

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
