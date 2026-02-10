"""
Seed script for insights_history table
Generates 12 months of historical data for each insight
"""
import sys
from pathlib import Path
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
import random

# Add parent directory to path to import app modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from app.core.config import settings


def generate_history_for_insight(insight_key, base_total, base_percentual, base_valor, 
                                   taxa_crescimento, months=12):
    """Generate historical data points for an insight over N months"""
    history = []
    current_date = date.today()
    
    # Work backwards from today
    for i in range(months):
        ref_date = current_date - relativedelta(months=i)
        
        # Calculate values with some randomness and growth trend
        # Older months should have lower values if there's growth
        growth_factor = 1.0 - (taxa_crescimento / 100.0) * (i / months)
        
        # Add some realistic noise (±5%)
        noise = random.uniform(0.95, 1.05)
        
        total = int(base_total * growth_factor * noise)
        percentual = round(base_percentual * growth_factor * noise, 2)
        valor = round(base_valor * growth_factor * noise, 2) if base_valor else None
        
        # Calculate monthly and annual variation
        variacao_mensal = None
        variacao_anual = None
        
        if i < months - 1:  # Not the oldest point
            prev_total = int(base_total * (1.0 - (taxa_crescimento / 100.0) * ((i + 1) / months)) * random.uniform(0.95, 1.05))
            variacao_mensal = round(((total - prev_total) / prev_total) * 100, 2) if prev_total > 0 else 0.0
        
        if i < months - 12:  # Has data from 12 months ago
            year_ago_total = int(base_total * (1.0 - (taxa_crescimento / 100.0) * ((i + 12) / months)) * random.uniform(0.95, 1.05))
            variacao_anual = round(((total - year_ago_total) / year_ago_total) * 100, 2) if year_ago_total > 0 else 0.0
        
        history.append({
            'insight_key': insight_key,
            'data_referencia': ref_date,
            'total_empresas': total,
            'percentual': percentual,
            'valor_medio': valor,
            'variacao_mensal': variacao_mensal,
            'variacao_anual': variacao_anual
        })
    
    return history


def seed_insights_history():
    """Populate insights_history with 12 months of data for each insight"""
    
    engine = create_engine(settings.database_url)
    
    # First, get all insights from cache
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT insight_key, total_empresas, percentual, valor_medio, taxa_crescimento
            FROM insights_cache
            ORDER BY insight_key
        """))
        insights = result.fetchall()
        
        if not insights:
            print("⚠️  No insights found in insights_cache. Run seed_insights_cache.py first.")
            return
        
        # Clear existing history
        conn.execute(text("TRUNCATE TABLE insights_history RESTART IDENTITY CASCADE"))
        conn.commit()
        
        total_records = 0
        
        # Generate and insert history for each insight
        for insight in insights:
            insight_key, total_empresas, percentual, valor_medio, taxa_crescimento = insight
            
            history = generate_history_for_insight(
                insight_key=insight_key,
                base_total=total_empresas,
                base_percentual=percentual,
                base_valor=valor_medio if valor_medio else 0.0,
                taxa_crescimento=taxa_crescimento if taxa_crescimento else 15.0,
                months=12
            )
            
            # Insert each history point
            for point in history:
                sql = text("""
                    INSERT INTO insights_history (
                        insight_key, data_referencia, total_empresas, percentual,
                        valor_medio, variacao_mensal, variacao_anual
                    ) VALUES (
                        :insight_key, :data_referencia, :total_empresas, :percentual,
                        :valor_medio, :variacao_mensal, :variacao_anual
                    )
                """)
                conn.execute(sql, point)
            
            total_records += len(history)
            print(f"  ✓ Generated {len(history)} months for {insight_key}")
        
        conn.commit()
        print(f"\n✅ Successfully seeded {total_records} historical records")
        print(f"   - {len(insights)} insights × 12 months each")
        print(f"   - Date range: {date.today() - relativedelta(months=11)} to {date.today()}")


if __name__ == "__main__":
    seed_insights_history()
