"""
Plan API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import credit as credit_crud
from app.schemas.credit import PlanCreate, PlanUpdate, PlanResponse

router = APIRouter()


@router.get("/", response_model=List[PlanResponse])
def list_plans(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """List all plans"""
    plans = credit_crud.get_plans(db, skip=skip, limit=limit, is_active=is_active)
    return plans


@router.get("/{plan_id}", response_model=PlanResponse)
def read_plan(plan_id: int, db: Session = Depends(get_db)):
    """Get plan by ID"""
    plan = credit_crud.get_plan(db, plan_id=plan_id)
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return plan


@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(plan: PlanCreate, db: Session = Depends(get_db)):
    """Create new plan"""
    return credit_crud.create_plan(db=db, plan=plan)


@router.put("/{plan_id}", response_model=PlanResponse)
def update_plan(plan_id: int, plan: PlanUpdate, db: Session = Depends(get_db)):
    """Update plan"""
    db_plan = credit_crud.update_plan(db, plan_id=plan_id, plan_update=plan)
    if db_plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return db_plan
