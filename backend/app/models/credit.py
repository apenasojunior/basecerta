"""
Credit System Models
Plans, Packages, UserCredits and Transactions
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class PlanType(str, enum.Enum):
    """Plan types"""
    BASIC = "basic"
    SMART = "smart"
    PRO = "pro"
    EMPRESARIAL = "empresarial"


class Plan(BaseModel):
    """Subscription plans"""
    
    __tablename__ = "plans"
    
    name = Column(String(100), nullable=False)  # Basic, Smart, Pro, Empresarial
    type = Column(Enum(PlanType), nullable=False, unique=True)
    price = Column(Float, nullable=False)  # Monthly price in BRL
    credits = Column(Integer, nullable=False)  # Credits included per month
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Plan(id={self.id}, name={self.name}, price=R${self.price})>"


class CreditPackage(BaseModel):
    """Credit packages for purchase"""
    
    __tablename__ = "credit_packages"
    
    name = Column(String(100), nullable=False)  # Ex: "Pacote 200", "Pacote 450"
    price = Column(Float, nullable=False)  # Price in BRL
    credits = Column(Integer, nullable=False)  # Total credits
    
    # Limits per research type
    basic_research_limit = Column(Integer, nullable=True)  # Pesquisas básicas
    advanced_research_limit = Column(Integer, nullable=True)  # Pesquisas avançadas
    ultra_research_limit = Column(Integer, nullable=True)  # Pesquisas ultra
    
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<CreditPackage(id={self.id}, name={self.name}, credits={self.credits})>"


class UserCredits(BaseModel):
    """User credit balance"""
    
    __tablename__ = "user_credits"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Integer, default=0, nullable=False)  # Current credit balance
    total_earned = Column(Integer, default=0, nullable=False)  # Total credits earned
    total_spent = Column(Integer, default=0, nullable=False)  # Total credits spent
    
    # Relationships
    user = relationship("User", back_populates="credits")
    
    def __repr__(self):
        return f"<UserCredits(user_id={self.user_id}, balance={self.balance})>"


class TransactionType(str, enum.Enum):
    """Transaction types"""
    PURCHASE = "purchase"  # Compra de créditos
    SUBSCRIPTION = "subscription"  # Créditos de assinatura
    RESEARCH = "research"  # Consumo em pesquisa
    REFUND = "refund"  # Reembolso
    ADMIN_ADJUSTMENT = "admin_adjustment"  # Ajuste manual


class CreditTransaction(BaseModel):
    """Credit transaction history"""
    
    __tablename__ = "credit_transactions"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Integer, nullable=False)  # Positive for credit, negative for debit
    balance_after = Column(Integer, nullable=False)  # Balance after transaction
    description = Column(Text, nullable=True)
    
    # References
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)
    package_id = Column(Integer, ForeignKey("credit_packages.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    plan = relationship("Plan")
    package = relationship("CreditPackage")
    
    def __repr__(self):
        return f"<CreditTransaction(id={self.id}, user_id={self.user_id}, amount={self.amount})>"
