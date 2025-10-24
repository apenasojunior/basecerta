-- ================================================================
-- Script: Criar Índices de Performance - Smart CNPJ
-- Issue: 2.1.4 e 2.1.5
-- Descrição: Índices para otimizar 7 tipos de busca + 8 filtros
-- Target: <500ms p95, <200ms busca direta por CNPJ
-- Schema: cnpj (CNPJ data) + public (support tables)
-- ================================================================

-- Habilitar extensão para busca textual performática
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================================
-- ANÁLISE: Índices JÁ EXISTENTES no schema cnpj
-- ================================================================
-- ✅ empresas_pkey - PRIMARY KEY (cnpj_basico)
-- ✅ idx_empresas_cnpj_basico - btree (cnpj_basico)
-- ✅ idx_empresas_razao - gin (to_tsvector razao_social) - Portuguese
-- ✅ idx_empresas_razao_social - btree (razao_social)
-- ✅ idx_empresas_capital_social - btree (capital_social)
-- ✅ idx_empresas_porte - btree (porte_empresa)
-- ✅ idx_empresas_natureza - btree (natureza_juridica)
--
-- ✅ estabelecimentos_pkey - PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv)
-- ✅ idx_estab_cnpj_completo - btree (cnpj_basico, cnpj_ordem, cnpj_dv)
-- ✅ idx_estab_cnae - btree (cnae_fiscal_principal)
-- ✅ idx_estab_municipio - btree (municipio)
-- ✅ idx_estab_uf - btree (uf)
-- ✅ idx_estab_situacao - btree (situacao_cadastral)
-- ✅ idx_estab_matriz_filial - btree (identificador_matriz_filial)
-- ✅ idx_estab_nome_fantasia - gin (to_tsvector nome_fantasia) - Portuguese
--
-- ✅ socios_pkey - PRIMARY KEY (id)
-- ✅ idx_socios_cnpj - btree (cnpj_basico)
-- ✅ idx_socios_cpf_cnpj - btree (cnpj_cpf_socio)
-- ✅ idx_socios_nome - gin (to_tsvector nome_socio) - Portuguese
-- ✅ idx_socios_tipo - btree (identificador_socio)
--
-- ✅ cnaes_pkey - PRIMARY KEY (codigo)
-- ================================================================

-- ================================================================
-- ÍNDICES FALTANTES (necessários para Smart CNPJ)
-- ================================================================

-- ❌ 1. Busca por Email (textual com ILIKE)
-- Índice GIN com pg_trgm para suportar ILIKE '%@gmail.com%'
CREATE INDEX IF NOT EXISTS idx_estab_email_gin 
ON cnpj.estabelecimentos USING gin (correio_eletronico gin_trgm_ops);

-- ❌ 2. Busca por Telefone (concatenado)
-- Para suportar busca tipo: (19) 91174491 → 1991174491
CREATE INDEX IF NOT EXISTS idx_estab_telefone_concat 
ON cnpj.estabelecimentos ((ddd_1 || telefone_1));

-- ❌ 3. Busca por CEP (exata)
CREATE INDEX IF NOT EXISTS idx_estab_cep 
ON cnpj.estabelecimentos (cep);

-- ❌ 4. Filtro: Data de Abertura (range queries)
CREATE INDEX IF NOT EXISTS idx_estab_data_atividade 
ON cnpj.estabelecimentos (data_inicio_atividade);

-- ================================================================
-- ÍNDICES COMPOSTOS (otimizar combinações frequentes de filtros)
-- ================================================================

-- ❌ 5. UF + Situação Cadastral (filtro comum: "empresas ativas em SP")
CREATE INDEX IF NOT EXISTS idx_estab_uf_situacao 
ON cnpj.estabelecimentos (uf, situacao_cadastral);

-- ❌ 6. Porte + Capital Social (filtro de tamanho: "grandes empresas com capital > 1M")
CREATE INDEX IF NOT EXISTS idx_empresas_porte_capital 
ON cnpj.empresas (porte_empresa, capital_social);

