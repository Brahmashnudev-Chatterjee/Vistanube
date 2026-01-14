from flask import Blueprint, request, jsonify
from services.feed_service import get_all_posts, search_posts

feed_bp = Blueprint("feed", __name__)

@feed_bp.route("/posts", methods=["GET"])
def feed():
    posts = get_all_posts()
    return jsonify(posts), 200


@feed_bp.route("/search", methods=["GET"])
def search():
    query = request.args.get("q")

    if not query:
        return jsonify({"error": "Search query required"}), 400

    results = search_posts(query)
    return jsonify(results), 200
