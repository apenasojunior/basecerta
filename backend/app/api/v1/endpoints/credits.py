"""
Credits API endpoints
User credit balance, transactions, and operations
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import credit as credit_crud
from app.schemas.credit import (
    UserCreditsResponse,
    CreditTransactionResponse,
    AddCreditsRequest
)
from app.models.credit import TransactionType

router = APIRouter()


@router.get("/{user_id}/balance", response_model=UserCreditsResponse)
def get_balance(user_id: int, db: Session = Depends(get_db)):
    """Get user credit balance"""
    user_credits = credit_crud.get_user_credits(db, user_id=user_id)
    if user_credits is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User credits not found"
        )
    return user_credits


@router.get("/{user_id}/history", response_model=List[CreditTransactionResponse])
def get_history(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get user credit transaction history"""
    transactions = credit_crud.get_transactions(db, user_id=user_id, skip=skip, limit=limit)
    return transactions


@router.post("/{user_id}/add", response_model=UserCreditsResponse)
def add_credits(
    user_id: int,
    request: AddCreditsRequest,
    db: Session = Depends(get_db)
):
    """Add credits to user account"""
    # Validate plan if provided
    if request.plan_id:
        plan = credit_crud.get_plan(db, plan_id=request.plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
    
    # Validate package if provided
    if request.package_id:
        package = credit_crud.get_package(db, package_id=request.package_id)
        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Package not found"
            )
    
    # Add credits
    user_credits = credit_crud.add_credits(
        db=db,
        user_id=user_id,
        amount=request.amount,
        transaction_type=request.transaction_type,
        description=request.description,
        plan_id=request.plan_id,
        package_id=request.package_id
    )
    
    return user_credits


@router.post("/{user_id}/deduct")
def deduct_credits(
    user_id: int,
    amount: int,
    description: str = None,
    db: Session = Depends(get_db)
):
    """Deduct credits from user account"""
    user_credits = credit_crud.deduct_credits(
        db=db,
        user_id=user_id,
        amount=amount,
        description=description
    )
    
    if user_credits is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient credits"
        )
    
    return {
        "message": "Credits deducted successfully",
        "balance": user_credits.balance
    }
