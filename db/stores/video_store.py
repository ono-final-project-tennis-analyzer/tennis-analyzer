from bson.objectid import ObjectId
from models.videos import Videos


class VideoStore:
    def save_video(self, account_id: str, object_name: str):
        video = Videos(account_id, object_name)
        video.save()
        return video

    def get_videos(self, account_id):
        return Videos.get_all(ObjectId(account_id))

    def get_video(self, video_id):
        return Videos.get_by_id(ObjectId(video_id))

    def delete_video(self, video_id):
        Videos.delete(ObjectId(video_id))
