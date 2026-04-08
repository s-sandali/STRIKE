from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from app.database.session import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)

    # Relationships
    user = relationship("User", back_populates="orders")
