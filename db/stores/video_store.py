from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import desc
from .events_store import EventStore
from ..models.videos_model import Videos
from ..views.account_views import session


class VideoStore:
    def __init__(self, session: Session):
        self._session = session
        self._event_store = EventStore(session)

    def create_video(self, account_id: int, video_path: str, name: str, event_id: int, bottom_player_account_id: Optional[int] = None, top_player_account_id: Optional[int] = None):
        upload_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        video = Videos(
            account_id=account_id, 
            video_path=video_path, 
            name=name, 
            upload_date=upload_date, 
            event_id=event_id, 
            status=1,
            bottom_player_account_id=bottom_player_account_id,
            top_player_account_id=top_player_account_id
        )
        self._session.add(video)
        self._session.commit()
        return video

    def get_all_videos(self, account_id: int):
        query = (
            self._session.query(Videos)
            .filter(Videos.account_id == account_id)
            .order_by(desc(Videos.upload_date))
            .all()
        )
        videos = [self._get_video_for_return(video) for video in query]
        return videos

    def get_video(self, video_id: int) -> Optional[Videos]:
        return self._session.query(Videos).filter(Videos.id == video_id).first()

    def delete_video(self, video_id: int):
        video = self.get_video(video_id)
        if not video:
            return False

        # Delete video record
        self._session.delete(video)
        self._session.commit()

        # Delete associated event
        self._event_store.delete_event(video.event_id)

        return True

    def update_processed_video_path(self, event_id: int, path: str):
        video = self._session.query(Videos).filter(Videos.event_id == event_id).first()
        video.processed_video_path = path
        self._session.add(video)
        self._session.commit()

    def _get_video_for_return(self, video):
        if not video:
            return None

        event_data = None
        event = self._event_store.get_event(video.event_id)
        if event:
            event_data = {
                "file_name": event.meta.get("file_name"),
                "stage": event.stage,
                "progress": event.progress,
            }

        return {
            "id": str(video.id),
            "name": video.name,
            "upload_date": video.upload_date,
            "status": video.status,
            "event_data": event_data,
            "bottom_player_account_id": video.bottom_player_account_id,
            "top_player_account_id": video.top_player_account_id
        }
