import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI: str | None = os.getenv("MONGO_URI")
CLAUDE_API_KEY: str | None = os.getenv("CLAUDE_API_KEY")
