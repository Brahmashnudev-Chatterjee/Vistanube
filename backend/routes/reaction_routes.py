from flask import Blueprint, request, jsonify
from services.reaction_service import toggle_reaction
from utils.auth_guard import auth_required
reaction_bp = Blueprint("reactions", __name__)

@reaction_bp.route("/react", methods=["POST"])
@auth_required
def react():
    data = request.json
    user_id = data.get("user_id")
    post_id = data.get("post_id")
    reaction = data.get("reaction")

    if reaction not in ["like", "dislike"]:
        return jsonify({"error": "Invalid reaction"}), 400

    toggle_reaction(user_id, post_id, reaction)
    return jsonify({"message": "Reaction updated"}), 200
