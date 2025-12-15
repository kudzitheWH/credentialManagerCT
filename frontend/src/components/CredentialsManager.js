// src/components/CredentialsManager.js
import React from "react";

export default function CredentialsManager() {
  // Read user + token from localStorage once
  let user = null;
  let token = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      user = parsed;
      token = parsed.token;
    }
  } catch (err) {
    console.error("❌ Failed to parse user from localStorage:", err);
  }

  if (!user) {
    return (
      <div
        style={{
          border: "1px solid #555",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "8px",
        }}
      >
        <p>No user data found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #555",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "8px",
        textAlign: "left",
      }}
    >
      <h2>Welcome, {user.name}</h2>

      <p>
        <strong>Role:</strong> {user.role}
      </p>

      {user.email && (
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      )}

      <p style={{ fontSize: "12px", marginTop: "10px" }}>
        <strong>JWT preview:</strong>{" "}
        {token ? token.substring(0, 30) + "..." : "no token found"}
      </p>
    </div>
  );
}
