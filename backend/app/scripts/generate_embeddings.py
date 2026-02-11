"""
Script para gerar embeddings vetoriais dos insights
Usa sentence-transformers (paraphrase-multilingual-mpnet-base-v2)
Modelo otimizado para português e similaridade semântica
"""
import sys
from pathlib import Path
from datetime import datetime
import hashlib
import time

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine, text
from app.core.config import settings

# Imports condicionais para sentence-transformers
try:
    from sentence_transformers import SentenceTransformer
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("⚠️  sentence-transformers não instalado")
    print("📦 Execute: pip install sentence-transformers")


def generate_embeddings():
    """Generate embeddings for all insights in insights_cache"""
    
    if not TRANSFORMERS_AVAILABLE:
        print("❌ sentence-transformers não disponível. Abortando.")
        return
    
    print("🔄 Carregando modelo sentence-transformers...")
    print("   Modelo: paraphrase-multilingual-mpnet-base-v2")
    print("   Dimensões: 768")
    print("   Otimizado para: português, similaridade semântica\n")
    
    # Load model (will download on first run - ~420MB)
    model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-mpnet-base-v2')
    
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Get all insights from insights_cache
        result = conn.execute(text("""
            SELECT 
                insight_key,
                titulo as title,
                descricao as description
            FROM insights_cache
            ORDER BY insight_key
        """))
        
        insights = list(result)
        total = len(insights)
        
        if total == 0:
            print("⚠️  Nenhum insight encontrado em insights_cache")
            return
        
        print(f"📊 {total} insights encontrados\n")
        
        # Clear existing embeddings
        conn.execute(text("DELETE FROM insights_embeddings"))
        conn.commit()
        
        success_count = 0
        error_count = 0
        total_time = 0
        
        for idx, insight in enumerate(insights, 1):
            try:
                # Combine title and description for richer embedding
                content = f"{insight.title}\n\n{insight.description}"
                
                # Generate content hash for change detection
                content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()
                
                # Generate embedding
                start_time = time.time()
                embedding = model.encode(content, convert_to_numpy=True)
                generation_time_ms = int((time.time() - start_time) * 1000)
                total_time += generation_time_ms
                
                # Convert numpy array to list for PostgreSQL
                embedding_list = embedding.tolist()
                
                # Format as PostgreSQL array string
                embedding_str = '[' + ','.join(map(str, embedding_list)) + ']'
                
                # Escape single quotes in strings for SQL
                title_escaped = insight.title.replace("'", "''")
                description_escaped = insight.description.replace("'", "''")
                
                # Insert into database using f-string to avoid parameter binding issues with ::vector cast
                conn.execute(text(f"""
                    INSERT INTO insights_embeddings (
                        insight_key, title, description, content_hash,
                        embedding, model_name, model_version, embedding_dimensions,
                        generation_method, generation_time_ms,
                        created_at, updated_at
                    ) VALUES (
                        '{insight.insight_key}',
                        '{title_escaped}',
                        '{description_escaped}',
                        '{content_hash}',
                        '{embedding_str}'::vector,
                        'sentence-transformers/paraphrase-multilingual-mpnet-base-v2',
                        'latest',
                        {len(embedding_list)},
                        'local',
                        {generation_time_ms},
                        NOW(),
                        NOW()
                    )
                """))
                
                success_count += 1
                print(f"✅ [{idx}/{total}] {insight.insight_key[:30]:30} | {generation_time_ms:4}ms | {len(embedding_list)} dims")
                
            except Exception as e:
                error_count += 1
                print(f"❌ [{idx}/{total}] {insight.insight_key[:30]:30} | ERRO: {str(e)[:50]}")
        
        conn.commit()
        
        # Summary
        avg_time = total_time / success_count if success_count > 0 else 0
        print(f"\n{'='*80}")
        print(f"✅ {success_count}/{total} embeddings gerados com sucesso")
        if error_count > 0:
            print(f"❌ {error_count} erros")
        print(f"⏱️  Tempo total: {total_time/1000:.2f}s")
        print(f"⏱️  Tempo médio: {avg_time:.0f}ms por embedding")
        print(f"📦 Modelo: paraphrase-multilingual-mpnet-base-v2")
        print(f"📊 Dimensões: 768")
        print(f"{'='*80}\n")
        
        # Test similarity search
        if success_count > 0:
            print("🔍 Testando busca por similaridade...\n")
            
            # Test query
            test_query = "empresas de tecnologia que mais crescem"
            query_embedding = model.encode(test_query, convert_to_numpy=True).tolist()
            
            # Format as PostgreSQL array string
            query_embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'
            
            # Use f-string to avoid parameter binding issues
            result = conn.execute(text(f"""
                SELECT 
                    insight_key,
                    title,
                    1 - (embedding <=> '{query_embedding_str}'::vector) as similarity
                FROM insights_embeddings
                ORDER BY embedding <=> '{query_embedding_str}'::vector
                LIMIT 3
            """))
            
            print(f"Query: '{test_query}'\n")
            print("Top 3 resultados mais similares:")
            for row in result:
                print(f"  • {row.title[:60]:60} | Similaridade: {row.similarity:.3f}")
            
            print(f"\n✅ Sistema de busca vetorial FUNCIONAL!")
        else:
            print("\n⚠️  Nenhum embedding gerado, teste de busca ignorado.")


if __name__ == "__main__":
    generate_embeddings()
