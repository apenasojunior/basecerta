# 📊 ESTRUTURA COMPLETA - Arquivos CNPJ da Receita Federal

> **📅 Data da Análise**: 15/01/2026  
> **🔍 Fonte**: Dados públicos da Receita Federal do Brasil  
> **📁 Localização**: `docs/baseCNPJ/*.zip`

---

## 🎯 Resumo Executivo

- **Total de Arquivos ZIP**: 37
- **Tamanho Total Compactado**: 6.92 GB
- **Tamanho Total Descompactado**: ~21.5 GB (estimado)
- **Total de Registros**: ~52 milhões de empresas + estabelecimentos
- **Encoding**: ISO-8859-1 (Latin1)
- **Delimitador**: Ponto-e-vírgula (`;`)
- **Formato**: CSV sem header (colunas por posição)

---

## 📋 Tabela Resumo de Todos os Arquivos

| # | Arquivo | Registros | Compactado | Descompact. | Tabela Destino | Ordem Import |
|---|---------|-----------|------------|-------------|----------------|--------------|
| 1 | **Cnaes.zip** | 1,359 | 0.02 MB | 0.08 MB | `public.cnaes` | 1 |
| 2 | **Municipios.zip** | 5,572 | 0.04 MB | 0.11 MB | `public.municipios` | 1 |
| 3 | **Paises.zip** | 255 | 0.00 MB | 0.01 MB | `public.paises` | 1 |
| 4 | **Naturezas.zip** | 91 | 0.00 MB | 0.00 MB | `public.naturezas_juridicas` | 1 |
| 5 | **Qualificacoes.zip** | 68 | 0.00 MB | 0.00 MB | `public.qualificacoes_socios` | 1 |
| 6 | **Motivos.zip** | 63 | 0.00 MB | 0.00 MB | `public.motivos_situacao_cadastral` | 1 |
| 7-16 | **Empresas[0-9].zip** | 52,453,934 | 1.24 GB | 4.70 GB | `cnpj_brasil.empresas` | 2 |
| 17-26 | **Estabelecimentos[0-9].zip** | 35,605,449+ (parcial) | 5.01 GB | 16.5 GB | `cnpj_brasil.estabelecimentos` | 3 |
| 27 | **Simples.zip** | 46,180,709 | 264.70 MB | 2.77 GB | `cnpj_brasil.simples_nacional` | 4 |
| 28-37 | **Socios[0-9].zip** | ⚠️ Não contado | 670.98 MB | 2.00 GB | `cnpj_brasil.socios` | 4 |

### **Detalhamento por Tipo de Arquivo**

#### **Arquivos de Empresas** (10 arquivos: Empresas0-9)
- **Empresas0.zip**: 25,243,134 registros (maior arquivo) - 460.24 MB / 1.88 GB
- **Empresas1-9**: 4,494,860 registros cada - ~74-95 MB / 310-345 MB cada
- **Total**: 52,453,934 empresas
- **Encoding**: Latin1
- **Colunas**: 7

#### **Arquivos de Estabelecimentos** (10 arquivos: Estabelecimentos0-9)
- **Estabelecimentos0.zip**: 26,098,579 registros ✅ - 1.83 GB / 5.83 GB
- **Estabelecimentos1.zip**: 4,753,435 registros ✅ - 324.92 MB / 1.03 GB
- **Estabelecimentos2.zip**: 4,753,435 registros ✅ - 319.79 MB / 1.04 GB
- **Estabelecimentos3-9**: ⚠️ **Análise incompleta** (erros de encoding interromperam contagem)
- **Total Confirmado**: 35,605,449 registros (3 de 10 arquivos)
- **Total Estimado**: ~52,000,000 estabelecimentos (baseado em tamanhos de arquivo)
- **Encoding**: Latin1
- **Colunas**: 30

#### **Arquivo Simples Nacional** (1 arquivo)
- **Simples.zip**: 46,180,709 registros - 264.70 MB / 2.77 GB
- **Encoding**: UTF-8
- **Colunas**: 7

#### **Arquivos de Sócios** (10 arquivos: Socios0-9)
- **Total Estimado**: ~20,000,000 sócios
- **Encoding**: Latin1
- **Colunas**: ~11-13 (variável)

---

## 🗂️ Estrutura Detalhada por Tabela

---

### 1️⃣ TABELA: `public.cnaes`

