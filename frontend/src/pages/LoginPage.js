// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.msg || "Invalid credentials");
      }

      // Create unified user object for the app
      const userObj = {
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
        token: data.token,
      };

      // Store single user object — clean and consistent
      localStorage.setItem("user", JSON.stringify(userObj));
      console.log("User stored:", userObj);

      // Smooth navigation
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#121212",
        color: "white",
      }}
    >
      <h1>Cool Tech Credential Manager</h1>
      <h2>Login</h2>

      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "280px",
          gap: "10px",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #555",
            backgroundColor: "#1e1e1e",
            color: "white",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #555",
            backgroundColor: "#1e1e1e",
            color: "white",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: loading ? "#555" : "#007bff",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && (
        <p style={{ color: "#ff5555", marginTop: "15px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
