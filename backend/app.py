import os
from flask import Flask, send_from_directory # <-- COMBINED IMPORTS
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.post_routes import post_bp
from routes.feed_routes import feed_bp
from routes.reaction_routes import reaction_bp
from routes.comment_routes import comment_bp

app = Flask(__name__)

app.add_url_rule(
    '/media/<path:filename>', 
    endpoint='media', 
    view_func=lambda filename: send_from_directory(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads'), 
        filename
    )
)

CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173"    
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.register_blueprint(auth_bp)
app.register_blueprint(post_bp, url_prefix="/api/posts")
app.register_blueprint(feed_bp, url_prefix="/api/feed")
app.register_blueprint(reaction_bp, url_prefix="/api/reactions")
app.register_blueprint(comment_bp, url_prefix="/api/comments")

@app.route("/")
def home():
    return {"message": "VistaNube Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)