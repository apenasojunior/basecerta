"""
Seed initial data for credit system
Plans, Credit Packages, and test user
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.credit import Plan, CreditPackage, PlanType
from app.utils.logger import logger


def seed_plans(db: Session):
    """Seed subscription plans"""
    logger.info("🌱 Seeding plans...")
    
    plans_data = [
        {
            "name": "Basic",
            "type": PlanType.BASIC,
            "price": 0.0,
            "credits": 10,
            "description": "Plano gratuito com 10 consultas/mês"
        },
        {
            "name": "Smart",
            "type": PlanType.SMART,
            "price": 99.90,
            "credits": 100,
            "description": "100 consultas/mês + suporte prioritário"
        },
        {
            "name": "Pro",
            "type": PlanType.PRO,
            "price": 299.90,
            "credits": 500,
            "description": "500 consultas/mês + API access + relatórios"
        },
        {
            "name": "Empresarial",
            "type": PlanType.EMPRESARIAL,
            "price": 999.90,
            "credits": 2000,
            "description": "2000 consultas/mês + múltiplos usuários + suporte dedicado"
        }
    ]
    
    for plan_data in plans_data:
        existing = db.query(Plan).filter(Plan.type == plan_data["type"]).first()
        if not existing:
            plan = Plan(**plan_data)
            db.add(plan)
            logger.info(f"  ✅ Created plan: {plan_data['name']}")
        else:
            logger.info(f"  ⏭️  Plan {plan_data['name']} already exists")
    
    db.commit()


def seed_packages(db: Session):
    """Seed credit packages (pay-as-you-go)"""
    logger.info("🌱 Seeding credit packages...")
    
    packages_data = [
        {
            "name": "Pacote Starter",
            "credits": 50,
            "price": 49.90,
            "description": "50 créditos avulsos",
            "basic_research_limit": 50,
            "advanced_research_limit": 25,
            "ultra_research_limit": 10
        },
        {
            "name": "Pacote Growth",
            "credits": 150,
            "price": 129.90,
            "description": "150 créditos (10% desconto)",
            "basic_research_limit": 150,
            "advanced_research_limit": 75,
            "ultra_research_limit": 30
        },
        {
            "name": "Pacote Business",
            "credits": 300,
            "price": 239.90,
            "description": "300 créditos (15% desconto)",
            "basic_research_limit": 300,
            "advanced_research_limit": 150,
            "ultra_research_limit": 60
        },
        {
            "name": "Pacote Enterprise",
            "credits": 1000,
            "price": 699.90,
            "description": "1000 créditos (25% desconto)",
            "basic_research_limit": 1000,
            "advanced_research_limit": 500,
            "ultra_research_limit": 200
        }
    ]
    
    for package_data in packages_data:
        existing = db.query(CreditPackage).filter(
            CreditPackage.name == package_data["name"]
        ).first()
        if not existing:
            package = CreditPackage(**package_data)
            db.add(package)
            logger.info(f"  ✅ Created package: {package_data['name']}")
        else:
            logger.info(f"  ⏭️  Package {package_data['name']} already exists")
    
    db.commit()


def seed_test_user(db: Session):
    """Create a test user"""
    logger.info("🌱 Seeding test user...")
    
    test_email = "test@basecerta.com.br"
    existing = db.query(User).filter(User.email == test_email).first()
    
    if not existing:
        user = User(
            email=test_email,
            full_name="Usuário Teste",
            is_active=True
        )
        db.add(user)
        db.commit()
        logger.info(f"  ✅ Created test user: {test_email}")
    else:
        logger.info(f"  ⏭️  Test user already exists")


def main():
    """Main seed function"""
    logger.info("🚀 Starting database seed...")
    
    db = SessionLocal()
    try:
        seed_plans(db)
        seed_packages(db)
        seed_test_user(db)
        
        logger.info("✅ Database seeding completed successfully!")
        
        # Show summary
        plans_count = db.query(Plan).count()
        packages_count = db.query(CreditPackage).count()
        users_count = db.query(User).count()
        
        logger.info(f"\n📊 Summary:")
        logger.info(f"  Plans: {plans_count}")
        logger.info(f"  Packages: {packages_count}")
        logger.info(f"  Users: {users_count}")
        
    except Exception as e:
        logger.error(f"❌ Error seeding database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
