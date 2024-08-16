from datetime import datetime

from bson import ObjectId
from .base_model import BaseModel
from . import db
from pydantic import BaseModel as PydanticBaseModel
from werkzeug.security import generate_password_hash, check_password_hash


class Account(BaseModel):
    def __init__(self, username: str, email: str, password: str):
        self.id = str(ObjectId())
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        super().save()

        account_data = AccountModel(
            id=self.id,
            username=self.username,
            email=self.email,
            password=self.password,
            created_at=self.created_at,
            updated_at=self.updated_at
        )

        db.accounts.insert_one(account_data.dict())

    @staticmethod
    def get_all():
        data = db.accounts.find()
        return [Account.from_dict(item) for item in data]

    @staticmethod
    def get_by_id(account_id):
        data = db.accounts.find_one({"_id": ObjectId(account_id)})
        if data:
            return Account.from_dict(data)

    @staticmethod
    def update(account_id, data):
        db.accounts.update_one({"_id": account_id}, {"$set": data})

    @staticmethod
    def delete(account_id):
        db.accounts.delete_one({"_id": account_id})

    @staticmethod
    def get_by_username(username):
        data = db.accounts.find_one({"username": username})
        if data:
            return Account.from_dict(data)

    @staticmethod
    def get_by_email(email):
        data = db.accounts.find_one({"email": email})
        if data:
            return Account.from_dict(data)

    @staticmethod
    def login(email, password):
        account = Account.get_by_email(email)
        if account and check_password_hash(account.password, password):
            return account

    @staticmethod
    def from_dict(data):
        account = Account(data['username'], data['email'], data['password'])
        account.id = str(data['_id'])
        account.created_at = data['created_at']
        account.updated_at = data['updated_at']
        account.password = data['password']
        return account

    def get_id(self):
        return self.id

    @property
    def is_active(self):
        return True  # Customize this if you need an actual field for this

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False
