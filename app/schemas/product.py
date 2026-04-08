from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, field_validator


class ProductCreate(BaseModel):
    name: str
    price: Decimal
    old_price: Optional[Decimal] = None
    rating: Optional[Decimal] = None
    reviews_count: Optional[int] = 0
    description: Optional[str] = None
    material: Optional[str] = None
    product_type: Optional[str] = None
    heel_type: Optional[str] = None
    available_sizes: Optional[str] = None
    weight: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Price must be greater than zero")
        return v


class ProductOut(BaseModel):
    id: int
    name: str
    price: Decimal
    old_price: Optional[Decimal] = None
    rating: Optional[Decimal] = None
    reviews_count: Optional[int] = 0
    description: Optional[str] = None
    material: Optional[str] = None
    product_type: Optional[str] = None
    heel_type: Optional[str] = None
    available_sizes: Optional[str] = None
    weight: Optional[str] = None
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}
