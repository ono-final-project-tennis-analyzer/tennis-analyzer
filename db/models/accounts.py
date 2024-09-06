from utils.consumer_secret_manager.consumer_secret_manager import ConsumerSecretManager
from .base_model import BaseModel
from sqlalchemy import Column, Integer, String
from config import ACCOUNT_PASSWORD_ENCRYPTION_KEY as salt


class Account(BaseModel):
    _consumer_secret_manager = ConsumerSecretManager()

    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    _password = Column(String, nullable=False)

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    @property
    def password(self):
        return self._consumer_secret_manager.decrypt(salt, self._password)

    @password.setter
    def password(self, password):
        self._password = self._consumer_secret_manager.encrypt(salt, password)
