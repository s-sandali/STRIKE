# E-Commerce API

A minimal, production-style e-commerce REST API built with **FastAPI**, **SQLAlchemy**, and **PostgreSQL**.

---

## Features

| Feature | Endpoint(s) |
|---|---|
| User Registration | `POST /auth/register` |
| User Login (JWT) | `POST /auth/login` |
| Products CRUD | `POST /products/`, `GET /products/`, `GET /products/{id}` |
| Cart Management | `GET /cart/`, `POST /cart/items`, `DELETE /cart/items/{id}` |
| Checkout | `POST /checkout/` |

---

## Project Structure

```
ASE project/
├── app/
│   ├── main.py               # FastAPI application factory
│   ├── config.py             # Pydantic settings (loads .env)
│   ├── database/
│   │   ├── __init__.py
│   │   └── session.py        # Engine, SessionLocal, Base, get_db
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py           # User ORM model
│   │   ├── product.py        # Product ORM model
│   │   ├── cart.py           # Cart & CartItem ORM models
│   │   └── order.py          # Order ORM model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py           # UserCreate, UserOut, Token, TokenData
│   │   ├── product.py        # ProductCreate, ProductOut
│   │   ├── cart.py           # CartItemAdd, CartItemOut, CartOut
│   │   └── order.py          # OrderOut
│   ├── services/
│   │   ├── __init__.py
│   │   ├── security.py       # bcrypt hashing / verification
│   │   ├── jwt.py            # JWT creation / decoding
│   │   └── deps.py           # get_current_user dependency
│   └── routes/
│       ├── __init__.py
│       ├── auth.py           # /auth/register, /auth/login
│       ├── products.py       # /products/
│       ├── cart.py           # /cart/
│       └── checkout.py       # /checkout/
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
├── alembic.ini
├── requirements.txt
├── .env.example
└── .gitignore
```

---

## Quickstart

### 1. Prerequisites

- Python 3.11+
- PostgreSQL running locally (or via Docker)

### 2. Clone & install dependencies

```bash
# create and activate a virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS / Linux

pip install -r requirements.txt
```

### 3. Configure environment

```bash
copy .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/ecommerce_db
SECRET_KEY=change-this-to-a-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Create the database

```bash
# Using psql:
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### 5. Run the server

```bash
uvicorn app.main:app --reload
```

The API will be available at **http://127.0.0.1:8000**  
Interactive docs: **http://127.0.0.1:8000/docs**

---

## Using Alembic (optional, recommended for production)

```bash
# Generate initial migration
alembic revision --autogenerate -m "initial schema"

# Apply migrations
alembic upgrade head
```

> **Note:** Without Alembic, `Base.metadata.create_all()` in `main.py` auto-creates tables on startup — handy for development.

---

## API Usage Examples

### Register

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -d "username=user@example.com&password=secret123"
```

### Add a product (authenticated)

```bash
TOKEN="<access_token_from_login>"

curl -X POST http://localhost:8000/products/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Wireless Mouse", "price": 29.99}'
```

### Add item to cart

```bash
curl -X POST http://localhost:8000/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

### Checkout

```bash
curl -X POST http://localhost:8000/checkout/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## Security Notes

- All passwords are hashed with **bcrypt** via `passlib`.
- JWTs are signed with **HS256**. Change `SECRET_KEY` before deploying.
- Tighten `allow_origins` in CORS settings for production.
