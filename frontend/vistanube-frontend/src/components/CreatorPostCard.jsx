import React, { useState } from "react";
import api from "../services/api";
import "./CreatorPostCard.css"; // Make sure to create this CSS file!

function CreatorPostCard({ post, onRefresh }) {
  // 🔑 1. State for Edit Mode and Form Inputs
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editCaption, setEditCaption] = useState(post.caption);

  // Function to extract the filename from the local filesystem path
  const getFilenameFromUrl = (fullPath) => {
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    return parts[parts.length - 1];
  };

  // 🔑 2. Construct the Accessible HTTP URL for Media
  const filename = getFilenameFromUrl(post.media_url);
  // Assuming your Flask server is running on http://127.0.0.1:5000
  const mediaHttpUrl = `http://127.0.0.1:5000/media/${filename}`; 


  // --- UPDATE (EDIT) LOGIC ---
  const handleUpdate = async (e) => {
      e.preventDefault();
      
      try {
          // Send the updated title and caption to the backend
          // The backend (post_service.py) enforces ownership check
          await api.put(`/posts/update/${post.id}`, {
              title: editTitle,
              caption: editCaption
          });
          
          setIsEditing(false); // Exit edit mode
          onRefresh();         // Refresh the list to show the new data
          
      } catch (error) {
          alert("Failed to update post.");
          console.error("UPDATE FAILED:", error);
      }
  };


  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    // The functional design required a confirmation prompt
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await api.delete(`/posts/delete/${post.id}`); 
      onRefresh(); // Refresh the list to remove the deleted post
    } catch (error) {
      alert("Failed to delete post.");
      console.error("DELETE FAILED:", error);
    }
  };


  // 🔑 3. Conditional Rendering for Edit Mode (FORM)
  if (isEditing) {
      return (
          <div className="creator-post-card editing-mode">
              <form onSubmit={handleUpdate} className="edit-form">
                  <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                  />
                  <textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      rows="4"
                  />
                  
                  <div className="edit-actions">
                      <button type="submit" className="save-btn">Save Changes</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                  </div>
              </form>
          </div>
      );
  }

  // 🔑 4. View Mode (The default display)
  return (
    <div className="creator-post-card">
      <div className="post-details">
        <h3>{post.title}</h3>
        <p>{post.caption}</p>
        <small>{new Date(post.created_at).toLocaleString()}</small>
      </div>

      <div className="post-media-container">
        {post.media_type === "image" ? (
          <img 
             src={mediaHttpUrl} 
             alt={post.title} 
             className="post-image"
          />
        ) : post.media_type === "video" ? (
          <video 
             src={mediaHttpUrl} 
             controls 
             className="post-video" 
          />
        ) : (
          <p>Media file not found or type unknown.</p>
        )}
      </div>
      
      <div className="post-actions">
        {/* EDIT BUTTON: Toggles the edit mode */}
        <button onClick={() => setIsEditing(true)} className="edit-btn"> 
          Edit
        </button>
        
        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default CreatorPostCard;