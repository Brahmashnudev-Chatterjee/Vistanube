from flask import Blueprint, request, jsonify
from services.auth_service import signup_user, login_user
from utils.jwt_utils import generate_token

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if not username or not password or not role:
        return jsonify({"error": "Missing fields"}), 400

    success, error = signup_user(username, password, role)

    if not success:
        return jsonify({"error": error}), 409

    return jsonify({"message": "Signup successful"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = login_user(username, password)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ GENERATE JWT TOKEN
    token = generate_token(user)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user
    }), 200
