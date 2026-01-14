import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("consumer");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", {
        username,
        password,
        role,
      });

      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="signup-page">
      {/* Background Video */}
      <video
        className="signup-video"
        src="/signup-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="signup-overlay">
        <form className="signup-card" onSubmit={handleSignup}>
          <h2>Create Account</h2>
          <p>Join VistaNube today</p>

          <input
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

          <div className="role-select">
            <label>
              <input
                type="radio"
                value="creator"
                checked={role === "creator"}
                onChange={() => setRole("creator")}
              />
              Creator
            </label>

            <label>
              <input
                type="radio"
                value="consumer"
                checked={role === "consumer"}
                onChange={() => setRole("consumer")}
              />
              Consumer
            </label>
          </div>

          <button type="submit">Sign Up</button>

          <span className="signup-link" onClick={() => navigate("/login")}>
            Already have an account? Login
          </span>
        </form>
      </div>
    </div>
  );
}

export default Signup;
