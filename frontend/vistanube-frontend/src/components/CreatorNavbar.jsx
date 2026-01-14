import "./CreatorNavbar.css";
import { useAuth } from "../context/AuthContext";

export default function CreatorNavbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <nav className="creator-navbar">
      <div className="nav-left">
        <button
          className={`nav-btn ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          🏠 <span>All Posts</span>
        </button>

        <button
          className={`nav-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          ➕ <span>Create Post</span>
        </button>
      </div>

      <div className="nav-right">
        <span className="nav-user">👤 {user?.username}</span>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
