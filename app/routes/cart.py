from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartOut
from app.services.deps import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


def _get_or_create_cart(user: User, db: Session) -> Cart:
    """Return the user's cart, creating one if it doesn't exist yet."""
    if user.cart is None:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        return cart
    return user.cart


@router.get("/", response_model=CartOut)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the authenticated user's current cart."""
    cart = _get_or_create_cart(current_user, db)
    db.refresh(cart)
    return cart


@router.post("/items", response_model=CartOut, status_code=status.HTTP_201_CREATED)
def add_item(
    item_in: CartItemAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a product to the cart. If the product is already in the cart, increment quantity."""
    # Validate product exists
    product = db.get(Product, item_in.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {item_in.product_id} not found",
        )

    cart = _get_or_create_cart(current_user, db)

    # Check if the item already exists in the cart
    existing_item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == item_in.product_id)
        .first()
    )

    if existing_item:
        existing_item.quantity += item_in.quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity,
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return cart


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a cart item by its ID. Only items belonging to the current user's cart can be removed."""
    cart = _get_or_create_cart(current_user, db)

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    db.delete(item)
    db.commit()
    db.refresh(cart)
    return cart
