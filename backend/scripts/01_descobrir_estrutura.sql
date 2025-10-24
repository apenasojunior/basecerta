-- ========================================
-- SCRIPT 1: DESCOBRIR ESTRUTURA DA TABELA CNPJ
-- ========================================
-- Objetivo: Descobrir o nome real e estrutura da tabela CNPJ
-- Execute no PostgreSQL: psql -U usuario -d basecerta -f 01_descobrir_estrutura.sql

\echo '========================================';
\echo 'DESCOBRINDO ESTRUTURA DA TABELA CNPJ';
\echo '========================================';
\echo '';

-- 1. Listar todas as tabelas no banco
\echo '1. TABELAS DISPONÍVEIS NO BANCO:';
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\echo '';
\echo '2. BUSCANDO TABELAS COM "CNPJ", "EMPRESA" OU "ESTABELECIMENTO":';
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND (
    tablename ILIKE '%cnpj%' OR
    tablename ILIKE '%empresa%' OR
    tablename ILIKE '%estabelecimento%'
  )
ORDER BY tablename;

\echo '';
\echo '3. CONTAGEM DE REGISTROS DAS TABELAS ENCONTRADAS:';
-- Execute manualmente para cada tabela encontrada:
-- SELECT COUNT(*) FROM nome_da_tabela;

\echo '';
\echo '========================================';
\echo 'APÓS IDENTIFICAR A TABELA CORRETA, EXECUTE:';
\echo '\d nome_da_tabela_cnpj';
\echo '\d+ nome_da_tabela_cnpj  -- Com índices e storage';
\echo 'SELECT * FROM nome_da_tabela_cnpj LIMIT 1;  -- Ver exemplo de dados';
\echo '========================================';
