"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuthCheck from "../hooks/useAuthCheck"; // Fixed import path

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuthCheck(); // Add checkAuth

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post("/api/auth/login", { email, password });
  
      if (response.data.success) {
        await checkAuth(); // Force authentication check
        router.push("/dashboard");
      } else {
        setError(response.data.errorMessage);
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
      <form className="login-container" onSubmit={handleLogin}>
        <h2>Wolf Intelligence</h2>
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
