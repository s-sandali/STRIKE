"""Unit tests for Pydantic schema validation behavior."""

from decimal import Decimal

import pytest
from pydantic import ValidationError

from app.schemas.cart import CartItemAdd
from app.schemas.product import ProductCreate
from app.schemas.user import UserCreate


@pytest.fixture
def valid_product_payload() -> dict:
    """Return a baseline valid product payload used across schema tests."""
    return {
        "name": "Classic Runner",
        "price": Decimal("149.99"),
        "description": "Everyday comfort shoe",
        "image_url": "https://example.com/shoe.jpg",
    }


@pytest.mark.parametrize(
    "price,should_be_valid",
    [
        (Decimal("0"), False),
        (Decimal("-10"), False),
        (Decimal("0.01"), True),
        (Decimal("999.99"), True),
    ],
)
def test_product_price_validation(valid_product_payload: dict, price: Decimal, should_be_valid: bool):
    payload = {**valid_product_payload, "price": price}

    if should_be_valid:
        product = ProductCreate(**payload)
        assert product.price == price
    else:
        with pytest.raises(ValidationError):
            ProductCreate(**payload)


@pytest.mark.parametrize(
    "payload,should_be_valid",
    [
        ({"name": "Core Sneaker", "price": Decimal("50.00")}, True),
        ({"price": Decimal("50.00")}, False),
        ({"name": "Core Sneaker"}, False),
    ],
)
def test_product_required_fields(payload: dict, should_be_valid: bool):
    if should_be_valid:
        product = ProductCreate(**payload)
        assert product.name == "Core Sneaker"
        assert product.price == Decimal("50.00")
    else:
        with pytest.raises(ValidationError):
            ProductCreate(**payload)


@pytest.mark.parametrize(
    "quantity,should_be_valid",
    [
        (0, False),
        (-1, False),
        (1, True),
        (100, True),
    ],
)
def test_cart_quantity_validation(quantity: int, should_be_valid: bool):
    payload = {"product_id": 1, "quantity": quantity}

    if should_be_valid:
        cart_item = CartItemAdd(**payload)
        assert cart_item.quantity == quantity
    else:
        with pytest.raises(ValidationError):
            CartItemAdd(**payload)


@pytest.mark.parametrize(
    "email,should_be_valid",
    [
        ("notanemail", False),
        ("@bad", False),
        ("a@b.com", True),
        ("x@y.co.uk", True),
    ],
)
def test_user_email_validation(email: str, should_be_valid: bool):
    payload = {"email": email, "password": "StrongPass123!"}

    if should_be_valid:
        user = UserCreate(**payload)
        assert user.email == email
    else:
        with pytest.raises(ValidationError):
            UserCreate(**payload)


def test_product_optional_fields(valid_product_payload: dict):
    payload_without_optional = {
        "name": valid_product_payload["name"],
        "price": valid_product_payload["price"],
    }

    product = ProductCreate(**payload_without_optional)
    assert product.name == valid_product_payload["name"]
    assert product.price == valid_product_payload["price"]
    assert product.description is None
    assert product.image_url is None


def test_product_create_valid_complete(valid_product_payload: dict):
    product = ProductCreate(**valid_product_payload)

    assert product.name == "Classic Runner"
    assert product.price == Decimal("149.99")
    assert product.description == "Everyday comfort shoe"
    assert product.image_url == "https://example.com/shoe.jpg"


@pytest.mark.parametrize("quantity", [1, 5, 50])
def test_cart_valid_quantity(quantity: int):
    cart_item = CartItemAdd(product_id=42, quantity=quantity)
    assert cart_item.quantity == quantity


@pytest.mark.parametrize(
    "email",
    [
        "simple@example.com",
        "user.name+tag@example.com",
        "first_last@sub.domain.org",
        "capsLOCK@EXAMPLE.io",
    ],
)
def test_user_valid_email_variants(email: str):
    user = UserCreate(email=email, password="ValidPass123!")
    # EmailStr may normalize domain casing; compare semantically.
    assert str(user.email).lower() == email.lower()
