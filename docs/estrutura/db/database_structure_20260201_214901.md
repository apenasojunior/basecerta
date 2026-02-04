# 📚 Documentação Completa - Base CNPJ

**Gerado em:** 2026-02-01 21:49:01

---

## 🗄️ Informações do Banco

**PostgreSQL:** PostgreSQL 17.7 (Homebrew)
**Database:** `basecerta`
**Host:** ::1/128
**Porta:** 5432
**Schema Principal:** `cnpj`
**Owner:** `aian_db`

**Schemas disponíveis:**
- `cnpj`
- `cnpj_staging`
- `public`

---

## 🎯 Visão Geral

Base com dados públicos de empresas brasileiras (Receita Federal).

**Dados:**
- 65M+ empresas (matriz)
- 68M+ estabelecimentos (matriz + filiais)
- 26M+ sócios
- 20M+ optantes pelo Simples Nacional

**Atualização:** Mensal pela Receita Federal

**Formato:** PostgreSQL 16+ com schema `cnpj`

---

## 🔐 Como Conectar

### String de Conexão Atual

```bash
# PostgreSQL
postgresql://aian_db:senha@::1/128:5432/basecerta

# psql
psql -h ::1/128 -p 5432 -U aian_db -d basecerta
```

**Python (psycopg2):**
```python
conn = psycopg2.connect(
    host='::1/128',
    port=5432,
    database='basecerta',
    user='cnpj_readonly',
    password='sua_senha'
)
```

---

## 🏗️ Arquitetura

### Diagrama ER (Textual)

```
                    ┌─────────────────┐
                    │    empresas     │ ← Matriz (CNPJ 8 dígitos)
                    │                 │
                    │ • cnpj_basico   │ (PK)
                    │ • razao_social  │
                    │ • porte         │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
   ┌──────────────────┐ ┌─────────┐ ┌──────────────┐
   │estabelecimentos  │ │ socios  │ │   simples    │
   │                  │ │         │ │              │
   │ • cnpj_basico    │ │ • id    │ │ • cnpj_basico│ (FK)
   │ • cnpj_ordem     │ │         │ │ • opcao      │
   │ • cnpj_dv        │ └─────────┘ └──────────────┘
   │ (FK: cnpj_basico)│
   └──────────────────┘
   68M registros         26M          20M
```

### Volumetria das Tabelas

| Tabela | Registros | Tamanho | Propósito |
|--------|-----------|---------|----------|
| cnaes | 4,077 | 576 kB | Códigos e descrições das atividades econômicas |
| control_audit | 33 | 56 kB | - |
| control_batches | 12 | 80 kB | - |
| control_checkpoints | 44 | 112 kB | - |
| empresas | 65,683,740 | 14 GB | Contém razão social, natureza jurídica, porte, capital social |
| estabelecimentos | 68,940,108 | 23 GB | Endereço, nome fantasia, situação cadastral, CNAE, contatos |
| estabelecimentos_cnaes_secundarios | 114,636,576 | 11 GB | - |
| historico_empresas | 0 | 32 kB | - |
| historico_estabelecimentos | 0 | 32 kB | - |
| historico_simples | 0 | 32 kB | - |
| historico_socios | 0 | 32 kB | - |
| motivos_situacao_cadastral | 189 | 40 kB | Códigos e descrições (baixa, suspensão, etc.) |
| municipios | 16,716 | 1160 kB | Códigos e nomes dos municípios |
| naturezas_juridicas | 273 | 48 kB | Códigos e descrições (SA, LTDA, etc.) |
| paises | 765 | 64 kB | Códigos e nomes de países |
| qualificacoes_socios | 204 | 40 kB | Códigos e descrições (Administrador, Sócio, etc.) |
| simples | 46,189,169 | 4713 MB | Datas de opção e exclusão do Simples Nacional |
| socios | 26,760,175 | 7034 MB | Nome, CPF/CNPJ do sócio, qualificação, data de entrada |

---

## 📊 Volumetria Atual

| Tabela | Registros | Tamanho |
|--------|-----------|--------|
| cnaes | 4,077 | 576 kB |
| control_audit | 33 | 56 kB |
| control_batches | 12 | 80 kB |
| control_checkpoints | 44 | 112 kB |
| empresas | 65,683,740 | 14 GB |
| estabelecimentos | 68,940,108 | 23 GB |
| estabelecimentos_cnaes_secundarios | 114,636,576 | 11 GB |
| historico_empresas | 0 | 32 kB |
| historico_estabelecimentos | 0 | 32 kB |
| historico_simples | 0 | 32 kB |
| historico_socios | 0 | 32 kB |
| motivos_situacao_cadastral | 189 | 40 kB |
| municipios | 16,716 | 1160 kB |
| naturezas_juridicas | 273 | 48 kB |
| paises | 765 | 64 kB |
| qualificacoes_socios | 204 | 40 kB |
| simples | 46,189,169 | 4713 MB |
| socios | 26,760,175 | 7034 MB |

