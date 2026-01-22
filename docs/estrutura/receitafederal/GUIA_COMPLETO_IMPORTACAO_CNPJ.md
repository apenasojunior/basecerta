# Guia Completo - Importação CNPJ Receita Federal

**Versão**: 2.1 (Atualizado - Foreign Keys)  
**Data**: 20/01/2026  
**Database**: PostgreSQL 17 + Disco Externo Samsung T7  
**⚠️ IMPORTANTE**: Foreign Keys removidas durante importação. Consulte [PROXIMOS_PASSOS_IMPORTACAO.md](PROXIMOS_PASSOS_IMPORTACAO.md)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura dos Dados](#estrutura-dos-dados)
3. [Configuração PostgreSQL Disco Externo](#configuração-postgresql-disco-externo)
4. [Arquitetura de Importação](#arquitetura-de-importação)
5. [Qualidade dos Dados](#qualidade-dos-dados)
6. [Execução da Importação](#execução-da-importação)
7. [Otimização de Performance](#otimização-de-performance)
8. [Manutenção e Atualizações Mensais](#manutenção-e-atualizações-mensais)
9. [Troubleshooting](#troubleshooting)

---

## 1. Visão Geral

### 1.1 Sistema Atual

```
PostgreSQL 17 (rodando no disco externo)
├─ Database: basecerta
├─ Schema: cnpj_brasil
├─ Localização: /Volumes/ExtMB/postgresql/data/
└─ Dados Receita: /Volumes/ExtMB/BaseCNPJ/dez2025/ (41 arquivos, ~7GB)
```

### 1.2 Capacidade e Volumes

**Dados Completos da Receita Federal (Dezembro 2025):**
- **Empresas**: ~52 milhões de registros
- **Estabelecimentos**: ~68 milhões de registros
- **Simples Nacional**: ~46 milhões de registros
- **Sócios**: ~26 milhões de registros
- **Auxiliares**: 6 tabelas de referência (CNAEs, Municípios, etc.)

**Espaço em Disco:**
- Dados comprimidos (ZIP): ~7 GB
- Dados importados no PostgreSQL: ~200 GB
- Pico durante importação: ~220 GB (inclui tabelas temporárias)
- Disco externo disponível: 932 GB

### 1.3 Hardware e Performance

**Disco Externo Samsung PSSD T7:**
- Capacidade: 1 TB (932 GB livres)
- Interface: USB 3.2 Gen 2
- Velocidade medida: 842 MB/s (escrita sequencial)
- Tipo: SSD NVMe interno (não é HDD)
- Filesystem: HFS+ (funcional, APFS seria melhor)

**Estimativas de Tempo:**
- Importação inicial (com tuning): **6-8 horas**
- Importação inicial (sem tuning): **8-10 horas**
- Atualizações mensais: **4-5 horas** (apenas delta de mudanças)

---

## 2. Estrutura dos Dados

### 2.1 Arquivos da Receita Federal

#### Principais (37 arquivos)
```
Empresas (10 arquivos)
├─ Empresas0.zip (460 MB)
├─ Empresas1.zip (74 MB)
├─ Empresas2.zip (75 MB)
├─ Empresas3.zip (81 MB)
├─ Empresas4.zip (80 MB)
├─ Empresas5.zip (84 MB)
├─ Empresas6.zip (83 MB)
├─ Empresas7.zip (85 MB)
├─ Empresas8.zip (94 MB)
└─ Empresas9.zip (95 MB)

Estabelecimentos (10 arquivos)
├─ Estabelecimentos0.zip (1.8 GB)
├─ Estabelecimentos1.zip (320 MB)
├─ Estabelecimentos2.zip (322 MB)
├─ Estabelecimentos3.zip (327 MB)
├─ Estabelecimentos4.zip (331 MB)
├─ Estabelecimentos5.zip (335 MB)
├─ Estabelecimentos6.zip (334 MB)
├─ Estabelecimentos7.zip (336 MB)
├─ Estabelecimentos8.zip (341 MB)
└─ Estabelecimentos9.zip (343 MB)

Simples (10 arquivos)
├─ Simples0.zip ~ Simples9.zip
└─ (~40-90 MB cada)

Socios (10 arquivos)
├─ Socios0.zip ~ Socios9.zip
└─ (~50-270 MB cada)
```

#### Auxiliares (6 arquivos)
```
Cnaes.zip           (22 KB)   - Códigos de atividade econômica
Motivos.zip         (2.3 KB)  - Motivos de situação cadastral
Municipios.zip      (126 KB)  - Códigos de municípios
Naturezas.zip       (1.7 KB)  - Naturezas jurídicas
Paises.zip          (5.7 KB)  - Códigos de países
Qualificacoes.zip   (1.5 KB)  - Qualificações de sócios
```

### 2.2 Estrutura de Campos

#### Empresas (7 campos)
```csv
cnpj_basico;razao_social;natureza_juridica;qualificacao_responsavel;
capital_social;porte_empresa;ente_federativo
```

#### Estabelecimentos (30 campos)
```csv
cnpj_basico;cnpj_ordem;cnpj_dv;identificador_matriz_filial;nome_fantasia;
situacao_cadastral;data_situacao_cadastral;motivo_situacao_cadastral;
nome_cidade_exterior;pais;data_inicio_atividade;cnae_fiscal_principal;
cnae_fiscal_secundaria;tipo_logradouro;logradouro;numero;complemento;
bairro;cep;uf;municipio;ddd_1;telefone_1;ddd_2;telefone_2;ddd_fax;fax;
email;situacao_especial;data_situacao_especial
```

#### Simples Nacional (7 campos)
```csv
cnpj_basico;opcao_simples;data_opcao_simples;data_exclusao_simples;
opcao_mei;data_opcao_mei;data_exclusao_mei
```

#### Sócios (11 campos)
```csv
cnpj_basico;identificador_socio;nome_socio;cpf_cnpj_socio;
qualificacao_socio;data_entrada_sociedade;pais;representante_legal;
nome_representante;qualificacao_representante;faixa_etaria
```

### 2.3 Schema PostgreSQL

```sql
-- Schema principal
CREATE SCHEMA IF NOT EXISTS cnpj_brasil;

-- Tabela Empresas
CREATE TABLE cnpj_brasil.empresas (
    cnpj_basico TEXT PRIMARY KEY,
    razao_social TEXT,
    natureza_juridica TEXT,
    qualificacao_responsavel TEXT,
    capital_social NUMERIC(15,2),
    porte_empresa TEXT,
    ente_federativo TEXT,
    razao_social_tsvector TSVECTOR,  -- Full-text search
    versao_importacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Estabelecimentos
CREATE TABLE cnpj_brasil.estabelecimentos (
    cnpj_basico TEXT NOT NULL,
    cnpj_ordem TEXT NOT NULL,
    cnpj_dv TEXT NOT NULL,
    identificador_matriz_filial TEXT,
    nome_fantasia TEXT,
    situacao_cadastral TEXT,
    data_situacao_cadastral DATE,
    motivo_situacao_cadastral TEXT,
    nome_cidade_exterior TEXT,
    pais TEXT,
    data_inicio_atividade DATE,
    cnae_fiscal_principal TEXT,
    cnae_fiscal_secundaria TEXT,
    tipo_logradouro TEXT,
    logradouro TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cep TEXT,
    uf TEXT,
    municipio TEXT,
    ddd_1 TEXT,
    telefone_1 TEXT,
    ddd_2 TEXT,
    telefone_2 TEXT,
    ddd_fax TEXT,
    fax TEXT,
    email TEXT,
    situacao_especial TEXT,
    data_situacao_especial DATE,
    nome_fantasia_tsvector TSVECTOR,
    versao_importacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv),
    FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)
);

-- Tabela Simples Nacional
CREATE TABLE cnpj_brasil.simples_nacional (
    cnpj_basico TEXT PRIMARY KEY,
    opcao_simples TEXT,
    data_opcao_simples DATE,
    data_exclusao_simples DATE,
    opcao_mei TEXT,
    data_opcao_mei DATE,
    data_exclusao_mei DATE,
    versao_importacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)
);

-- Tabela Sócios
CREATE TABLE cnpj_brasil.socios (
    cnpj_basico TEXT NOT NULL,
    identificador_socio TEXT NOT NULL,
    nome_socio TEXT NOT NULL,
    cpf_cnpj_socio TEXT,
    qualificacao_socio TEXT,
    data_entrada_sociedade DATE,
    pais TEXT,
    representante_legal TEXT,
    nome_representante TEXT,
    qualificacao_representante TEXT,
    faixa_etaria TEXT,
    versao_importacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cnpj_basico, identificador_socio, nome_socio),
    FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)
);

-- Tabelas auxiliares (schema public)
CREATE TABLE cnaes (codigo TEXT PRIMARY KEY, descricao TEXT);
CREATE TABLE motivos_situacao_cadastral (codigo TEXT PRIMARY KEY, descricao TEXT);
CREATE TABLE municipios (codigo TEXT PRIMARY KEY, descricao TEXT);
CREATE TABLE naturezas_juridicas (codigo TEXT PRIMARY KEY, descricao TEXT);
CREATE TABLE paises (codigo TEXT PRIMARY KEY, descricao TEXT);
CREATE TABLE qualificacoes_socios (codigo TEXT PRIMARY KEY, descricao TEXT);

-- Tabela de log de importações
CREATE TABLE cnpj_brasil.import_log (
    id SERIAL PRIMARY KEY,
    versao_importacao TEXT,
    data_importacao TIMESTAMP,
    status TEXT,
    observacoes TEXT
);

-- Índices
CREATE INDEX idx_empresas_razao_social ON cnpj_brasil.empresas(razao_social);
CREATE INDEX idx_empresas_razao_tsvector ON cnpj_brasil.empresas USING GIN(razao_social_tsvector);
CREATE INDEX idx_estabelecimentos_cnpj ON cnpj_brasil.estabelecimentos(cnpj_basico, cnpj_ordem, cnpj_dv);
CREATE INDEX idx_estabelecimentos_uf ON cnpj_brasil.estabelecimentos(uf);
CREATE INDEX idx_estabelecimentos_municipio ON cnpj_brasil.estabelecimentos(municipio);
CREATE INDEX idx_estabelecimentos_situacao ON cnpj_brasil.estabelecimentos(situacao_cadastral);
CREATE INDEX idx_estabelecimentos_fantasia_tsvector ON cnpj_brasil.estabelecimentos USING GIN(nome_fantasia_tsvector);
CREATE INDEX idx_socios_nome ON cnpj_brasil.socios(nome_socio);
CREATE INDEX idx_socios_cpf_cnpj ON cnpj_brasil.socios(cpf_cnpj_socio);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER empresas_updated_at BEFORE UPDATE ON cnpj_brasil.empresas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER estabelecimentos_updated_at BEFORE UPDATE ON cnpj_brasil.estabelecimentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER simples_updated_at BEFORE UPDATE ON cnpj_brasil.simples_nacional
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER socios_updated_at BEFORE UPDATE ON cnpj_brasil.socios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Views úteis
CREATE VIEW cnpj_brasil.v_cnpjs_completos AS
SELECT 
    e.cnpj_basico || est.cnpj_ordem || est.cnpj_dv AS cnpj_completo,
    e.razao_social,
    est.nome_fantasia,
    est.situacao_cadastral,
    est.uf,
    est.municipio,
    est.email
FROM cnpj_brasil.empresas e
INNER JOIN cnpj_brasil.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico;

CREATE VIEW cnpj_brasil.v_empresas_ativas AS
SELECT *
FROM cnpj_brasil.estabelecimentos
WHERE situacao_cadastral = '02';  -- 02 = Ativa
```

---

## 3. Configuração PostgreSQL Disco Externo

### 3.1 Por que Usar Disco Externo?

**Motivos:**
1. **Espaço**: 932 GB disponíveis vs ~100 GB no disco interno
2. **Isolamento**: Dados não competem com sistema operacional
3. **Mobilidade**: Pode desconectar e usar em outro Mac
4. **Backup**: Dados separados facilitam backup/restauração
5. **Performance**: Samsung T7 (842 MB/s) é quase tão rápido quanto SSD interno

**Trade-offs:**
- Importação ~30% mais lenta que disco interno (USB overhead)
- Precisa ter cuidado ao desconectar (sempre parar PostgreSQL antes)
- Depende da conexão USB (usar porta Thunderbolt/USB-C direta)

### 3.2 Como Foi Feita a Migração

#### Passo 1: Preparação
```bash
# Criar estrutura no disco externo
mkdir -p /Volumes/ExtMB/postgresql/{data,backups,logs}
mkdir -p /Volumes/ExtMB/temp
```

#### Passo 2: Backup e Parada
```bash
# Parar PostgreSQL
brew services stop postgresql@17

# Fazer backup do cluster atual
cp -R /opt/homebrew/var/postgresql@17 \
      /Volumes/ExtMB/postgresql/backups/data_backup_20260119
```

#### Passo 3: Migração dos Dados
```bash
# Copiar dados para disco externo (preserva permissões)
rsync -av /opt/homebrew/var/postgresql@17/ \
          /Volumes/ExtMB/postgresql/data/

# Ajustar permissões
chmod 700 /Volumes/ExtMB/postgresql/data
```

#### Passo 4: Criar Symlink
```bash
# Renomear diretório original
mv /opt/homebrew/var/postgresql@17 \
   /opt/homebrew/var/postgresql@17.bak_20260119

# Criar symlink apontando para disco externo
ln -s /Volumes/ExtMB/postgresql/data \
      /opt/homebrew/var/postgresql@17
```

#### Passo 5: Reiniciar e Validar
```bash
# Iniciar PostgreSQL
brew services start postgresql@17

# Verificar se está usando disco externo
ls -la /opt/homebrew/var/postgresql@17
# lrwxr-xr-x ... postgresql@17 -> /Volumes/ExtMB/postgresql/data

# Testar conexão
psql -U aian_db -d basecerta -c "SELECT COUNT(*) FROM cnpj_brasil.empresas;"
```

### 3.3 Como Refazer a Migração (Se Necessário)

**Cenário 1: Voltar para disco interno**
```bash
# Parar PostgreSQL
brew services stop postgresql@17

# Remover symlink
rm /opt/homebrew/var/postgresql@17

# Restaurar backup original
mv /opt/homebrew/var/postgresql@17.bak_20260119 \
   /opt/homebrew/var/postgresql@17

# Reiniciar
brew services start postgresql@17
```

**Cenário 2: Mover para outro disco externo**
```bash
# Parar PostgreSQL
brew services stop postgresql@17

# Copiar para novo disco
rsync -av /Volumes/ExtMB/postgresql/data/ \
          /Volumes/NovoDiscou/postgresql/data/

# Atualizar symlink
rm /opt/homebrew/var/postgresql@17
ln -s /Volumes/NovoDisco/postgresql/data \
      /opt/homebrew/var/postgresql@17

# Reiniciar
brew services start postgresql@17
```

**Cenário 3: Reconstruir do zero**
```bash
# Parar PostgreSQL
brew services stop postgresql@17

# Remover tudo
rm /opt/homebrew/var/postgresql@17
rm -rf /Volumes/ExtMB/postgresql/data

# Inicializar novo cluster
/opt/homebrew/opt/postgresql@17/bin/initdb \
    -D /Volumes/ExtMB/postgresql/data

# Criar symlink
ln -s /Volumes/ExtMB/postgresql/data \
      /opt/homebrew/var/postgresql@17

# Iniciar
brew services start postgresql@17

# Re-criar database e schema
psql -U aian_db -d postgres -c "CREATE DATABASE basecerta;"
psql -U aian_db -d basecerta -f scripts/create_database_schema.sql
```

### 3.4 Gerenciamento do Disco Externo

**SEMPRE fazer antes de desconectar:**
```bash
# 1. Parar PostgreSQL
brew services stop postgresql@17

# 2. Aguardar
sleep 3

# 3. Ejetar com segurança
diskutil eject /Volumes/ExtMB
```

**Ao reconectar:**
```bash
# 1. Verificar se montou
ls /Volumes/ExtMB/postgresql/data/

# 2. Iniciar PostgreSQL
brew services start postgresql@17

# 3. Validar
psql -U aian_db -d basecerta -c "SELECT 1;"
```

---

## 4. Arquitetura de Importação

### 4.1 Problema: Duplicação de Dados

**Abordagem Tradicional (NÃO USADA):**
```
Schema: staging_cnpj
├─ Importar tudo → staging (200 GB)
├─ Validar dados
└─ Copiar → production (200 GB)

Total: 400 GB (duplicado!)
```

**Problema:** Não temos 400 GB disponíveis no disco.

### 4.2 Solução: TEMP Tables + MERGE

**Nossa Arquitetura:**
```
1. Criar UNLOGGED TEMP table
2. COPY dados do ZIP → temp table
3. MERGE (UPSERT) temp → production
4. DROP temp table
5. Repetir para próxima tabela

Espaço máximo: 200 GB (base) + 20 GB (1 temp table) = 220 GB
```

**Vantagens:**
- ✅ Sem duplicação permanente
- ✅ Usa UPSERT para atualizações mensais
- ✅ Processa uma tabela por vez
- ✅ Economiza espaço (220 GB vs 400 GB)
- ✅ Logs detalhados de progresso

**Desvantagens:**
- ⚠️ Mais lento que importação direta
- ⚠️ Não pode reverter facilmente (usar backup antes)

### 4.3 Fluxo de Importação

```
FASE 1: AUXILIARES (5-10 min)
├─ TRUNCATE tabelas auxiliares
├─ COPY direto (sem TEMP)
└─ 6 tabelas pequenas

FASE 2: EMPRESAS (45-60 min)
├─ CREATE UNLOGGED TABLE temp_empresas
├─ COPY Empresas0.zip → temp_empresas
├─ COPY Empresas1.zip → temp_empresas
├─ ... (10 arquivos)
├─ CREATE INDEX ON temp_empresas (cnpj_basico)
├─ MERGE temp_empresas → cnpj_brasil.empresas
│   ├─ Batch 1: 100k registros
│   ├─ Batch 2: 100k registros
│   └─ ... (até ~52M registros)
└─ DROP temp_empresas

FASE 3: ESTABELECIMENTOS (2-3 horas)
├─ CREATE UNLOGGED TABLE temp_estabelecimentos
├─ COPY 10 arquivos
├─ MERGE → cnpj_brasil.estabelecimentos
└─ DROP temp

FASE 4: SIMPLES (40-50 min)
├─ CREATE TEMP, COPY, MERGE, DROP
└─ ~46M registros

FASE 5: SOCIOS (30-40 min)
├─ CREATE TEMP, COPY, MERGE, DROP
└─ ~26M registros

TOTAL: 6-8 horas (com tuning)
```

### 4.4 Detalhes Técnicos

**UNLOGGED Tables:**
```sql
CREATE UNLOGGED TABLE temp_empresas (
    cnpj_basico TEXT,
    razao_social TEXT,
    ...
);
```
- Não grava WAL (Write-Ahead Log)
- 3-5x mais rápido para escrita
- Não recupera após crash (mas é temporária)

**COPY direto do ZIP:**
```python
with zipfile.ZipFile(zip_path) as zf:
    csv_name = zf.namelist()[0]
    with zf.open(csv_name) as csv_file:
        text_file = (line.decode('latin1') for line in csv_file)
        cursor.copy_expert(
            f"COPY {temp_table} FROM STDIN WITH CSV DELIMITER ';'",
            text_file
        )
```
- Lê direto do ZIP (sem extrair para disco)
- Converte latin1 → UTF-8 on-the-fly
- Mais rápido que INSERT em loop

**UPSERT em Batches:**
```sql
INSERT INTO cnpj_brasil.empresas (cnpj_basico, razao_social, ...)
SELECT cnpj_basico, razao_social, ...
FROM temp_empresas
LIMIT 100000 OFFSET 0
ON CONFLICT (cnpj_basico)
DO UPDATE SET
    razao_social = EXCLUDED.razao_social,
    versao_importacao = EXCLUDED.versao_importacao,
    updated_at = CURRENT_TIMESTAMP
```
- Batches de 100k evitam locks longos
- ON CONFLICT = UPSERT (atualiza se existe)
- Versão controlada por `versao_importacao`

---

## 5. Qualidade dos Dados

### 5.1 Análise Executada

**Amostra:** 100.000 registros por arquivo (37 arquivos)  
**Ferramenta:** `scripts/analise_qualidade_campos.py`

### 5.2 Resultados por Tabela

#### Empresas (99.99% válidos)

| Campo | % NULL | Observações |
|-------|--------|-------------|
| cnpj_basico | 0% | ✅ Sempre preenchido |
| razao_social | 0% | ✅ Sempre preenchido |
| natureza_juridica | 0% | ✅ Sempre preenchido |
| qualificacao_responsavel | 0.01% | ⚠️ Raros NULLs |
| capital_social | 0.02% | ⚠️ Alguns zerados |
| porte_empresa | 0% | ✅ Sempre preenchido |
| ente_federativo | 99.9% | ⚠️ Quase sempre NULL (campo raro) |

**Encoding:** Sem problemas, razão social já em UTF-8.

#### Estabelecimentos (92-99% válidos)

| Campo | % NULL | Observações |
|-------|--------|-------------|
| cnpj_basico, cnpj_ordem, cnpj_dv | 0% | ✅ Chave sempre presente |
| nome_fantasia | 45% | ⚠️ Muitos sem fantasia (usam razão social) |
| situacao_cadastral | 0% | ✅ Sempre preenchido |
| email | 89% | ⚠️ Maioria sem email cadastrado |
| logradouro | 2% | ⚠️ Alguns sem endereço |
| bairro | 8% | ⚠️ Campo frequentemente vazio |
| telefone_1 | 35% | ⚠️ Muitos sem telefone |

**Encoding:** Acentuação em 0.1-1.1% dos endereços (esperado, preservar).

**Erros de Parsing:** 1-8% dos registros têm ponto-e-vírgula (`;`) no endereço que quebra CSV:
```
Exemplo problemático:
Rua ABC; apto 123;Bairro;CEP;...  <- ";" no meio do endereço
```
**Solução:** Script trata com `csv.QUOTE_NONE` e validação de colunas.

#### Simples Nacional (100% válidos)

| Campo | % NULL | Observações |
|-------|--------|-------------|
| cnpj_basico | 0% | ✅ Sempre preenchido |
| opcao_simples | 20% | ⚠️ Nem todos optam pelo Simples |
| data_opcao_simples | 20% | Corresponde a opcao_simples |
| opcao_mei | 75% | ⚠️ Poucos são MEI |

**Encoding:** Sem problemas.

#### Sócios (100% válidos)

| Campo | % NULL | Observações |
|-------|--------|-------------|
| cnpj_basico, identificador_socio | 0% | ✅ Sempre preenchido |
| nome_socio | 0% | ✅ Sempre preenchido |
| cpf_cnpj_socio | 3% | ⚠️ Alguns sócios estrangeiros sem CPF |
| pais | 99.7% | ⚠️ Quase sempre Brasil (não preenche) |
| nome_representante | 97% | ⚠️ Raro ter representante legal |

**Encoding:** Acentos em nomes preservados corretamente.

### 5.3 Recomendações

**Tolerâncias de Erro:**
- Empresas: Aceitar até 0.1% de erros
- Estabelecimentos: Aceitar até 8% de erros (pontos-e-vírgula)
- Simples: Aceitar 0% de erros
- Sócios: Aceitar até 0.1% de erros

**Validações Críticas:**
```sql
-- Após importação, verificar:

-- 1. CNPJs sem empresa mãe (não deveria existir)
SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos e
LEFT JOIN cnpj_brasil.empresas emp ON e.cnpj_basico = emp.cnpj_basico
WHERE emp.cnpj_basico IS NULL;
-- Esperado: 0

-- 2. Duplicatas na chave primária
SELECT cnpj_basico, COUNT(*) FROM cnpj_brasil.empresas
GROUP BY cnpj_basico HAVING COUNT(*) > 1;
-- Esperado: 0 linhas

-- 3. Datas inválidas
SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos
WHERE data_situacao_cadastral > CURRENT_DATE;
-- Esperado: 0
```

---

## 6. Execução da Importação

### 6.1 Pré-requisitos

**Checklist:**
- [ ] PostgreSQL rodando no disco externo
- [ ] Disco externo com 250+ GB livres
- [ ] Dados em `/Volumes/ExtMB/BaseCNPJ/dez2025/`
- [ ] Scripts em `/Users/code4us/.../basecerta/scripts/`
- [ ] Dependências instaladas (`psycopg2`, `psutil`)
- [ ] Backup recente (se tiver dados importantes)
- [ ] Mac conectado na tomada (não usar bateria)
- [ ] Outros aplicativos fechados (liberar RAM)

### 6.2 Comandos de Execução

```bash
# Ir para pasta de scripts
cd /Users/code4us/Documents/ADACODE/basecerta/scripts

# 1. Aplicar tuning (OPCIONAL mas recomendado)
python3 postgres_tuning.py --apply

# 2. Executar importação
python3 import_cnpj.py 2025-12

# Confirmação interativa
⚠️  Iniciar importação? (s/n): s

# 3. Após terminar, restaurar configurações
python3 postgres_tuning.py --restore
brew services restart postgresql@17
```

### 6.3 Progresso Esperado

```
╔═══════════════════════════════════════════════════════════════════╗
║       IMPORTAÇÃO CNPJ - RECEITA FEDERAL - BRASIL                 ║
║  Versão: 2025-12                                                 ║
╚═══════════════════════════════════════════════════════════════════╝

===== FASE 1: TABELAS AUXILIARES =====
📋 Importando auxiliar: Cnaes → cnaes
  ✅ Cnaes: 1,335 registros
📋 Importando auxiliar: Motivos → motivos_situacao_cadastral
  ✅ Motivos: 11 registros
📋 Importando auxiliar: Municipios → municipios
  ✅ Municipios: 5,570 registros
...

===== FASE 2: TABELAS PRINCIPAIS =====

===== IMPORTANDO: Empresas =====
📁 Encontrados 10 arquivo(s) para Empresas
✅ Tabela temporária criada: temp_empresas
  ✅ Empresas0.zip: 5,234,567 linhas
  ✅ Empresas1.zip: 723,456 linhas
  ...
📊 Total carregado em temp_empresas: 52,123,456 linhas

🔄 Iniciando MERGE: temp_empresas → cnpj_brasil.empresas
📊 Total de registros para UPSERT: 52,123,456
  Batch 1: 100,000 registros | Progresso: 0.2%
  Batch 2: 100,000 registros | Progresso: 0.4%
  ...
  Batch 521: 23,456 registros | Progresso: 100.0%
✅ MERGE completo: 52,123,456 registros processados
🗑️  Tabela temporária removida: temp_empresas
⏱️  Tempo total para Empresas: 52.3 minutos

===== IMPORTANDO: Estabelecimentos =====
...

===== ESTATÍSTICAS DA IMPORTAÇÃO =====
  empresas            :      52,123,456 registros
  estabelecimentos    :      68,234,567 registros
  simples_nacional    :      46,345,678 registros
  socios              :      26,456,789 registros

🎉 IMPORTAÇÃO COMPLETA!
⏱️  Tempo total: 7.2 horas
📅 Versão: 2025-12
```

### 6.4 Monitoramento Durante Importação

**Terminal 1: Executar**
```bash
python3 import_cnpj.py 2025-12
```

**Terminal 2: Monitorar Log**
```bash
tail -f /Volumes/ExtMB/postgresql/logs/import_2025-12_*.log
```

**Terminal 3: Estatísticas**
```bash
# Espaço em disco
watch -n 60 'df -h /Volumes/ExtMB'

# Tamanho das tabelas
watch -n 300 "psql -U aian_db -d basecerta -c \"
SELECT tablename, pg_size_pretty(pg_total_relation_size('cnpj_brasil.'||tablename))
FROM pg_tables WHERE schemaname = 'cnpj_brasil' ORDER BY tablename
\""

# Queries ativas
watch -n 30 "psql -U aian_db -d basecerta -c \"
SELECT pid, state, LEFT(query, 50) FROM pg_stat_activity WHERE datname = 'basecerta'
\""
```

### 6.5 Validação Pós-Importação

```sql
-- Conectar ao banco
psql -U aian_db -d basecerta

-- 1. Verificar contagens
SELECT 
    'empresas' AS tabela, COUNT(*) AS registros 
FROM cnpj_brasil.empresas WHERE versao_importacao = '2025-12'
UNION ALL
SELECT 'estabelecimentos', COUNT(*) FROM cnpj_brasil.estabelecimentos WHERE versao_importacao = '2025-12'
UNION ALL
SELECT 'simples_nacional', COUNT(*) FROM cnpj_brasil.simples_nacional WHERE versao_importacao = '2025-12'
UNION ALL
SELECT 'socios', COUNT(*) FROM cnpj_brasil.socios WHERE versao_importacao = '2025-12';

-- 2. Verificar integridade referencial
SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos e
LEFT JOIN cnpj_brasil.empresas emp ON e.cnpj_basico = emp.cnpj_basico
WHERE emp.cnpj_basico IS NULL;
-- Deve retornar 0

-- 3. Testar índices (deve usar index scan)
EXPLAIN ANALYZE
SELECT * FROM cnpj_brasil.empresas WHERE cnpj_basico = '12345678';

-- 4. Testar full-text search
EXPLAIN ANALYZE
SELECT * FROM cnpj_brasil.empresas 
WHERE razao_social_tsvector @@ to_tsquery('BANCO');

-- 5. Estatísticas por UF
SELECT uf, COUNT(*) as total
FROM cnpj_brasil.estabelecimentos
WHERE versao_importacao = '2025-12'
GROUP BY uf
ORDER BY total DESC
LIMIT 10;
```

---

## 7. Otimização de Performance

### 7.1 Script de Auto-Tuning

**Arquivo:** `scripts/postgres_tuning.py`

**O que faz:**
- Detecta RAM, CPU, tipo de disco automaticamente
- Calcula configurações otimizadas
- Faz backup do `postgresql.conf` atual
- Aplica tuning agressivo para importação
- Restaura configurações seguras após importação

### 7.2 Configurações Aplicadas

**Para importação (agressivo):**
```ini
# Memória
shared_buffers = 4GB              # 25% da RAM
work_mem = 256MB                  # Para SORT/HASH
maintenance_work_mem = 2GB        # Para CREATE INDEX
effective_cache_size = 12GB       # 75% da RAM

# WAL (Write-Ahead Log)
wal_level = minimal               # Mínimo necessário
max_wal_senders = 0               # Sem replicação
fsync = off                       # ⚠️ PERIGO: desabilita sync
synchronous_commit = off          # Não aguarda confirmação
full_page_writes = off            # Economiza I/O

# Checkpoints
checkpoint_timeout = 30min        # Menos checkpoints
max_wal_size = 10GB              # WAL grande
checkpoint_completion_target = 0.9

# Disco SSD USB
effective_io_concurrency = 100    # SSD via USB
random_page_cost = 1.5            # SSD (mas USB tem overhead)
seq_page_cost = 1.0

# Paralelismo
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_worker_processes = 8

# Autovacuum (desabilitar durante import)
autovacuum = off
```

**Para produção (seguro):**
```ini
fsync = on                        # ✅ SEGURO
synchronous_commit = on           # ✅ SEGURO
full_page_writes = on             # ✅ SEGURO
autovacuum = on                   # ✅ SEGURO
wal_level = replica               # Permite replicação
```

### 7.3 Uso do Script

```bash
# Aplicar tuning para importação
python3 postgres_tuning.py --apply

# Verificar configurações atuais
python3 postgres_tuning.py --status

# Restaurar configurações originais
python3 postgres_tuning.py --restore

# Após restaurar, reiniciar PostgreSQL
brew services restart postgresql@17
```

### 7.4 Ganho de Performance

| Operação | Sem Tuning | Com Tuning | Ganho |
|----------|------------|------------|-------|
| COPY para TEMP | 120 MB/s | 200 MB/s | +66% |
| CREATE INDEX | 2.5 horas | 1.5 horas | -40% |
| UPSERT batches | 50k/s | 80k/s | +60% |
| **Total** | **9-10h** | **6-8h** | **-30%** |

### 7.5 Otimizações Adicionais

**Durante importação:**
```sql
-- Desabilitar triggers temporariamente (se não críticos)
ALTER TABLE cnpj_brasil.empresas DISABLE TRIGGER ALL;
-- Importar dados
ALTER TABLE cnpj_brasil.empresas ENABLE TRIGGER ALL;

-- Criar índices CONCURRENTLY (não bloqueia)
CREATE INDEX CONCURRENTLY idx_empresas_razao ON cnpj_brasil.empresas(razao_social);

-- ANALYZE após importação (atualiza estatísticas)
ANALYZE cnpj_brasil.empresas;
ANALYZE cnpj_brasil.estabelecimentos;
ANALYZE cnpj_brasil.simples_nacional;
ANALYZE cnpj_brasil.socios;

-- VACUUM após importação (limpa espaço)
VACUUM ANALYZE cnpj_brasil.empresas;
```

**Monitorar bloat:**
```sql
SELECT 
    schemaname, 
    tablename, 
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_dead_tup 
FROM pg_stat_user_tables 
WHERE schemaname = 'cnpj_brasil'
ORDER BY n_dead_tup DESC;
```

---

## 8. Manutenção e Atualizações Mensais

### 8.1 Fluxo de Atualização Mensal

```bash
# 1. Baixar novos dados da Receita Federal
mkdir -p /Volumes/ExtMB/BaseCNPJ/jan2026
# (copiar ZIPs para jan2026/)

# 2. Atualizar DATA_DIR no import_cnpj.py
# Linha 18: DATA_DIR = Path("/Volumes/ExtMB/BaseCNPJ/jan2026")

# 3. Fazer backup preventivo
pg_dump -U aian_db -d basecerta -F c \
    -f /Volumes/ExtMB/postgresql/backups/basecerta_pre_jan2026.dump

# 4. Executar atualização
python3 import_cnpj.py 2026-01

# 5. Validar
psql -U aian_db -d basecerta -c "
SELECT versao_importacao, COUNT(*) 
FROM cnpj_brasil.empresas 
GROUP BY versao_importacao
"
```

### 8.2 Vantagens do UPSERT

**Primeira importação (Dez/2025):**
- Todos os registros são INSERT
- Tempo: 6-8 horas

**Atualização mensal (Jan/2026):**
- ~90% dos registros: UPDATE (já existem)
- ~10% dos registros: INSERT (novos)
- Tempo: 4-5 horas (mais rápido!)

**Histórico de versões:**
```sql
-- Ver evolução de um CNPJ
SELECT versao_importacao, razao_social, capital_social, updated_at
FROM cnpj_brasil.empresas
WHERE cnpj_basico = '12345678'
ORDER BY updated_at DESC;

-- Empresas criadas em janeiro/2026
SELECT COUNT(*) FROM cnpj_brasil.empresas
WHERE versao_importacao = '2026-01' AND created_at >= '2026-01-01';

-- Empresas atualizadas em janeiro/2026
SELECT COUNT(*) FROM cnpj_brasil.empresas
WHERE versao_importacao = '2026-01' AND updated_at >= '2026-01-01';
```

### 8.3 Limpeza de Versões Antigas

```sql
-- Ver versões existentes
SELECT versao_importacao, COUNT(*) as total
FROM cnpj_brasil.empresas
GROUP BY versao_importacao
ORDER BY versao_importacao DESC;

-- Remover versões antigas (se necessário)
-- ⚠️ CUIDADO: Isso remove dados permanentemente!
DELETE FROM cnpj_brasil.empresas WHERE versao_importacao < '2025-12';

-- VACUUM para recuperar espaço
VACUUM FULL cnpj_brasil.empresas;
```

### 8.4 Backup e Restauração

**Backup completo:**
```bash
# Dump binário (rápido, compacto)
pg_dump -U aian_db -d basecerta -F c \
    -f /Volumes/ExtMB/postgresql/backups/basecerta_$(date +%Y%m%d).dump

# Dump SQL (legível, maior)
pg_dump -U aian_db -d basecerta \
    > /Volumes/ExtMB/postgresql/backups/basecerta_$(date +%Y%m%d).sql
```

**Backup apenas schema:**
```bash
pg_dump -U aian_db -d basecerta --schema-only \
    > /Volumes/ExtMB/postgresql/backups/schema_$(date +%Y%m%d).sql
```

**Restauração:**
```bash
# De dump binário
pg_restore -U aian_db -d basecerta -c \
    /Volumes/ExtMB/postgresql/backups/basecerta_20260119.dump

# De SQL
psql -U aian_db -d basecerta \
    < /Volumes/ExtMB/postgresql/backups/basecerta_20260119.sql
```

**Backup do cluster completo:**
```bash
# Parar PostgreSQL
brew services stop postgresql@17

# Copiar cluster inteiro
tar -czf /Volumes/ExtMB/postgresql/backups/cluster_$(date +%Y%m%d).tar.gz \
    -C /Volumes/ExtMB/postgresql data/

# Reiniciar
brew services start postgresql@17
```

---

## 9. Troubleshooting

### 9.1 PostgreSQL não inicia

**Sintoma:**
```bash
brew services start postgresql@17
# Erro: could not connect to server
```

**Diagnóstico:**
```bash
# Verificar logs
tail -100 /opt/homebrew/var/log/postgresql@17.log

# Verificar se disco está montado
ls /Volumes/ExtMB/postgresql/data/

# Verificar permissões
ls -ld /Volumes/ExtMB/postgresql/data/
# Deve ser: drwx------ (700)
```

**Soluções:**
1. **Disco não montado:**
   ```bash
   # Reconectar disco e tentar novamente
   brew services start postgresql@17
   ```

2. **Permissões incorretas:**
   ```bash
   chmod 700 /Volumes/ExtMB/postgresql/data
   chown -R $(whoami) /Volumes/ExtMB/postgresql/data
   ```

3. **Symlink quebrado:**
   ```bash
   rm /opt/homebrew/var/postgresql@17
   ln -s /Volumes/ExtMB/postgresql/data \
         /opt/homebrew/var/postgresql@17
   ```

4. **Corrupção após desconexão forçada:**
   ```bash
   # Verificar integridade
   /opt/homebrew/opt/postgresql@17/bin/pg_resetwal -n \
       /Volumes/ExtMB/postgresql/data/
   
   # Se corrompido, restaurar backup
   rm -rf /Volumes/ExtMB/postgresql/data/*
   tar -xzf /Volumes/ExtMB/postgresql/backups/cluster_latest.tar.gz \
       -C /Volumes/ExtMB/postgresql/
   ```

### 9.2 Importação muito lenta

**Diagnóstico:**
```bash
# Velocidade do disco
iostat -w 1 disk4

# Processos competindo
top -o cpu

# Queries lentas no PostgreSQL
psql -U aian_db -d basecerta -c "
SELECT pid, state, wait_event_type, LEFT(query, 60) 
FROM pg_stat_activity 
WHERE datname = 'basecerta' AND state != 'idle'
"
```

**Soluções:**
1. **Aplicar tuning** (se não aplicou):
   ```bash
   python3 postgres_tuning.py --apply
   ```

2. **Fechar outros aplicativos**

3. **Desabilitar antivírus temporariamente**

4. **Verificar se disco não está superaquecendo:**
   ```bash
   # Samsung T7 tem proteção térmica
   # Se aquecer muito, reduz velocidade
   # Solução: Pausar importação, deixar esfriar
   ```

5. **Reduzir BATCH_SIZE** (se out of memory):
   ```python
   # Em import_cnpj.py, linha 27
   BATCH_SIZE = 50000  # Era 100000
   ```

### 9.3 Erro "out of memory"

**Sintoma:**
```
ERROR: out of memory
DETAIL: Failed on request of size XXXX
```

**Soluções:**
1. **Aumentar swap (macOS):**
   ```bash
   # macOS gerencia swap automaticamente
   # Verificar atividade:
   vm_stat
   ```

2. **Reduzir work_mem:**
   ```bash
   # Em postgresql.conf
   work_mem = 128MB  # Era 256MB
   ```

3. **Reduzir BATCH_SIZE no import_cnpj.py**

4. **Fechar outros apps para liberar RAM**

### 9.4 Disco cheio durante importação

**Sintoma:**
```
ERROR: could not extend file "base/XXXX/YYYY": No space left on device
```

**Soluções:**
```bash
# 1. Verificar espaço
df -h /Volumes/ExtMB

# 2. Limpar temp
rm -rf /Volumes/ExtMB/temp/*

# 3. Limpar backups antigos
rm /Volumes/ExtMB/postgresql/backups/data_backup_*

# 4. Limpar WAL antigo
rm /Volumes/ExtMB/postgresql/data/pg_wal/00000001*

# 5. Reduzir max_wal_size
# Em postgresql.conf
max_wal_size = 5GB  # Era 10GB
```

### 9.5 Importação interrompida

**Cenário:** Importação parou no meio (queda de energia, erro, etc.)

**Recuperação:**
```bash
# 1. Verificar estado do banco
psql -U aian_db -d basecerta -c "
SELECT versao_importacao, COUNT(*) 
FROM cnpj_brasil.empresas 
GROUP BY versao_importacao
"

# 2. Re-executar importação
# UPSERT vai continuar de onde parou!
python3 import_cnpj.py 2025-12

# 3. Validar integridade
psql -U aian_db -d basecerta -f scripts/validacao_pos_importacao.sql
```

**Vantagem do UPSERT:** Pode re-executar sem perder dados.

### 9.6 Disco externo desconectou durante uso

**⚠️ CRÍTICO - Não fazer:**
- ❌ Reconectar e reiniciar imediatamente
- ❌ Forçar inicialização do PostgreSQL

**✅ Procedimento correto:**
```bash
# 1. Reconectar disco
# (macOS vai montar automaticamente)

# 2. Verificar integridade
ls -la /Volumes/ExtMB/postgresql/data/

# 3. Verificar consistência do cluster
/opt/homebrew/opt/postgresql@17/bin/pg_controldata \
    /Volumes/ExtMB/postgresql/data/ | head -20

# 4. Se parece OK, tentar iniciar
brew services start postgresql@17

# 5. Verificar logs
tail -100 /opt/homebrew/var/log/postgresql@17.log

# 6. Se corrompido, restaurar backup
brew services stop postgresql@17
rm -rf /Volumes/ExtMB/postgresql/data/*
tar -xzf /Volumes/ExtMB/postgresql/backups/cluster_latest.tar.gz \
    -C /Volumes/ExtMB/postgresql/
brew services start postgresql@17
```

### 9.7 Dados inconsistentes

**Verificações:**
```sql
-- 1. CNPJs órfãos (estabelecimento sem empresa)
SELECT e.cnpj_basico 
FROM cnpj_brasil.estabelecimentos e
LEFT JOIN cnpj_brasil.empresas emp ON e.cnpj_basico = emp.cnpj_basico
WHERE emp.cnpj_basico IS NULL
LIMIT 100;

-- 2. Duplicatas
SELECT cnpj_basico, COUNT(*) 
FROM cnpj_brasil.empresas 
GROUP BY cnpj_basico 
HAVING COUNT(*) > 1;

-- 3. Datas inválidas
SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos
WHERE data_situacao_cadastral > CURRENT_DATE
   OR data_inicio_atividade > CURRENT_DATE;

-- 4. Encoding quebrado
SELECT razao_social FROM cnpj_brasil.empresas
WHERE razao_social ~ '[^\x00-\x7F]'  -- Caracteres não-ASCII
AND razao_social ~ '�'  -- Caractere de substituição
LIMIT 100;
```

**Correções:**
```sql
-- Remover CNPJs órfãos
DELETE FROM cnpj_brasil.estabelecimentos
WHERE cnpj_basico NOT IN (SELECT cnpj_basico FROM cnpj_brasil.empresas);

-- Remover duplicatas (manter mais recente)
DELETE FROM cnpj_brasil.empresas a
USING cnpj_brasil.empresas b
WHERE a.cnpj_basico = b.cnpj_basico
  AND a.updated_at < b.updated_at;
```

### 9.8 Performance Degradada

**Sintoma:** Queries lentas após importação

**Diagnóstico:**
```sql
-- 1. Verificar índices
SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 2. Verificar bloat
SELECT 
    schemaname, 
    tablename, 
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_dead_tup,
    ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE schemaname = 'cnpj_brasil';

-- 3. Verificar estatísticas
SELECT schemaname, tablename, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'cnpj_brasil';
```

**Soluções:**
```sql
-- 1. Atualizar estatísticas
ANALYZE cnpj_brasil.empresas;
ANALYZE cnpj_brasil.estabelecimentos;

-- 2. Vacuum completo
VACUUM ANALYZE cnpj_brasil.empresas;
VACUUM ANALYZE cnpj_brasil.estabelecimentos;

-- 3. Reindexar (se índices corrompidos/bloat)
REINDEX TABLE cnpj_brasil.empresas;

-- 4. Rebuild completo (se muito bloat)
VACUUM FULL cnpj_brasil.empresas;  -- ⚠️ Locks a tabela!
```

---

## 📞 Resumo de Comandos Rápidos

```bash
# ===== GERENCIAMENTO POSTGRESQL =====
# Iniciar
brew services start postgresql@17

# Parar (SEMPRE antes de desconectar disco!)
brew services stop postgresql@17

# Status
brew services list | grep postgresql

# Conectar
psql -U aian_db -d basecerta

# ===== IMPORTAÇÃO =====
cd /Users/code4us/Documents/ADACODE/basecerta/scripts

# Aplicar tuning
python3 postgres_tuning.py --apply

# Executar importação
python3 import_cnpj.py 2025-12

# Restaurar config
python3 postgres_tuning.py --restore
brew services restart postgresql@17

# ===== MONITORAMENTO =====
# Log em tempo real
tail -f /Volumes/ExtMB/postgresql/logs/import_*.log

# Espaço em disco
df -h /Volumes/ExtMB

# Tamanho das tabelas
psql -U aian_db -d basecerta -c "
SELECT tablename, pg_size_pretty(pg_total_relation_size('cnpj_brasil.'||tablename))
FROM pg_tables WHERE schemaname = 'cnpj_brasil'
"

# ===== BACKUP =====
# Dump completo
pg_dump -U aian_db -d basecerta -F c \
    -f /Volumes/ExtMB/postgresql/backups/basecerta_$(date +%Y%m%d).dump

# Backup cluster
brew services stop postgresql@17
tar -czf /Volumes/ExtMB/postgresql/backups/cluster_$(date +%Y%m%d).tar.gz \
    -C /Volumes/ExtMB/postgresql data/
brew services start postgresql@17

# ===== LIMPEZA =====
# Remover backup PostgreSQL local (48 MB)
rm -rf /opt/homebrew/var/postgresql@17.bak_20260119

# Limpar temp
rm -rf /Volumes/ExtMB/temp/*

# Limpar logs antigos
rm /Volumes/ExtMB/postgresql/logs/import_2024*.log

# ===== EJEÇÃO SEGURA DISCO =====
brew services stop postgresql@17
sleep 3
diskutil eject /Volumes/ExtMB
```

---

## 📚 Arquivos de Referência

**Scripts Principais:**
- `scripts/import_cnpj.py` - Importação principal
- `scripts/postgres_tuning.py` - Auto-tuning
- `scripts/create_database_schema.sql` - Schema completo

**Scripts de Análise:**
- `scripts/analise_qualidade_campos.py` - Qualidade dos dados
- `scripts/analisar_receita.py` - Contador de registros
- `scripts/analise_detalhada_receita.py` - Análise campo a campo

**Localização dos Dados:**
- Receita Federal: `/Volumes/ExtMB/BaseCNPJ/dez2025/`
- PostgreSQL: `/Volumes/ExtMB/postgresql/data/`
- Backups: `/Volumes/ExtMB/postgresql/backups/`
- Logs: `/Volumes/ExtMB/postgresql/logs/`
- Temp: `/Volumes/ExtMB/temp/`

**Documentação:**
- Este arquivo: Guia completo consolidado
- Schema SQL: `scripts/create_database_schema.sql`

---

**Última atualização:** 19/01/2026  
**Autor:** Sistema de Importação CNPJ v2.0  
**Suporte:** Este guia contém tudo o que você precisa saber sobre a importação CNPJ.
