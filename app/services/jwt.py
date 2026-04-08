from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings
from app.schemas.user import TokenData


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> TokenData:
    """Decode and validate a JWT, returning TokenData. Raises JWTError on failure."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int | None = payload.get("sub")
        if user_id is None:
            raise JWTError("Token payload missing 'sub'")
        return TokenData(user_id=int(user_id))
    except JWTError:
        raise
