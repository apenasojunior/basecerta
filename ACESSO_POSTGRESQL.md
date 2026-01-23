# 🤖 Guia de Orientação - PostgreSQL BaseCerta

> **Documento para IA**: Este é um guia completo sobre a estrutura e configuração do PostgreSQL usado no projeto BaseCerta. Leia atentamente antes de realizar qualquer operação no banco de dados.

---

## 🎯 Contexto e Objetivo

Este documento orienta sobre a infraestrutura PostgreSQL configurada em um MacBook com **armazenamento externo**. O banco de dados `basecerta` está **zerado** (sem tabelas), pronto para receber a estrutura e dados CNPJ da Receita Federal do Brasil.

**⚠️ IMPORTANTE**: 
- O banco está **vazio**, pronto para receber tabelas e dados CNPJ
- Scripts de referência (migrations Alembic) estão em `backup_importacao_old/`
- Arquivos RFB originais preservados em `/Volumes/ExtMB/BaseCNPJ/dez2025/`

---

## 🗄️ Estrutura de Armazenamento

### ⚡ Armazenamento em SSD Externo Samsung T7 (1TB)

**Ponto de montagem**: `/Volumes/ExtMB`

```
/Volumes/ExtMB/
├── postgresql/
│   ├── data/           # PostgreSQL data directory (62GB)
│   │   ├── base/       # Databases storage
│   │   ├── pg_wal/     # Write-Ahead Logs
│   │   ├── postgresql.conf
│   │   └── postgresql.auto.conf
│   └── logs/           # Import/operation logs (vazio após limpeza)
│
└── BaseCNPJ/
    └── dez2025/        # Arquivos RFB preservados (~7GB ZIPs)
        ├── Empresas0.zip (460MB)
        ├── Empresas1.zip (74MB)
        ├── Estabelecimentos*.zip
        ├── Socios*.zip
        └── ... (todos os arquivos da Receita Federal)
```

**🔴 CRÍTICO**: 
- O PostgreSQL roda do SSD externo, NÃO do HD interno do Mac
- Se `/Volumes/ExtMB` não estiver montado, o PostgreSQL não funcionará
- Data directory oficial: `/Volumes/ExtMB/postgresql/data/` (configurado via symlink)
- Data directory padrão (Homebrew): `/opt/homebrew/var/postgresql@17` (aponta para ExtMB)

---

## 📋 Informações de Conexão

### Servidor Local (MacBook)

```
Host:     localhost (ou 127.0.0.1)
Porta:    5432
Database: basecerta
Versão:   PostgreSQL 17.7 (Homebrew) on aarch64-apple-darwin
```

### Usuários Disponíveis

#### 1. Usuário: `code4us` (Superuser)
- **Tipo**: Superuser com todas as permissões
- **Privilégios**: Create DB, Create Role, Replication, Bypass RLS
- **Autenticação**: Trust (sem senha para conexões locais)
- **Uso**: Administração completa do banco

#### 2. Usuário: `aian_db`
- **Tipo**: Usuário padrão (owner das tabelas)
- **Privilégios**: Acesso normal ao banco
- **Autenticação**: Trust (sem senha para conexões locais)
- **Uso**: Operações normais de aplicação

#### 3. Usuário: `dev4us` (Para Aplicação)
- **Senha**: `P@lm315@s`
- **Uso**: Conexão da aplicação com autenticação
- **Privilégios**: ALL PRIVILEGES no database basecerta

---

## 🔌 Strings de Conexão

### Python (psycopg2)

```python
import psycopg2

# Conexão Local (Superuser)
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="basecerta",
    user="code4us"
)

# Conexão com Autenticação (dev4us)
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="basecerta",
    user="dev4us",
    password="P@lm315@s"
)

# URL de Conexão (PostgreSQL URL)
DATABASE_URL = "postgresql://code4us@localhost:5432/basecerta"
# ou com senha:
DATABASE_URL = "postgresql://dev4us:P%40lm315%40s@localhost:5432/basecerta"
```

### Python (SQLAlchemy)

