# 📊 Estrutura do Banco de Dados - BaseCerta

**Database:** `basecerta`  
**SGBD:** PostgreSQL  
**Owner:** `aian_db`  
**Data de última atualização:** 24/10/2025

---

## 📑 Índice

1. [Extensões Instaladas](#extensões-instaladas)
2. [Schemas](#schemas)
3. [Schema PUBLIC - Tabelas do Sistema](#schema-public)
4. [Schema CNPJ - Dados CNPJ](#schema-cnpj)
5. [Relacionamentos](#relacionamentos)
6. [Índices Criados](#índices-criados)
7. [Triggers e Funções](#triggers-e-funções)
8. [Scripts SQL de Setup](#scripts-sql-de-setup)
9. [Performance e Estatísticas](#performance-e-estatísticas)

---

## 🔌 Extensões Instaladas

```sql
-- Extensões habilitadas no banco
pg_trgm  v1.6   -- Busca textual com trigrams (ILIKE performático)
plpgsql  v1.0   -- Linguagem procedural PL/pgSQL
```

### pg_trgm (Trigram)
**Função:** Permite buscas textuais eficientes com `ILIKE '%termo%'`  
**Uso:** Índices GIN trigram nas colunas:
- `cnpj.empresas.razao_social`
- `cnpj.estabelecimentos.correio_eletronico`
- `cnpj.estabelecimentos.cnae_fiscal_secundaria`

---

## 📦 Schemas

### 1. **public** - Sistema BaseCerta
Tabelas da aplicação: usuários, créditos, histórico de buscas

### 2. **cnpj** - Dados CNPJ da Receita Federal
Dados públicos de CNPJ: empresas, estabelecimentos, sócios, CNAEs, etc.

---

## 🏢 Schema PUBLIC

### Tabelas do Sistema

| Tabela | Registros | Tamanho | Descrição |
|--------|-----------|---------|-----------|
| `users` | 1 | 64 kB | Usuários do sistema |
| `user_credits` | 1 | 88 kB | Saldo de créditos por usuário |
| `credit_transactions` | 0 | 24 kB | Histórico de transações de créditos |
| `credit_packages` | 4 | 48 kB | Pacotes de créditos disponíveis |
| `plans` | 4 | 64 kB | Planos de assinatura |
| `pesquisa_cnpj` | 0 | 176 kB | Histórico de buscas Smart CNPJ |
| `alembic_version` | 1 | 24 kB | Controle de migrações Alembic |

---

### 📋 Estrutura Detalhada: public.users

```sql
Table "public.users"
Column        | Type                        | Nullable | Default
--------------|-----------------------------|----------|---------------------------
email         | character varying(255)      | not null |
full_name     | character varying(255)      | not null |
is_active     | boolean                     | not null |
is_superuser  | boolean                     | not null |
id            | integer                     | not null | nextval('users_id_seq')
created_at    | timestamp without time zone | not null |
updated_at    | timestamp without time zone | not null |

Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "ix_users_email" UNIQUE, btree (email)
    "ix_users_id" btree (id)

Referenced by:
    TABLE "credit_transactions" FOREIGN KEY (user_id) REFERENCES users(id)
    TABLE "pesquisa_cnpj" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    TABLE "user_credits" FOREIGN KEY (user_id) REFERENCES users(id)
```

**Usuário de Teste:**
- ID: 1
- Email: teste@basecerta.com
- Créditos iniciais: 10.000

---

### 💳 Estrutura Detalhada: public.user_credits

```sql
Table "public.user_credits"
Column        | Type                        | Nullable | Default
--------------|-----------------------------|----------|---------------------------
user_id       | integer                     | not null |
balance       | integer                     | not null |
total_earned  | integer                     | not null |
total_spent   | integer                     | not null |
id            | integer                     | not null | nextval('user_credits_id_seq')
created_at    | timestamp without time zone | not null |
updated_at    | timestamp without time zone | not null |

Indexes:
    "user_credits_pkey" PRIMARY KEY, btree (id)
    "ix_user_credits_id" btree (id)
    "user_credits_user_id_key" UNIQUE CONSTRAINT, btree (user_id)

Foreign-key constraints:
    "user_credits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
```

**Campos:**
- `balance`: Saldo atual de créditos
- `total_earned`: Total de créditos ganhos (histórico)
- `total_spent`: Total de créditos gastos (histórico)

---

### 🔍 Estrutura Detalhada: public.pesquisa_cnpj

```sql
Table "public.pesquisa_cnpj"
Column             | Type                        | Nullable | Default
-------------------|-----------------------------|----------|-------------------
id                 | uuid                        | not null | gen_random_uuid()
user_id            | integer                     | not null |
tipo_busca         | character varying(20)       | not null |
valor_busca        | text                        | not null |
filtros_aplicados  | jsonb                       |          |
total_resultados   | integer                     |          |
creditos_usados    | integer                     | not null | 5
tempo_resposta_ms  | integer                     |          |
created_at         | timestamp without time zone |          | CURRENT_TIMESTAMP
updated_at         | timestamp without time zone |          | CURRENT_TIMESTAMP
cnpj_encontrado    | character varying(18)       |          |

Indexes:
    "pesquisa_cnpj_pkey" PRIMARY KEY, btree (id)
    "idx_pesquisa_cnpj" btree (cnpj_encontrado)
    "idx_pesquisa_created_at" btree (created_at DESC)
    "idx_pesquisa_filtros_gin" gin (filtros_aplicados)
    "idx_pesquisa_tipo_busca" btree (tipo_busca)
    "idx_pesquisa_user_created" btree (user_id, created_at DESC)
    "idx_pesquisa_user_id" btree (user_id)

Check constraints:
    "pesquisa_cnpj_tipo_busca_check" CHECK (tipo_busca IN (
        'cnpj', 'razao_social', 'segmento', 'email', 
        'telefone', 'nome_socio', 'cep'
    ))

Foreign-key constraints:
    "pesquisa_cnpj_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

Triggers:
    trg_registrar_uso_credito AFTER INSERT
```

**Tipos de Busca Suportados:**
1. `cnpj` - Busca por CNPJ específico
2. `razao_social` - Busca por razão social (ILIKE)
3. `segmento` - Busca por CNAE
4. `email` - Busca por email
5. `telefone` - Busca por telefone
6. `nome_socio` - Busca por nome de sócio
7. `cep` - Busca por CEP

**Custo de Créditos:** 5 créditos por busca (padrão)

---

## 🏭 Schema CNPJ

### Tabelas de Dados CNPJ

| Tabela | Registros | Tamanho | Descrição |
|--------|-----------|---------|-----------|
| `empresas` | 64.906.177 | 23 GB | Empresas (CNPJ básico) |
| `estabelecimentos` | 68.072.706 | 30 GB | Estabelecimentos (matriz + filiais) |
| `socios` | 26.510.294 | 5.2 GB | Sócios das empresas |
| `simples` | 0 | 4.3 GB | Optantes pelo Simples Nacional |
| `cnaes` | 2.718 | 376 kB | Códigos CNAE |
| `municipios` | 5.572 | 592 kB | Municípios brasileiros |
| `naturezas_juridicas` | 91 | 40 kB | Naturezas jurídicas |
| `qualificacoes_socios` | 68 | 40 kB | Qualificações de sócios |
| `motivos_situacao_cadastral` | 0 | 56 kB | Motivos de situação cadastral |
| `paises` | 0 | 88 kB | Países |

**Total de Dados:** ~58 GB de dados CNPJ

---

### 🏢 Estrutura Detalhada: cnpj.empresas

```sql
Table "cnpj.empresas"
Column                       | Type                   | Nullable
-----------------------------|------------------------|----------
cnpj_basico                  | character varying(8)   | not null (PK)
razao_social                 | character varying(500) | not null
natureza_juridica            | character varying(10)  |
qualificacao_responsavel     | character varying(5)   |
capital_social               | numeric(18,2)          |
porte_empresa                | character varying(2)   |
ente_federativo_responsavel  | character varying(100) |

Indexes:
    "empresas_pkey" PRIMARY KEY, btree (cnpj_basico)
    "idx_empresas_cnpj_basico" btree (cnpj_basico)
    "idx_empresas_razao_social" btree (razao_social)
    "idx_empresas_razao_social_gin_trgm" gin (razao_social gin_trgm_ops) ⭐
    "idx_empresas_razao" gin (to_tsvector('portuguese', razao_social))
    "idx_empresas_capital_social" btree (capital_social)
    "idx_empresas_porte" btree (porte_empresa)
    "idx_empresas_porte_capital" btree (porte_empresa, capital_social)
    "idx_empresas_natureza" btree (natureza_juridica)

Foreign-key constraints:
    "fk_natureza" FOREIGN KEY (natureza_juridica) 
        REFERENCES cnpj.naturezas_juridicas(codigo)
    "fk_qualif_resp" FOREIGN KEY (qualificacao_responsavel) 
        REFERENCES cnpj.qualificacoes_socios(codigo)

Referenced by:
    TABLE "cnpj.estabelecimentos" FOREIGN KEY (cnpj_basico) 
        REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
    TABLE "cnpj.socios" FOREIGN KEY (cnpj_basico) 
        REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
    TABLE "cnpj.simples" FOREIGN KEY (cnpj_basico) 
        REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
```

**Campos Principais:**
- `cnpj_basico`: Primeiros 8 dígitos do CNPJ (identifica a empresa)
- `razao_social`: Nome empresarial da empresa
- `capital_social`: Capital social declarado
- `porte_empresa`: 01=ME, 03=EPP, 05=Demais

⭐ **Índice Crítico de Performance:**
`idx_empresas_razao_social_gin_trgm` permite buscas `ILIKE '%termo%'` em ~100ms

---

### 🏪 Estrutura Detalhada: cnpj.estabelecimentos

```sql
Table "cnpj.estabelecimentos"
Column                      | Type                   | Nullable
----------------------------|------------------------|----------
cnpj_basico                 | character varying(8)   | not null (PK1)
cnpj_ordem                  | character varying(4)   | not null (PK2)
cnpj_dv                     | character varying(2)   | not null (PK3)
identificador_matriz_filial | character varying(1)   | -- 1=Matriz, 2=Filial
nome_fantasia               | character varying(500) |
situacao_cadastral          | character varying(2)   | -- 02=Ativa, 08=Baixada
data_situacao_cadastral     | date                   |
motivo_situacao_cadastral   | character varying(5)   |
data_inicio_atividade       | date                   |
cnae_fiscal_principal       | character varying(10)  |
cnae_fiscal_secundaria      | text                   | -- CSV de códigos
tipo_logradouro             | character varying(50)  |
logradouro                  | character varying(500) |
numero                      | character varying(20)  |
complemento                 | character varying(300) |
bairro                      | character varying(100) |
cep                         | character varying(8)   |
uf                          | character varying(2)   |
municipio                   | character varying(10)  |
ddd_1                       | character varying(5)   |
telefone_1                  | character varying(20)  |
ddd_2                       | character varying(5)   |
telefone_2                  | character varying(20)  |
correio_eletronico          | character varying(200) |
... (30 colunas total)

Indexes: (28 índices total)
    "estabelecimentos_pkey" PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv)
    "idx_estab_cnpj_completo" btree (cnpj_basico, cnpj_ordem, cnpj_dv)
    "idx_estab_cnae" btree (cnae_fiscal_principal)
    "idx_estab_email_gin" gin (correio_eletronico gin_trgm_ops) ⭐
    "idx_estab_telefone_concat" btree ((ddd_1 || telefone_1))
    "idx_estab_cep" btree (cep)
    "idx_estab_uf" btree (uf)
    "idx_estab_municipio" btree (municipio)
    "idx_estab_situacao" btree (situacao_cadastral)
    "idx_estab_matriz_filial" btree (identificador_matriz_filial)
    "idx_estab_data_atividade" btree (data_inicio_atividade)
    "idx_estab_uf_situacao" btree (uf, situacao_cadastral)
    "idx_estab_uf_mun_sit" btree (uf, municipio, situacao_cadastral)
    "idx_estab_situacao_data" btree (situacao_cadastral, data_inicio_atividade)
    "idx_estab_cnae_secundaria_gin" gin (cnae_fiscal_secundaria gin_trgm_ops)
    "idx_estab_nome_fantasia" gin (to_tsvector('portuguese', nome_fantasia))
    "idx_estab_matriz_ativa" btree (cnpj_basico) 
        WHERE identificador_matriz_filial = '1' AND situacao_cadastral = '02'
    "idx_estab_sem_nome_fantasia" btree (cnpj_basico) 
        WHERE nome_fantasia IS NULL

Foreign-key constraints:
    "fk_empresa" FOREIGN KEY (cnpj_basico) 
        REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
    "fk_cnae_principal" FOREIGN KEY (cnae_fiscal_principal) 
        REFERENCES cnpj.cnaes(codigo)
    "fk_municipio" FOREIGN KEY (municipio) 
        REFERENCES cnpj.municipios(codigo)
```

**CNPJ Completo:** `cnpj_basico (8) + cnpj_ordem (4) + cnpj_dv (2) = 14 dígitos`

**Índices Parciais de Performance:**
- `idx_estab_matriz_ativa`: Somente matrizes ativas (otimização para 90% das queries)
- `idx_estab_sem_nome_fantasia`: Empresas sem nome fantasia

---

### 👥 Estrutura Detalhada: cnpj.socios

```sql
Table "cnpj.socios"
Column                          | Type                   | Nullable
--------------------------------|------------------------|----------
id                              | integer                | not null (PK, serial)
cnpj_basico                     | character varying(8)   | not null (FK)
identificador_socio             | character varying(1)   | -- 1=PJ, 2=PF, 3=Estrangeiro
nome_socio                      | character varying(500) |
cnpj_cpf_socio                  | character varying(14)  |
qualificacao_socio              | character varying(5)   |
data_entrada_sociedade          | date                   |
pais                            | character varying(5)   |
representante_legal             | character varying(11)  |
nome_representante              | character varying(300) |
qualificacao_representante_legal| character varying(5)   |
faixa_etaria                    | character varying(1)   |

Indexes:
    "socios_pkey" PRIMARY KEY, btree (id)
    "idx_socios_cnpj" btree (cnpj_basico)
    "idx_socios_cpf_cnpj" btree (cnpj_cpf_socio)
    "idx_socios_tipo" btree (identificador_socio)
    "idx_socios_nome" gin (to_tsvector('portuguese', nome_socio))

Foreign-key constraints:
    "fk_socios_empresa" FOREIGN KEY (cnpj_basico) 
        REFERENCES cnpj.empresas(cnpj_basico) ON DELETE CASCADE
    "fk_socios_qualif" FOREIGN KEY (qualificacao_socio) 
        REFERENCES cnpj.qualificacoes_socios(codigo)
```

---

## 🔗 Relacionamentos

### Diagrama de Relacionamentos Principais

```
┌─────────────────┐
│ public.users    │
│ (id)            │
└────────┬────────┘
         │ 1
         │
         │ N
    ┌────┴────────────────┬──────────────────┐
    │                     │                  │
┌───▼──────────┐  ┌───────▼─────────┐  ┌────▼─────────────┐
│user_credits  │  │credit_trans...  │  │pesquisa_cnpj     │
└──────────────┘  └─────────────────┘  └──────────────────┘

┌─────────────────┐
│ cnpj.empresas   │
│ (cnpj_basico)   │
└────────┬────────┘
         │ 1
         │
    ┌────┴────────────────┬──────────────┐
    │ N                   │ N            │ N
┌───▼──────────────┐  ┌───▼────────┐  ┌─▼───────┐
│estabelecimentos  │  │socios      │  │simples  │
│(cnpj_completo)   │  │            │  │         │
└──────────────────┘  └────────────┘  └─────────┘
```

### Cascatas de Delete

**ON DELETE CASCADE implementado:**
- `cnpj.empresas` → `cnpj.estabelecimentos`
- `cnpj.empresas` → `cnpj.socios`
- `cnpj.empresas` → `cnpj.simples`
- `public.users` → `public.pesquisa_cnpj`

---

## 📊 Índices Criados

### Índices de Performance Crítica (GIN Trigram)

**Criados para otimizar buscas com ILIKE '%termo%':**

```sql
-- ⭐ CRÍTICO: Busca por Razão Social (reduz de 37s para 100ms)
idx_empresas_razao_social_gin_trgm
  ON cnpj.empresas USING gin (razao_social gin_trgm_ops)

-- ⭐ Busca por Email
idx_estab_email_gin
  ON cnpj.estabelecimentos USING gin (correio_eletronico gin_trgm_ops)

-- CNAE Secundário (array de códigos em texto)
idx_estab_cnae_secundaria_gin
  ON cnpj.estabelecimentos USING gin (cnae_fiscal_secundaria gin_trgm_ops)
```

### Índices Compostos (Filtros Combinados)

```sql
-- UF + Situação (ex: "empresas ativas em SP")
idx_estab_uf_situacao (uf, situacao_cadastral)

-- Porte + Capital Social (ex: "grandes empresas com capital > 1M")
idx_empresas_porte_capital (porte_empresa, capital_social)

-- Situação + Data (ex: "empresas ativas abertas em 2023")
idx_estab_situacao_data (situacao_cadastral, data_inicio_atividade)

-- UF + Município + Situação (filtro geográfico detalhado)
idx_estab_uf_mun_sit (uf, municipio, situacao_cadastral)
```

### Índices Parciais (Otimizações Específicas)

```sql
-- Apenas matrizes ativas (90% das queries)
idx_estab_matriz_ativa
  WHERE identificador_matriz_filial = '1' AND situacao_cadastral = '02'

-- Empresas sem nome fantasia
idx_estab_sem_nome_fantasia
  WHERE nome_fantasia IS NULL
```

### Total de Índices

- **Schema CNPJ:** 44 índices
- **Schema PUBLIC:** 15 índices
- **Total:** 59 índices

---

## ⚡ Triggers e Funções

### Trigger: Débito Automático de Créditos

```sql
CREATE FUNCTION registrar_uso_credito()
RETURNS TRIGGER AS $$
BEGIN
    -- Debitar créditos do usuário
    UPDATE public.user_credits
    SET 
        balance = balance - NEW.creditos_usados,
        total_spent = total_spent + NEW.creditos_usados,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Registrar transação no histórico
    INSERT INTO public.credit_transactions (
        user_id, type, amount, balance_after, description
    ) SELECT 
        NEW.user_id, 'debit', NEW.creditos_usados, 
        uc.balance,
        CONCAT('Busca Smart CNPJ: ', NEW.tipo_busca)
    FROM public.user_credits uc
    WHERE uc.user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Associar trigger à tabela pesquisa_cnpj
CREATE TRIGGER trg_registrar_uso_credito
    AFTER INSERT ON public.pesquisa_cnpj
    FOR EACH ROW
    EXECUTE FUNCTION registrar_uso_credito();
```

**Funcionamento:**
1. Ao inserir registro em `pesquisa_cnpj`
2. Trigger debita automaticamente `creditos_usados` do saldo
3. Registra transação em `credit_transactions`
4. Atualiza `total_spent` no histórico

⚠️ **Validação de saldo:** Feita na camada da aplicação (antes do INSERT)

---

## 📜 Scripts SQL de Setup

### Arquivo: `backend/scripts/00_cleanup_old_tables.sql`

**Objetivo:** Remover tabelas duplicadas antigas do schema `public`

**Tabelas removidas:**
- `public.pessoa_juridica` (duplicava dados de `cnpj.empresas`)
- `public.endereco_empresa` (dados em `cnpj.estabelecimentos`)
- `public.cnae_empresa` (dados em `cnpj.cnaes`)
- `public.socio_empresa` (dados em `cnpj.socios`)
- `public.historico_dividas_empresa`
- `public.redes_sociais_empresa`

**Decisão Arquitetural:** Usar diretamente o schema `cnpj` da Receita Federal

---

### Arquivo: `backend/scripts/01_descobrir_estrutura.sql`

**Objetivo:** Script de análise/descoberta da estrutura do banco

**Queries executadas:**
```sql
-- Listar tabelas por schema
SELECT schemaname, tablename FROM pg_tables;

-- Buscar tabelas relacionadas a CNPJ
SELECT tablename FROM pg_tables 
WHERE tablename ILIKE '%cnpj%' 
   OR tablename ILIKE '%empresa%';

-- Ver estrutura completa de tabela
\d+ nome_da_tabela
```

---

### Arquivo: `backend/scripts/02_create_indexes.sql`

**Objetivo:** Criar índices de performance para Smart CNPJ

**Índices Criados:** (versão atual atualizada em 24/10/2025)

```sql
-- ✅ Extensão trigram
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ✅ Busca por Razão Social (CRÍTICO - 99,7% mais rápido)
CREATE INDEX idx_empresas_razao_social_gin_trgm 
ON cnpj.empresas USING gin (razao_social gin_trgm_ops);

-- ✅ Busca por Email
CREATE INDEX idx_estab_email_gin 
ON cnpj.estabelecimentos USING gin (correio_eletronico gin_trgm_ops);

-- ✅ Busca por Telefone (concatenado)
CREATE INDEX idx_estab_telefone_concat 
ON cnpj.estabelecimentos ((ddd_1 || telefone_1));

-- ✅ Busca por CEP
CREATE INDEX idx_estab_cep 
ON cnpj.estabelecimentos (cep);

-- ✅ Filtro por Data de Abertura
CREATE INDEX idx_estab_data_atividade 
ON cnpj.estabelecimentos (data_inicio_atividade);

-- ✅ Índices compostos (ver seção "Índices Criados")
-- ... (14 índices adicionais)
```

**Performance Obtida:**
- Busca por CNPJ: ~55ms
- Busca por Razão Social: ~82ms (era 37 segundos!)
- Busca por CNAE: ~132ms

---

### Arquivo: `backend/scripts/03_create_support_tables.sql`

**Objetivo:** Criar tabela `pesquisa_cnpj` e triggers

**Estruturas criadas:**
1. ✅ Verificação de usuário teste (ID=1, 10.000 créditos)
2. ✅ Tabela `public.pesquisa_cnpj`
3. ✅ 7 índices na tabela de pesquisas
4. ✅ Função `registrar_uso_credito()`
5. ✅ Trigger `trg_registrar_uso_credito`

**Tabelas NÃO criadas (já existiam):**
- `users`, `user_credits`, `credit_transactions`
- `plans`, `credit_packages`
- `alembic_version`

---

## 📈 Performance e Estatísticas

### Tamanho do Banco

```
Total do Schema CNPJ:  ~58 GB
Total do Schema PUBLIC: ~500 KB
Total do Banco:        ~58 GB
```

### Registros por Tabela

| Tabela | Registros Vivos | Última Análise |
|--------|-----------------|----------------|
| `cnpj.estabelecimentos` | 68.072.706 | 24/10/2025 09:30 |
| `cnpj.empresas` | 64.906.177 | 24/10/2025 17:23 |
| `cnpj.socios` | 26.510.294 | 24/10/2025 09:30 |
| `cnpj.municipios` | 5.572 | 24/10/2025 09:30 |
| `cnpj.cnaes` | 2.718 | 24/10/2025 09:30 |

### Performance de Queries

**Benchmark (Smart CNPJ Search):**

| Tipo de Busca | Tempo Médio | Índice Usado |
|---------------|-------------|--------------|
| CNPJ (exato) | 55ms | `idx_estab_cnpj_completo` (btree) |
| Razão Social (ILIKE) | 82ms | `idx_empresas_razao_social_gin_trgm` ⭐ |
| CNAE/Segmento | 132ms | `idx_estab_cnae` (btree) |
| Email | ~timeout | `idx_estab_email_gin` (investigar) |
| Telefone | ~timeout | `idx_estab_telefone_concat` (investigar) |

⭐ **Otimização Crítica:** Índice GIN trigram reduziu busca por razão social de **37 segundos para 82ms** (melhoria de 99,7%)

### Manutenção

**Auto-Vacuum Status:**
- ✅ Ativo para todas as tabelas
- ✅ Última execução: 24/10/2025
- ✅ Estatísticas atualizadas via `ANALYZE`

---

## 🔍 Queries Úteis

### Verificar uso de índice em query

```sql
EXPLAIN ANALYZE
SELECT * FROM cnpj.empresas 
WHERE razao_social ILIKE '%shoptudo%'
LIMIT 20;
```

### Tamanho de índices

```sql
SELECT 
    schemaname, tablename, indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes 
WHERE schemaname = 'cnpj'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Estatísticas de tabelas

```sql
SELECT 
    schemaname, relname,
    n_live_tup, n_dead_tup,
    last_vacuum, last_analyze
FROM pg_stat_user_tables
WHERE schemaname IN ('public', 'cnpj')
ORDER BY n_live_tup DESC;
```

---

## 📝 Notas Importantes

1. **Banco Externo ao Docker:** PostgreSQL roda na máquina host (não em container)
   - Acesso via `host.docker.internal` do Docker
   - Conexão direta via `localhost` da máquina

2. **Dados de Produção:** Schema `cnpj` contém dados reais da Receita Federal
   - ~65 milhões de empresas
   - ~68 milhões de estabelecimentos
   - Atualização: conforme releases da Receita

3. **Créditos:** Sistema implementado mas triggers podem falhar se usuário não tiver saldo
   - Validação de saldo deve ser feita ANTES do INSERT
   - Ver arquivo: `backend/app/crud/credits.py`

4. **Performance:** Índices GIN trigram são ESSENCIAIS
   - Sem eles, buscas textuais levam 30-40 segundos
   - Com eles, buscas levam 80-150ms

---

**Última atualização deste documento:** 24/10/2025 20:00  
**Responsável:** Sistema de IA  
**Versão:** 1.0
