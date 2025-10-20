"""
Credit Package API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import credit as credit_crud
from app.schemas.credit import CreditPackageCreate, CreditPackageUpdate, CreditPackageResponse

router = APIRouter()


@router.get("/", response_model=List[CreditPackageResponse])
def list_packages(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """List all credit packages"""
    packages = credit_crud.get_packages(db, skip=skip, limit=limit, is_active=is_active)
    return packages


@router.get("/{package_id}", response_model=CreditPackageResponse)
def read_package(package_id: int, db: Session = Depends(get_db)):
    """Get credit package by ID"""
    package = credit_crud.get_package(db, package_id=package_id)
    if package is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    return package


@router.post("/", response_model=CreditPackageResponse, status_code=status.HTTP_201_CREATED)
def create_package(package: CreditPackageCreate, db: Session = Depends(get_db)):
    """Create new credit package"""
    return credit_crud.create_package(db=db, package=package)


@router.put("/{package_id}", response_model=CreditPackageResponse)
def update_package(
    package_id: int,
    package: CreditPackageUpdate,
    db: Session = Depends(get_db)
):
    """Update credit package"""
    db_package = credit_crud.update_package(db, package_id=package_id, package_update=package)
    if db_package is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    return db_package
