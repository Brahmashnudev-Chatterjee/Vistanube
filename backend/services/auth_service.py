from database.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash


def signup_user(username, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()

    # ✅ Securely hash password using Werkzeug
    hashed_password = generate_password_hash(password)

    try:
        cursor.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            (username, hashed_password, role)
        )
        conn.commit()
        return True, None

    except Exception:
        return False, "Username already exists"

    finally:
        conn.close()


def login_user(username, password):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔍 Fetch user by username only
    cursor.execute(
        "SELECT id, username, password, role FROM users WHERE username = ?",
        (username,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        return None

    # ✅ Verify hashed password
    if not check_password_hash(user["password"], password):
        return None

    # ✅ Return safe user object (no password)
    return {
        "id": user["id"],
        "username": user["username"],
        "role": user["role"]
    }
