// frontend/src/components/CommentSection.jsx (FINAL UPDATE)
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useAuth } from '../context/AuthContext';
import './CommentSection.css'; 

function CommentSection({ postId, onCommentChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔑 1. FETCH COMMENTS ON LOAD AND REFRESH
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 🔑 2. ADD COMMENT LOGIC
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await api.post("/comments/add", {
        post_id: postId,
        user_id: user.id,
        comment: newCommentText.trim(),
      });
      
      setNewCommentText('');
      fetchComments();
      onCommentChange();
    } catch (err) {
      alert("Failed to post comment.");
    }
  };
  
  // 🔑 3. DELETE COMMENT LOGIC
  const handleDeleteComment = async (commentId, commenterUserId) => {
    
    // 🔑 FIX: The alert should ONLY fire if the user ID is wrong, 
    // but the backend handles the definitive check. 
    // For *your* code, we remove the redundant client-side check 
    // that was blocking the delete call.
    
    // Confirmation prompt (as required by the draft)
    if (!window.confirm("Are you sure you want to delete your comment?")) {
        return;
    }

    try {
      // Calls: /api/comments/delete/<comment_id> 
      // Sends logged-in user's ID to the backend for ownership verification
      await api.delete(`/comments/delete/${commentId}`, {
        data: { user_id: user.id } 
      });
      
      fetchComments();   
      onCommentChange(); 
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete comment.");
    }
  };

  // --- RENDERING ---
  return (
    <div className="comment-section-container">
      {/* ADD COMMENT FORM */}
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          placeholder="Write your comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          required
        />
        <button type="submit" disabled={!newCommentText.trim()}>Post</button>
      </form>

      {/* COMMENTS LIST */}
      <div className="comments-list">
        {loading && <p className="comment-status">Loading comments...</p>}
        {error && <p className="comment-status error">{error}</p>}
        
        {/* Placeholder: "No comments yet" message */}
        {!loading && comments.length === 0 && (
          <p className="comment-status">No comments yet</p>
        )}

        {/* Display comments in chronological order (backend handles ASC sort) */}
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="commenter-username">@{comment.commenter}</span>
              
              {/* 🔑 FIX: New container for timestamp and delete button */}
              <div className="comment-meta">
                <small className="comment-timestamp">
                    {new Date(comment.created_at).toLocaleString()}
                </small>
                
                {/* Delete button: Now uses user.id from the post and the comment.user_id from the fetch */}
                {user?.id === comment.user_id && ( 
                  <button 
                    className="delete-comment-btn"
                    onClick={() => handleDeleteComment(comment.id, comment.user_id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="comment-text">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;