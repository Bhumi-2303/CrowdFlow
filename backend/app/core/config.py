import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI: str | None = os.getenv("MONGO_URI")
CLAUDE_API_KEY: str | None = os.getenv("CLAUDE_API_KEY")

SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-replace-in-production")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