**Total:** 322,232,081 registros

---

## 📋 Tabelas - Descrição Detalhada

### cnaes

**O QUE É:** Classificação Nacional de Atividades Econômicas (tabela de domínio)

**PARA QUE SERVE:** Códigos e descrições das atividades econômicas

**RELACIONAMENTOS:** Referenciada por estabelecimentos

**REGISTROS ATUAIS:** 4,077

**TAMANHO:** 576 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| codigo | character varying(10) | ✓ | - |
| descricao | text | ✗ | - |

---

### control_audit

**Registros:** 33

**Tamanho:** 56 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| audit_id | integer | ✗ | nextval('cnpj.control_audit_audit_id_seq'::regclass) |
| batch_id | integer | ✗ | - |
| table_name | character varying(100) | ✗ | - |
| inserts | integer | ✓ | 0 |
| updates | integer | ✓ | 0 |
| deletes | integer | ✓ | 0 |
| timestamp | timestamp without time zone | ✗ | CURRENT_TIMESTAMP |

---

### control_batches

**Registros:** 12

**Tamanho:** 80 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| batch_id | integer | ✗ | nextval('cnpj.control_batches_batch_id_seq'::regclass) |
| tipo | character varying(100) | ✗ | - |
| competencia | character varying(7) | ✗ | - |
| inicio | timestamp without time zone | ✗ | CURRENT_TIMESTAMP |
| fim | timestamp without time zone | ✓ | - |
| status | character varying(20) | ✗ | 'in_progress'::character varying |
| total_arquivos | integer | ✓ | 0 |
| total_registros | bigint | ✓ | 0 |
| erro | text | ✓ | - |

---

### control_checkpoints

**Registros:** 44

**Tamanho:** 112 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| checkpoint_id | integer | ✗ | nextval('cnpj.control_checkpoints_checkpoint_id_seq'::regclass) |
| batch_id | integer | ✗ | - |
| arquivo_nome | character varying(500) | ✗ | - |
| arquivo_hash | character varying(64) | ✗ | - |
| chunk_numero | integer | ✓ | 0 |
| rows_processed | integer | ✓ | 0 |
| status | character varying(20) | ✗ | 'pending'::character varying |
| erro | text | ✓ | - |
| inicio | timestamp without time zone | ✓ | - |
| fim | timestamp without time zone | ✓ | - |

---

### empresas

**O QUE É:** Tabela PRINCIPAL que armazena dados da matriz (CNPJ básico - 8 dígitos)

**PARA QUE SERVE:** Contém razão social, natureza jurídica, porte, capital social

**RELACIONAMENTOS:** 1 empresa → N estabelecimentos, N sócios, 0..1 simples

**REGISTROS ATUAIS:** 65,683,740

**TAMANHO:** 14 GB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| cnpj_basico | character varying(8) | ✗ | - |
| razao_social | character varying(500) | ✓ | - |
| natureza_juridica | character varying(10) | ✓ | - |
| qualificacao_responsavel | character varying(10) | ✓ | - |
| capital_social | numeric | ✓ | - |
| porte_empresa | character varying(2) | ✓ | - |
| ente_federativo | character varying(100) | ✓ | - |

---

### estabelecimentos

**O QUE É:** Todos os estabelecimentos (matriz + filiais) - CNPJ completo (14 dígitos)

**PARA QUE SERVE:** Endereço, nome fantasia, situação cadastral, CNAE, contatos

**RELACIONAMENTOS:** N estabelecimentos → 1 empresa (FK: cnpj_basico)

**REGISTROS ATUAIS:** 68,940,108

