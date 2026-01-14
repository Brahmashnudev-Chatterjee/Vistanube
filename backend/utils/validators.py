def validate_signup(username, password, role):
    if not username or not password or not role:
        return "All fields are required"

    if role not in ["creator", "consumer"]:
        return "Invalid role"

    if len(username) < 3:
        return "Username must be at least 3 characters"

    if len(password) < 6:
        return "Password must be at least 6 characters"

    return None