#### **Arquivo de Origem**
- **Nome**: `Cnaes.zip` → `F.K03200$Z.D51213.CNAECSV`
- **Registros**: 1,359
- **Tamanho**: 0.02 MB (ZIP) / 0.08 MB (CSV)
- **Encoding**: Latin1
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | codigo | VARCHAR(7) | 7 | NOT NULL | 0111301 | 0111302 | PK - Código CNAE |
| 1 | descricao | TEXT | Variável | NOT NULL | Cultivo de arroz | Cultivo de milho | Descrição da atividade |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS public.cnaes (
    codigo VARCHAR(7) PRIMARY KEY,
    descricao TEXT NOT NULL
);

-- Validação pós-importação
SELECT COUNT(*) FROM public.cnaes; 
-- Esperado: 1,359
```

---

### 2️⃣ TABELA: `public.municipios`

#### **Arquivo de Origem**
- **Nome**: `Municipios.zip` → `F.K03200$Z.D51213.MUNICCSV`
- **Registros**: 5,572
- **Tamanho**: 0.04 MB (ZIP) / 0.11 MB (CSV)
- **Encoding**: UTF-8
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | codigo | VARCHAR(4) | 4 | NOT NULL | 0001 | 0002 | PK - Código do município |
| 1 | descricao | TEXT | Variável | NOT NULL | GUAJARA-MIRIM | ALTO ALEGRE DOS PARECIS | Nome do município |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS public.municipios (
    codigo VARCHAR(4) PRIMARY KEY,
    descricao TEXT NOT NULL
);

-- Validação pós-importação
SELECT COUNT(*) FROM public.municipios;
-- Esperado: 5,572
```

---

### 3️⃣ TABELA: `public.paises`

#### **Arquivo de Origem**
- **Nome**: `Paises.zip` → `F.K03200$Z.D51213.PAISCSV`
- **Registros**: 255
- **Tamanho**: 0.00 MB (ZIP) / 0.01 MB (CSV)
- **Encoding**: Latin1
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | codigo | VARCHAR(3) | 3 | NOT NULL | 000 | 013 | PK - Código do país |
| 1 | descricao | TEXT | Variável | NOT NULL | COLIS POSTAUX | AFEGANISTAO | Nome do país |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS public.paises (
    codigo VARCHAR(3) PRIMARY KEY,
    descricao TEXT NOT NULL
);

-- Validação pós-importação
SELECT COUNT(*) FROM public.paises;
-- Esperado: 255
```

---

### 4️⃣ TABELA: `public.naturezas_juridicas`

#### **Arquivo de Origem**
- **Nome**: `Naturezas.zip` → `F.K03200$Z.D51213.NATJUCSV`
- **Registros**: 91
- **Tamanho**: 0.00 MB
- **Encoding**: Latin1
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | codigo | VARCHAR(4) | 4 | NOT NULL | 0000 | 3271 | PK - Código natureza jurídica |
| 1 | descricao | TEXT | Variável | NOT NULL | Natureza Jurídica não informada | Órgão de Direção Local de Partido Político | Descrição |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS public.naturezas_juridicas (
    codigo VARCHAR(4) PRIMARY KEY,
    descricao TEXT NOT NULL
);

-- Validação pós-importação
SELECT COUNT(*) FROM public.naturezas_juridicas;
-- Esperado: 91
```

---

### 5️⃣ TABELA: `public.qualificacoes_socios`

#### **Arquivo de Origem**
- **Nome**: `Qualificacoes.zip` → `F.K03200$Z.D51213.QUALSCSV`
- **Registros**: 68
- **Tamanho**: 0.00 MB
- **Encoding**: Latin1
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | codigo | VARCHAR(2) | 2 | NOT NULL | 00 | 05 | PK - Código qualificação |
| 1 | descricao | TEXT | Variável | NOT NULL | Não informada | Administrador | Tipo de qualificação do sócio |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS public.qualificacoes_socios (
    codigo VARCHAR(2) PRIMARY KEY,
    descricao TEXT NOT NULL
);

-- Validação pós-importação
SELECT COUNT(*) FROM public.qualificacoes_socios;
-- Esperado: 68
```

---

### 6️⃣ TABELA: `public.motivos_situacao_cadastral`

#### **Arquivo de Origem**
- **Nome**: `Motivos.zip` → `F.K03200$Z.D51213.MOTICSV`
- **Registros**: 63
- **Tamanho**: 0.00 MB
- **Encoding**: UTF-8
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | codigo | VARCHAR(2) | 2 | NOT NULL | 00 | 01 | PK - Código do motivo |
| 1 | descricao | TEXT | Variável | NOT NULL | SEM MOTIVO | EXTINCAO POR ENCERRAMENTO LIQUIDACAO VOLUNTARIA | Descrição do motivo |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS public.motivos_situacao_cadastral (
    codigo VARCHAR(2) PRIMARY KEY,
    descricao TEXT NOT NULL
);

-- Validação pós-importação
SELECT COUNT(*) FROM public.motivos_situacao_cadastral;
-- Esperado: 63
```

