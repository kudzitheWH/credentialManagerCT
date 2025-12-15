import React, { useState, useEffect } from "react";

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  // ------------------------------------------------------
  // Load users, divisions, and orgUnits on mount
  // ------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("No session found. Please log in again.");
      setLoading(false);
      return;
    }

    let token;
    try {
      token = JSON.parse(storedUser).token;
    } catch {
      setError("Invalid session data. Please log in again.");
      setLoading(false);
      return;
    }

    async function fetchAdminData() {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [usersRes, divRes, ouRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", { headers }),
          fetch("http://localhost:5000/api/admin/divisions", { headers }),
          fetch("http://localhost:5000/api/admin/orgUnits", { headers }),
        ]);

        if (!usersRes.ok || !divRes.ok || !ouRes.ok) {
          throw new Error("Failed to load admin data.");
        }

        const [usersData, divData, ouData] = await Promise.all([
          usersRes.json(),
          divRes.json(),
          ouRes.json(),
        ]);

        setUsers(usersData);
        setDivisions(divData);
        setOrgUnits(ouData);
      } catch (err) {
        console.error("Admin data fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  // ------------------------------------------------------
  // Assign division
  // ------------------------------------------------------
  async function handleAssign() {
    if (!selectedUser || !selectedDivision) {
      setStatusMsg("Please select both a user and a division.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${selectedUser}/division`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ divisionId: selectedDivision }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Assignment failed.");

      setStatusMsg(`${data.msg}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser ? { ...u, divisions: [selectedDivision] } : u
        )
      );
    } catch (err) {
      console.error("Error assigning division:", err.message);
      setStatusMsg(err.message);
    }
  }

  // ------------------------------------------------------
  // Remove division
  // ------------------------------------------------------
  async function handleRemove() {
    if (!selectedUser) {
      setStatusMsg("Please select a user first.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${selectedUser}/division/remove`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Removal failed.");

      setStatusMsg(`${data.msg}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser ? { ...u, divisions: [] } : u
        )
      );
    } catch (err) {
      console.error("Error removing division:", err.message);
      setStatusMsg(err.message);
    }
  }

  // ------------------------------------------------------
  // ✅ Change Role Handler
  // ------------------------------------------------------
  async function handleChangeRole() {
    if (!selectedUser || !newRole) {
      setStatusMsg("Please select both a user and a role.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${selectedUser}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Role update failed.");

      setStatusMsg(`Role updated: ${data.updatedUser.name} is now ${data.updatedUser.role}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser ? { ...u, role: data.updatedUser.role } : u
        )
      );
      setNewRole("");
    } catch (err) {
      console.error("Error changing role:", err.message);
      setStatusMsg(err.message);
    }
  }

  // ------------------------------------------------------
  // Render UI
  // ------------------------------------------------------
  if (loading) return <p>Loading admin data...</p>;

  return (
    <div>
      <h2>Admin – Manage Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {statusMsg && <p style={{ color: "#00bfff" }}>{statusMsg}</p>}

      {!error && (
        <>
          {/* --- USERS --- */}
          <h3>All Users</h3>
          <select
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="">Select user...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          {/* --- DIVISIONS --- */}
          <h3 style={{ marginTop: "20px" }}>Divisions</h3>
          <select
            onChange={(e) => setSelectedDivision(e.target.value)}
            value={selectedDivision}
          >
            <option value="">Select division...</option>
            {divisions.map((div) => (
              <option key={div._id} value={div._id}>
                {div.name}
              </option>
            ))}
          </select>

          {/* --- DIVISION ACTIONS --- */}
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={handleAssign}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "8px 14px",
                marginRight: "8px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Assign Division
            </button>

            <button
              onClick={handleRemove}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "8px 14px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Remove Division
            </button>
          </div>

          {/* --- ROLE MANAGEMENT --- */}
          <h3 style={{ marginTop: "30px" }}>Change User Role</h3>
          <select
            onChange={(e) => setNewRole(e.target.value)}
            value={newRole}
            style={{ marginRight: "10px" }}
          >
            <option value="">Select role...</option>
            <option value="normal">Normal</option>
            <option value="management">Management</option> {/* ✅ Added */}
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleChangeRole}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "8px 14px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update Role
          </button>

          {/* --- ORG UNITS --- */}
          <h3 style={{ marginTop: "30px" }}>Organisational Units</h3>
          {orgUnits.length === 0 ? (
            <p>No organisational units found.</p>
          ) : (
            <ul>
              {orgUnits.map((ou) => (
                <li key={ou._id}>{ou.name}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
