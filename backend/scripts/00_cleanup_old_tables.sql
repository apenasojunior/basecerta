-- ================================================================
-- Script: Remover Tabelas Antigas e Desnecessárias
-- Issue: 2.1.0 - Cleanup
-- Descrição: Remove tabelas do schema public que duplicavam dados
--            do schema cnpj. Essas tabelas foram criadas em uma
--            tentativa anterior e não são mais necessárias.
-- ================================================================

-- ATENÇÃO: Este script DROP tabelas! Fazer backup antes se houver dados importantes.
-- Execute com cuidado!

\echo '============================================';
\echo 'CLEANUP: Removendo tabelas antigas';
\echo '============================================';
\echo '';

-- ================================================================
-- REMOVER TABELAS DE DUPLICAÇÃO DO SCHEMA CNPJ
-- ================================================================

-- Estas tabelas duplicavam os dados do schema cnpj no schema public
-- Agora usamos DIRETAMENTE o schema cnpj, então essas tabelas são redundantes

\echo '1. Removendo tabela redes_sociais_empresa...';
DROP TABLE IF EXISTS public.redes_sociais_empresa CASCADE;

\echo '2. Removendo tabela historico_dividas_empresa...';
DROP TABLE IF EXISTS public.historico_dividas_empresa CASCADE;

\echo '3. Removendo tabela socio_empresa...';
DROP TABLE IF EXISTS public.socio_empresa CASCADE;

\echo '4. Removendo tabela cnae_empresa...';
DROP TABLE IF EXISTS public.cnae_empresa CASCADE;

\echo '5. Removendo tabela endereco_empresa...';
DROP TABLE IF EXISTS public.endereco_empresa CASCADE;

\echo '6. Removendo tabela pessoa_juridica (principal duplicação)...';
DROP TABLE IF EXISTS public.pessoa_juridica CASCADE;

\echo '';
\echo '✅ Tabelas antigas removidas com sucesso!';
\echo '';

-- ================================================================
-- VERIFICAR TABELAS RESTANTES
-- ================================================================

\echo 'Tabelas restantes no schema public:';
\echo '';
\dt public.*;

-- ================================================================
-- RESULTADO ESPERADO
-- ================================================================
-- Devem PERMANECER apenas:
-- ✅ alembic_version           - Controle de migrações
-- ✅ users                      - Usuários do sistema
-- ✅ user_credits              - Saldo de créditos
-- ✅ credit_transactions       - Histórico de transações
-- ✅ credit_packages           - Pacotes de créditos
-- ✅ plans                      - Planos de assinatura
--
-- A criar:
-- 🆕 pesquisa_cnpj             - Histórico de buscas Smart CNPJ
-- ================================================================

\echo '';
\echo '============================================';
\echo 'CLEANUP CONCLUÍDO';
\echo '============================================';
