# Acesso ao PostgreSQL - BaseCerta

## 📋 Informações de Conexão

### Servidor Local (MacBook)

```
Host:     localhost (ou 127.0.0.1)
Porta:    5432
Database: basecerta
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

#### 3. Usuário: `dev4us` (Para Docker)
- **Senha**: `P@lm315@s`
- **Uso**: Conexão da aplicação em Docker
- **Host especial**: `host.docker.internal` (para containers)

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

# Conexão do Docker (com senha)
conn = psycopg2.connect(
    host="host.docker.internal",  # ou "localhost" se não for Docker
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
    'P@lm315@s'
);
?>
```

---

## 🐳 Configuração Docker

### docker-compose.yml

```yaml
services:
  app:
    environment:
      DB_HOST: host.docker.internal  # Acessa PostgreSQL do Mac
      DB_PORT: 5432
      DB_NAME: basecerta
      DB_USER: dev4us
      DB_PASSWORD: P@lm315@s
```

### Arquivo .env (Para sua aplicação)

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

### Conexões Remotas ou Docker
- Use o usuário `dev4us` com senha `P@lm315@s`
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

### Script Python de Teste

```python
#!/usr/bin/env python3
import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
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
