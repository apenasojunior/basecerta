-- ================================================================
-- SCRIPT: Criar Schema CNPJ com Estrutura CORRETA
-- Data: 10/12/2025
-- Objetivo: Estrutura otimizada para reimportação dos dados CNPJ
-- ================================================================

-- IMPORTANTE: Este script deve ser executado ANTES da importação dos CSVs
-- PRIMARY KEYs são criadas na definição das tabelas (muito mais rápido)
-- Índices devem ser criados DEPOIS da importação (10x mais rápido)

-- ================================================================
-- 1. PREPARAÇÃO
-- ================================================================

-- Criar extensão pg_trgm se não existir (necessária para índices GIN)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Criar schema cnpj (se não existir)
CREATE SCHEMA IF NOT EXISTS cnpj;

-- ================================================================
-- 2. TABELA: empresas (64M registros esperados)
-- ================================================================

DROP TABLE IF EXISTS cnpj.empresas CASCADE;

CREATE TABLE cnpj.empresas (
    cnpj_basico                 VARCHAR(8) NOT NULL,
    razao_social                VARCHAR(500) NOT NULL,
    natureza_juridica           VARCHAR(10),
    qualificacao_responsavel    VARCHAR(5),
    capital_social              NUMERIC(18,2),
    porte_empresa               VARCHAR(2),
    ente_federativo_responsavel VARCHAR(100),
    
    -- PRIMARY KEY definida na criação (CRÍTICO para performance de JOINs)
    PRIMARY KEY (cnpj_basico)
);

COMMENT ON TABLE cnpj.empresas IS 'Empresas (CNPJ básico 8 dígitos) - Receita Federal';
COMMENT ON COLUMN cnpj.empresas.cnpj_basico IS 'Primeiros 8 dígitos do CNPJ (identifica a empresa)';
COMMENT ON COLUMN cnpj.empresas.porte_empresa IS '01=ME, 03=EPP, 05=Demais';

-- ================================================================
-- 3. TABELA: estabelecimentos (68M registros esperados)
-- ================================================================

DROP TABLE IF EXISTS cnpj.estabelecimentos CASCADE;

CREATE TABLE cnpj.estabelecimentos (
    cnpj_basico                 VARCHAR(8) NOT NULL,
    cnpj_ordem                  VARCHAR(4) NOT NULL,
    cnpj_dv                     VARCHAR(2) NOT NULL,
    identificador_matriz_filial VARCHAR(1),
    nome_fantasia               VARCHAR(500),
    situacao_cadastral          VARCHAR(2),
    data_situacao_cadastral     DATE,
    motivo_situacao_cadastral   VARCHAR(5),
    nome_cidade_exterior        VARCHAR(100),
    pais                        VARCHAR(5),
    data_inicio_atividade       DATE,
    cnae_fiscal_principal       VARCHAR(10),
    cnae_fiscal_secundaria      TEXT,
    tipo_logradouro             VARCHAR(50),
    logradouro                  VARCHAR(500),
    numero                      VARCHAR(20),
    complemento                 VARCHAR(300),
    bairro                      VARCHAR(100),
    cep                         VARCHAR(8),
    uf                          VARCHAR(2),
    municipio                   VARCHAR(10),
    ddd_1                       VARCHAR(5),
    telefone_1                  VARCHAR(20),
    ddd_2                       VARCHAR(5),
    telefone_2                  VARCHAR(20),
    ddd_fax                     VARCHAR(5),
    fax                         VARCHAR(20),
    correio_eletronico          VARCHAR(200),
    situacao_especial           VARCHAR(100),
    data_situacao_especial      DATE,
    
    -- PRIMARY KEY composta (CRÍTICO para performance)
    PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv),
    
    -- FOREIGN KEY para empresas (integridade referencial)
    FOREIGN KEY (cnpj_basico) REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
);