```python
from sqlalchemy import create_engine

# Engine Local
engine = create_engine("postgresql://code4us@localhost:5432/basecerta")

# Engine com senha
engine = create_engine(
    "postgresql://dev4us:P%40lm315%40s@localhost:5432/basecerta",
    echo=True,
    pool_size=10,
    max_overflow=20
)
```

### Node.js (pg)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'basecerta',
  user: 'code4us',
  // password não necessário para conexões locais
});

// Ou com senha
const poolAuth = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'basecerta',
  user: 'dev4us',
  password: 'P@lm315@s',
});
```

### Linha de Comando (psql)

```bash
# Conexão direta (Superuser)
psql -U code4us -d basecerta

# Conexão com senha
PGPASSWORD='P@lm315@s' psql -U dev4us -h localhost -p 5432 -d basecerta

# Via URL
psql postgresql://code4us@localhost:5432/basecerta
```

### Java (JDBC)

```java
String url = "jdbc:postgresql://localhost:5432/basecerta";
String user = "code4us";
String password = ""; // vazio para conexões locais

Connection conn = DriverManager.getConnection(url, user, password);

// Ou com senha
String urlAuth = "jdbc:postgresql://localhost:5432/basecerta";
String userAuth = "dev4us";
String passwordAuth = "P@lm315@s";
```

### PHP (PDO)

```php
<?php
// Conexão Local
$pdo = new PDO(
    'pgsql:host=localhost;port=5432;dbname=basecerta',
    'code4us',
    null
);

