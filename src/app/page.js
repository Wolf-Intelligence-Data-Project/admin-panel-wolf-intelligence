"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth, AuthProvider } from "../context/authContext"; // Assuming you have an AuthContext to manage auth state

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated, setUserRole } = useAuth(); // Assuming setIsAuthenticated updates the auth state in context

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("/api/auth/login", { email, password }, {
        validateStatus: () => true, // Always resolve response so we can handle errors manually
      });
  
      console.log("Login response:", response.data); // Debugging line
  
      // Check if the backend says the password needs to be changed
      if (response.data.redirectToChangePassword) {
        router.push("/password-change");
        return;
      }
  
      if (response.data.success) {
        setIsAuthenticated(true);
        setUserRole(response.data.role); // ✅ Save role to context
        router.push("/dashboard");
      } else {
        setError(response.data.errorMessage || "Invalid login credentials.");
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <form className="login-container" onSubmit={handleLogin} noValidate>
      <div className="input-group">
        <label htmlFor="email">E-post</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Lösenord</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className='button-positive' type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Logga in"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