-- ❌ 7. Situação + Data Início (filtro temporal: "empresas ativas abertas em 2023")
CREATE INDEX IF NOT EXISTS idx_estab_situacao_data 
ON cnpj.estabelecimentos (situacao_cadastral, data_inicio_atividade);

-- ❌ 8. UF + Município + Situação (filtro geográfico detalhado)
CREATE INDEX IF NOT EXISTS idx_estab_uf_mun_sit 
ON cnpj.estabelecimentos (uf, municipio, situacao_cadastral);

-- ================================================================
-- ÍNDICES PARA CNAE SECUNDÁRIO (array de códigos em TEXT)
-- ================================================================

-- ❌ 9. GIN index para busca em cnae_fiscal_secundaria (formato: "1234567,2345678,3456789")
-- Suporta queries tipo: WHERE cnae_fiscal_secundaria LIKE '%1234567%'
CREATE INDEX IF NOT EXISTS idx_estab_cnae_secundaria_gin 
ON cnpj.estabelecimentos USING gin (cnae_fiscal_secundaria gin_trgm_ops);

-- ================================================================
-- ÍNDICES AUXILIARES (melhorar JOINs)
-- ================================================================

-- ❌ 10. Natureza Jurídica (JOIN frequente com empresas)
CREATE INDEX IF NOT EXISTS idx_naturezas_codigo 
ON cnpj.naturezas_juridicas (codigo);

-- ❌ 11. Municípios (JOIN frequente com estabelecimentos)
CREATE INDEX IF NOT EXISTS idx_municipios_codigo 
ON cnpj.municipios (codigo);

-- ❌ 12. Qualificações Sócios (JOIN com socios)
CREATE INDEX IF NOT EXISTS idx_qualificacoes_codigo 
ON cnpj.qualificacoes_socios (codigo);

-- ================================================================
-- OTIMIZAÇÕES EXTRAS
-- ================================================================

-- ❌ 13. Índice parcial: apenas matrizes ativas (otimizar 90% das queries)
CREATE INDEX IF NOT EXISTS idx_estab_matriz_ativa 
ON cnpj.estabelecimentos (cnpj_basico) 
WHERE identificador_matriz_filial = '1' AND situacao_cadastral = '02';

-- ❌ 14. Índice para nome fantasia NULL (empresas sem nome fantasia)
CREATE INDEX IF NOT EXISTS idx_estab_sem_nome_fantasia 
ON cnpj.estabelecimentos (cnpj_basico) 
WHERE nome_fantasia IS NULL;

-- ================================================================
-- VACUUM ANALYZE (atualizar estatísticas do query planner)
-- ================================================================

ANALYZE cnpj.empresas;
ANALYZE cnpj.estabelecimentos;
ANALYZE cnpj.socios;
ANALYZE cnpj.cnaes;
ANALYZE cnpj.naturezas_juridicas;
ANALYZE cnpj.municipios;
ANALYZE cnpj.qualificacoes_socios;

-- ================================================================
-- VERIFICAR ÍNDICES CRIADOS
-- ================================================================

-- Listar todos os índices no schema cnpj
-- SELECT schemaname, tablename, indexname, indexdef 
-- FROM pg_indexes 
-- WHERE schemaname = 'cnpj' 
-- ORDER BY tablename, indexname;

-- Verificar tamanho dos índices
-- SELECT schemaname, tablename, indexname, 
--        pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'cnpj'
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- ================================================================
-- PERFORMANCE TIPS
-- ================================================================
-- 1. Extension pg_trgm é ESSENCIAL para ILIKE performático
-- 2. Índices GIN (to_tsvector) JÁ existem para português
-- 3. Índices compostos devem seguir ordem: mais restritivo → menos restritivo
-- 4. Índices parciais (WHERE ...) economizam espaço e aumentam velocidade
-- 5. ANALYZE após criar índices para atualizar estatísticas
-- 6. Use EXPLAIN ANALYZE para validar uso dos índices
-- ================================================================

-- ================================================================
-- FIM DO SCRIPT - Issue 2.1.4/2.1.5
-- ================================================================
