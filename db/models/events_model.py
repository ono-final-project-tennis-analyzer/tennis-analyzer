from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship

from .base_model import BaseModel


class Events(BaseModel):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, nullable=True, index=True)
    account_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    stage = Column(String, nullable=False)
    progress = Column(Float, nullable=False, default=0.0)
    meta = Column(JSON, nullable=True)
