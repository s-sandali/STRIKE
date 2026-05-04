"""Unit tests for password hashing and verification security behavior."""

import pytest

from app.services.security import hash_password, pwd_context, verify_password


@pytest.fixture
def reference_hash() -> str:
    """Hash for a known password to validate verify_password behavior."""
    return hash_password("KnownPassword123!")


@pytest.fixture(autouse=True)
def fast_bcrypt_rounds():
    """Reduce bcrypt cost for test speed while preserving behavior checks."""
    original_rounds = pwd_context.to_dict().get("bcrypt__rounds", 12)
    pwd_context.update(bcrypt__rounds=4)
    try:
        yield
    finally:
        pwd_context.update(bcrypt__rounds=original_rounds)


@pytest.mark.parametrize(
    "password",
    [
        "password",
        "Admin@123",
        "x" * 73,
    ],
)
def test_hash_password_unique_salts(password: str):
    first_hash = hash_password(password)
    second_hash = hash_password(password)

    # bcrypt should embed random salt, so hashes for same input differ.
    assert first_hash != second_hash
    assert verify_password(password, first_hash) is True
    assert verify_password(password, second_hash) is True


def test_verify_password_correct(reference_hash: str):
    assert verify_password("KnownPassword123!", reference_hash) is True


def test_verify_password_incorrect(reference_hash: str):
    assert verify_password("WrongPassword999!", reference_hash) is False


@pytest.mark.parametrize("candidate", ["", " ", "\x00"])
def test_verify_password_empty(reference_hash: str, candidate: str):
    assert verify_password(candidate, reference_hash) is False


@pytest.mark.parametrize("length", [72, 73])
def test_hash_long_input_edge(length: int):
    password = "A" * length
    hashed = hash_password(password)

    assert isinstance(hashed, str)
    assert hashed
    assert verify_password(password, hashed) is True
