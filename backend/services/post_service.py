import os
from datetime import datetime
from database.db import get_db_connection

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def create_post(creator_id, title, caption, media_type, media_file):
    filename = f"{datetime.utcnow().timestamp()}_{media_file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    media_file.save(filepath)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO posts (creator_id, title, caption, media_type, media_url)
        VALUES (?, ?, ?, ?, ?)
    """, (creator_id, title, caption, media_type, filepath))

    conn.commit()
    conn.close()


def get_creator_posts(creator_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, caption, media_type, media_url, created_at
        FROM posts
        WHERE creator_id = ?
        ORDER BY created_at DESC
    """, (creator_id,))

    posts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return posts


def update_post(post_id, creator_id, title, caption):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE posts
        SET title=?, caption=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=? AND creator_id=?
    """, (title, caption, post_id, creator_id))

    conn.commit()
    conn.close()


def delete_post(post_id, creator_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM posts WHERE id=? AND creator_id=?
    """, (post_id, creator_id))

    conn.commit()
    conn.close()
