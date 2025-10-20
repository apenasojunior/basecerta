"""
Credit System Schemas
Pydantic schemas for Plans, Packages, Credits and Transactions
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class PlanTypeEnum(str, Enum):
    BASIC = "basic"
    SMART = "smart"
    PRO = "pro"
    EMPRESARIAL = "empresarial"


class TransactionTypeEnum(str, Enum):
    PURCHASE = "purchase"
    SUBSCRIPTION = "subscription"
    RESEARCH = "research"
    REFUND = "refund"
    ADMIN_ADJUSTMENT = "admin_adjustment"


# Plan Schemas
class PlanBase(BaseModel):
    """Base plan schema"""
    name: str = Field(..., max_length=100)
    type: PlanTypeEnum
    price: float = Field(..., ge=0)  # ge=0 allows free plans
    credits: int = Field(..., gt=0)
    description: Optional[str] = None
    is_active: bool = True


class PlanCreate(PlanBase):
    """Schema for creating a plan"""
    pass


class PlanUpdate(BaseModel):
    """Schema for updating a plan"""
    name: Optional[str] = Field(None, max_length=100)
    price: Optional[float] = Field(None, ge=0)  # ge=0 allows free plans
    credits: Optional[int] = Field(None, gt=0)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class PlanResponse(PlanBase):
    """Schema for plan response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Credit Package Schemas
class CreditPackageBase(BaseModel):
    """Base credit package schema"""
    name: str = Field(..., max_length=100)
    price: float = Field(..., gt=0)
    credits: int = Field(..., gt=0)
    basic_research_limit: Optional[int] = Field(None, ge=0)
    advanced_research_limit: Optional[int] = Field(None, ge=0)
    ultra_research_limit: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None
    is_active: bool = True


class CreditPackageCreate(CreditPackageBase):
    """Schema for creating a credit package"""
    pass


class CreditPackageUpdate(BaseModel):
    """Schema for updating a credit package"""
    name: Optional[str] = Field(None, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    credits: Optional[int] = Field(None, gt=0)
    basic_research_limit: Optional[int] = Field(None, ge=0)
    advanced_research_limit: Optional[int] = Field(None, ge=0)
    ultra_research_limit: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CreditPackageResponse(CreditPackageBase):
    """Schema for credit package response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# User Credits Schemas
class UserCreditsResponse(BaseModel):
    """Schema for user credits response"""
    user_id: int
    balance: int
    total_earned: int
    total_spent: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CreditBalanceResponse(BaseModel):
    """Simple credit balance response"""
    balance: int
    total_earned: int
    total_spent: int


# Credit Transaction Schemas
class CreditTransactionBase(BaseModel):
    """Base transaction schema"""
    type: TransactionTypeEnum
    amount: int
    description: Optional[str] = None


class CreditTransactionCreate(CreditTransactionBase):
    """Schema for creating a transaction"""
    user_id: int
    plan_id: Optional[int] = None
    package_id: Optional[int] = None


class CreditTransactionResponse(CreditTransactionBase):
    """Schema for transaction response"""
    id: int
    user_id: int
    balance_after: int
    plan_id: Optional[int] = None
    package_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class CreditHistoryResponse(BaseModel):
    """Credit history with pagination"""
    total: int
    page: int
    page_size: int
    transactions: List[CreditTransactionResponse]


# Add Credits Schema (Admin)
class AddCreditsRequest(BaseModel):
    """Schema for admin adding credits"""
    user_id: int = Field(..., gt=0)
    amount: int = Field(..., gt=0)
    description: Optional[str] = "Créditos adicionados pelo admin"
