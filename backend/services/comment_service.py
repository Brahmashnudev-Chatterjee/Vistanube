# backend/services/comment_service.py (FINAL UPDATE)

from database.db import get_db_connection


def get_comments(post_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            comments.id,
            comments.comment,
            comments.created_at,
            comments.user_id,          -- 🔑 ADDED: Include the user_id for client-side delete check
            users.username AS commenter
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    """, (post_id,))

    comments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return comments


def add_comment(post_id, user_id, comment_text):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO comments (post_id, user_id, comment)
        VALUES (?, ?, ?)
    """, (post_id, user_id, comment_text))

    conn.commit()
    conn.close()


def delete_comment(comment_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM comments
        WHERE id = ? AND user_id = ?
    """, (comment_id, user_id))

    conn.commit()
    conn.close()