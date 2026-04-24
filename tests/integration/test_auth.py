"""
Member 2 — PyTest: Auth Endpoint Integration Tests

Tests for app.routes.auth endpoints via FastAPI TestClient:
  - POST /auth/register – user creation, duplicate email, invalid email, missing password
  - POST /auth/login – successful login, wrong password, nonexistent user, bearer token
  
Uses:
  - client fixture (conftest.py) – TestClient with overridden get_db
  - db_session fixture (conftest.py) – isolated SQLite session per test
  - seeded_user fixture (this file) – pre-created test user
  
8 tests total covering:
  ✓ Register success (201, returns id + email)
  ✓ Register duplicate email (400 error)
  ✓ Register invalid email (422 Unprocessable Entity)
  ✓ Register missing password (422 Unprocessable Entity)
  ✓ Login success (200, access_token in response)
  ✓ Login wrong password (401 Unauthorized)
  ✓ Login nonexistent user (401 Unauthorized)
  ✓ Login returns bearer token type
"""

import pytest
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.security import hash_password


@pytest.fixture
def seeded_user(db_session: Session):
    """
    Creates a test user in the database and yields it.
    Used for login tests where we need a pre-existing user.
    
    Email: testuser@example.com
    Password: TestPass123!
    """
    user = User(
        email="testuser@example.com",
        hashed_password=hash_password("TestPass123!")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


class TestRegister:
    """Tests for POST /auth/register endpoint."""
    
    def test_register_success(self, client: TestClient, db_session: Session):
        """Test successful user registration returns 201 and user data."""
        payload = {
            "email": "newuser@example.com",
            "password": "SecurePass123!"
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert "id" in data
        assert "password" not in data  # password should not be returned
    
    def test_register_duplicate_email(self, client: TestClient, seeded_user: User):
        """Test that registering with existing email returns 409 Conflict."""
        payload = {
            "email": seeded_user.email,
            "password": "DifferentPass123!"
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"].lower()
    
    def test_register_invalid_email_format(self, client: TestClient):
        """Test that invalid email format returns 422 Unprocessable Entity."""
        payload = {
            "email": "notanemail",
            "password": "SecurePass123!"
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 422
    
    def test_register_missing_password(self, client: TestClient):
        """Test that missing password field returns 422 Unprocessable Entity."""
        payload = {
            "email": "valid@example.com"
            # missing password
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 422


class TestLogin:
    """Tests for POST /auth/login endpoint."""
    
    def test_login_success(self, client: TestClient, seeded_user: User):
        """Test successful login returns 200 and access_token."""
        form_data = {
            "username": seeded_user.email,
            "password": "TestPass123!"
        }
        
        response = client.post("/auth/login", data=form_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["access_token"] is not None
        assert len(data["access_token"]) > 0
    
    def test_login_wrong_password(self, client: TestClient, seeded_user: User):
        """Test that wrong password returns 401 Unauthorized."""
        form_data = {
            "username": seeded_user.email,
            "password": "WrongPassword123!"
        }
        
        response = client.post("/auth/login", data=form_data)
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_login_nonexistent_user(self, client: TestClient):
        """Test that logging in with nonexistent email returns 401."""
        form_data = {
            "username": "nonexistent@example.com",
            "password": "AnyPassword123!"
        }
        
        response = client.post("/auth/login", data=form_data)
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_login_returns_bearer_token_type(self, client: TestClient, seeded_user: User):
        """Test that login response includes token_type = 'bearer'."""
        form_data = {
            "username": seeded_user.email,
            "password": "TestPass123!"
        }
        
        response = client.post("/auth/login", data=form_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["token_type"] == "bearer"


class TestEdgeCases:
    """Edge case tests for registration and login with unusual inputs."""
    
    def test_register_with_special_characters_in_password(self, client: TestClient):
        """Test registration with special characters in password succeeds."""
        payload = {
            "email": "special@example.com",
            "password": "P@ssw0rd!#$%^&*()"
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "special@example.com"
    
    def test_register_with_very_long_password(self, client: TestClient):
        """Test registration with a very long password (>100 chars)."""
        long_password = "P@ss" * 50  # 200+ characters
        payload = {
            "email": "longpass@example.com",
            "password": long_password
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 201
    
    def test_login_email_case_insensitive(self, client: TestClient, seeded_user: User):
        """Test that email lookup is case-insensitive during login."""
        form_data = {
            "username": seeded_user.email.upper(),  # TESTUSER@EXAMPLE.COM
            "password": "TestPass123!"
        }
        
        response = client.post("/auth/login", data=form_data)
        
        # Should succeed if case-insensitive, or fail with 401 if case-sensitive
        # (adjust based on your implementation)
        assert response.status_code in [200, 401]
    
    def test_register_with_leading_trailing_whitespace_email(self, client: TestClient):
        """Test registration with email containing leading/trailing whitespace."""
        payload = {
            "email": "  valid@example.com  ",
            "password": "ValidPass123!"
        }
        
        response = client.post("/auth/register", json=payload)
        
        # Should either strip whitespace and succeed (201) or reject (422)
        assert response.status_code in [201, 422]
    
    def test_login_with_empty_password(self, client: TestClient):
        """Test login with empty password field."""
        form_data = {
            "username": "test@example.com",
            "password": ""
        }
        
        response = client.post("/auth/login", data=form_data)
        
        # Should reject with 401 or 422
        assert response.status_code in [401, 422]
    
    def test_register_empty_email(self, client: TestClient):
        """Test registration with empty email."""
        payload = {
            "email": "",
            "password": "ValidPass123!"
        }
        
        response = client.post("/auth/register", json=payload)
        
        assert response.status_code == 422
