from bson.objectid import ObjectId
from models.accounts import Account

class AccountStore:
    def create_account(self, username, email, password):
            account = Account(username=username, email=email, password=password)
            account.save()
            return account


    def get_account(self, account_id):
        account = Account.get_by_id(ObjectId(account_id))
        if account:
            return serialize_account(account)

    def update_account(self, account_id, data):
        Account.update(ObjectId(account_id), data)

    def delete_account(self, account_id):
        Account.delete(ObjectId(account_id))

    def list_accounts(self):
        accounts = Account.get_all()
        serialized_accounts = [serialize_account(account) for account in accounts]
        account_count = len(serialized_accounts)
        return {
            "accounts": serialized_accounts,
            "count": account_count
        }

    def get_account_by_email(self, email):
        account = Account.get_by_email(email)
        if account:
            return serialize_account(account)


    def login(self, email, password):
        return Account.login(email, password)

def serialize_account(account):
    return {
        "id": account.id,
        "username": account.username,
        "email": account.email,
        "created_at": account.created_at,
        "updated_at": account.updated_at
    }