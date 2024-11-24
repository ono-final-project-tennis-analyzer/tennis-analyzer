import os
from dotenv import load_dotenv

# Load environment variables from .env or .env.test file
if os.getenv('TEST_ENV'):
    load_dotenv('test.env')
else:
    load_dotenv()

# Get MongoDB URI and Database Name from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")


APP_SECRET_KEY = os.getenv("APP_SECRET_KEY")


# MinIO Configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME")

# postgress
if os.getenv('DATABASE_URL'):
    DATABASE_URL = os.getenv('DATABASE_URL')
else:
    _POSTGRES_USER = os.getenv("POSTGRES_USER")
    _POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    _POSTGRES_DB = os.getenv("POSTGRES_DB")
    _POSTGRES_HOST = os.getenv('POSTGRES_HOST')
    _POSTGRES_PORT = os.getenv('POSTGRES_PORT')
    DATABASE_URL = f"postgresql://{_POSTGRES_USER}:{_POSTGRES_PASSWORD}@{_POSTGRES_HOST}:{_POSTGRES_PORT}/{_POSTGRES_DB}"
# ENCRYPTION
ACCOUNT_PASSWORD_ENCRYPTION_KEY = os.getenv("ACCOUNT_PASSWORD_ENCRYPTION_KEY")

# Celery
REDIS_BROKER_URL = os.getenv("REDIS_BROKER_URL", "redis://localhost:6379/0")
