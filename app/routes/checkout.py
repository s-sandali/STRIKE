from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.cart import Cart, CartItem
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderOut
from app.services.deps import get_current_user

router = APIRouter(prefix="/checkout", tags=["Checkout"])


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create an order from the authenticated user's cart.

    - Validates the cart is not empty.
    - Calculates the total from CartItem quantities × product prices.
    - Persists the order.
    - Clears all cart items afterwards.
    """
    cart: Cart | None = current_user.cart
    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot checkout with an empty cart",
        )

    # Calculate order total
    total: Decimal = sum(
        Decimal(str(item.product.price)) * item.quantity
        for item in cart.items
    )

    # Create the order
    order = Order(user_id=current_user.id, total=total)
    db.add(order)

    # Clear cart items (keep the cart shell for future use)
    for item in list(cart.items):
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order
