import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* HERO SECTION */}
      <section className="hero">
        <video
          className="hero-video"
          auto consisting of autoplay loop muted playsInline
          src="/hero-video.mp4"
        />

        <div className="hero-overlay">
          <h1>VistaNube</h1>
          <p>
            A Cloud-Native Media Sharing Platform for Creators and Consumers
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")} className="secondary">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section">
        <h2>What is VistaNube?</h2>
        <p>
          VistaNube is a scalable cloud-native media platform that enables creators
          to upload and manage visual content while allowing consumers to explore,
          interact, and engage through likes, dislikes, and comments.
        </p>
      </section>

      {/* FEATURES */}
      <section className="section alt">
        <h2>Why VistaNube?</h2>
        <div className="features">
          <div className="feature">🎥 Image & Video Sharing</div>
          <div className="feature">🔐 Secure Authentication</div>
          <div className="feature">⚡ Real-time Engagement</div>
          <div className="feature">☁️ Cloud-Ready Architecture</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 VistaNube | Built for Cloud Computing Coursework</p>
      </footer>
    </div>
  );
}

export default Landing;
