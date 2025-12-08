# 🗂️ Backup e Restauração do Banco de Dados

## 📋 Passo a Passo Completo

### **No Notebook Atual (linkerx):**

#### 1. Iniciar Docker (se não estiver rodando)
```bash
# Abrir Docker Desktop ou
open -a Docker

# Aguardar Docker iniciar e então:
cd /Users/linkerx/Documents/ADACODE/basecerta
docker-compose up -d
```

#### 2. Fazer Backup
```bash
./backup-database.sh
```

**O script vai criar:**
- ✅ Arquivo backup comprimido: `backups/basecerta_backup_YYYYMMDD_HHMMSS.sql.gz`
- ✅ Arquivo de informações: `backups/backup_info_YYYYMMDD_HHMMSS.txt`

#### 3. Copiar para o novo notebook
Copie a pasta `backups/` inteira junto com a pasta ADACODE

---

### **No Novo Notebook (code4us):**

#### 1. Rodar Setup Primeiro
```bash
cd /Users/code4us/Documents/ADACODE/basecerta
./setup-new-machine.sh
```

**Aguardar setup concluir** (isso vai criar o banco vazio)

#### 2. Restaurar Backup
```bash
./restore-database.sh backups/basecerta_backup_YYYYMMDD_HHMMSS.sql.gz
```

> ⚠️ **Substitua** `YYYYMMDD_HHMMSS` pela data/hora do seu backup

#### 3. Verificar
```bash
# Ver se dados foram restaurados
docker-compose exec postgres psql -U aian_db -d basecerta -c "SELECT COUNT(*) FROM cnpj.empresas;"
```

---

## 🎯 Ordem Correta de Execução

### **Notebook Atual:**
```bash
# 1. Garantir que Docker está rodando
docker-compose up -d

# 2. Fazer backup
./backup-database.sh

# 3. Copiar pasta backups/ para novo notebook
```

### **Novo Notebook:**
```bash
# 1. Setup completo (cria infraestrutura)
./setup-new-machine.sh

# 2. Restaurar backup (popula dados)
./restore-database.sh backups/basecerta_backup_20241208_HHMMSS.sql.gz

# 3. Iniciar aplicação
./start.sh
```

---

## 📦 Arquivos Necessários no Novo Notebook

Copiar da pasta ADACODE:

### Scripts (já estão no repo):
- ✅ `setup-new-machine.sh`
- ✅ `backup-database.sh`
- ✅ `restore-database.sh`
- ✅ `start.sh`
- ✅ `stop.sh`
- ✅ `logs.sh`

### Backup do banco:
- ✅ `backups/basecerta_backup_YYYYMMDD_HHMMSS.sql.gz`
- ✅ `backups/backup_info_YYYYMMDD_HHMMSS.txt` (opcional, só info)

---

## 🔍 Verificar Backup

### Ver informações do backup:
```bash
cat backups/backup_info_*.txt
```

### Listar backups disponíveis:
```bash
ls -lh backups/*.gz
```

### Testar integridade:
```bash
gunzip -t backups/basecerta_backup_*.sql.gz
```

---

## ⚠️ Troubleshooting

### "Docker não está rodando"
```bash
# Abrir Docker Desktop
open -a Docker

# Aguardar alguns segundos
sleep 10

# Tentar novamente
./backup-database.sh
```

### "Container do PostgreSQL não está rodando"
```bash
docker-compose up -d postgres
sleep 5
./backup-database.sh
```

### Backup muito grande (>1GB)
O arquivo já é comprimido automaticamente (`.gz`). Se ainda for grande:
- Use HD externo ou cloud (Google Drive, Dropbox)
- Ou use `git pull` no novo notebook (sem backup)

### Restauração falhou
```bash
# O script cria backup de segurança automático em:
backups/safety/before_restore_*.sql.gz

# Para restaurar o backup de segurança:
./restore-database.sh backups/safety/before_restore_*.sql.gz
```

---

## 🚀 Exemplo Completo

### Notebook Atual:
```bash
# 1. Fazer backup
cd /Users/linkerx/Documents/ADACODE/basecerta
docker-compose up -d
./backup-database.sh

# 2. Copiar pasta ADACODE inteira (inclui backups/) para novo notebook
```

### Novo Notebook:
```bash
# 1. Setup
cd /Users/code4us/Documents/ADACODE/basecerta
./setup-new-machine.sh

# 2. Restaurar (use TAB para autocompletar o nome do arquivo)
./restore-database.sh backups/basecerta_backup_<TAB>

# 3. Iniciar
./start.sh

# 4. Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## 📊 Tamanho Estimado

**Banco completo com 27M+ empresas:**
- SQL não comprimido: ~15-20 GB
- SQL comprimido (.gz): ~2-3 GB

**Tempo estimado:**
- Backup: 10-20 minutos
- Restauração: 15-30 minutos

---

## 💡 Dica Pro

Se quiser backup incremental diário:
```bash
# Adicionar ao crontab
crontab -e

# Adicionar linha (backup todo dia às 2h da manhã)
0 2 * * * cd /Users/code4us/Documents/ADACODE/basecerta && ./backup-database.sh
```

---

**Última atualização:** 08/12/2025
