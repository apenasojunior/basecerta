# Resumo da Configuração Final - BaseCerta

**Data**: 20/01/2026  
**Status**: ✅ Configuração Completa e Funcionando

---

## 🎯 Objetivo Alcançado

Migrar PostgreSQL e Docker Desktop para SSD externo Samsung T7 (1 TB) para liberar espaço no disco interno e preparar para importação de 200 GB de dados CNPJ.

---

## ✅ Configuração Final

### 1. PostgreSQL no SSD Externo

**Localização**: `/Volumes/ExtMB/postgresql/data/`

**Como foi feito**:
```bash
# 1. Parou PostgreSQL
brew services stop postgresql@17

# 2. Criou estrutura no SSD
mkdir -p /Volumes/ExtMB/postgresql/{data,backups,logs}

# 3. Migrou dados
rsync -av /opt/homebrew/var/postgresql@17/ /Volumes/ExtMB/postgresql/data/

# 4. Criou symlink
rm -rf /opt/homebrew/var/postgresql@17
ln -s /Volumes/ExtMB/postgresql/data /opt/homebrew/var/postgresql@17

# 5. Reiniciou PostgreSQL
brew services start postgresql@17
```

**Tamanho atual**: 94 MB (vazio, só schema)  
**Tamanho após importação**: ~200 GB

**Documentação**: `docs/estrutura/receitafederal/GUIA_COMPLETO_IMPORTACAO_CNPJ.md`

---

### 2. Docker Desktop no SSD Externo

**Localização**: `/Volumes/ExtMB/docker/data/DockerDesktop/`

**Como foi feito**:
1. Abriu Docker Desktop → Settings → Resources → Advanced
2. Alterou "Disk image location" para `/Volumes/ExtMB/docker/data`
3. Clicou em "Apply & Restart"
4. Removeu Docker.raw antigo e deixou Docker recriar

**Tamanho atual**: 32 GB  
**Problema resolvido**: Backup de 228 GB removido (HFS+ expandiu sparse file)

**Documentação**: `docs/estrutura/docker/DOCKER_SSD_EXTERNO.md`

---

### 3. Volumes Docker (Bind Mounts)

**Configurado em**: `docker-compose.yml`

```yaml
volumes:
  - /Volumes/ExtMB/docker/volumes/redis:/data          # Redis
  - /Volumes/ExtMB/docker/cache/backend:/tmp           # Backend temp
  - /Volumes/ExtMB/docker/cache/nextjs:/app/.next      # Next.js cache
```

---

## 📊 Uso de Espaço

### Disco Interno (macOS)
- **Liberado**: ~32 GB (Docker movido)
- **Resíduos**: 2.4 MB (tolerável)

### SSD Externo Samsung T7 (932 GB)
- **Docker**: 32 GB
- **PostgreSQL**: 94 MB (crescerá para ~200 GB)
- **Dados CNPJ (ZIPs)**: 6.8 GB
- **Redis/Cache**: ~100 MB
- **Total usado**: ~40 GB
- **Livre**: ~892 GB

---

## 🐳 Containers Rodando

```bash
docker ps
```

- ✅ `basecerta_redis` (healthy)
- ✅ `basecerta_backend` (up)
- ✅ `basecerta_frontend` (up)
- ✅ `basecerta_celery_worker` (up)
- ✅ `basecerta_celery_beat` (up)

---

## 📁 Estrutura de Diretórios no SSD Externo

```
/Volumes/ExtMB/
├── BaseCNPJ/
│   └── dez2025/              # 6.8 GB - ZIPs da Receita Federal
├── postgresql/
│   ├── data/                 # 94 MB - Dados PostgreSQL (symlink)
│   ├── backups/              # Backups futuros
│   └── logs/                 # Logs de importação
└── docker/
    ├── data/
    │   └── DockerDesktop/    # 32 GB - Docker Desktop completo
    ├── volumes/
    │   └── redis/            # Redis data
    └── cache/
        ├── backend/          # Backend temp
        └── nextjs/           # Next.js cache
```

---

## 🚀 Próximos Passos

### 1. Importar Dados CNPJ (Quando Estiver Pronto)

```bash
cd /Users/code4us/Documents/ADACODE/basecerta/scripts

# Opcional: Tuning para importação mais rápida
python3 postgres_tuning.py --apply

# Importação (6-8 horas)
python3 import_cnpj.py 2025-12

# Restaurar configuração segura
python3 postgres_tuning.py --restore
```

**Resultado esperado**: PostgreSQL crescerá de 94 MB → ~200 GB

---

## 🔧 Comandos Úteis

### Verificar Espaço

```bash
# PostgreSQL
du -sh /Volumes/ExtMB/postgresql/data/

# Docker
du -sh /Volumes/ExtMB/docker/

# Total no SSD
df -h /Volumes/ExtMB
```

### Gerenciar Docker

```bash
# Ver uso de espaço
docker system df

# Limpar cache (libera espaço)
docker system prune -a --volumes

# Rebuild projeto
docker-compose build
docker-compose up -d
```

### PostgreSQL

```bash
# Conectar
psql -h localhost -U postgres -d basecerta

# Ver tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ⚠️ Observações Importantes

### HFS+ vs APFS

O SSD externo está em **HFS+** (não APFS):
- **Problema**: Sparse files são expandidos (Docker.raw 228 GB → ocupou 228 GB reais)
- **Solução aplicada**: Remover Docker.raw e deixar Docker recriar do zero
- **Alternativa futura**: Reformatar disco para APFS (perde dados, requer backup)

### Dependência do SSD Externo

- PostgreSQL e Docker **SÓ funcionam** com SSD conectado
- Sempre feche Docker Desktop antes de desconectar o SSD
- PostgreSQL precisa ser parado: `brew services stop postgresql@17`

### Reversão (Se Necessário)

**PostgreSQL de volta ao interno**:
```bash
brew services stop postgresql@17
rm /opt/homebrew/var/postgresql@17
rsync -av /Volumes/ExtMB/postgresql/data/ /opt/homebrew/var/postgresql@17/
brew services start postgresql@17
```

**Docker de volta ao interno**:
- Docker Desktop → Settings → Resources → Advanced
- Disk image location → Escolha local padrão
- Apply & Restart

---

## 📖 Documentação Relacionada

- **Importação CNPJ**: `docs/estrutura/receitafederal/GUIA_COMPLETO_IMPORTACAO_CNPJ.md`
- **Docker SSD**: `docs/estrutura/docker/DOCKER_SSD_EXTERNO.md`
- **Scripts**:
  - `scripts/import_cnpj.py` - Importação principal
  - `scripts/postgres_tuning.py` - Otimização PostgreSQL
  - `scripts/docker_fresh_install_ssd.sh` - Migração Docker (não usado)

---

## ✅ Checklist de Verificação

- [x] PostgreSQL no SSD externo e funcionando
- [x] Docker Desktop no SSD externo
- [x] Volumes Docker em bind mounts externos
- [x] Containers rodando normalmente
- [x] 892 GB livres para importação CNPJ
- [x] Documentação atualizada
- [ ] Importação CNPJ executada (próximo passo)

---

**Configuração validada em**: 20/01/2026 às 01:15  
**Tudo funcionando**: ✅
