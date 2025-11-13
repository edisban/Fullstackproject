import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState(""); // 🔹 username αντί για login
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext); // ✅ αφήνουμε το login εδώ
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Always hit backend directly to avoid any dev/proxy/static host issues
      const response = await axiosInstance.post(
        "http://localhost:8080/api/auth/login",
        { username, password }
      );

      const token = response.data.token; // ✅ γιατί backend επιστρέφει "token"
      if (token) {
        login(token); // ✅ από το AuthContext (όχι να το αλλάξεις!)
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        setError("Δεν ελήφθη token από τον server.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Connection error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // ✅ username εδώ
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            disabled={loading}
          />
        </div>

        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Σύνδεση..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
