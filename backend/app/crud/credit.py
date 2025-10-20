"""
Credit System CRUD operations
Plans, Packages, Credits, Transactions
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.credit import (
    Plan, CreditPackage, UserCredits, CreditTransaction,
    TransactionType, PlanType
)
from app.schemas.credit import (
    PlanCreate, PlanUpdate,
    CreditPackageCreate, CreditPackageUpdate
)
from app.schemas.transaction import CreditTransactionCreate


# ==================== PLANS ====================

def get_plan(db: Session, plan_id: int) -> Optional[Plan]:
    """Get plan by ID"""
    return db.query(Plan).filter(Plan.id == plan_id).first()


def get_plan_by_type(db: Session, plan_type: PlanType) -> Optional[Plan]:
    """Get plan by type"""
    return db.query(Plan).filter(Plan.type == plan_type).first()


def get_plans(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = True
) -> List[Plan]:
    """Get list of plans"""
    query = db.query(Plan)
    
    if is_active is not None:
        query = query.filter(Plan.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()


def create_plan(db: Session, plan: PlanCreate) -> Plan:
    """Create new plan"""
    db_plan = Plan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def update_plan(db: Session, plan_id: int, plan_update: PlanUpdate) -> Optional[Plan]:
    """Update plan"""
    db_plan = get_plan(db, plan_id)
    if not db_plan:
        return None
    
    update_data = plan_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_plan, field, value)
    
    db.commit()
    db.refresh(db_plan)
    return db_plan


# ==================== CREDIT PACKAGES ====================

def get_package(db: Session, package_id: int) -> Optional[CreditPackage]:
    """Get credit package by ID"""
    return db.query(CreditPackage).filter(CreditPackage.id == package_id).first()


def get_packages(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = True
) -> List[CreditPackage]:
    """Get list of credit packages"""
    query = db.query(CreditPackage)
    
    if is_active is not None:
        query = query.filter(CreditPackage.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()


def create_package(db: Session, package: CreditPackageCreate) -> CreditPackage:
    """Create new credit package"""
    db_package = CreditPackage(**package.model_dump())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package


def update_package(
    db: Session,
    package_id: int,
    package_update: CreditPackageUpdate
) -> Optional[CreditPackage]:
    """Update credit package"""
    db_package = get_package(db, package_id)
    if not db_package:
        return None
    
    update_data = package_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_package, field, value)
    
    db.commit()
    db.refresh(db_package)
    return db_package


# ==================== USER CREDITS ====================

def get_user_credits(db: Session, user_id: int) -> Optional[UserCredits]:
    """Get user credits"""
    return db.query(UserCredits).filter(UserCredits.user_id == user_id).first()


def get_credit_balance(db: Session, user_id: int) -> int:
    """Get user credit balance"""
    user_credits = get_user_credits(db, user_id)
    return user_credits.balance if user_credits else 0


def add_credits(
    db: Session,
    user_id: int,
    amount: int,
    transaction_type: TransactionType,
    description: Optional[str] = None,
    plan_id: Optional[int] = None,
    package_id: Optional[int] = None
) -> UserCredits:
    """Add credits to user account"""
    user_credits = get_user_credits(db, user_id)
    
    if not user_credits:
        # Create if doesn't exist
        user_credits = UserCredits(user_id=user_id, balance=0)
        db.add(user_credits)
        db.flush()
    
    # Update balance
    user_credits.balance += amount
    user_credits.total_earned += amount
    
    # Create transaction
    transaction = CreditTransaction(
        user_id=user_id,
        type=transaction_type,
        amount=amount,
        balance_after=user_credits.balance,
        description=description,
        plan_id=plan_id,
        package_id=package_id
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(user_credits)
    return user_credits


def deduct_credits(
    db: Session,
    user_id: int,
    amount: int,
    description: Optional[str] = None
) -> Optional[UserCredits]:
    """Deduct credits from user account"""
    user_credits = get_user_credits(db, user_id)
    
    if not user_credits or user_credits.balance < amount:
        return None  # Insufficient credits
    
    # Update balance
    user_credits.balance -= amount
    user_credits.total_spent += amount
    
    # Create transaction
    transaction = CreditTransaction(
        user_id=user_id,
        type=TransactionType.RESEARCH,
        amount=-amount,  # Negative for debit
        balance_after=user_credits.balance,
        description=description
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(user_credits)
    return user_credits


# ==================== TRANSACTIONS ====================

def get_transactions(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 50
) -> List[CreditTransaction]:
    """Get user transaction history"""
    return (
        db.query(CreditTransaction)
        .filter(CreditTransaction.user_id == user_id)
        .order_by(desc(CreditTransaction.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_transaction_count(db: Session, user_id: int) -> int:
    """Get total transaction count for user"""
    return db.query(CreditTransaction).filter(CreditTransaction.user_id == user_id).count()


def create_transaction(
    db: Session,
    transaction: CreditTransactionCreate
) -> CreditTransaction:
    """Create credit transaction"""
    db_transaction = CreditTransaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
