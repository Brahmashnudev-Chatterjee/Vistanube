from flask import Blueprint, request, jsonify
from services.comment_service import (
    get_comments,
    add_comment,
    delete_comment
)
from utils.auth_guard import auth_required
comment_bp = Blueprint("comments", __name__)

@comment_bp.route("/<int:post_id>", methods=["GET"])
def fetch_comments(post_id):
    comments = get_comments(post_id)
    return jsonify(comments), 200


@comment_bp.route("/add", methods=["POST"])
@auth_required
def create_comment():
    data = request.json
    post_id = data.get("post_id")
    user_id = data.get("user_id")
    comment = data.get("comment")

    if not all([post_id, user_id, comment]):
        return jsonify({"error": "Missing required fields"}), 400

    add_comment(post_id, user_id, comment)
    return jsonify({"message": "Comment added"}), 201


@comment_bp.route("/delete/<int:comment_id>", methods=["DELETE"])
@auth_required
def remove_comment(comment_id):
    data = request.json
    user_id = data.get("user_id")

    delete_comment(comment_id, user_id)
    return jsonify({"message": "Comment deleted"}), 200
