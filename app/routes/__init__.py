from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.cart import router as cart_router
from app.routes.checkout import router as checkout_router

__all__ = ["auth_router", "products_router", "cart_router", "checkout_router"]