**TAMANHO:** 23 GB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| cnpj_basico | character varying(8) | ✗ | - |
| cnpj_ordem | character varying(4) | ✗ | - |
| cnpj_dv | character varying(2) | ✗ | - |
| identificador_matriz_filial | character varying(1) | ✓ | - |
| nome_fantasia | character varying(500) | ✓ | - |
| situacao_cadastral | character varying(2) | ✓ | - |
| data_situacao_cadastral | date | ✓ | - |
| motivo_situacao_cadastral | character varying(10) | ✓ | - |
| nome_cidade_exterior | character varying(200) | ✓ | - |
| pais | character varying(10) | ✓ | - |
| data_inicio_atividade | date | ✓ | - |
| cnae_fiscal_principal | character varying(10) | ✓ | - |
| cnae_fiscal_secundaria | text | ✓ | - |
| tipo_logradouro | character varying(100) | ✓ | - |
| logradouro | character varying(500) | ✓ | - |
| numero | character varying(50) | ✓ | - |
| complemento | character varying(200) | ✓ | - |
| bairro | character varying(200) | ✓ | - |
| cep | character varying(8) | ✓ | - |
| uf | character varying(2) | ✓ | - |
| municipio | character varying(10) | ✓ | - |
| ddd_1 | character varying(4) | ✓ | - |
| telefone_1 | character varying(20) | ✓ | - |
| ddd_2 | character varying(4) | ✓ | - |
| telefone_2 | character varying(20) | ✓ | - |
| ddd_fax | character varying(4) | ✓ | - |
| fax | character varying(20) | ✓ | - |
| correio_eletronico | character varying(200) | ✓ | - |
| situacao_especial | character varying(200) | ✓ | - |
| data_situacao_especial | date | ✓ | - |

---

### estabelecimentos_cnaes_secundarios

**Registros:** 114,636,576

**Tamanho:** 11 GB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| cnpj_basico | character varying(8) | ✗ | - |
| cnpj_ordem | character varying(4) | ✗ | - |
| cnpj_dv | character varying(2) | ✗ | - |
| cnae_secundario | character varying(10) | ✗ | - |

---

### historico_empresas

**Registros:** 0

**Tamanho:** 32 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| historico_id | bigint | ✗ | nextval('cnpj.historico_empresas_historico_id_seq'::regclass) |
| cnpj_basico | character varying(8) | ✗ | - |
| operacao | character varying(10) | ✗ | - |
| hash_anterior | character varying(32) | ✓ | - |
| hash_novo | character varying(32) | ✓ | - |
| batch_id | integer | ✓ | - |
| timestamp | timestamp without time zone | ✗ | CURRENT_TIMESTAMP |

---

### historico_estabelecimentos

**Registros:** 0

**Tamanho:** 32 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| historico_id | bigint | ✗ | nextval('cnpj.historico_estabelecimentos_historico_id_seq'::regclass) |
| cnpj_basico | character varying(8) | ✗ | - |
| operacao | character varying(10) | ✗ | - |
| hash_anterior | character varying(32) | ✓ | - |
| hash_novo | character varying(32) | ✓ | - |
| batch_id | integer | ✓ | - |
| timestamp | timestamp without time zone | ✗ | CURRENT_TIMESTAMP |

---

### historico_simples

**Registros:** 0

**Tamanho:** 32 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| historico_id | bigint | ✗ | nextval('cnpj.historico_simples_historico_id_seq'::regclass) |
| cnpj_basico | character varying(8) | ✗ | - |
| operacao | character varying(10) | ✗ | - |
| hash_anterior | character varying(32) | ✓ | - |
| hash_novo | character varying(32) | ✓ | - |
| batch_id | integer | ✓ | - |
| timestamp | timestamp without time zone | ✗ | CURRENT_TIMESTAMP |

---

### historico_socios

**Registros:** 0

**Tamanho:** 32 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| historico_id | bigint | ✗ | nextval('cnpj.historico_socios_historico_id_seq'::regclass) |
| cnpj_basico | character varying(8) | ✗ | - |
| operacao | character varying(10) | ✗ | - |
| hash_anterior | character varying(32) | ✓ | - |
| hash_novo | character varying(32) | ✓ | - |
| batch_id | integer | ✓ | - |
| timestamp | timestamp without time zone | ✗ | CURRENT_TIMESTAMP |

---

### motivos_situacao_cadastral

**O QUE É:** Motivos de situação cadastral (tabela de domínio)

**PARA QUE SERVE:** Códigos e descrições (baixa, suspensão, etc.)

**RELACIONAMENTOS:** Referenciada por estabelecimentos

**REGISTROS ATUAIS:** 189

**TAMANHO:** 40 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| codigo | character varying(10) | ✓ | - |
| descricao | character varying(200) | ✗ | - |

---

### municipios

**O QUE É:** Municípios brasileiros (tabela de domínio)

**PARA QUE SERVE:** Códigos e nomes dos municípios

**RELACIONAMENTOS:** Referenciada por estabelecimentos

**REGISTROS ATUAIS:** 16,716

**TAMANHO:** 1160 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| codigo | character varying(10) | ✓ | - |
| descricao | character varying(200) | ✗ | - |

---

### naturezas_juridicas

**O QUE É:** Naturezas jurídicas (tabela de domínio)

**PARA QUE SERVE:** Códigos e descrições (SA, LTDA, etc.)

