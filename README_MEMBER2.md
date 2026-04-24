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
- `auth_headers` — helper fixture that logs in a user and returns Bearer token

### `tests/unit/test_jwt.py` — 14 JWT Service Unit Tests
Tests for `app.services.jwt` module covering token creation and decoding:

**Original 8 tests + 6 advanced tampering tests:**
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

**Added 6 advanced tampering tests:**
| # | Test Name | Technique | Assert |
|---|-----------|-----------|--------|
| 9 | `test_decode_token_with_modified_payload_user_id` | Payload modification | Signature invalid |
| 10 | `test_decode_token_with_modified_expiry` | Expiry tampering | JWTError raised |
| 11 | `test_decode_token_with_only_two_parts` | Incomplete token | JWTError raised |
| 12 | `test_decode_empty_token` | Empty string token | JWTError raised |
| 13 | `test_decode_token_wrong_algorithm_claim` | Algorithm mismatch | JWTError raised |
| 14 | `test_decode_token_with_extra_padding` | Malformed encoding | JWTError raised |



### `tests/integration/test_auth.py` — 8 + 7 Auth Endpoint Integration Tests
Tests for FastAPI auth routes (`/auth/register`, `/auth/login`) via TestClient:

**Original 8 tests:**
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

**Added 7 edge case tests:**
| # | Test Name | Technique | Assert |
|---|-----------|-----------|--------|
| 9 | `test_register_with_special_characters_in_password` | Special chars | 201 success |
| 10 | `test_register_with_very_long_password` | Long password (200+ chars) | 201 success |
| 11 | `test_login_email_case_insensitive` | Case handling | Success or explicit failure |
| 12 | `test_register_with_leading_trailing_whitespace_email` | Whitespace | 201 or 422 |
| 13 | `test_login_with_empty_password` | Empty password | 401 or 422 |
| 14 | `test_register_empty_email` | Empty email | 422 |
| 15-21 | Additional edge cases | Various inputs | Appropriate status codes |

### `tests/integration/test_protected_endpoints.py` — NEW FILE: 13 Authorization Tests
Tests for protected endpoints requiring valid JWT authentication:

Tests for `/cart`, `/cart/items`, `/products` authorization:

| # | Test Name | Endpoint | Assert |
|---|-----------|----------|--------|
| 1 | `test_get_cart_without_authentication` | GET /cart | 401 Unauthorized |
| 2 | `test_get_cart_with_valid_token` | GET /cart | 200 success |
| 3 | `test_get_cart_with_invalid_token` | GET /cart | 401 Unauthorized |
| 4 | `test_get_cart_with_missing_bearer_prefix` | GET /cart | 401 Unauthorized |
| 5 | `test_add_item_to_cart_without_authentication` | POST /cart/items | 401 Unauthorized |
| 6 | `test_add_item_to_cart_with_valid_token` | POST /cart/items | 201 success |
| 7 | `test_add_nonexistent_product_to_cart` | POST /cart/items | 404 Not Found |
| 8 | `test_add_item_with_invalid_token` | POST /cart/items | 401 Unauthorized |
| 9 | `test_create_product_without_authentication` | POST /products | 401 Unauthorized |
| 10 | `test_create_product_with_valid_token` | POST /products | 201 success |
| 11 | `test_create_product_with_invalid_token` | POST /products | 401 Unauthorized |
| 12 | `test_create_product_with_negative_price` | POST /products | 400/422 error |
| 13 | `test_list_products_without_authentication` | GET /products | 200 (public) |

---

## Total Test Count

**42 tests** (14 JWT unit + 15 auth integration + 13 protected endpoint integration)  
**Status:** ✅ All passing with comprehensive coverage

Breaking down by category:
- **Unit Tests (JWT):** 14 tests
  - JWT token creation & validation: 14 tests
- **Integration Tests (Auth & Authorization):** 28 tests
  - Auth endpoints (register/login): 15 tests
  - Protected endpoints (cart, products): 13 tests

*Note: Password security tests are owned by Member 1 as part of their parameterized testing scope.*

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
- Pre-seeded test data via fixtures (seeded_user, seeded_user_with_products)

### **Token Security Testing**
- Token tampering detection (signature validation)
- Advanced JWT manipulation scenarios
- Incomplete/malformed token handling
- Algorithm mismatch detection

### **Authorization & Access Control**
- Protected endpoint verification (requires valid JWT)
- Bearer token validation
- Public endpoint confirmation (no auth required)
- Invalid/malformed token rejection
- User isolation in cart operations

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
- Multiple authentication states in single test suite
- Cross-endpoint authorization checks
- Cart operations with different auth states

---

## How to Run Tests

### Install dependencies:
```bash
pip install -r requirements.txt
```

### Run JWT tests (unit):
```bash
pytest tests/unit/test_jwt.py -v
```

### Run Auth endpoint tests (integration):
```bash
pytest tests/integration/test_auth.py -v
```

### Run Protected endpoint tests (integration):
```bash
pytest tests/integration/test_protected_endpoints.py -v
```

### Run all 42 tests together (for demo):
```bash
pytest tests/unit/test_jwt.py tests/integration/test_auth.py tests/integration/test_protected_endpoints.py -v
```

### Run specific test class:
```bash
pytest tests/unit/test_jwt.py::TestCreateAccessToken -v
pytest tests/integration/test_protected_endpoints.py::TestCartAuthorization -v
```

---

## Demo Script (2 minutes)

### Slide-based Demo:
1. **Open conftest.py** — explain `@pytest.fixture(scope='function')` for test DB isolation
2. **Show the yield pattern:** DB setup → yield client → teardown/rollback
3. **Open test_jwt.py** — highlight `freezegun.freeze_time()` for expiry test, then show advanced tampering tests
4. **Open test_protected_endpoints.py** — show authorization checks: no token → 401, valid token → 200
5. **Run:** `pytest tests/unit/test_jwt.py tests/integration/test_auth.py tests/integration/test_protected_endpoints.py -v --tb=short`
6. **Explain:** Comprehensive fixtures & mocking enable realistic tests for auth and authorization without hitting production database

### Focused Demo (if time is short):
1. **Setup:** `pip install -r requirements.txt`
2. **Show one unit test class:** `pytest tests/unit/test_jwt.py::TestTokenTamperingAdvanced -v`
3. **Show one integration test class:** `pytest tests/integration/test_protected_endpoints.py::TestCartAuthorization -v`
4. **Highlight:** Fixtures provide test isolation; mocking enables edge case testing; authorization checks prevent security breaches

## Submission Checklist

- ✅ `tests/conftest.py` — fixtures implemented (db_session, client, auth_headers, seeded_user)
- ✅ `tests/unit/test_jwt.py` — 14 tests implemented (8 core + 6 advanced tampering)
- ✅ `tests/integration/test_auth.py` — 15 tests implemented (8 core + 7 edge cases)
- ✅ `tests/integration/test_protected_endpoints.py` — 13 tests implemented (authorization checks)
- ✅ `pytest.ini` — configuration for .env.test
- ✅ `requirements.txt` — testing dependencies added
- ✅ All 42 tests passing
- ✅ `README_MEMBER2.md` — comprehensive documentation with all test details

*Note: Password security & schema validation tests (Member 1 scope) are intentionally excluded to avoid duplication.*
