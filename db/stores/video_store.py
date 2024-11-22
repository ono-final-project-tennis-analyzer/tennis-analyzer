from datetime import datetime
from sqlalchemy.orm import Session
from ..models.videos_model import Videos
from ..views.account_views import session


class VideoStore:


    def __init__(self, session: Session):
        self._session = session

    def get_video_for_return(self, video):
        return {
            "id": str(video.id),
            "name": video.name,
            "upload_date": video.upload_date,
            "status": video.status,

        }
    def create_video(self, account_id: int, video_path: str,name: str,event_id: int):
        upload_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        video = Videos(account_id=account_id, video_path=video_path, name=name, upload_date=upload_date, event_id=event_id,status=1)
        session.add(video)
        session.commit()
        return video


    def get_videos(self, account_id):
        query = session.query(Videos).filter(Videos.account_id == account_id)
        videos = query.all()
        videos = [self.get_video_for_return(video) for video in videos]
        return [videos,query.count()]

    def get_video(self, video_id):
        return  self.get_video_for_return(session.query(Videos).filter(Videos.id == video_id).first())

    def delete_video(self, video_id):
        session.query(Videos).filter(Videos.id == video_id).delete()
        session.commit()
        return True