**RELACIONAMENTOS:** Referenciada por empresas

**REGISTROS ATUAIS:** 273

**TAMANHO:** 48 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| codigo | character varying(10) | ✓ | - |
| descricao | character varying(200) | ✗ | - |

---

### paises

**O QUE É:** Países (tabela de domínio)

**PARA QUE SERVE:** Códigos e nomes de países

**RELACIONAMENTOS:** Referenciada por sócios

**REGISTROS ATUAIS:** 765

**TAMANHO:** 64 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| codigo | character varying(10) | ✓ | - |
| descricao | character varying(200) | ✗ | - |

---

### qualificacoes_socios

**O QUE É:** Qualificações de sócios (tabela de domínio)

**PARA QUE SERVE:** Códigos e descrições (Administrador, Sócio, etc.)

**RELACIONAMENTOS:** Referenciada por sócios e empresas

**REGISTROS ATUAIS:** 204

**TAMANHO:** 40 kB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| codigo | character varying(10) | ✓ | - |
| descricao | character varying(200) | ✗ | - |

---

### simples

**O QUE É:** Empresas optantes pelo Simples Nacional e MEI

**PARA QUE SERVE:** Datas de opção e exclusão do Simples Nacional

**RELACIONAMENTOS:** 0..1 simples → 1 empresa (FK: cnpj_basico)

**REGISTROS ATUAIS:** 46,189,169

**TAMANHO:** 4713 MB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| cnpj_basico | character varying(8) | ✗ | - |
| opcao_simples | character varying(1) | ✓ | - |
| data_opcao_simples | date | ✓ | - |
| data_exclusao_simples | date | ✓ | - |
| opcao_mei | character varying(1) | ✓ | - |
| data_opcao_mei | date | ✓ | - |
| data_exclusao_mei | date | ✓ | - |

---

### socios

**O QUE É:** Sócios, administradores e responsáveis das empresas

**PARA QUE SERVE:** Nome, CPF/CNPJ do sócio, qualificação, data de entrada

**RELACIONAMENTOS:** N sócios → 1 empresa (FK: cnpj_basico)

**REGISTROS ATUAIS:** 26,760,175

**TAMANHO:** 7034 MB

**Colunas:**

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|--------|
| cnpj_basico | character varying(8) | ✗ | - |
| identificador_socio | character varying(1) | ✗ | - |
| nome_socio | character varying(500) | ✓ | - |
| cnpj_cpf_socio | character varying(14) | ✓ | - |
| qualificacao_socio | character varying(10) | ✓ | - |
| data_entrada_sociedade | date | ✓ | - |
| pais | character varying(10) | ✓ | - |
| representante_legal | character varying(14) | ✓ | - |
| nome_representante | character varying(500) | ✓ | - |
| qualificacao_representante | character varying(10) | ✓ | - |
| faixa_etaria | character varying(2) | ✓ | - |

---

## 🔗 Relacionamentos (Foreign Keys)

### Diagrama de Relacionamentos

```
empresas (1) ──< estabelecimentos (N)
    │
    ├──< socios (N)
    │
    └──< simples (0..1)
```

### Foreign Keys Explicadas

#### control_audit_batch_id_fkey

- **Relacionamento:** `control_audit.batch_id` → `control_batches.batch_id`

#### control_checkpoints_batch_id_fkey

- **Relacionamento:** `control_checkpoints.batch_id` → `control_batches.batch_id`

#### fk_estabelecimentos_empresa

- **Relacionamento:** `estabelecimentos.cnpj_basico` → `empresas.cnpj_basico`
- **O QUE É:** Cada estabelecimento DEVE pertencer a uma empresa
- **CARDINALIDADE:** N:1 (obrigatório)
- **EXEMPLO:** Uma empresa (matriz) pode ter várias filiais

#### fk_cnaes_sec_estabelecimento

- **Relacionamento:** `estabelecimentos_cnaes_secundarios.cnpj_basico, cnpj_basico, cnpj_basico, cnpj_ordem, cnpj_ordem, cnpj_ordem, cnpj_dv, cnpj_dv, cnpj_dv` → `estabelecimentos.cnpj_dv, cnpj_ordem, cnpj_basico, cnpj_ordem, cnpj_dv, cnpj_basico, cnpj_ordem, cnpj_basico, cnpj_dv`

#### historico_empresas_batch_id_fkey

- **Relacionamento:** `historico_empresas.batch_id` → `control_batches.batch_id`

#### historico_estabelecimentos_batch_id_fkey

- **Relacionamento:** `historico_estabelecimentos.batch_id` → `control_batches.batch_id`

#### historico_simples_batch_id_fkey

