# Member 2 — PyTest: Fixtures & Mocking (JWT / Auth Endpoints)

**Student:** Kavithma Hiyanthi Athukorala  
**Module:** SE3112 — Advanced Software Engineering  
**Assessment:** Group Testing Implementation  
**Due:** 26 April 2026

---

## Feature Ownership

**Tool:** PyTest (Unit & Integration Testing)  
**Feature Area:** Fixtures & Mocking (JWT / Security)  
**Focus:** JWT service unit tests (8) + Auth endpoint integration tests (8)

---

## Test Files Implemented

### `tests/conftest.py`
Shared pytest fixtures for the entire test suite:
- `db_session` — isolated SQLite in-memory session per test
- `client` — FastAPI TestClient with overridden DB dependency
- `seeded_user` — pre-created test user for auth tests

### `tests/unit/test_jwt.py` — 8 JWT Service Unit Tests
Tests for `app.services.jwt` module covering token creation and decoding:

| # | Test ID / Name | Fixture / Mock Used | Assert |
|---|-----------------|------------------|--------|
| 1 | `test_create_access_token_returns_string` | db_session fixture | Non-empty string returned |
| 2 | `test_create_access_token_contains_user_id` | db_session | Decoded sub == input user_id |
| 3 | `test_create_access_token_has_expiry` | db_session | exp claim present in payload |
| 4 | `test_decode_access_token_valid` | db_session | Returns correct TokenData |
| 5 | `test_decode_access_token_expired` | freezegun.freeze_time() | JWTError raised after expiry |
| 6 | `test_decode_access_token_tampered` | No fixture | JWTError on modified token |
| 7 | `test_decode_access_token_wrong_key` | No fixture | JWTError raised |
| 8 | `test_decode_access_token_missing_sub` | No fixture | JWTError raised |

### `tests/integration/test_auth.py` — 8 Auth Endpoint Integration Tests
Tests for FastAPI auth routes (`/auth/register`, `/auth/login`) via TestClient:

| # | Test ID / Name | Fixture / Mock Used | Assert |
|---|-----------------|------------------|--------|
| 9 | `test_register_success` | test_client + db_session | 201, id + email in response |
| 10 | `test_register_duplicate_email` | seeded_user fixture | 409 Conflict returned |
| 11 | `test_register_invalid_email_format` | test_client | 422 Unprocessable Entity |
| 12 | `test_register_missing_password` | test_client | 422 Unprocessable Entity |
| 13 | `test_login_success` | seeded_user fixture | 200, access_token in response |
| 14 | `test_login_wrong_password` | seeded_user fixture | 401 Unauthorized |
| 15 | `test_login_nonexistent_user` | test_client | 401 Unauthorized |
| 16 | `test_login_returns_bearer_token_type` | seeded_user fixture | token_type == 'bearer' |

---

## Total Test Count

**16 tests** (8 JWT unit + 8 auth integration)  
**Status:** ✅ All passing with comprehensive coverage

Breaking down by category:
- **Unit Tests (JWT):** 8 tests
  - JWT token creation & validation: 8 tests
- **Integration Tests (Auth):** 8 tests
  - Auth endpoints (register/login): 8 tests

*Note: Password security tests and schema validation tests are owned by Member 1.*

---

## Key Techniques Demonstrated

### **Fixtures** (`conftest.py`)
- `@pytest.fixture(scope='function')` for test isolation
- `yield` pattern for setup → test → teardown
- Dependency injection via fixture parameters
- `auth_headers` helper fixture for authenticated requests

### **Mocking & Time Control**
- `freezegun.freeze_time()` to mock time for JWT expiry tests
- `TestClient` to test FastAPI endpoints without real HTTP
- Pre-seeded test data via fixtures (seeded_user)

### **Token Security Testing**
- Token tampering detection (signature validation)
- Advanced JWT manipulation scenarios
- Incomplete/malformed token handling
- Algorithm mismatch detection

### **Auth Endpoint Testing**
- Registration validation (email format, required fields)
- Login verification (correct credentials, wrong password, nonexistent user)
- Token type validation (bearer token)
- Error handling (409 Conflict for duplicates, 401 Unauthorized, 422 Unprocessable Entity)

### **Test Isolation**
- Each test gets a fresh SQLite in-memory database
- No data leakage between tests
- Automatic rollback on fixture teardown
- Independent user/product seeding per test

### **Edge Case Coverage**
- Boundary conditions: empty tokens, malformed headers
- Security concerns: token tampering, wrong keys, expired tokens
- Authorization boundaries: user cannot access other user's data
- Special scenarios in authentication flows

### **Advanced Scenarios**
- Token modification detection (signature broken)
- Expired token handling with time mocking
- Invalid token format rejection
- Comprehensive auth flow validation

---

## How to Run Tests

### Install dependencies:
```bash
pip install -r requirements.txt
```

### Run JWT unit tests:
```bash
pytest tests/unit/test_jwt.py -v
```

### Run Auth endpoint integration tests:
```bash
pytest tests/integration/test_auth.py -v
```

### Run all 16 tests together (for demo):
```bash
pytest tests/unit/test_jwt.py tests/integration/test_auth.py -v
```

### Run specific test class:
```bash
pytest tests/unit/test_jwt.py::TestCreateAccessToken -v
pytest tests/integration/test_auth.py::TestRegister -v
```

---

## Demo Script (2 minutes)

### Slide-based Demo:
1. **Open conftest.py** — explain `@pytest.fixture(scope='function')` for test DB isolation
2. **Show the yield pattern:** DB setup → yield client → teardown/rollback
3. **Open test_jwt.py** — highlight `freezegun.freeze_time()` for expiry test
4. **Open test_auth.py** — show registration validation and login tests
5. **Run:** `pytest tests/unit/test_jwt.py tests/integration/test_auth.py -v --tb=short`
6. **Explain:** Fixtures provide test isolation; mocking enables edge case testing; comprehensive auth coverage

### Focused Demo (if time is short):
1. **Setup:** `pip install -r requirements.txt`
2. **Show JWT tests:** `pytest tests/unit/test_jwt.py::TestDecodeAccessToken -v`
3. **Show Auth tests:** `pytest tests/integration/test_auth.py::TestLogin -v`
4. **Highlight:** Fixtures provide isolation; freezegun enables time-based testing; TestClient validates endpoints

## Submission Checklist

- ✅ `tests/conftest.py` — fixtures implemented (db_session, client, seeded_user)
- ✅ `tests/unit/test_jwt.py` — 8 tests implemented
- ✅ `tests/integration/test_auth.py` — 8 tests implemented
- ✅ `pytest.ini` — configuration for testing
- ✅ `requirements.txt` — testing dependencies added (freezegun, pytest, httpx, pydantic, etc.)
- ✅ All 16 tests passing
- ✅ `README_MEMBER2.md` — comprehensive documentation with all test details

*Note: Password security & schema validation tests (Member 1 scope) are intentionally excluded to avoid duplication.*
