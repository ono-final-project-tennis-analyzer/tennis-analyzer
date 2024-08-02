from sqlalchemy import Column, Integer, String, Float

from .base_model import BaseModel


class Events(BaseModel):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    stage = Column(String, nullable=False)
    progress = Column(Float, nullable=False, default=0.0)
