from flask import Blueprint, request, jsonify
from services.post_service import (
    create_post, get_creator_posts,
    update_post, delete_post
)
from utils.role_guard import creator_only
from utils.auth_guard import auth_required
post_bp = Blueprint("posts", __name__)

@post_bp.route("/create", methods=["POST"])
@auth_required
@creator_only
def create():
    creator_id = request.user["id"]
    title = request.form.get("title")
    caption = request.form.get("caption")
    media_type = request.form.get("media_type")
    media_file = request.files.get("media")

    if not all([creator_id, title, media_type, media_file]):
        return jsonify({"error": "Missing required fields"}), 400

    create_post(creator_id, title, caption, media_type, media_file)
    return jsonify({"message": "Post created successfully"}), 201


@post_bp.route("/my", methods=["GET"])
@auth_required
@creator_only
def my_posts():
    creator_id = request.user["id"]
    posts = get_creator_posts(creator_id)
    return jsonify(posts), 200


@post_bp.route("/update/<int:post_id>", methods=["PUT"])
@auth_required
@creator_only
def update(post_id):
    creator_id = request.user["id"]
    data = request.json
    update_post(post_id, creator_id, data.get("title"), data.get("caption"))
    return jsonify({"message": "Post updated"}), 200


@post_bp.route("/delete/<int:post_id>", methods=["DELETE"])
@auth_required
@creator_only
def delete(post_id):
    creator_id = request.user["id"]
    delete_post(post_id, creator_id)
    return jsonify({"message": "Post deleted"}), 200

