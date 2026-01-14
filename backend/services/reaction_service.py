from database.db import get_db_connection


def toggle_reaction(user_id, post_id, reaction_type):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT reaction FROM reactions
        WHERE user_id = ? AND post_id = ?
    """, (user_id, post_id))

    existing = cursor.fetchone()

    if existing:
        if existing["reaction"] == reaction_type:
            # Same reaction clicked again → remove
            cursor.execute("""
                DELETE FROM reactions
                WHERE user_id = ? AND post_id = ?
            """, (user_id, post_id))
        else:
            # Switch reaction (like ↔ dislike)
            cursor.execute("""
                UPDATE reactions
                SET reaction = ?
                WHERE user_id = ? AND post_id = ?
            """, (reaction_type, user_id, post_id))
    else:
        # No reaction yet → insert
        cursor.execute("""
            INSERT INTO reactions (user_id, post_id, reaction)
            VALUES (?, ?, ?)
        """, (user_id, post_id, reaction_type))

    conn.commit()
    conn.close()
def get_user_reaction(user_id, post_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT reaction FROM reactions
        WHERE user_id = ? AND post_id = ?
    """, (user_id, post_id))

    result = cursor.fetchone()
    conn.close()
    return result["reaction"] if result else None
