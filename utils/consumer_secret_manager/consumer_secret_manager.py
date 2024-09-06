import base64
import os

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding

from .exceptions import EmptySaltError, EmptyValueError


class ConsumerSecretManager:
    _BLOCK_SIZE = algorithms.AES.block_size
    _KEY_SIZE = 32
    _IV_SIZE = 16

    def __init__(self, algorithm=algorithms.AES):
        self.algorithm = algorithm

    def _get_cipher(self, key, iv):
        return Cipher(self.algorithm(key), modes.CBC(iv), backend=default_backend())

    def _pad(self, data):
        padder = padding.PKCS7(self._BLOCK_SIZE).padder()
        padded_data = padder.update(data) + padder.finalize()
        return padded_data

    def _unpad(self, data):
        unpadder = padding.PKCS7(self._BLOCK_SIZE).unpadder()
        unpadded_data = unpadder.update(data) + unpadder.finalize()
        return unpadded_data

    def _derive_key(self, salt: str):
        if not salt:
            raise EmptySaltError("Salt cannot be empty")
        return (salt * (self._KEY_SIZE // len(salt) + 1))[:self._KEY_SIZE].encode('utf-8')

    def encrypt(self, salt: str, value: str) -> str:
        self._validate_salt_and_value(salt, value)

        iv = os.urandom(self._IV_SIZE)
        key = self._derive_key(salt)
        cipher = self._get_cipher(key, iv)
        encryptor = cipher.encryptor()
        padded_value = self._pad(value.encode('utf-8'))
        encrypted = encryptor.update(padded_value) + encryptor.finalize()
        encrypted_value = iv + encrypted
        return base64.b64encode(encrypted_value).decode('utf-8')

    def decrypt(self, salt: str, encrypted_value: str) -> str:
        self._validate_salt_and_value(salt, encrypted_value)

        encrypted_value_bytes = base64.b64decode(encrypted_value.encode('utf-8'))
        iv = encrypted_value_bytes[:self._IV_SIZE]
        key = self._derive_key(salt)
        cipher = self._get_cipher(key, iv)
        decryptor = cipher.decryptor()
        decrypted_padded = decryptor.update(encrypted_value_bytes[self._IV_SIZE:]) + decryptor.finalize()
        decrypted = self._unpad(decrypted_padded)
        return decrypted.decode('utf-8')

    def _validate_salt_and_value(self, salt: str, value: str):
        if not salt:
            raise EmptySaltError("Salt cannot be empty")
        if not value:
            raise EmptyValueError("Value cannot be empty")