- **Relacionamento:** `historico_simples.batch_id` → `control_batches.batch_id`

#### historico_socios_batch_id_fkey

- **Relacionamento:** `historico_socios.batch_id` → `control_batches.batch_id`

#### fk_simples_empresa

- **Relacionamento:** `simples.cnpj_basico` → `empresas.cnpj_basico`
- **O QUE É:** Empresa optante pelo Simples Nacional
- **CARDINALIDADE:** 0..1:1 (opcional)
- **EXEMPLO:** Nem todas as empresas são do Simples

#### fk_socios_empresa

- **Relacionamento:** `socios.cnpj_basico` → `empresas.cnpj_basico`
- **O QUE É:** Cada sócio DEVE estar vinculado a uma empresa
- **CARDINALIDADE:** N:1 (obrigatório)
- **EXEMPLO:** Uma empresa pode ter vários sócios

---

## 🗂️ Índices - Justificativa e Impacto

### cnaes

#### idx_cnaes_descricao

- **Colunas:** 
- **Tipo:** INDEX
- **Tamanho:** 160 kB
- **Scans:** 0

---

### control_audit

#### control_audit_pkey

- **Colunas:** audit_id
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_audit_batch

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_audit_table

- **Colunas:** table_name
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

---

### control_batches

#### control_batches_pkey

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_batches_competencia

- **Colunas:** competencia
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_batches_status

- **Colunas:** status
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 2

#### idx_batches_tipo

- **Colunas:** tipo
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

---

### control_checkpoints

#### control_checkpoints_pkey

- **Colunas:** checkpoint_id
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_checkpoints_batch

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_checkpoints_hash

- **Colunas:** arquivo_hash
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

#### idx_checkpoints_status

- **Colunas:** status
- **Tipo:** INDEX
- **Tamanho:** 16 kB
- **Scans:** 0

---

### empresas

#### idx_empresas_natureza_juridica

- **Colunas:** natureza_juridica
- **Tipo:** INDEX
- **Tamanho:** 434 MB
- **Scans:** 0

#### idx_empresas_porte

- **Colunas:** porte_empresa
- **Tipo:** INDEX
- **Tamanho:** 434 MB
- **Scans:** 0

#### idx_empresas_razao_social

- **Colunas:** razao_social
- **Tipo:** INDEX
- **Tamanho:** 3472 MB
- **Scans:** 0
- **POR QUE:** Busca textual case-insensitive em razão social
- **QUANDO USAR:** WHERE razao_social ILIKE %X%
- **IMPACTO:** 2-10x mais rápido com LIKE/ILIKE

#### idx_empresas_razao_social_fts

- **Colunas:** 
- **Tipo:** INDEX
- **Tamanho:** 2515 MB
- **Scans:** 0

#### pk_empresas

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 1976 MB
- **Scans:** 8,425,773

---

### estabelecimentos

#### idx_estabelecimentos_cep

- **Colunas:** cep
- **Tipo:** INDEX
- **Tamanho:** 496 MB
- **Scans:** 0

#### idx_estabelecimentos_cnae_principal

- **Colunas:** cnae_fiscal_principal
- **Tipo:** INDEX
- **Tamanho:** 456 MB
- **Scans:** 0
- **POR QUE:** Filtra estabelecimentos por atividade econômica
- **QUANDO USAR:** WHERE cnae_fiscal_principal = X
- **IMPACTO:** 10-50x mais rápido

#### idx_estabelecimentos_cnpj_basico

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 2010 MB
- **Scans:** 4
- **POR QUE:** FOREIGN KEY para empresas - Otimiza JOINs
- **QUANDO USAR:** JOIN estabelecimentos com empresas
- **IMPACTO:** 100-3900x mais rápido que Sequential Scan

#### idx_estabelecimentos_data_inicio

- **Colunas:** data_inicio_atividade
- **Tipo:** INDEX
- **Tamanho:** 461 MB
- **Scans:** 0

#### idx_estabelecimentos_data_situacao

- **Colunas:** data_situacao_cadastral
- **Tipo:** INDEX
- **Tamanho:** 459 MB
- **Scans:** 0

#### idx_estabelecimentos_matriz_filial

- **Colunas:** identificador_matriz_filial
- **Tipo:** INDEX
- **Tamanho:** 455 MB
- **Scans:** 0

#### idx_estabelecimentos_municipio

- **Colunas:** municipio
- **Tipo:** INDEX
- **Tamanho:** 457 MB
- **Scans:** 0
- **POR QUE:** Filtra estabelecimentos por município
- **QUANDO USAR:** WHERE municipio = X
- **IMPACTO:** 10-100x mais rápido

