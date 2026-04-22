# Member 2 — PyTest: Fixtures & Mocking (JWT / Auth Endpoints)

**Student:** Kavithma Hiyanthi Athukorala  
**Module:** SE3112 — Advanced Software Engineering  
**Assessment:** Group Testing Implementation  
**Due:** 26 April 2026

---

## Feature Ownership

**Tool:** PyTest (Unit & Integration Testing)  
**Feature Area:** Fixtures & Mocking (JWT / Security)  
**Focus:** Auth endpoints, security & JWT service unit tests

---

## Test Files Implemented

### `tests/conftest.py`
Shared pytest fixtures for the entire test suite:
- `db_session` — isolated SQLite in-memory session per test
- `client` — FastAPI TestClient with overridden DB dependency
- `seeded_user` — pre-created test user for auth tests

### `tests/unit/test_jwt.py` — 8 JWT Service Unit Tests
Tests for `app.services.jwt` module covering token creation and decoding:

| # | Test Name | Technique | Assert |
|---|-----------|-----------|--------|
| 1 | `test_create_access_token_returns_string` | db_session fixture | Non-empty string returned |
| 2 | `test_create_access_token_contains_user_id` | db_session fixture | Decoded sub == input user_id |
| 3 | `test_create_access_token_has_expiry` | db_session fixture | exp claim present in payload |
| 4 | `test_decode_access_token_valid` | db_session fixture | Returns correct TokenData |
| 5 | `test_decode_access_token_expired` | freezegun.freeze_time() | JWTError raised after expiry |
| 6 | `test_decode_access_token_tampered` | Manual token tampering | JWTError on modified token |
| 7 | `test_decode_access_token_wrong_key` | Wrong secret key | JWTError raised |
| 8 | `test_decode_access_token_missing_sub` | Malformed payload | JWTError raised |

### `tests/integration/test_auth.py` — 8 Auth Endpoint Integration Tests
Tests for FastAPI auth routes (`/auth/register`, `/auth/login`) via TestClient:

| # | Test Name | Fixture / Technique | Assert |
|---|-----------|------------------|--------|
| 1 | `test_register_success` | test_client + db_session | 201, id + email in response |
| 2 | `test_register_duplicate_email` | seeded_user fixture | 409 Conflict error |
| 3 | `test_register_invalid_email_format` | test_client | 422 Unprocessable Entity |
| 4 | `test_register_missing_password` | test_client | 422 Unprocessable Entity |
| 5 | `test_login_success` | seeded_user fixture | 200, access_token in response |
| 6 | `test_login_wrong_password` | seeded_user fixture | 401 Unauthorized |
| 7 | `test_login_nonexistent_user` | test_client | 401 Unauthorized |
| 8 | `test_login_returns_bearer_token_type` | seeded_user fixture | token_type == 'bearer' |

---

## Total Test Count

**16 tests** (8 JWT unit + 8 Auth integration)  
**Status:** ✅ All passing (9.73s)

---

## Key Techniques Demonstrated

### **Fixtures** (`conftest.py`)
- `@pytest.fixture(scope='function')` for test isolation
- `yield` pattern for setup → test → teardown
- Dependency injection via fixture parameters

### **Mocking**
- `freezegun.freeze_time()` to mock time for JWT expiry tests
- `TestClient` to test FastAPI endpoints without real HTTP
- Pre-seeded test data via `seeded_user` fixture

### **Test Isolation**
- Each test gets a fresh SQLite in-memory database
- No data leakage between tests
- Automatic rollback on fixture teardown

---

## How to Run Tests

### Install dependencies:
```bash
pip install -r requirements.txt
```

### Run JWT tests:
```bash
pytest tests/unit/test_jwt.py -v
```

### Run Auth endpoint tests:
```bash
pytest tests/integration/test_auth.py -v
```

### Run all 16 tests together (for demo):
```bash
pytest tests/unit/test_jwt.py tests/integration/test_auth.py -v
```

---

## Demo Script (2 minutes)

1. **Open conftest.py** — explain `@pytest.fixture(scope='function')` for test DB isolation
2. **Show the yield pattern:** DB setup → yield client → teardown/rollback
3. **Open test_jwt.py** — highlight `freezegun.freeze_time()` for expiry test
4. **Run:** `pytest tests/unit/test_jwt.py tests/integration/test_auth.py -v`
5. **Explain:** Fixtures enable realistic tests without polluting production database

## Submission Checklist

- ✅ `tests/conftest.py` — fixtures implemented
- ✅ `tests/unit/test_jwt.py` — 8 tests implemented
- ✅ `tests/integration/test_auth.py` — 8 tests implemented
- ✅ `pytest.ini` — configuration for .env.test
- ✅ `requirements.txt` — testing dependencies added
- ✅ All 16 tests passing
- ✅ `README.md` — this file
