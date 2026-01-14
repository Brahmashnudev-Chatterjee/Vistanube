import jwt
from datetime import datetime, timedelta

SECRET_KEY = "vistanube-secret-key"
ALGORITHM = "HS256"

def generate_token(user):
    payload = {
        "id": user["id"],        # 🔑 use id directly
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=6)  # longer for dev
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
