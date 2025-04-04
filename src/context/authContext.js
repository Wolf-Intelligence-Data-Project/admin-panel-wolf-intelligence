import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state
  const [userRole, setUserRole] = useState(null); // Track user role

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/status", { withCredentials: true });
        setIsAuthenticated(res.data.isAuthenticated); 
        setUserRole(res.data.role); 
        console.log("User role set:", res.data.role);
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
