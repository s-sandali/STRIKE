from passlib.context import CryptContext
from passlib.exc import PasswordValueError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except PasswordValueError:
        # Fail closed for malformed password inputs such as NULL bytes.
        return False
