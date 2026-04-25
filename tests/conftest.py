"""
Shared pytest fixtures for the ASE e-commerce backend.

Provides:
  - `db_session`   – an isolated SQLite in-memory session that rolls back
                     after every test so tests never pollute each other.
  - `client`       – a FastAPI TestClient wired to the test DB session.
  - `seeded_user`  – a pre-created test user for login tests.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.session import Base, get_db
from app.main import app
from app.models.user import User
from app.services.security import hash_password

# ── Test database (SQLite in-memory, one file per test run) ──────────────────
TEST_DATABASE_URL = "sqlite:///./test.db"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},  # required for SQLite + pytest
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=test_engine
)


# ── Session fixture ───────────────────────────────────────────────────────────
@pytest.fixture(scope="function")
def db_session():
    """
    Creates all tables, yields a fresh session, then drops everything.
    Each test gets a clean slate — no leftover rows between tests.
    """
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


# ── TestClient fixture ────────────────────────────────────────────────────────
@pytest.fixture(scope="function")
def client(db_session):
    """
    FastAPI TestClient whose get_db dependency is overridden to use the
    isolated test session instead of the real PostgreSQL database.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass  # session lifecycle managed by db_session fixture

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ── Seeded user fixture ───────────────────────────────────────────────────────
@pytest.fixture(scope="function")
def seeded_user(db_session):
    """
    Creates a pre-existing test user in the database.
    
    Email: testuser@example.com
    Password: TestPass123!
    
    Used for login tests and other scenarios requiring a known user.
    """
    user = User(
        email="testuser@example.com",
        hashed_password=hash_password("TestPass123!")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user
