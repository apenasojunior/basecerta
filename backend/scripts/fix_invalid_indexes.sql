-- ========================================
-- Script: Corrigir Índices Inválidos
-- Data: 09/12/2025
-- Descrição: Recriar índices marcados como INVALID no PostgreSQL
-- ========================================

-- DIAGNÓSTICO INICIAL
-- Verificar índices inválidos antes da correção
SELECT 
    i.relname as index_name, 
    indisvalid, 
    pg_size_pretty(pg_relation_size(i.oid)) as size
FROM pg_index idx 
JOIN pg_class i ON i.oid = idx.indexrelid 
JOIN pg_class t ON t.oid = idx.indrelid 
JOIN pg_namespace n ON n.oid = t.relnamespace 
WHERE n.nspname = 'cnpj' 
AND t.relname = 'estabelecimentos' 
AND indisvalid = false
ORDER BY i.relname;

-- ========================================
-- 1. ÍNDICE: Email GIN (Matriz Ativa)
-- ========================================
-- Maior índice (986 MB) - Trigram GIN para buscas ILIKE em emails
-- Tempo estimado: 15-20 minutos

\echo '🔄 Removendo índice inválido: idx_estab_matriz_ativa_email_gin'
DROP INDEX IF EXISTS cnpj.idx_estab_matriz_ativa_email_gin;

\echo '⏳ Criando índice: idx_estab_matriz_ativa_email_gin (pode levar 15-20min)...'
\timing on
CREATE INDEX idx_estab_matriz_ativa_email_gin 
ON cnpj.estabelecimentos 
USING GIN (correio_eletronico gin_trgm_ops)
WHERE identificador_matriz_filial = '1' 
AND situacao_cadastral = '02';
\timing off

\echo '✅ Índice Email GIN criado com sucesso!'

-- ========================================
-- 2. ÍNDICE: CNPJ Completo Concatenado
-- ========================================
-- Índice para busca rápida por CNPJ completo (14 dígitos)
-- Tempo estimado: 5-8 minutos

\echo '🔄 Removendo índice inválido: idx_estab_cnpj_completo_concat'
DROP INDEX IF EXISTS cnpj.idx_estab_cnpj_completo_concat;

\echo '⏳ Criando índice: idx_estab_cnpj_completo_concat (pode levar 5-8min)...'
\timing on
CREATE INDEX idx_estab_cnpj_completo_concat 
ON cnpj.estabelecimentos 
((cnpj_basico || cnpj_ordem || cnpj_dv));
\timing off

\echo '✅ Índice CNPJ Completo criado com sucesso!'

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
\echo '📊 Verificando índices após recriação...'

SELECT 
    i.relname as index_name, 
    CASE WHEN indisvalid THEN '✅ VÁLIDO' ELSE '❌ INVÁLIDO' END as status,
    pg_size_pretty(pg_relation_size(i.oid)) as size
FROM pg_index idx 
JOIN pg_class i ON i.oid = idx.indexrelid 
JOIN pg_class t ON t.oid = idx.indrelid 
JOIN pg_namespace n ON n.oid = t.relnamespace 
WHERE n.nspname = 'cnpj' 
AND t.relname = 'estabelecimentos' 
AND i.relname IN (
    'idx_estab_matriz_ativa_email_gin',
    'idx_estab_cnpj_completo_concat',
    'idx_estab_matriz_ativa_cep'
)
ORDER BY i.relname;

\echo '✅ Script de correção concluído!'
\echo ''
\echo '📝 PRÓXIMOS PASSOS:'
\echo '1. Validar performance das buscas Smart CNPJ'
\echo '2. Executar: python3 backend/scripts/test_all_search_types.py'
\echo '3. Comparar tempos de resposta com benchmarks anteriores'
