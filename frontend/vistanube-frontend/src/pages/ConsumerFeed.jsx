import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConsumerPostCard from "../components/ConsumerPostCard"; 
import "./ConsumerFeed.css"; // We will create this CSS file next

export default function ConsumerFeed() {
  const { logout } = useAuth(); // Need logout in the nav
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔑 Search State
  const [searchQuery, setSearchQuery] = useState("");

  // 🔑 Fetching logic for the main feed or search results
  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      let endpoint = "/feed/posts";
      if (query) {
        // Use the search endpoint if a query is present
        endpoint = `/feed/search?q=${encodeURIComponent(query)}`;
      }
      
      const res = await api.get(endpoint);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  };

  // Initial load: fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // 🔑 Search Logic: Perform search immediately as user types
    if (query.trim().length > 0) {
        fetchPosts(query.trim());
    } else {
        // Clearing the search input restores the Consumer feed to its default state
        fetchPosts(); 
    }
  };

  return (
    <div className="consumer-feed-page">
      <header className="feed-header">
        <h1 className="logo">VistaNube</h1>
        
        {/* 🔑 Search Section */}
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search by title, keywords, or Creator username..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />
        </div>
        
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="feed-container">
        {loading ? (
          <p className="loading-message">Loading content...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts">
            {searchQuery ? "No results found for your query." : "No posts available yet."}
          </p>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <ConsumerPostCard 
                key={post.id} 
                post={post} 
                onRefresh={() => fetchPosts(searchQuery)} // Pass function to re-fetch current state
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}