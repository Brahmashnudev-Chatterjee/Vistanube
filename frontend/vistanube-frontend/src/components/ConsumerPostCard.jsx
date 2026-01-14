import React, { useState } from "react"; 
import api from "../services/api"; 
import { useAuth } from "../context/AuthContext";
import CommentSection from "./CommentSection"; // <-- IMPORT CommentSection
import "./ConsumerPostCard.css"; 

function ConsumerPostCard({ post, onRefresh }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false); // <-- NEW STATE to toggle CommentSection
  
  // --- Utility Functions (for media path) ---
  const getFilenameFromUrl = (fullPath) => {
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    return parts[parts.length - 1];
  };

  const filename = getFilenameFromUrl(post.media_url);
  const mediaHttpUrl = `http://127.0.0.1:5000/media/${filename}`; 
  // ------------------------------------------------------------------------

  // --- REACTION LOGIC (Like/Dislike) ---
  const handleReaction = async (reactionType) => {
    if (!user) {
      alert("Please log in to react.");
      return;
    }
    
    try {
      await api.post("/reactions/react", {
        user_id: user.id,
        post_id: post.id,
        reaction: reactionType,
      });
      onRefresh(); // Refresh the feed to show updated reaction counts
    } catch (error) {
      console.error("Reaction failed:", error);
      alert("Failed to update reaction.");
    }
  };
  
  // LOGIC: Toggles the comment section display
  const handleCommentClick = () => {
    setShowComments(prev => !prev);
  };
  
  // LOGIC: Function passed to CommentSection to re-fetch the post counts
  const handleCommentChange = () => {
      onRefresh(); // Calls the parent Feed to re-fetch all posts and update counts
  }


  return (
    <div className="consumer-post-card">
      <div className="post-header-info">
        <span className="creator-username">@{post.creator_name}</span>
        <small className="timestamp">
          {new Date(post.created_at).toLocaleDateString()}
        </small>
      </div>
      
      {/* Media Content */}
      <div className="post-media-content">
        {post.media_type === "image" ? (
          <img src={mediaHttpUrl} alt={post.title} className="post-image" />
        ) : (
          <video src={mediaHttpUrl} controls className="post-video" />
        )}
      </div>

      {/* Title & Caption */}
      <div className="post-details">
        <h3>{post.title}</h3>
        <p>{post.caption}</p>
      </div>

      {/* Interaction Buttons & Counts */}
      <div className="post-interactions">
        <div className="reaction-counts">
            <span className="count-item like-count">👍 {post.likes || 0}</span>
            <span className="count-item dislike-count">👎 {post.dislikes || 0}</span>
            <span className="count-item comment-count">💬 {post.comments_count || 0}</span>
        </div>
        
        <div className="reaction-buttons">
          <button 
            className="like-btn" 
            onClick={() => handleReaction('like')}
          >
            Like
          </button>
          <button 
            className="dislike-btn" 
            onClick={() => handleReaction('dislike')}
          >
            Dislike
          </button>
          <button 
            className={`comment-btn ${showComments ? 'active' : ''}`} // Add 'active' class when open
            onClick={handleCommentClick}
          >
            {showComments ? 'Hide Comments' : 'Comment'}
          </button>
        </div>
      </div>
      
      {/* 🔑 INTEGRATE COMMENT SECTION (Conditional Rendering) */}
      {showComments && (
        <CommentSection 
          postId={post.id} 
          onCommentChange={handleCommentChange} // Pass the refresh function
        />
      )}
    </div>
  );
}

export default ConsumerPostCard;