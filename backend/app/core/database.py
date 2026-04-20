import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Create an async connection with Motor
# It acts lazily, so we don't need a formal lifespan event for basic usage.
client = AsyncIOMotorClient(MONGO_URI)

# Create a global database instance
db = client.crowdflow
