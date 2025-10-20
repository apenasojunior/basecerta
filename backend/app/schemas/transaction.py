"""
CreditTransactionCreate schema for internal CRUD operations
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.credit import TransactionType


class CreditTransactionCreate(BaseModel):
    """Schema for creating a transaction"""
    user_id: int
    type: TransactionType
    amount: int
    balance_after: int
    description: Optional[str] = None
    plan_id: Optional[int] = None
    package_id: Optional[int] = None