// Conexão com senha
$pdo = new PDO(
    'pgsql:host=localhost;port=5432;dbname=basecerta',
    'dev4us',
    Arquitetura do Sistema

**Hardware**:
- MacBook Air M2/M3
- RAM: 16GB total
- SSD Interno: Sistema e aplicativos
- SSD Externo (Samsung T7): PostgreSQL data + Arquivos RFB

**Instalação**:
- Método: Homebrew (`brew install postgresql@17`)
- Versão: PostgreSQL 17.7
- Arquitetura: aarch64 (Apple Silicon)

### Diretórios Importantes

| Diretório | Localização | Uso |
|-----------|-------------|-----|
| **Data Directory** | `/opt/homebrew/var/postgresql@17` → `/Volumes/ExtMB/postgresql/data/` | Dados do PostgreSQL (symlink) |
| **Logs do Sistema** | `/opt/homebrew/var/log/postgresql@17.log` | Logs operacionais do PostgreSQL |
| **Logs de Importação** | `/Volumes/ExtMB/postgresql/logs/` | Logs removidos (estava com 54 arquivos) |
| **Arquivos RFB** | `/Volumes/ExtMB/BaseCNPJ/dez2025/` | ZIPs da Receita Federal (7GB) |
| **Backup Scripts** | `~/Documents/ADACODE/basecerta/backup_importacao_old/` | Scripts e migrations (46MB) |

### Configurações Aplicadas (postgresql.auto.conf)

```ini
# Otimizações aplicadas para importação
shared_buffers = '1536MB'          # Cache compartilhado
work_mem = '192MB'                  # Memória para operações
maintenance_work_mem = '512MB'      # Memória para VACUUM, INDEX
max_connections = 10                # Reduzido para economizar RAM
effective_cache_size = '4GB'        # Cache do SO estimado
```

**⚠️ Contexto**: Estas configurações foram otimizadas para importação massiva mas ainda assim esbarram no limite de 16GB de RAM do Mac. Para importações grandes, considere:
- Aumentar RAM (32GB+)
- Usar servidor cloud
- Processar em chunks menores

### Gerenciamento do Serviço

```bash
# Status do serviço
brew services info postgresql@17

# Iniciar PostgreSQL
brew services start postgresql@17

# Parar PostgreSQL
brew services stop postgresql@17

# Reiniciar PostgreSQL
brew services restart postgresql@17

# Verificar se está rodando
ps aux | grep postgres | grep -v grep

# Verificar se SSD está montado (CRÍTICO)
ls -la /Volumes/ExtMB/postgresql/data/
```env
# PostgreSQL Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=basecerta
DB_USER=code4us
DB_PASSWORD=

# Ou com autenticação
DB_HOST=localhost
DB_PORT=5432
DB_NAME=basecerta
DB_USER=dev4us
DB_PASSWORD=P@lm315@s

# URL Completa
DATABASE_URL=postgresql://code4us@localhost:5432/basecerta
# ou
DATABASE_URL=postgresql://dev4us:P%40lm315%40s@localhost:5432/basecerta
```

---

## 🛠️ Informações Técnicas

### Diretório de Dados
```
/opt/homebrew/var/postgresql@17
```

### Logs do PostgreSQL
```
/opt/homebrew/var/log/postgresql@17.log
```

### Gerenciamento do Serviço

```bash
# Status
brew services info postgresql@17

# Iniciar
brew services start postgresql@17

# Parar
brew services stop postgresql@17

# Reiniciar
brew services restart postgresql@17
```

---

## 🔐 Segurança

### Conexões Locais (Trust Authentication)
- Usuários `code4us` e `aian_db` **não precisam de senha** para conexões locais
- Configurado via `pg_hba.conf`
- Ideal para desenvolvimento local

### Conexões com Autenticação
- Use o usuário `dev4us` com senha `P@lm315@s` quando precisar de autenticação
- Para produção, **sempre altere a senha**

### Criar Novo Usuário (se necessário)

```sql
-- Conectar como superuser
psql -U code4us -d postgres

-- Criar usuário com senha
CREATE USER meu_usuario WITH PASSWORD 'minha_senha_segura';

-- Dar permissões no banco
GRANT ALL PRIVILEGES ON DATABASE basecerta TO meu_usuario;

-- Dar permissões em schemas futuros
\c basecerta
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO meu_usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO meu_usuario;
```

---

## ✅ Teste de Conexão

### Teste Rápido (Terminal)

```bash
# Teste 1: Conexão básica
psql -U code4us -d basecerta -c "SELECT version();"

# Teste 2: Verificar banco vazio
psql -U code4us -d basecerta -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');"

# Teste 3: Listar databases
psql -U code4us -l
```

### �️ Estado Atual do Banco de Dados

### Status: **VAZIO (0 tabelas)**

```sql
-- Verificar estado atual
SELECT COUNT(*) FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
-- Resultado: 0

-- Schemas existentes
\dn
-- Resultado: apenas 'public' (cnpj_brasil foi removido)

-- Usuários existentes
\du
-- code4us (superuser), aian_db (owner), dev4us (app)
```

### Histórico de Limpeza (23/01/2026)

**Removido**:
- ❌ Schema `cnpj_brasil` CASCADE (5 tabelas + 3 views + 1 function)
- ❌ Tabelas principais: empresas, estabelecimentos, socios, simples_nacional, import_log
- ❌ Tabelas auxiliares: cnaes, motivos_situacao_cadastral, municipios, naturezas_juridicas, paises, qualificacoes_socios
- ❌ Tabelas temporárias: temp_empresas, temp_estabelecimentos
- ❌ Sistema de checkpoints de importação
- ❌ 54 arquivos de log de importação

**Preservado**:
- ✅ Estrutura do banco `basecerta`
- ✅ Usuários: code4us, aian_db, dev4us
- ✅ Configurações do PostgreSQL
- ✅ Arquivos RFB em `/Volumes/ExtMB/BaseCNPJ/dez2025/` (~7GB)
- ✅ Backup completo em `backup_importacao_old/` (46MB, 96 arquivos)

### Motivo da Limpeza

O processo de importação CNPJ foi **movido para outro projeto** devido a:
- Limitação de RAM (Mac 16GB vs necessário 20GB+ para MERGE de 4.5M registros)
- Importação repetidamente travando por OOM (Out of Memory)
- Decisão de criar infraestrutura separada para importação massiva

---

## 📌 Orientações para IA

### ✅ O que VOCÊ PODE fazer:

1. **Criar tabelas e schemas** usando migrations do backup como referência
2. **Importar dados** CNPJ dos arquivos em `/Volumes/ExtMB/BaseCNPJ/dez2025/`
3. **Consultar** metadados do banco (pg_catalog, information_schema)
4. **Criar conexões** usando qualquer dos 3 usuários
5. **Verificar** configurações e status do PostgreSQL
6. **Executar queries** de leitura, escrita e análise
7. **Gerenciar** o serviço (start/stop/restart)

### ❌ O que VOCÊ NÃO DEVE fazer:

1. **NÃO** modifique arquivos em `/Volumes/ExtMB/BaseCNPJ/` (arquivos RFB preservados)
2. **NÃO** altere `postgresql.conf` sem backup (configurações otimizadas)
3. **NÃO** delete `backup_importacao_old/` (referência importante)
4. **NÃO** execute importações massivas sem chunks (RAM limitada a 16GB)

### 🎯 Uso Recomendado:

```python
# Conecte-se para verificar estrutura
import psycopg2
conn = psycopg2.connect("postgresql://code4us@localhost:5432/basecerta")

# Verifique se tabelas foram criadas pelo outro projeto
cur.execute("""
    SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
    FROM pg_tables 
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY schemaname, tablename;
""")

# Use as tabelas quando estiverem disponíveis
# NÃO tente criar tabelas aqui
```

---

## 📚 Recursos Disponíveis

### Backup de Scripts e Migrations (`backup_importacao_old/`)

```
backup_importacao_old/
├── migrations/
│   ├── 001_create_insights_cache.py
│   ├── 002_create_cnpj_structure.py       # Schema completo CNPJ
│   └── 003_create_cnpj_brasil_schema.py   # Tabelas principais
├── create_database_schema.sql              # SQL completo
├── alembic.ini                             # Config Alembic
├── import_cnpj.py                          # Script importação com checkpoints
├── manage_checkpoints.py                   # Gestão de checkpoints
├── monitor_importacao_visual.sh            # Monitor com barras de progresso
└── postgresql_logs/                        # 52 logs de tentativas
```

**Para referência**: Se precisar entender como as tabelas devem ser criadas, consulte:
- `002_create_cnpj_structure.py` - Estrutura completa com índices
- `create_database_schema.sql` - SQL direto
- `import_cnpj.py` - Lógica de importação (com problemas de RAM)

### Arquivos da Receita Federal

```bash
# Localização dos ZIPs originais
ls -lh /Volumes/ExtMB/BaseCNPJ/dez2025/

# Total: ~7GB compactados
# Empresas: 10 arquivos (460MB + 74-94MB cada)
# Estabelecimentos: ~20 arquivos
# Sócios: ~10 arquivos
# Auxiliares: Cnaes, Municípios, etc.
```

---

## 🚨 Troubleshooting para IA

### Problema: "connection refused"

```bash
# 1. Verificar se PostgreSQL está rodando
brew services list | grep postgresql

# 2. Verificar se SSD externo está montado
ls /Volumes/ExtMB || echo "❌ SSD não montado!"

# 3. Iniciar serviço
brew services start postgresql@17

# 4. Aguardar 5 segundos e testar
sleep 5
psql -U code4us -d basecerta -c "SELECT 1;"
```

### Problema: "data directory not found"

```bash
# CRÍTICO: SSD externo não está montado
# Verifique:
diskutil list | grep "ExtMB"

# Se não aparecer:
# 1. Conecte o Samsung T7 na porta USB-C
# 2. Aguarde montagem automática
# 3. Reinicie PostgreSQL
brew services restart postgresql@17
```

### Problema: "database does not exist"

```bash
# Criar banco se necessário
psql -U code4us -d postgres -c "CREATE DATABASE basecerta;"

# Dar permissões aos usuários
psql -U code4us -d basecerta -c "
    GRANT ALL PRIVILEGES ON DATABASE basecerta TO aian_db;
    GRANT ALL PRIVILEGES ON DATABASE basecerta TO dev4us;
"
```

### Problema: "out of memory" durante importação

**Solução**: Não faça importações massivas neste Mac!
- RAM disponível: 16GB total
- PostgreSQL MERGE precisa: 2-3GB
- Python processo precisa: 2.5GB
- Sistema + apps: 13-15GB
- **Total necessário**: ~20GB (excede capacidade)

**Alternativas**:
1. Use outro servidor com 32GB+ RAM
2. Processe em chunks de 100k registros
3. Use servidor cloud (AWS RDS, DigitalOcean)
4. Desabilite aplicativos durante importação (não recomendado)

---

## 📞 Contato e Documentação

**Branch Git**: `beta006`  
**Commit**: `562e32e` - "feat(beta006): Limpeza completa de importação e criação de documentação"  
**Data**: 23 de Janeiro de 2026  
**Projeto**: BaseCerta - Consulta CNPJ Brasil  

**Documentos Relacionados**:
- `test_connection.py` - Script teste simples
- `test_all_connections.py` - Teste completo de 3 usuários
- `backup_importacao_old/README_MONITORES.md` - Documentação de monitores

---

## 🎓 Resumo Executivo para IA

**O que você precisa saber**:

1. ✅ PostgreSQL 17.7 rodando em SSD externo Samsung T7 (`/Volumes/ExtMB`)
2. ✅ Banco `basecerta` **vazio**, pronto para outro projeto criar tabelas
3. ✅ 3 usuários disponíveis: `code4us` (superuser), `aian_db` (owner), `dev4us` (app)
4. ✅ Arquivos RFB preservados (7GB) em `/Volumes/ExtMB/BaseCNPJ/dez2025/`
5. ✅ Backup completo de scripts (46MB) em `backup_importacao_old/`
6. ⚠️ **NÃO criar tabelas aqui** - será feito em outro projeto
7. ⚠️ **NÃO executar importações massivas** - RAM insuficiente (16GB)
8. ⚠️ **Verificar sempre se SSD está montado** antes de operações

**Seu papel**: Criar a estrutura do banco (schemas, tabelas, índices) e importar dados CNPJ da Receita Federal. Use as migrations em `backup_importacao_old/` como referência, mas implemente importação em chunks para evitar problemas de memória.

---

**Última atualização**: 23 de Janeiro de 2026  
**Status**: ✅ Banco vazio, configurado e testado  
**Próximo passo**: Aguardar criação de tabelas por projeto externo     host="localhost",
        port=5432,
        database="basecerta",
        user="code4us"
    )
    
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    
    print("✅ Conexão bem-sucedida!")
    print(f"📊 PostgreSQL: {version[0]}")
    
    cur.execute("SELECT current_database(), current_user;")
    info = cur.fetchone()
    print(f"🗄️  Database: {info[0]}")
    print(f"👤 User: {info[1]}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erro: {e}")
```

---

## 📌 Notas Importantes

1. **Banco Zerado**: O banco `basecerta` está **sem tabelas** no momento
2. **Schemas**: Você precisará criar os schemas e tabelas no seu outro projeto
3. **Backup**: Todos os scripts de criação estão em `backup_importacao_old/`
4. **Arquivos RFB**: Preservados em `/Volumes/ExtMB/BaseCNPJ/dez2025/`
5. **PostgreSQL 17**: Versão instalada via Homebrew no macOS

---

## 🚀 Uso em Outro Projeto

Para usar este banco em outro projeto:

1. **Copie as credenciais** acima
2. **Configure seu .env** ou arquivo de configuração
3. **Crie as tabelas** usando os scripts em `backup_importacao_old/migrations/`
4. **Importe os dados** no novo projeto

### Exemplo: Novo Projeto Python

```bash
# 1. No seu novo projeto, configure .env
echo "DATABASE_URL=postgresql://code4us@localhost:5432/basecerta" > .env

# 2. Instale dependências
pip install psycopg2-binary sqlalchemy

# 3. Teste conexão
python3 -c "import psycopg2; conn = psycopg2.connect('postgresql://code4us@localhost:5432/basecerta'); print('✅ Conectado!')"

# 4. Crie suas tabelas (use scripts do backup_importacao_old/)
```

---

## 📞 Troubleshooting

### Erro: "connection refused"
```bash
# Verifique se PostgreSQL está rodando
brew services list | grep postgresql

# Inicie se necessário
brew services start postgresql@17
```

### Erro: "database does not exist"
```bash
# Crie o banco se necessário
psql -U code4us -d postgres -c "CREATE DATABASE basecerta;"
```

### Erro: "password authentication failed"
```bash
# Use o usuário correto:
# - code4us (sem senha, local)
# - dev4us (com senha P@lm315@s)
```

---

**Última atualização**: 23 de Janeiro de 2026  
**PostgreSQL Version**: 17.x  
**Status**: Banco vazio, pronto para uso
