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
    print("here")
else:
    _POSTGRES_USER = 'postgres'
    _POSTGRES_PASSWORD = 'postgres'
    _POSTGRES_DB = 'postgres'
    _POSTGRES_HOST = 'localhost'  # or the name of your docker network bridge
    _POSTGRES_PORT = '5432'
    DATABASE_URL = f"postgresql://{_POSTGRES_USER}:{_POSTGRES_PASSWORD}@{_POSTGRES_HOST}:{_POSTGRES_PORT}/{_POSTGRES_DB}"
# ENCRYPTION
ACCOUNT_PASSWORD_ENCRYPTION_KEY = os.getenv("ACCOUNT_PASSWORD_ENCRYPTION_KEY")
