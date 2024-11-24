from minio import Minio
from minio.error import S3Error
from dataclasses import dataclass
from config import MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET_NAME


@dataclass
class UploadResult:
    object_name: str
    account_id: str


class StorageClient:
    def __init__(self):
        self.client = Minio(
            MINIO_ENDPOINT,
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=False
        )
        # Ensure the bucket exists
        if not self.client.bucket_exists(MINIO_BUCKET_NAME):
            self.client.make_bucket(MINIO_BUCKET_NAME)

    def upload_file(self, account_id: str, file_path: str, file_name: str) -> UploadResult:
        try:
            object_name = f"{account_id}/{file_name}"
            self.client.fput_object(
                MINIO_BUCKET_NAME, object_name, file_path
            )

            return UploadResult(object_name=object_name, account_id=account_id)
        except S3Error as err:
            raise Exception(f"File upload failed: {err}")

    def download_file(self, account_id: str, file_name: str, destination_path: str):
        try:
            object_name = f"{account_id}/{file_name}"
            self.client.fget_object(
                MINIO_BUCKET_NAME, object_name, destination_path
            )

            return f"File downloaded successfully to {destination_path}"
        except S3Error as err:
            return f"File download failed: {err}"

    def delete_file(self, account_id: str, file_name: str):
        try:
            object_name = f"{account_id}/{file_name}"
            self.client.remove_object(MINIO_BUCKET_NAME, object_name)
            return f"File '{file_name}' deleted successfully."
        except S3Error as err:
            return f"Failed to delete file '{file_name}': {err}"

    def stream_file(self, account_id: str, file_name: str):
        try:
            object_name = f"{account_id}/{file_name}"
            return self.client.get_object(MINIO_BUCKET_NAME, object_name)
        except S3Error as err:
            raise Exception(f"Failed to stream file '{file_name}': {err}")

    def stream_file_by_path(self, object_name: str):
        try:
            return self.client.get_object(MINIO_BUCKET_NAME, object_name)
        except S3Error as err:
            raise Exception(f"Failed to stream file '{object_name}': {err}")
