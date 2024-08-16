from bson import ObjectId
from pydantic import BaseModel as PydanticBaseModel
from .base_model import BaseModel
from . import db
from datetime import datetime


class Video(PydanticBaseModel):
    id: str
    account_id: str
    object_name: str
    created_at: datetime
    updated_at: datetime


class Videos(BaseModel):
    def __init__(self, account_id: str, object_name: str, ):
        self.id = str(ObjectId())
        self.account_id = account_id
        self.object_name = object_name

    def save(self):
        super().save()
        video_data = Video(
            id=self.id,
            account_id=self.account_id,
            object_name=self.object_name,
            created_at=self.created_at,
            updated_at=self.updated_at
        )
        db.videos.insert_one(video_data.dict())

    @staticmethod
    def get_all(account_id):
        return list(db.videos.find({"account_id": account_id}))

    @staticmethod
    def get_by_id(minio_id):
        return db.videos.find_one({"minio_id": minio_id})

    @staticmethod
    def delete(minio_id):
        db.videos.delete_one({"minio_id": minio_id})
