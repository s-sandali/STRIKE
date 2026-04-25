"""
Member 2 — PyTest: JWT Service Unit Tests

Tests for app.services.jwt module:
  - create_access_token() – token generation with exp claim
  - decode_access_token() – validation, expiry, tampering, missing sub
  
Uses:
  - db_session fixture (conftest.py)
  - freezegun.freeze_time() to mock time for expiry tests
  
8 tests total covering:
  ✓ Token creation (string, user_id in sub, exp claim present)
  ✓ Token decoding (valid, expired, tampered, wrong key, missing sub)
"""

import pytest
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from freezegun import freeze_time

from app.services.jwt import create_access_token, decode_access_token
from app.config import settings


class TestCreateAccessToken:
    """Tests for JWT token creation."""
    
    def test_create_access_token_returns_string(self, db_session):
        """Test that create_access_token returns a non-empty string."""
        user_id = 42
        token = create_access_token(data={"sub": str(user_id)})
        
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_create_access_token_contains_user_id(self, db_session):
        """Test that token's 'sub' claim matches the input user_id."""
        user_id = 99
        token = create_access_token(data={"sub": str(user_id)})
        
        # Decode without validation to inspect payload
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        assert payload.get("sub") == str(user_id)
    
    def test_create_access_token_has_expiry(self, db_session):
        """Test that token payload contains exp claim."""
        token = create_access_token(data={"sub": "123"})
        
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        assert "exp" in payload
        assert payload["exp"] is not None


class TestDecodeAccessToken:
    """Tests for JWT token decoding and validation."""
    
    def test_decode_access_token_valid(self, db_session):
        """Test that a valid token decodes correctly and returns TokenData."""
        user_id = 42
        token = create_access_token(data={"sub": str(user_id)})
        
        token_data = decode_access_token(token)
        
        assert token_data.user_id == user_id
    
    def test_decode_access_token_expired(self, db_session):
        """Test that expired tokens raise JWTError.
        
        Uses freezegun to mock time: create token at T=0, advance to T=31min,
        attempt decode (default expiry is 30min).
        """
        with freeze_time("2026-01-01 12:00:00") as frozen_time:
            # Create token at T=0
            token = create_access_token(data={"sub": "123"})
            
            # Advance time to 31 minutes later (beyond 30-min default expiry)
            frozen_time.move_to("2026-01-01 12:31:00")
            
            # Attempt to decode expired token
            with pytest.raises(JWTError):
                decode_access_token(token)
    
    def test_decode_access_token_tampered(self, db_session):
        """Test that a tampered token raises JWTError."""
        token = create_access_token(data={"sub": "123"})
        
        # Tamper by modifying the token string
        tampered_token = token[:-10] + "corrupted!"
        
        with pytest.raises(JWTError):
            decode_access_token(tampered_token)
    
    def test_decode_access_token_wrong_key(self, db_session):
        """Test that a token signed with wrong key raises JWTError."""
        user_id = 42
        token = create_access_token(data={"sub": str(user_id)})
        
        # Try to decode with a different secret key
        with pytest.raises(JWTError):
            jwt.decode(
                token, 
                "wrong-secret-key", 
                algorithms=[settings.ALGORITHM]
            )
    
    def test_decode_access_token_missing_sub(self, db_session):
        """Test that missing 'sub' claim raises JWTError."""
        # Create a token without 'sub' claim
        payload = {
            "data": "some_data",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        with pytest.raises(JWTError):
            decode_access_token(token)
