from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import mapped_column, relationship

from .base_model import BaseModel


class Videos(BaseModel):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = mapped_column(ForeignKey('events.id'))
    event = relationship('Events')
    video_path = Column(String, nullable=False)
    name = Column(String, nullable=False)
    upload_date = Column(String, nullable=False)
    status = Column(Integer, nullable=False)