#### idx_estabelecimentos_nome_fantasia_fts

- **Colunas:** 
- **Tipo:** INDEX
- **Tamanho:** 381 MB
- **Scans:** 0

#### idx_estabelecimentos_situacao

- **Colunas:** situacao_cadastral
- **Tipo:** INDEX
- **Tamanho:** 455 MB
- **Scans:** 0
- **POR QUE:** Filtra estabelecimentos por situação cadastral (ativa, baixada, etc.)
- **QUANDO USAR:** WHERE situacao_cadastral = X
- **IMPACTO:** 10-100x mais rápido

#### idx_estabelecimentos_uf

- **Colunas:** uf
- **Tipo:** INDEX
- **Tamanho:** 455 MB
- **Scans:** 0
- **POR QUE:** Filtra estabelecimentos por estado
- **QUANDO USAR:** WHERE uf = X ou GROUP BY uf
- **IMPACTO:** 5-50x mais rápido

#### idx_estabelecimentos_uf_cnae_situacao

- **Colunas:** situacao_cadastral, cnae_fiscal_principal, uf
- **Tipo:** INDEX
- **Tamanho:** 188 MB
- **Scans:** 1

#### pk_estabelecimentos

- **Colunas:** cnpj_basico, cnpj_ordem, cnpj_dv
- **Tipo:** INDEX
- **Tamanho:** 3915 MB
- **Scans:** 0

---

### estabelecimentos_cnaes_secundarios

#### idx_cnaes_sec_cnae

- **Colunas:** cnae_secundario
- **Tipo:** INDEX
- **Tamanho:** 758 MB
- **Scans:** 0

#### idx_cnaes_sec_cnpj_basico

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 1659 MB
- **Scans:** 0

#### idx_cnaes_sec_estabelecimento

- **Colunas:** cnpj_basico, cnpj_ordem, cnpj_dv
- **Tipo:** INDEX
- **Tamanho:** 1977 MB
- **Scans:** 0

---

### historico_empresas

#### historico_empresas_pkey

- **Colunas:** historico_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_empresas_batch

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_empresas_cnpj

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_empresas_timestamp

- **Colunas:** timestamp
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

---

### historico_estabelecimentos

#### historico_estabelecimentos_pkey

- **Colunas:** historico_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_estabelecimentos_batch

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_estabelecimentos_cnpj

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_estabelecimentos_timestamp

- **Colunas:** timestamp
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

---

### historico_simples

#### historico_simples_pkey

- **Colunas:** historico_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_simples_batch

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_simples_cnpj

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_simples_timestamp

- **Colunas:** timestamp
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

---

### historico_socios

#### historico_socios_pkey

- **Colunas:** historico_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_socios_batch

- **Colunas:** batch_id
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_socios_cnpj

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

#### idx_hist_socios_timestamp

- **Colunas:** timestamp
- **Tipo:** INDEX
- **Tamanho:** 8192 bytes
- **Scans:** 0

---

### municipios

#### idx_municipios_descricao

- **Colunas:** descricao
- **Tipo:** INDEX
- **Tamanho:** 328 kB
- **Scans:** 0

---

### simples

#### idx_simples_data_mei

- **Colunas:** data_opcao_mei
- **Tipo:** INDEX
- **Tamanho:** 308 MB
- **Scans:** 0

#### idx_simples_data_opcao

- **Colunas:** data_opcao_simples
- **Tipo:** INDEX
- **Tamanho:** 308 MB
- **Scans:** 0

#### idx_simples_mei_optante

- **Colunas:** opcao_mei
- **Tipo:** INDEX
- **Tamanho:** 111 MB
- **Scans:** 0

#### idx_simples_optante

- **Colunas:** opcao_simples
- **Tipo:** INDEX
- **Tamanho:** 163 MB
- **Scans:** 0

#### pk_simples

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 1389 MB
- **Scans:** 0

---

### socios

#### idx_socios_cnpj_basico

- **Colunas:** cnpj_basico
- **Tipo:** INDEX
- **Tamanho:** 631 MB
- **Scans:** 7,866
- **POR QUE:** FOREIGN KEY para empresas - Otimiza JOINs
- **QUANDO USAR:** JOIN sócios com empresas
- **IMPACTO:** 50-500x mais rápido

#### idx_socios_cnpj_cpf_socio

- **Colunas:** cnpj_cpf_socio
- **Tipo:** INDEX
- **Tamanho:** 202 MB
- **Scans:** 0

#### idx_socios_nome

