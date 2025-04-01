from sqlalchemy.orm import Session

from db.models import VideoEvents


class VideoEventsStore:
    def __init__(self, session: Session):
        self.session = session

    def create_video_event(self, video_id, event_type, frame_number, time_seconds, time_string, event_metadata=None, stroke_type=None):
        """
        Create a new video event
        
        Args:
            video_id (int): The ID of the video
            event_type (str): The type of event ('bottom_player_stroke', 'top_player_stroke', 'ball_bounce')
            frame_number (int): The frame number where the event occurred
            time_seconds (float): The time in seconds from the start of the video
            time_string (str): The time in HH:MM:SS.ms format
            event_metadata (dict, optional): Additional data for the event
            stroke_type (str, optional): The type of stroke ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10')
        Returns:
            VideoEvents: The created video event
        """
        video_event = VideoEvents(
            video_id=video_id,
            event_type=event_type,
            frame_number=frame_number,
            time_seconds=time_seconds,
            time_string=time_string,
            event_metadata=event_metadata,
            stroke_type=stroke_type
        )
        
        self.session.add(video_event)
        self.session.commit()
        
        return video_event
    
    def get_video_events_by_video_id(self, video_id):
        """
        Get all video events for a specific video
        
        Args:
            video_id (int): The ID of the video
            
        Returns:
            list: List of VideoEvents objects
        """
        return self.session.query(VideoEvents).filter(VideoEvents.video_id == video_id).all()
    
    def get_video_events_by_type(self, video_id, event_type):
        """
        Get all video events of a specific type for a specific video
        
        Args:
            video_id (int): The ID of the video
            event_type (str): The type of event
            
        Returns:
            list: List of VideoEvents objects
        """
        return self.session.query(VideoEvents).filter(
            VideoEvents.video_id == video_id,
            VideoEvents.event_type == event_type
        ).all()
    
    def delete_video_events_by_video_id(self, video_id):
        """
        Delete all video events for a specific video
        
        Args:
            video_id (int): The ID of the video
            
        Returns:
            int: Number of deleted rows
        """
        result = self.session.query(VideoEvents).filter(VideoEvents.video_id == video_id).delete()
        self.session.commit()
        
        return result

    def update_stroke_types(self, updates):
        """
        Update stroke types for multiple events
        
        Args:
            updates (list): List of dictionaries containing event_id and stroke_type
            
        Returns:
            list: List of updated VideoEvents objects
        """
        updated_events = []
        for update in updates:
            event = self.session.query(VideoEvents).filter(VideoEvents.id == update['event_id']).first()
            if event:
                event.stroke_type = update['stroke_type']
                updated_events.append(event)
        
        self.session.commit()
        return updated_events 
    
    def find_by_id(self, id):
        return self.session.query(VideoEvents).filter(VideoEvents.id == id).first()
    
    def find_by_video_id(self, video_id):
        return self.session.query(VideoEvents).filter(VideoEvents.video_id == video_id).all()
    
    
