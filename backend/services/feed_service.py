from database.db import get_db_connection


def get_all_posts():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            posts.id,
            posts.title,
            posts.caption,
            posts.media_type,
            posts.media_url,
            posts.created_at,
            users.username AS creator_name,

            -- Like count
            SUM(CASE WHEN reactions.reaction = 'like' THEN 1 ELSE 0 END) AS likes,

            -- Dislike count
            SUM(CASE WHEN reactions.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes,

            -- Comment count
            COUNT(DISTINCT comments.id) AS comments_count

        FROM posts
        JOIN users ON posts.creator_id = users.id
        LEFT JOIN reactions ON reactions.post_id = posts.id
        LEFT JOIN comments ON comments.post_id = posts.id

        GROUP BY posts.id
        ORDER BY posts.created_at DESC
    """)

    posts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return posts


def search_posts(query):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            posts.id,
            posts.title,
            posts.caption,
            posts.media_type,
            posts.media_url,
            posts.created_at,
            users.username AS creator_name,

            SUM(CASE WHEN reactions.reaction = 'like' THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN reactions.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
            COUNT(DISTINCT comments.id) AS comments_count

        FROM posts
        JOIN users ON posts.creator_id = users.id
        LEFT JOIN reactions ON reactions.post_id = posts.id
        LEFT JOIN comments ON comments.post_id = posts.id

        WHERE posts.title = ?
           OR posts.title LIKE ?
           OR users.username LIKE ?

        GROUP BY posts.id
        ORDER BY posts.created_at DESC
    """, (query, f"%{query}%", f"%{query}%"))

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results
