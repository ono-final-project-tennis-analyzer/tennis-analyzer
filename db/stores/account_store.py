from bson.objectid import ObjectId
from sqlalchemy.orm import Session
from ..models.accounts import Account
from werkzeug.security import generate_password_hash, check_password_hash


class AccountStore:

    def __init__(self, session: Session):
        self._session = session

    def create_account(self, username, email, password):
        hash_password = generate_password_hash(password)
        account = Account(username=username, email=email, password=hash_password)
        self._session.add(account)
        self._session.commit()
        return self.get_account_for_return(account)

    def get_account(self, account_id):
        account = self._session.query(Account).filter(Account.id == account_id).first()
        if account:
            return self.get_account_for_return(account)
        return None

    def update_account(self, account_id, data):
        self._session.query(Account).filter(Account.id == account_id).update(data)
        self._session.commit()
        return True

    def delete_account(self, account_id):
        self._session.query(Account).filter(Account.id == account_id).delete()
        self._session.commit()
        return True

    def list_accounts(self):
        query = self._session.query(Account)
        accounts = query.all()
        count = query.count()
        return {
            "accounts": accounts,
            "count": count,
        }

    def get_account_by_email(self, email):
        account = self._session.query(Account).filter(Account.email == email).first()
        if account:
            return self.get_account_for_return(account)
        else:
            return None

    def login(self, email, password):
        account = self._session.query(Account).filter(Account.email == email).first()
        if account and check_password_hash(account.password, password):
            return {account.id, account.username, account.email, account.created_at, account.updated_at}
        else:
            return None

    @staticmethod
    def get_account_for_return(account):
        return {
            "id": account.id,
            "username": account.username,
            "email": account.email,
            "created_at": account.created_at,
            "updated_at": account.updated_at
        }
