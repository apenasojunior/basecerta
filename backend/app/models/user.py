"""
User Model
Basic user model (authentication will be added in Sprint 11)
"""
from sqlalchemy import Column, String, Boolean, Integer
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class User(BaseModel):
    """User model"""
    
    __tablename__ = "users"
    
    # Basic info
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    credits = relationship("UserCredits", back_populates="user", uselist=False)
    transactions = relationship("CreditTransaction", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
