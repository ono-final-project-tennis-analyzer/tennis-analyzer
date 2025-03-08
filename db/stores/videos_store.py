from sqlalchemy.orm import Session

from db.models import Videos


class VideosStore:
    def __init__(self, session: Session):
        self.session = session

    def create_video(self, event_id, account_id, video_path, name, upload_date, status=0, processed_video_path=None):
        """
        Create a new video record
        
        Args:
            event_id (int): The ID of the event
            account_id (str): The ID of the account
            video_path (str): The path to the video file
            name (str): The name of the video
            upload_date (str): The date the video was uploaded
            status (int, optional): The status of the video (0=pending, 1=processing, 2=completed, 3=error)
            processed_video_path (str, optional): The path to the processed video file
            
        Returns:
            Videos: The created video record
        """
        video = Videos(
            event_id=event_id,
            account_id=account_id,
            video_path=video_path,
            name=name,
            upload_date=upload_date,
            status=status,
            processed_video_path=processed_video_path
        )
        
        self.session.add(video)
        self.session.commit()
        
        return video
    
    def get_video(self, video_id):
        """
        Get a video by ID
        
        Args:
            video_id (int): The ID of the video
            
        Returns:
            Videos: The video record
        """
        return self.session.query(Videos).filter(Videos.id == video_id).first()
    
    def get_videos_by_event_id(self, event_id):
        """
        Get all videos for a specific event
        
        Args:
            event_id (int): The ID of the event
            
        Returns:
            list: List of Videos objects
        """
        return self.session.query(Videos).filter(Videos.event_id == event_id).all()
    
    def update_video_status(self, video_id, status, processed_video_path=None):
        """
        Update the status of a video
        
        Args:
            video_id (int): The ID of the video
            status (int): The new status (0=pending, 1=processing, 2=completed, 3=error)
            processed_video_path (str, optional): The path to the processed video file
            
        Returns:
            Videos: The updated video record
        """
        video = self.get_video(video_id)
        if video:
            video.status = status
            if processed_video_path:
                video.processed_video_path = processed_video_path
            self.session.commit()
        
        return video 