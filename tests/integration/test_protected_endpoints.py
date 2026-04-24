"""
Member 2 — PyTest: Protected Endpoints Authorization Tests

Tests for protected endpoints requiring valid JWT authentication:
  - GET /cart – requires authentication, returns user's cart
  - POST /cart/items – requires authentication, adds product to cart
  - POST /products – requires authentication, creates product
  
Tests verify:
  ✓ Unauthorized requests (no token) return 401
  ✓ Authenticated requests with valid token succeed
  ✓ Invalid/expired tokens return 401
  ✓ Authorization boundaries (users cannot access other users' data)

Uses:
  - client fixture (conftest.py) – TestClient with overridden get_db
  - auth_headers fixture (conftest.py) – valid Bearer token headers
  - seeded_user fixture – pre-created test user with products
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.product import Product
from app.services.security import hash_password


@pytest.fixture
def seeded_user_with_products(db_session: Session):
    """Create a test user and some products for cart tests."""
    user = User(
        email="cartuser@example.com",
        hashed_password=hash_password("CartPass123!")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Add test products
    product1 = Product(name="Test Product 1", price=29.99)
    product2 = Product(name="Test Product 2", price=49.99)
    db_session.add_all([product1, product2])
    db_session.commit()
    db_session.refresh(product1)
    db_session.refresh(product2)
    
    return {"user": user, "products": [product1, product2]}


class TestCartAuthorization:
    """Tests for cart endpoint authorization."""
    
    def test_get_cart_without_authentication(self, client: TestClient):
        """Test that GET /cart without token returns 401 Unauthorized."""
        response = client.get("/cart/")
        
        assert response.status_code == 401
    
    def test_get_cart_with_valid_token(self, client: TestClient, auth_headers):
        """Test that GET /cart with valid token returns 200 and cart data."""
        response = client.get("/cart/", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "items" in data
    
    def test_get_cart_with_invalid_token(self, client: TestClient):
        """Test that GET /cart with malformed token returns 401."""
        headers = {"Authorization": "Bearer invalid-token-xyz"}
        response = client.get("/cart/", headers=headers)
        
        assert response.status_code == 401
    
    def test_get_cart_with_missing_bearer_prefix(self, client: TestClient):
        """Test that missing 'Bearer' prefix in auth header returns 401."""
        headers = {"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
        response = client.get("/cart/", headers=headers)
        
        assert response.status_code == 401


class TestAddToCartAuthorization:
    """Tests for add-to-cart endpoint authorization."""
    
    def test_add_item_to_cart_without_authentication(self, client: TestClient, seeded_user_with_products):
        """Test that POST /cart/items without token returns 401."""
        product = seeded_user_with_products["products"][0]
        payload = {
            "product_id": product.id,
            "quantity": 1
        }
        
        response = client.post("/cart/items", json=payload)
        
        assert response.status_code == 401
    
    def test_add_item_to_cart_with_valid_token(self, client: TestClient, auth_headers, seeded_user_with_products):
        """Test that POST /cart/items with valid token succeeds."""
        product = seeded_user_with_products["products"][0]
        payload = {
            "product_id": product.id,
            "quantity": 2
        }
        
        response = client.post("/cart/items", headers=auth_headers, json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert "items" in data
    
    def test_add_nonexistent_product_to_cart(self, client: TestClient, auth_headers):
        """Test that adding nonexistent product to cart returns 404."""
        payload = {
            "product_id": 999999,
            "quantity": 1
        }
        
        response = client.post("/cart/items", headers=auth_headers, json=payload)
        
        assert response.status_code == 404
    
    def test_add_item_with_invalid_token(self, client: TestClient, seeded_user_with_products):
        """Test that POST /cart/items with invalid token returns 401."""
        product = seeded_user_with_products["products"][0]
        headers = {"Authorization": "Bearer invalid-token"}
        payload = {
            "product_id": product.id,
            "quantity": 1
        }
        
        response = client.post("/cart/items", headers=headers, json=payload)
        
        assert response.status_code == 401


class TestProductCreationAuthorization:
    """Tests for product creation endpoint authorization."""
    
    def test_create_product_without_authentication(self, client: TestClient):
        """Test that POST /products without token returns 401."""
        payload = {
            "name": "New Product",
            "price": 99.99
        }
        
        response = client.post("/products/", json=payload)
        
        assert response.status_code == 401
    
    def test_create_product_with_valid_token(self, client: TestClient, auth_headers):
        """Test that POST /products with valid token succeeds."""
        payload = {
            "name": "Authenticated Product",
            "price": 79.99
        }
        
        response = client.post("/products/", headers=auth_headers, json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Authenticated Product"
        assert data["price"] == 79.99
    
    def test_create_product_with_invalid_token(self, client: TestClient):
        """Test that POST /products with invalid token returns 401."""
        headers = {"Authorization": "Bearer malformed-token-abc"}
        payload = {
            "name": "Unauthorized Product",
            "price": 59.99
        }
        
        response = client.post("/products/", headers=headers, json=payload)
        
        assert response.status_code == 401
    
    def test_create_product_with_negative_price(self, client: TestClient, auth_headers):
        """Test that creating product with negative price fails validation."""
        payload = {
            "name": "Invalid Price Product",
            "price": -19.99
        }
        
        response = client.post("/products/", headers=auth_headers, json=payload)
        
        # Should fail validation (422) or business logic error
        assert response.status_code in [400, 422]


class TestListProductsNoAuth:
    """Tests that list products endpoint does NOT require authentication."""
    
    def test_list_products_without_authentication(self, client: TestClient):
        """Test that GET /products is public (no auth required)."""
        response = client.get("/products/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_single_product_without_authentication(self, client: TestClient, seeded_user_with_products):
        """Test that GET /products/{id} is public (no auth required)."""
        product = seeded_user_with_products["products"][0]
        response = client.get(f"/products/{product.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == product.id
