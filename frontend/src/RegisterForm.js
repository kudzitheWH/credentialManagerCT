// src/RegisterForm.js
import React, { useEffect, useState } from "react";
import { apiRequest } from "./api";

function RegisterForm({ onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [orgUnits, setOrgUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load orgUnits + divisions on mount
  useEffect(() => {
    async function loadOrgStructure() {
      try {
        const data = await apiRequest("/api/auth/org-structure", {
          method: "GET",
        });
        // assuming shape: { orgUnits: [...], divisions: [...] }
        setOrgUnits(data.orgUnits || []);
        setDivisions(data.divisions || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load organisation structure.");
      }
    }

    loadOrgStructure();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const body = {
        name,
        email,
        password,
        orgUnitId: selectedOrgUnit,
        divisionId: selectedDivision,
      };

      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setMessage(data.msg || "Registration successful.");
      if (onRegistered) {
        onRegistered(data);
      }
      // Optional: clear fields
      // setName(""); setEmail(""); setPassword("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Divisions filtered by selected orgUnit
  const filteredDivisions = divisions.filter(
    (d) => d.orgUnit === selectedOrgUnit
  );

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Org Unit
          <select
            value={selectedOrgUnit}
            onChange={(e) => {
              setSelectedOrgUnit(e.target.value);
              setSelectedDivision("");
            }}
            required
          >
            <option value="">Select org unit</option>
            {orgUnits.map((ou) => (
              <option key={ou._id} value={ou._id}>
                {ou.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Division
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            required
          >
            <option value="">Select division</option>
            {filteredDivisions.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RegisterForm;
