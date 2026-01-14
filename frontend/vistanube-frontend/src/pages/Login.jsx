import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, user } = res.data;

      login(token, user);

      if (user.role === "creator") navigate("/creator");
      else navigate("/feed");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      {/* Background Video */}
      <video
        className="login-video"
        src="/login-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="login-overlay">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p>Login to continue to VistaNube</p>

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

          <button type="submit">Login</button>

          <span className="login-link" onClick={() => navigate("/signup")}>
            Don’t have an account? Sign up
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;
