from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship

from db.models.base_model import BaseModel


class VideoEvents(BaseModel):
    __tablename__ = 'video_events'

    id = Column(Integer, primary_key=True)
    video_id = Column(Integer, ForeignKey('videos.id'), nullable=False)
    event_type = Column(String, nullable=False)  # 'bottom_player_stroke', 'top_player_stroke', 'ball_bounce'
    frame_number = Column(Integer, nullable=False)
    time_seconds = Column(Float, nullable=False)  # Time in seconds from the start of the video
    time_string = Column(String, nullable=False)  # Time in HH:MM:SS.ms format
    event_metadata = Column(JSON, nullable=True)  # For storing additional data like position coordinates

    # Relationship with Videos table
    video = relationship("Videos", back_populates="video_events") 