from flask import request, jsonify
from functools import wraps

def creator_only(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = getattr(request, "user", None)

        if not user or user.get("role") != "creator":
            return jsonify({"error": "Creator access required"}), 403

        return func(*args, **kwargs)
    return wrapper