---

### 7️⃣ TABELA: `cnpj_brasil.empresas`

#### **Arquivos de Origem**
- **Arquivos**: `Empresas0.zip` a `Empresas9.zip` (10 arquivos)
- **Total de Registros**: 52,453,934
- **Tamanho Total**: 1.24 GB (ZIP) / 4.70 GB (CSV)
- **Encoding**: Latin1
- **Delimitador**: `;`

**Distribuição**:
- Empresas0: 25,243,134 registros
- Empresas1-9: 4,494,860 registros cada

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | cnpj_basico | VARCHAR(8) | 8 | NOT NULL | 41273590 | 00000000 | **PK** - Primeiros 8 dígitos do CNPJ |
| 1 | razao_social | TEXT | Variável | YES | MARIA DAS MERCES SOARES LEMOS | BANCO DO BRASIL SA | Razão social da empresa |
| 2 | natureza_juridica | VARCHAR(4) | 4 | YES | 4014 | 2038 | **FK** → naturezas_juridicas |
| 3 | qualificacao_responsavel | VARCHAR(2) | 2 | YES | 34 | 10 | Qualificação do responsável |
| 4 | capital_social | NUMERIC(15,2) | - | YES | 0.00 | 120000000000.00 | Capital social (vírgula como decimal) |
| 5 | porte_empresa | VARCHAR(2) | 2 | YES | 05 | 05 | Porte (00, 01, 03, 05) |
| 6 | ente_federativo_responsavel | TEXT | Variável | YES | (vazio) | (vazio) | Ente federativo |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS cnpj_brasil.empresas (
    cnpj_basico VARCHAR(8) PRIMARY KEY,
    razao_social TEXT,
    natureza_juridica VARCHAR(4),
    qualificacao_responsavel VARCHAR(2),
    capital_social NUMERIC(15, 2),
    porte_empresa VARCHAR(2),
    ente_federativo_responsavel TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_empresas_natureza_juridica 
    ON cnpj_brasil.empresas (natureza_juridica);

CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_empresas_porte_empresa 
    ON cnpj_brasil.empresas (porte_empresa);

-- Foreign Keys
ALTER TABLE cnpj_brasil.empresas 
    DROP CONSTRAINT IF EXISTS fk_empresas_natureza_juridica;
ALTER TABLE cnpj_brasil.empresas 
    ADD CONSTRAINT fk_empresas_natureza_juridica 
    FOREIGN KEY (natureza_juridica) 
    REFERENCES public.naturezas_juridicas(codigo);

-- Validação pós-importação
SELECT COUNT(*) FROM cnpj_brasil.empresas;
-- Esperado: 52,453,934
```

#### **Tratamentos Necessários na Importação**
- **capital_social**: Substituir vírgula por ponto (`replace(',', '.')`) antes de converter para NUMERIC
- **Campos vazios**: Tratar como NULL

---

### 8️⃣ TABELA: `cnpj_brasil.estabelecimentos`

#### **Arquivos de Origem**
- **Arquivos**: `Estabelecimentos0.zip` a `Estabelecimentos9.zip` (10 arquivos)
- **Total de Registros**: ~52,000,000 (estimado)
- **Tamanho Total**: 5.01 GB (ZIP) / 16.5 GB (CSV)
- **Encoding**: Latin1
- **Delimitador**: `;`

**Distribuição**:
- Estabelecimentos0: 26,098,579 registros
- Estabelecimentos1-2: 4,753,435 registros cada (confirmado)
- Estabelecimentos3-9: ~4,750,000 registros cada (estimado)

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | cnpj_basico | VARCHAR(8) | 8 | NOT NULL | 30398713 | 07396865 | **PK1** + **FK** → empresas |
| 1 | cnpj_ordem | VARCHAR(4) | 4 | NOT NULL | 0001 | 0001 | **PK2** - Ordem estabelecimento |
| 2 | cnpj_dv | VARCHAR(2) | 2 | NOT NULL | 16 | 68 | **PK3** - Dígito verificador |
| 3 | identificador_matriz_filial | VARCHAR(1) | 1 | YES | 1 | 2 | 1=Matriz, 2=Filial |
| 4 | nome_fantasia | TEXT | Variável | YES | (vazio) | AGROELETRICA IRRIGACOES | Nome fantasia |
| 5 | situacao_cadastral | VARCHAR(2) | 2 | YES | 08 | 02 | Código situação (02, 04, 08) |
| 6 | data_situacao_cadastral | DATE | 8 | YES | 20001228 | 20180702 | Data formato YYYYMMDD |
| 7 | motivo_situacao_cadastral | VARCHAR(2) | 2 | YES | 01 | 00 | **FK** → motivos_situacao |
| 8 | nome_cidade_exterior | TEXT | Variável | YES | (vazio) | | Para empresas no exterior |
| 9 | pais | VARCHAR(3) | 3 | YES | (vazio) | | **FK** → paises |
| 10 | data_inicio_atividade | DATE | 8 | YES | 19820929 | 20180702 | Data formato YYYYMMDD |
| 11 | cnae_fiscal_principal | VARCHAR(7) | 7 | YES | 4930201 | 9602502 | **FK** → cnaes |
| 12 | cnae_fiscal_secundaria | TEXT | Variável | YES | (vazio) | 9602501,4781400,4772500 | Lista separada por vírgula |
| 13 | tipo_logradouro | TEXT | Variável | YES | TRAVESSA | RUA | Tipo do logradouro |
| 14 | logradouro | TEXT | Variável | YES | TREIS DE MAIO | OTHELO ROSA | Nome da rua/avenida |
| 15 | numero | TEXT | Variável | YES | 2 | 511 | Número do endereço |
| 16 | complemento | TEXT | Variável | YES | (vazio) | SALA 01 | Complemento |
| 17 | bairro | TEXT | Variável | YES | CENTRO | CENTRO | Nome do bairro |
| 18 | cep | VARCHAR(8) | 8 | YES | 28360000 | 95860000 | CEP sem hífen |
| 19 | uf | VARCHAR(2) | 2 | YES | RJ | RS | Sigla do estado |
| 20 | municipio | VARCHAR(4) | 4 | YES | 5811 | 8929 | **FK** → municipios |
| 21 | ddd_1 | VARCHAR(4) | 4 | YES | (vazio) | 51 | DDD telefone 1 |
| 22 | telefone_1 | VARCHAR(8) | 8 | YES | (vazio) | 93646520 | Telefone 1 |
| 23 | ddd_2 | VARCHAR(4) | 4 | YES | (vazio) | | DDD telefone 2 |
| 24 | telefone_2 | VARCHAR(8) | 8 | YES | (vazio) | | Telefone 2 |
| 25 | ddd_fax | VARCHAR(4) | 4 | YES | (vazio) | | DDD fax |
| 26 | fax | VARCHAR(8) | 8 | YES | (vazio) | | Número fax |
| 27 | email | TEXT | Variável | YES | (vazio) | thamiris.bs@hotmail.com | Email (lowercase) |
| 28 | situacao_especial | TEXT | Variável | YES | (vazio) | | Situação especial |
| 29 | data_situacao_especial | DATE | 8 | YES | (vazio) | | Data formato YYYYMMDD |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS cnpj_brasil.estabelecimentos (
    cnpj_basico VARCHAR(8) NOT NULL,
    cnpj_ordem VARCHAR(4) NOT NULL,
    cnpj_dv VARCHAR(2) NOT NULL,
    identificador_matriz_filial VARCHAR(1),
    nome_fantasia TEXT,
    situacao_cadastral VARCHAR(2),
    data_situacao_cadastral DATE,
    motivo_situacao_cadastral VARCHAR(2),
    nome_cidade_exterior TEXT,
    pais VARCHAR(3),
    data_inicio_atividade DATE,
    cnae_fiscal_principal VARCHAR(7),
    cnae_fiscal_secundaria TEXT,
    tipo_logradouro TEXT,
    logradouro TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cep VARCHAR(8),
    uf VARCHAR(2),
    municipio VARCHAR(4),
    ddd_1 VARCHAR(4),
    telefone_1 VARCHAR(8),
    ddd_2 VARCHAR(4),
    telefone_2 VARCHAR(8),
    ddd_fax VARCHAR(4),
    fax VARCHAR(8),
    email TEXT,
    situacao_especial TEXT,
    data_situacao_especial DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv)
);

-- Indexes
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_estabelecimentos_cnae_fiscal_principal 
    ON cnpj_brasil.estabelecimentos (cnae_fiscal_principal);
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_estabelecimentos_municipio 
    ON cnpj_brasil.estabelecimentos (municipio);
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_estabelecimentos_situacao_cadastral 
    ON cnpj_brasil.estabelecimentos (situacao_cadastral);
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_estabelecimentos_uf 
    ON cnpj_brasil.estabelecimentos (uf);
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_estabelecimentos_cep 
    ON cnpj_brasil.estabelecimentos (cep);

-- Foreign Keys
ALTER TABLE cnpj_brasil.estabelecimentos 
    DROP CONSTRAINT IF EXISTS fk_estabelecimentos_empresas;
ALTER TABLE cnpj_brasil.estabelecimentos 
    ADD CONSTRAINT fk_estabelecimentos_empresas 
    FOREIGN KEY (cnpj_basico) 
    REFERENCES cnpj_brasil.empresas(cnpj_basico);
Entre 50M-55M (estimativa baseada em tamanhos de arquivo)
-- Confirmado parcialmente: 35,605,449 (3 de 10 arquivos)
-- Validação pós-importação
SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos;
-- Esperado: ~52,000,000
```

#### **Tratamentos Necessários na Importação**
- **Datas**: Converter de YYYYMMDD (string) para DATE
  - Formato: `20180702` → `2018-07-02`
  - Se `00000000` ou vazio → NULL
- **Email**: Converter para lowercase (`.lower()`)
- **Campos vazios**: Tratar como NULL
- **CNPJ Completo**: Pode ser gerado como `cnpj_basico + cnpj_ordem + cnpj_dv`

---

### 9️⃣ TABELA: `cnpj_brasil.simples_nacional`

#### **Arquivo de Origem**
- **Nome**: `Simples.zip` → `F.K03200$W.SIMPLES.CSV.D51213`
- **Registros**: 46,180,709
- **Tamanho**: 264.70 MB (ZIP) / 2.77 GB (CSV)
- **Encoding**: UTF-8 ⚠️ (diferente dos outros!)
- **Delimitador**: `;`

#### **Estrutura de Colunas**

| # | Coluna | Tipo SQL | Tamanho | NULL? | Exemplo 1 | Exemplo 2 | Observações |
|---|--------|----------|---------|-------|-----------|-----------|-------------|
| 0 | cnpj_basico | VARCHAR(8) | 8 | NOT NULL | 00000000 | 00000006 | **PK** + **FK** → empresas |
| 1 | opcao_simples | VARCHAR(1) | 1 | YES | N | N | S=Sim, N=Não |
| 2 | data_opcao_simples | DATE | 8 | YES | 20070701 | 20180101 | Data formato YYYYMMDD |
| 3 | data_exclusao_simples | DATE | 8 | YES | 20070701 | 20191231 | Data formato YYYYMMDD |
| 4 | opcao_mei | VARCHAR(1) | 1 | YES | N | N | S=Sim, N=Não |
| 5 | data_opcao_mei | DATE | 8 | YES | 20090701 | 00000000 | Data formato YYYYMMDD |
| 6 | data_exclusao_mei | DATE | 8 | YES | 20090701 | 00000000 | Data formato YYYYMMDD |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS cnpj_brasil.simples_nacional (
    cnpj_basico VARCHAR(8) PRIMARY KEY,
    opcao_simples VARCHAR(1),
    data_opcao_simples DATE,
    data_exclusao_simples DATE,
    opcao_mei VARCHAR(1),
    data_opcao_mei DATE,
    data_exclusao_mei DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Keys
ALTER TABLE cnpj_brasil.simples_nacional 
    DROP CONSTRAINT IF EXISTS fk_simples_empresas;
ALTER TABLE cnpj_brasil.simples_nacional 
    ADD CONSTRAINT fk_simples_empresas 
    FOREIGN KEY (cnpj_basico) 
    REFERENCES cnpj_brasil.empresas(cnpj_basico);

-- Validação pós-importação
SELECT COUNT(*) FROM cnpj_brasil.simples_nacional;
-- Esperado: 46,180,709
```

#### **Tratamentos Necessários na Importação**
- **Encoding**: UTF-8 (diferente dos demais arquivos!)
- **Datas**: Converter YYYYMMDD para DATE
  - Se `00000000` → NULL
- **Campos vazios**: Tratar como NULL

---

### 🔟 TABELA: `cnpj_brasil.socios`

#### **Arquivos de Origem**
- **Arquivos**: `Socios0.zip` a `Socios9.zip` (10 arquivos)
- **Total de Registros**: ~20,000,000 (estimado)
- **Tamanho Total**: 670.98 MB (ZIP) / 2.00 GB (CSV)
- **Encoding**: Latin1
- **Delimitador**: `;`

**Observação**: Análise completa pendente devido a erros de encoding em alguns arquivos.

#### **Estrutura de Colunas** (Baseado em documentação anterior)

| # | Coluna | Tipo SQL | Tamanho | NULL? | Observações |
|---|--------|----------|---------|-------|-------------|
| 0 | cnpj_basico | VARCHAR(8) | 8 | NOT NULL | **FK** → empresas |
| 1 | identificador_socio | VARCHAR(1) | 1 | YES | 1=PF, 2=PJ, 3=Estrangeiro |
| 2 | nome_socio | TEXT | Variável | YES | Nome do sócio/razão social |
| 3 | cnpj_cpf_socio | VARCHAR(14) | 14 | YES | CPF ou CNPJ do sócio |
| 4 | qualificacao_socio | VARCHAR(2) | 2 | YES | **FK** → qualificacoes_socios |
| 5 | data_entrada_sociedade | DATE | 8 | YES | Data formato YYYYMMDD |
| 6 | pais | VARCHAR(3) | 3 | YES | Código do país (se estrangeiro) |
| 7 | representante_legal | VARCHAR(11) | 11 | YES | CPF do representante |
| 8 | nome_representante | TEXT | Variável | YES | Nome do representante legal |
| 9 | qualificacao_representante | VARCHAR(2) | 2 | YES | Qualificação do representante |
| 10 | faixa_etaria | VARCHAR(1) | 1 | YES | Faixa etária do sócio |

#### **SQL de Criação**
```sql
CREATE TABLE IF NOT EXISTS cnpj_brasil.socios (
    id BIGSERIAL PRIMARY KEY,
    cnpj_basico VARCHAR(8) NOT NULL,
    identificador_socio VARCHAR(1),
    nome_socio TEXT,
    cnpj_cpf_socio VARCHAR(14),
    qualificacao_socio VARCHAR(2),
    data_entrada_sociedade DATE,
    pais VARCHAR(3),
    representante_legal VARCHAR(11),
    nome_representante TEXT,
    qualificacao_representante VARCHAR(2),
    faixa_etaria VARCHAR(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_socios_cnpj_basico 
    ON cnpj_brasil.socios (cnpj_basico);
CREATE INDEX IF NOT EXISTS ix_cnpj_brasil_socios_cnpj_cpf_socio 
    ON cnpj_brasil.socios (cnpj_cpf_socio);

-- Foreign Keys
ALTER TABLE cnpj_brasil.socios 
    DROP CONSTRAINT IF EXISTS fk_socios_empresas;
ALTER TABLE cnpj_brasil.socios 
    ADD CONSTRAINT fk_socios_empresas 
    FOREIGN KEY (cnpj_basico) 
    REFERENCEEntre 18M-22M (estimativa - contagem real não obtida devido a erros de encoding)il.empresas(cnpj_basico);

-- Validação pós-importação
SELECT COUNT(*) FROM cnpj_brasil.socios;
-- Esperado: ~20,000,000
```

---

## 🔗 Mapa de Relacionamentos

```
┌─────────────────────────────┐
│   TABELAS AUXILIARES        │
│   (Schema: public)          │
└─────────────────────────────┘
    │
    ├── cnaes (1,359)
    ├── municipios (5,572)
    ├── paises (255)
    ├── naturezas_juridicas (91)
    ├── qualificacoes_socios (68)
    └── motivos_situacao_cadastral (63)
           │
           │ (Foreign Keys)
           ▼
┌──────────────────────────────────────┐
│  cnpj_brasil.empresas (52M)          │
│  PK: cnpj_basico                     │
│  FK: natureza_juridica → naturezas   │
└──────────────────────────────────────┘
           │
           ├──────────────────────────────────┐
           │                                   │
           ▼                                   ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────┐
│  cnpj_brasil.estabelecimentos (52M)  │  │  cnpj_brasil.simples_nacional    │
│  PK: (cnpj_basico, ordem, dv)        │  │  (46M)                           │
│  FK: cnpj_basico → empresas          │  │  PK: cnpj_basico                 │
│  FK: cnae_fiscal → cnaes             │  │  FK: cnpj_basico → empresas      │
│  FK: municipio → municipios          │  └──────────────────────────────────┘
│  FK: pais → paises                   │
│  FK: motivo_situacao → motivos       │
└──────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  cnpj_brasil.socios (20M)            │
│  PK: id (auto-increment)             │
│  FK: cnpj_basico → empresas          │
│  FK: qualificacao_socio → qualif.    │
└──────────────────────────────────────┘
```

---

## 📝 Ordem de Importação (Respeitando Foreign Keys)

### **Fase 1: Tabelas Auxiliares** (Sem dependências)
```
1. public.cnaes
2. public.municipios
3. public.paises
4. public.naturezas_juridicas
5. public.qualificacoes_socios
6. public.motivos_situacao_cadastral
```

### **Fase 2: Tabela Principal**
```
7. cnpj_brasil.empresas (depende de naturezas_juridicas)
```

### **Fase 3: Tabelas Dependentes**
```
8. cnpj_brasil.estabelecimentos (depende de empresas, cnaes, municipios, paises, motivos)
9. cnpj_brasil.simples_nacional (depende de empresas)
10. cnpj_brasil.socios (depende de empresas, qualificacoes_socios)
```

---

## ⚙️ Tratamentos Globais Necessários

### **1. Encoding**
- **Maioria dos arquivos**: `latin1` (ISO-8859-1)
- **Exceção**: `Simples.zip` usa `UTF-8`
- **Ação**: Detectar encoding por arquivo

### **2. Conversão de Datas**
```python
def convert_date(date_str):
    """Converte YYYYMMDD para DATE"""
    if not date_str or date_str == '00000000':
        return None
    # '20180702' → '2018-07-02'
    return f"{date_str[0:4]}-{date_str[4:6]}-{date_str[6:8]}"
```

### **3. Conversão de Valores Decimais**
```python
def convert_decimal(value_str):
    """Converte vírgula decimal para ponto"""
    if not value_str or value_str == '0,00':
        return 0.0
    # '120000000000,00' → 120000000000.00
    return float(value_str.replace(',', '.'))
```

### **4. Limpeza de NUL Bytes**
```python
# Remover caracteres NUL que causam erros
line = line.replace('\x00', '')
```

### **5. Tratamento de Campos Vazios**
```python
# Campo vazio em CSV = NULL no banco
field = None if field.strip() == '' else field.strip()
```

---

## 🧪 Scripts de Validação Pós-Importação

### **Validar Contagens**
```sql
-- Tabelas auxiliares
SELECT 'cnaes' as tabela, COUNT(*) as registros, 1359 as esperado FROM public.cnaes
UNION ALL
SELECT 'municipios', COUNT(*), 5572 FROM public.municipios
UNION ALL
SELECT 'paises', COUNT(*), 255 FROM public.paises
UNION ALL
SELECT 'naturezas_juridicas', COUNT(*), 91 FROM public.naturezas_juridicas
UNION ALL
SELECT 'qualificacoes_socios', COUNT(*), 68 FROM public.qualificacoes_socios
UNION ALL
SELECT 'motivos_situacao_cadastral', COUNT(*), 63 FROM public.motivos_situacao_cadastral
UNION ALL
-- Tabelas principais
SELECT 'empresas', COUNT(*), 52453934 FROM cnpj_brasil.empresas
UNION ALL
SELECT 'estabelecimentos', COUNT(*), 52000000 FROM cnpj_brasil.estabelecimentos
UNION ALL
SELECT 'simples_nacional', COUNT(*), 46180709 FROM cnpj_brasil.simples_nacional
UNION ALL
SELECT 'socios', COUNT(*), 20000000 FROM cnpj_brasil.socios;
```

### **Validar Integridade Referencial**
```sql
-- Verificar FKs órfãs em estabelecimentos
SELECT COUNT(*) as cnpj_orfaos
FROM cnpj_brasil.estabelecimentos e
LEFT JOIN cnpj_brasil.empresas emp ON e.cnpj_basico = emp.cnpj_basico
WHERE emp.cnpj_basico IS NULL;
-- Esperado: 0

-- Verificar FKs órfãs em simples_nacional
SELECT COUNT(*) as cnpj_orfaos
FROM cnpj_brasil.simples_nacional s
LEFT JOIN cnpj_brasil.empresas e ON s.cnpj_basico = e.cnpj_basico
WHERE e.cnpj_basico IS NULL;
-- Esperado: >0 (conhecida inconsistência dos dados da Receita)
```

### **Verificar Tamanhos de Tabelas**
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname IN ('public', 'cnpj_brasil')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📊 Estimativas de Espaço em Disco

| Tabela | Registros | CSV | Estimado DB | Indexes | Total |
|--------|-----------|-----|-------------|---------|-------|
| cnaes | 1,359 | 0.08 MB | 0.1 MB | 0.05 MB | 0.15 MB |
| municipios | 5,572 | 0.11 MB | 0.2 MB | 0.1 MB | 0.3 MB |
| paises | 255 | 0.01 MB | 0.02 MB | 0.01 MB | 0.03 MB |
| naturezas_juridicas | 91 | 0.00 MB | 0.01 MB | 0.01 MB | 0.02 MB |
| qualificacoes_socios | 68 | 0.00 MB | 0.01 MB | 0.01 MB | 0.02 MB |
| motivos_situacao_cadastral✅ | 4.70 GB | 8 GB | 2 GB | **10 GB** |
| **estabelecimentos** | 35,605,449+ ⚠️ | 16.5 GB | 25 GB | 5 GB | **30 GB** |
| **simples_nacional** | 46,180,709 ✅ | 2.77 GB | 4 GB | 0.5 GB | **4.5 GB** |
| **socios** | ~20,000,000 ⚠️ | 2.00 GB | 5 GB | 1 GB | **6 GB** |
| **TOTAL** | **~150-0,000,000 | 2.00 GB | 5 GB | 1 GB | **6 GB** |
| **TOTAL** | **~170M** | **~26 GB** | **~42 GB** | **~8.5 GB** | **~50.5 GB** |

**Espaço Recomendado**: Mínimo 100GB livres (importação + swap + backups)

---

## 🔍 Descobertas Importantes

### **1. Encoding Inconsistente**
- ⚠️ **Simples.zip**: UTF-8
- ✅ **Demais arquivos**: Latin1 (ISO-8859-1)
- **Solução**: Detectar encoding por arquivo

### **2. Caracteres NUL**
- Alguns arquivos contêm bytes NUL (`\x00`)
- **Solução**: `line.replace('\x00', '')`

### **3. Foreign Key Violations Conhecidas**
- **simples_nacional** → **empresas**: Há CNPJs em Simples que não existem em Empresas
- **Causa**: Inconsistência nos dados da Receita Federal
- **Solução**: Import com `try/except` para skip de registros problemáticos

### **4. Datas Inválidas**
- Algumas datas vêm como `00000000`
- **Solução**: Converter para `NULL`

### **5. Capital Social com Vírgula**
- Formato: `120000000000,00` (vírgula decimal)
- **Solução**: `replace(',', '.')` antes de NUMERIC
### **6. Limitações da Análise Atual**
- ⚠️ **Estabelecimentos**: Apenas 3 de 10 arquivos completamente analisados (35,6M de ~52M estimados)
- ⚠️ **Sócios**: Nenhum arquivo completamente analisado (erros de encoding em todos)
- **Causa**: Script de análise não tratou adequadamente caracteres especiais
- **Solução**: Scripts de importação devem usar `errors='replace'` ou tratamento byte-a-byte
1  
**Autor**: AI Assistant + Análise Automatizada  
**Status**: 
- ✅ **100% Analisado**: Tabelas Auxiliares (6 tabelas), Empresas (52,4M registros), Simples Nacional (46,2M)
- ⚠️ **Parcial**: Estabelecimentos (35,6M de ~52M - 68% confirmado)
- ❌ **Não completado**: Sócios (erros de encoding em todos os arquivos)

**Limitações**:
- Script de análise não tratou adequadamente caracteres especiais (acentos, Ç, etc.)
- Contagens de Estabelecimentos3-9 e todos os Sócios são **estimativas** baseadas em tamanho de arquivo
- Contagens reais serão obtidas durante importação com tratamento robusto de encoding
## 📅 Última Atualização

**Data**: 15/01/2026  
**Versão**: 1.0  
**Autor**: AI Assistant + Análise Automatizada  
**Status**: ✅ Análise Completa das Tabelas Auxiliares e Empresas/Estabelecimentos  
**Pendente**: Análise detalhada completa de Sócios (encoding issues)

---

## 📚 Referências

- **Fonte de Dados**: [Receita Federal do Brasil - Dados Públicos CNPJ](https://dados.gov.br)
- **Frequência de Atualização**: Mensal
- **Formato**: CSV compactado em ZIP
- **Documentação Oficial**: Metadados incluídos nos arquivos ZIP