- **Colunas:** nome_socio
- **Tipo:** INDEX
- **Tamanho:** 815 MB
- **Scans:** 0
- **POR QUE:** Busca textual case-insensitive em nome do sócio
- **QUANDO USAR:** WHERE nome_socio ILIKE %X%
- **IMPACTO:** 2-10x mais rápido com LIKE/ILIKE

#### idx_socios_nome_fts

- **Colunas:** 
- **Tipo:** INDEX
- **Tamanho:** 261 MB
- **Scans:** 0

#### idx_socios_qualificacao

- **Colunas:** qualificacao_socio
- **Tipo:** INDEX
- **Tamanho:** 177 MB
- **Scans:** 0

#### socios_unique_idx

- **Colunas:** cnpj_basico, identificador_socio
- **Tipo:** INDEX
- **Tamanho:** 2154 MB
- **Scans:** 0

---

## 📈 Estatísticas do Banco

- **Total de Tabelas:** 18
- **Total de Índices:** 60
- **Total de Registros:** 322,232,081
- **Tamanho Total:** 60 GB

---

## 📖 Dicionário de Dados Completo

### cnaes

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| codigo | character varying(10) | SIM | - | - |
| descricao | text | NÃO | - | - |

### control_audit

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| audit_id | integer | NÃO | nextval('cnpj.control_audit_audit_id_seq'::regclass) | - |
| batch_id | integer | NÃO | - | - |
| table_name | character varying(100) | NÃO | - | - |
| inserts | integer | SIM | 0 | - |
| updates | integer | SIM | 0 | - |
| deletes | integer | SIM | 0 | - |
| timestamp | timestamp without time zone | NÃO | CURRENT_TIMESTAMP | - |

### control_batches

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| batch_id | integer | NÃO | nextval('cnpj.control_batches_batch_id_seq'::regclass) | - |
| tipo | character varying(100) | NÃO | - | - |
| competencia | character varying(7) | NÃO | - | - |
| inicio | timestamp without time zone | NÃO | CURRENT_TIMESTAMP | - |
| fim | timestamp without time zone | SIM | - | - |
| status | character varying(20) | NÃO | 'in_progress'::character varying | - |
| total_arquivos | integer | SIM | 0 | - |
| total_registros | bigint | SIM | 0 | - |
| erro | text | SIM | - | - |

### control_checkpoints

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| checkpoint_id | integer | NÃO | nextval('cnpj.control_checkpoints_checkpoint_id_seq'::regclass) | - |
| batch_id | integer | NÃO | - | - |
| arquivo_nome | character varying(500) | NÃO | - | - |
| arquivo_hash | character varying(64) | NÃO | - | - |
| chunk_numero | integer | SIM | 0 | - |
| rows_processed | integer | SIM | 0 | - |
| status | character varying(20) | NÃO | 'pending'::character varying | - |
| erro | text | SIM | - | - |
| inicio | timestamp without time zone | SIM | - | - |
| fim | timestamp without time zone | SIM | - | - |

### empresas

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| cnpj_basico | character varying(8) | NÃO | - | - |
| razao_social | character varying(500) | SIM | - | - |
| natureza_juridica | character varying(10) | SIM | - | - |
| qualificacao_responsavel | character varying(10) | SIM | - | - |
| capital_social | numeric | SIM | - | - |
| porte_empresa | character varying(2) | SIM | - | - |
| ente_federativo | character varying(100) | SIM | - | - |

### estabelecimentos

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| cnpj_basico | character varying(8) | NÃO | - | - |
| cnpj_ordem | character varying(4) | NÃO | - | - |
| cnpj_dv | character varying(2) | NÃO | - | - |
| identificador_matriz_filial | character varying(1) | SIM | - | - |
| nome_fantasia | character varying(500) | SIM | - | - |
| situacao_cadastral | character varying(2) | SIM | - | - |
| data_situacao_cadastral | date | SIM | - | - |
| motivo_situacao_cadastral | character varying(10) | SIM | - | - |
| nome_cidade_exterior | character varying(200) | SIM | - | - |
| pais | character varying(10) | SIM | - | - |
| data_inicio_atividade | date | SIM | - | - |
| cnae_fiscal_principal | character varying(10) | SIM | - | - |
| cnae_fiscal_secundaria | text | SIM | - | - |
| tipo_logradouro | character varying(100) | SIM | - | - |
| logradouro | character varying(500) | SIM | - | - |
| numero | character varying(50) | SIM | - | - |
| complemento | character varying(200) | SIM | - | - |
| bairro | character varying(200) | SIM | - | - |
| cep | character varying(8) | SIM | - | - |
| uf | character varying(2) | SIM | - | - |
| municipio | character varying(10) | SIM | - | - |
| ddd_1 | character varying(4) | SIM | - | - |
| telefone_1 | character varying(20) | SIM | - | - |
| ddd_2 | character varying(4) | SIM | - | - |
| telefone_2 | character varying(20) | SIM | - | - |
| ddd_fax | character varying(4) | SIM | - | - |
| fax | character varying(20) | SIM | - | - |
| correio_eletronico | character varying(200) | SIM | - | - |
| situacao_especial | character varying(200) | SIM | - | - |
| data_situacao_especial | date | SIM | - | - |

