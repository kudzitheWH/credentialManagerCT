// src/pages/DashboardPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CredentialsManager from "../components/CredentialsManager";
import CredentialsPanel from "../components/CredentialsPanel";
import AdminUsersPanel from "../components/AdminUsersPanel";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-creds");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.warn("No user found, redirecting to login");
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.token) {
        console.warn("Missing token, forcing logout");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (err) {
      console.error("Error loading user data:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div
        style={{
          backgroundColor: "#121212",
          color: "white",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Loading user info...</h2>
      </div>
    );
  }

  // Helper: Format division names nicely if they exist
  const divisionList =
    user.divisions && user.divisions.length > 0
      ? user.divisions.join(", ")
      : "No division assigned";

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1>Cool Tech Credential Manager</h1>

      {/* User info header */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          textAlign: "left",
          maxWidth: "700px",
          margin: "30px auto",
        }}
      >
        <h2>
          Welcome, <span style={{ color: "#00bfff" }}>{user.name}</span>
        </h2>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Divisions:</strong> {divisionList}
        </p>
        <p style={{ fontSize: "0.8rem", color: "#999" }}>
          <strong>JWT preview:</strong> {user.token?.substring(0, 40)}...
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => setActiveTab("my-creds")}
          style={{
            marginRight: "10px",
            padding: "10px 15px",
            backgroundColor:
              activeTab === "my-creds" ? "#007bff" : "transparent",
            border: "1px solid #007bff",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
        >
          My Credentials
        </button>

        {user.role === "admin" && (
          <button
            onClick={() => setActiveTab("admin-users")}
            style={{
              padding: "10px 15px",
              backgroundColor:
                activeTab === "admin-users" ? "#007bff" : "transparent",
              border: "1px solid #007bff",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            Admin – Manage Users
          </button>
        )}

        <button
          onClick={handleLogout}
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            backgroundColor: "#dc3545",
            border: "1px solid #dc3545",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
        >
          Logout
        </button>
      </div>

      {/* Panels */}
      <div style={{ marginTop: "40px", textAlign: "left" }}>
        {activeTab === "my-creds" && <CredentialsPanel />}
        {activeTab === "admin-users" && user.role === "admin" && (
          <AdminUsersPanel />
        )}
      </div>
    </div>
  );
}
