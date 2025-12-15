import React, { useState, useEffect } from "react";

export default function CredentialsPanel() {
  const [credentials, setCredentials] = useState([]);
  const [error, setError] = useState(null);
  const [systemName, setSystemName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // -----------------------------------
  // Load credentials for user divisions
  // -----------------------------------
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;

        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/credentials/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load credentials");

        setCredentials(data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching credentials:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCredentials();
  }, []);

  // -----------------------------------
  // Add new credential
  // -----------------------------------
  async function handleAddCredential(e) {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!userData?.divisions || userData.divisions.length === 0) {
        setError("No division assigned to your account.");
        return;
      }

      const divisionId = userData.divisions[0]; // use first division
      const res = await fetch(
        `http://localhost:5000/api/divisions/${divisionId}/credentials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password, systemName, notes }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to add credential");

      setCredentials((prev) => [...prev, data]);
      setSystemName("");
      setUsername("");
      setPassword("");
      setNotes("");
      setError(null);
    } catch (err) {
      console.error("❌ Error adding credential:", err.message);
      setError(err.message);
    }
  }

  // -----------------------------------
  // UI
  // -----------------------------------
  if (loading) return <p>Loading credentials...</p>;

  return (
    <div>
      <h2>My Credentials</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {credentials.length === 0 && !error ? (
        <p>No credentials found for your divisions.</p>
      ) : (
        <ul>
          {credentials.map((cred) => (
            <li key={cred._id}>
              <strong>{cred.systemName || "Unnamed System"}</strong> —{" "}
              {cred.username || "No username"}{" "}
              {cred.division?.name && (
                <>
                  <em style={{ color: "#aaa" }}>
                    {" "}
                    ({cred.division.name})
                  </em>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddCredential} style={{ marginTop: "20px" }}>
        <h3>Add New Credential</h3>
        <input
          type="text"
          placeholder="System name"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit">Add Credential</button>
      </form>
    </div>
  );
}
