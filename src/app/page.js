"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";  // Make sure you have axios installed

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when login starts
    try {
      const response = await axios.post("/api/auth", { email, password });

      if (response.data.success) {
        router.push("/dashboard"); // Redirect on success
        setPassword(""); // Clear password after successful login
      } else {
        setError(response.data.errorMessage); // Show error message on failure
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error(err); // Log detailed error for debugging
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleLogin}>
        <h2>Logga in</h2>
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
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