COMMENT ON TABLE cnpj.estabelecimentos IS 'Estabelecimentos (matriz + filiais) - Receita Federal';
COMMENT ON COLUMN cnpj.estabelecimentos.identificador_matriz_filial IS '1=Matriz, 2=Filial';
COMMENT ON COLUMN cnpj.estabelecimentos.situacao_cadastral IS '02=Ativa, 08=Baixada';

-- ================================================================
-- 4. TABELA: socios (26M registros esperados)
-- ================================================================

DROP TABLE IF EXISTS cnpj.socios CASCADE;

CREATE TABLE cnpj.socios (
    id                               SERIAL PRIMARY KEY,
    cnpj_basico                      VARCHAR(8) NOT NULL,
    identificador_socio              VARCHAR(1),
    nome_socio                       VARCHAR(500),
    cnpj_cpf_socio                   VARCHAR(14),
    qualificacao_socio               VARCHAR(5),
    data_entrada_sociedade           DATE,
    pais                             VARCHAR(5),
    representante_legal              VARCHAR(11),
    nome_representante               VARCHAR(300),
    qualificacao_representante_legal VARCHAR(5),
    faixa_etaria                     VARCHAR(1),
    
    -- FOREIGN KEY para empresas
    FOREIGN KEY (cnpj_basico) REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
);

COMMENT ON TABLE cnpj.socios IS 'Sócios das empresas - Receita Federal';

-- ================================================================
-- 5. TABELAS DE APOIO
-- ================================================================

DROP TABLE IF EXISTS cnpj.cnaes CASCADE;
CREATE TABLE cnpj.cnaes (
    codigo      VARCHAR(10) PRIMARY KEY,
    descricao   TEXT
);

DROP TABLE IF EXISTS cnpj.municipios CASCADE;
CREATE TABLE cnpj.municipios (
    codigo VARCHAR(10) PRIMARY KEY,
    nome   VARCHAR(200)
);

DROP TABLE IF EXISTS cnpj.naturezas_juridicas CASCADE;
CREATE TABLE cnpj.naturezas_juridicas (
    codigo    VARCHAR(10) PRIMARY KEY,
    descricao VARCHAR(200)
);

DROP TABLE IF EXISTS cnpj.qualificacoes_socios CASCADE;
CREATE TABLE cnpj.qualificacoes_socios (
    codigo    VARCHAR(5) PRIMARY KEY,
    descricao VARCHAR(200)
);

DROP TABLE IF EXISTS cnpj.motivos_situacao_cadastral CASCADE;
CREATE TABLE cnpj.motivos_situacao_cadastral (
    codigo    VARCHAR(5) PRIMARY KEY,
    descricao VARCHAR(200)
);

DROP TABLE IF EXISTS cnpj.paises CASCADE;
CREATE TABLE cnpj.paises (
    codigo VARCHAR(5) PRIMARY KEY,
    nome   VARCHAR(100)
);

DROP TABLE IF EXISTS cnpj.simples CASCADE;
CREATE TABLE cnpj.simples (
    cnpj_basico                VARCHAR(8) PRIMARY KEY,
    opcao_simples              VARCHAR(1),
    data_opcao_simples         DATE,
    data_exclusao_simples      DATE,
    opcao_mei                  VARCHAR(1),
    data_opcao_mei             DATE,
    data_exclusao_mei          DATE,
    
    FOREIGN KEY (cnpj_basico) REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
);

-- ================================================================
-- IMPORTANTE: ÍNDICES DEVEM SER CRIADOS DEPOIS DA IMPORTAÇÃO!
-- Ver script: 02_create_indexes_after_import.sql
-- ================================================================

\echo '✅ Tabelas criadas com PRIMARY KEYs!'
\echo ''
\echo '📝 PRÓXIMOS PASSOS:'
\echo '1. Importar dados dos CSVs da Receita Federal'
\echo '2. Executar script: 02_create_indexes_after_import.sql'
\echo '3. Atualizar estatísticas: ANALYZE cnpj.empresas, cnpj.estabelecimentos, cnpj.socios;'
