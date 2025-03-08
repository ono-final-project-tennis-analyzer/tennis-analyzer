from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import mapped_column, relationship

from .base_model import BaseModel


class Videos(BaseModel):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = mapped_column(ForeignKey('events.id'))
    video_path = Column(String, nullable=False)
    processed_video_path = Column(String, nullable=True, default=None)
    name = Column(String, nullable=False)
    upload_date = Column(String, nullable=False)
    status = Column(Integer, nullable=False)

    event = relationship('Events')
    account_id = mapped_column(ForeignKey('accounts.id'))
    
    # Relationship with VideoEvents
    video_events = relationship("VideoEvents", back_populates="video", cascade="all, delete-orphan")