### estabelecimentos_cnaes_secundarios

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| cnpj_basico | character varying(8) | NÃO | - | - |
| cnpj_ordem | character varying(4) | NÃO | - | - |
| cnpj_dv | character varying(2) | NÃO | - | - |
| cnae_secundario | character varying(10) | NÃO | - | - |

### historico_empresas

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| historico_id | bigint | NÃO | nextval('cnpj.historico_empresas_historico_id_seq'::regclass) | - |
| cnpj_basico | character varying(8) | NÃO | - | - |
| operacao | character varying(10) | NÃO | - | - |
| hash_anterior | character varying(32) | SIM | - | - |
| hash_novo | character varying(32) | SIM | - | - |
| batch_id | integer | SIM | - | - |
| timestamp | timestamp without time zone | NÃO | CURRENT_TIMESTAMP | - |

### historico_estabelecimentos

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| historico_id | bigint | NÃO | nextval('cnpj.historico_estabelecimentos_historico_id_seq'::regclass) | - |
| cnpj_basico | character varying(8) | NÃO | - | - |
| operacao | character varying(10) | NÃO | - | - |
| hash_anterior | character varying(32) | SIM | - | - |
| hash_novo | character varying(32) | SIM | - | - |
| batch_id | integer | SIM | - | - |
| timestamp | timestamp without time zone | NÃO | CURRENT_TIMESTAMP | - |

### historico_simples

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| historico_id | bigint | NÃO | nextval('cnpj.historico_simples_historico_id_seq'::regclass) | - |
| cnpj_basico | character varying(8) | NÃO | - | - |
| operacao | character varying(10) | NÃO | - | - |
| hash_anterior | character varying(32) | SIM | - | - |
| hash_novo | character varying(32) | SIM | - | - |
| batch_id | integer | SIM | - | - |
| timestamp | timestamp without time zone | NÃO | CURRENT_TIMESTAMP | - |

### historico_socios

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| historico_id | bigint | NÃO | nextval('cnpj.historico_socios_historico_id_seq'::regclass) | - |
| cnpj_basico | character varying(8) | NÃO | - | - |
| operacao | character varying(10) | NÃO | - | - |
| hash_anterior | character varying(32) | SIM | - | - |
| hash_novo | character varying(32) | SIM | - | - |
| batch_id | integer | SIM | - | - |
| timestamp | timestamp without time zone | NÃO | CURRENT_TIMESTAMP | - |

### motivos_situacao_cadastral

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| codigo | character varying(10) | SIM | - | - |
| descricao | character varying(200) | NÃO | - | - |

### municipios

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| codigo | character varying(10) | SIM | - | - |
| descricao | character varying(200) | NÃO | - | - |

### naturezas_juridicas

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| codigo | character varying(10) | SIM | - | - |
| descricao | character varying(200) | NÃO | - | - |

### paises

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| codigo | character varying(10) | SIM | - | - |
| descricao | character varying(200) | NÃO | - | - |

### qualificacoes_socios

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| codigo | character varying(10) | SIM | - | - |
| descricao | character varying(200) | NÃO | - | - |

### simples

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| cnpj_basico | character varying(8) | NÃO | - | - |
| opcao_simples | character varying(1) | SIM | - | - |
| data_opcao_simples | date | SIM | - | - |
| data_exclusao_simples | date | SIM | - | - |
| opcao_mei | character varying(1) | SIM | - | - |
| data_opcao_mei | date | SIM | - | - |
| data_exclusao_mei | date | SIM | - | - |

### socios

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|----------|
| cnpj_basico | character varying(8) | NÃO | - | - |
| identificador_socio | character varying(1) | NÃO | - | - |
| nome_socio | character varying(500) | SIM | - | - |
| cnpj_cpf_socio | character varying(14) | SIM | - | - |
| qualificacao_socio | character varying(10) | SIM | - | - |
| data_entrada_sociedade | date | SIM | - | - |
| pais | character varying(10) | SIM | - | - |
| representante_legal | character varying(14) | SIM | - | - |
| nome_representante | character varying(500) | SIM | - | - |
| qualificacao_representante | character varying(10) | SIM | - | - |
| faixa_etaria | character varying(2) | SIM | - | - |

