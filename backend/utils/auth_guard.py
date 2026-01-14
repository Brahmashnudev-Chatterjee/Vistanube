from flask import request, jsonify
from functools import wraps
from utils.jwt_utils import decode_token

def auth_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401

        token = auth_header.split(" ")[1]
        decoded = decode_token(token)

        if not decoded:
            return jsonify({"error": "Session expired"}), 401

        request.user = {
            "id": decoded["id"],
            "role": decoded["role"]
        }
        return func(*args, **kwargs)

    return wrapper
