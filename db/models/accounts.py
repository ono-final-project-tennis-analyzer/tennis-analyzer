from .base_model import BaseModel
from sqlalchemy import Column, Integer, String, DateTime


class Account(BaseModel):
    __table__ = 'accounts'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False
