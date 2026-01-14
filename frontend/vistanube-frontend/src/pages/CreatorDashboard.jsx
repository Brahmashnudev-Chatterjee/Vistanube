import React, { useState, useEffect } from "react"; // <-- CORRECTED IMPORT: combined useState and useEffect
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import CreatorNavbar from "../components/CreatorNavbar";
import CreatorPostCard from "../components/CreatorPostCard"; // <-- IMPORT CREATORPOSTCARD
import "./CreatorDashboard.css";

export default function CreatorDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  const [myPosts, setMyPosts] = useState([]); // State to hold fetched posts
  const [fetchLoading, setFetchLoading] = useState(false); // State for fetching status

  // Form state
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for upload status

  // 🔑 FUNCTION TO FETCH POSTS (READ logic)
  const fetchMyPosts = async () => {
    if (!user) return;

    try {
      setFetchLoading(true);
      const res = await api.get("/posts/my");
      setMyPosts(res.data);
    } catch (err) {
      console.error("Error fetching creator posts:", err);
      // alert("Could not load your posts."); // Optional alert
    } finally {
      setFetchLoading(false);
    }
  };

  // 🔑 useEffect: FETCH POSTS ON COMPONENT LOAD
  useEffect(() => {
    // Only fetch if the user object is available (i.e., successfully logged in)
    if (user?.id) {
      fetchMyPosts();
    }
  }, [user]); // Re-run if user data changes (shouldn't happen, but good practice)


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Not authenticated. Please login again.");
      return;
    }

    if (!title || !file) {
      alert("Title and media file are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("media_type", mediaType);
    formData.append("media", file);

    try {
      setLoading(true);

      // Removed custom headers to let Axios/Browser handle Content-Type for FormData
      await api.post("/posts/create", formData);

      alert("Post uploaded successfully");

      // Reset form
      setTitle("");
      setCaption("");
      setMediaType("image");
      setFile(null);
      
      // Navigate to All Posts tab
      setActiveTab("posts");
      
      // 🔑 TRIGGER POSTS RE-FETCH TO DISPLAY NEW POST
      fetchMyPosts(); 

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creator-page">
      <div className="creator-container">
        <CreatorNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          username={user?.username}
        />

        {/* ALL POSTS TAB */}
        {activeTab === "posts" && (
          <section className="glass-section">
            <h2>Your Posts ({myPosts.length})</h2>
            
            {fetchLoading ? (
              <p>Loading posts...</p>
            ) : myPosts.length === 0 ? (
              // Display 'No posts yet' only if not loading and list is empty
              <p>No posts yet.</p> 
            ) : (
              // 🔑 RENDER THE LIST OF POSTS
              <div className="posts-list">
                {myPosts.map(post => (
                  <CreatorPostCard 
                    key={post.id} 
                    post={post} 
                    onRefresh={fetchMyPosts} // Pass the refresh function for deletion/update
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CREATE POST TAB */}
        {activeTab === "create" && (
          <section className="glass-section">
            <h2>Create New Post</h2>
            
            {/* ... (Your existing form code) ... */}
            <form
              className="create-post-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Write a caption..."
                rows="4"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>

              <input
                type="file"
                accept={mediaType === "image" ? "image/*" : "video/*"}
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Post"}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}