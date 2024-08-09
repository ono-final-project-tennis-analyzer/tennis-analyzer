import os
from dotenv import load_dotenv

# Load environment variables from .env or .env.test file
if os.getenv('TEST_ENV'):
    load_dotenv('.env.test')
else:
    load_dotenv()

# Get MongoDB URI and Database Name from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# MinIO Configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME")

# postgress
POSTGRES_USER = 'postgres'
POSTGRES_PASSWORD = 'postgres'
POSTGRES_DB = 'postgres'
POSTGRES_HOST = 'localhost'  # or the name of your docker network bridge
POSTGRES_PORT = '5432'
