# Configuração Docker no SSD Externo

**Data:** 19/01/2026  
**Localização:** `/Volumes/ExtMB/docker/`

---

## ✅ Configuração Aplicada

### Estrutura no SSD Externo

```
/Volumes/ExtMB/docker/
├── volumes/
│   └── redis/          # Dados persistentes do Redis
├── cache/
│   ├── backend/        # Cache temporário backend (/tmp)
│   └── nextjs/         # Build cache Next.js (.next)
└── data/               # Reservado para futuros dados
```

### O que foi movido

1. **Redis Data** (`redis_data`)
   - Antes: Volume Docker padrão (~100-500 MB)
   - Depois: `/Volumes/ExtMB/docker/volumes/redis`
   - Economia: Libera espaço no disco interno

2. **Next.js Build Cache** (`.next`)
   - Antes: Volume Docker anônimo (~200-800 MB)
   - Depois: `/Volumes/ExtMB/docker/cache/nextjs`
   - Vantagem: Cache persistente entre rebuilds

3. **Backend Temp** (`/tmp`)
   - Antes: Dentro do container (~variável)
   - Depois: `/Volumes/ExtMB/docker/cache/backend`
   - Vantagem: Arquivos temporários não enchem disco interno

---

## 📊 Economia de Espaço (Configuração Final - 20/01/2026)

**Docker Desktop no SSD Externo:**
- Docker.raw: ~32 GB (cresce conforme uso)
- Imagens: incluídas no Docker.raw
- Volumes: bind mounts externos
- **Total Docker**: ~32 GB

**Disco Interno Liberado:**
- Docker Desktop movido: ~32 GB
- **Total ganho**: ~32 GB

**SSD Externo (932 GB total):**
- Docker: 32 GB
- PostgreSQL: 94 MB (vazio - crescerá para ~200 GB após importação CNPJ)
- Dados CNPJ (ZIPs): 6.8 GB
- Redis volumes: ~100 MB
- **Usado**: ~40 GB
- **Livre**: ~892 GB

---

## ⚠️ IMPORTANTE: Sparse Files e Filesystem

### O Problema do Docker.raw

O Docker Desktop usa um arquivo `Docker.raw` que é um **sparse file**:
- **Tamanho aparente**: 228 GB (limite máximo do Docker Desktop)
- **Espaço real usado**: ~3 GB (dados efetivamente salvos)
- **Cresce dinamicamente** conforme você usa

### Comportamento por Filesystem

**APFS (disco interno macOS)**:
- ✅ Suporta sparse files nativamente
- `ls -lh Docker.raw` → mostra 228 GB
- `du -sh Docker.raw` → mostra 3 GB (espaço real)
- **Ocupa apenas 3 GB no disco**

**HFS+ (disco externo Samsung T7)**:
- ❌ NÃO suporta sparse files da mesma forma
- Ao mover Docker.raw para HFS+:
  - Arquivo será **expandido para 228 GB reais**
  - Ocupará **228 GB** no disco externo (não 3 GB!)
- Warnings rsync: `fpathconf, --sparse may not work: Invalid argument`

### ✅ SOLUÇÃO QUE FUNCIONOU (Testada e Aprovada)

**Método: Docker Desktop Settings (RECOMENDADO)**

1. **Abra Docker Desktop** → Settings (⚙️) → Resources → Advanced

2. **Disk image location**: Clique em "Browse"
   - Escolha: `/Volumes/ExtMB/docker/data`

3. **Apply & Restart**
   - Docker moverá tudo automaticamente
   - Aguarde 2-3 minutos

4. **Se Docker.raw ficar muito grande (HFS+ expande sparse files):**
   ```bash
   # Feche Docker Desktop
   rm /Volumes/ExtMB/docker/data/DockerDesktop/Docker.raw
   
   # Abra Docker Desktop (recria com tamanho correto)
   ```

**Resultado:**
- Docker Desktop 100% no SSD externo
- Docker.raw: ~32 GB (cresce conforme uso)
- Disco interno: ~32 GB liberados
- Containers funcionando normalmente

**Vantagens:**
- ✅ Solução oficial do Docker
- ✅ Não precisa scripts complexos
- ✅ Reversível facilmente
- ✅ Funciona com HFS+ e APFS

**🔄 ALTERNATIVA 1: Reformatar Disco para APFS**
```bash
# ⚠️ APAGA TODOS OS DADOS!
# Faça backup de PostgreSQL primeiro
diskutil eraseDisk APFS ExtMB disk4

# Depois restaure PostgreSQL e migre Docker novamente
# Sparse files funcionarão corretamente (3 GB reais)
```
- **Prós:** Sparse files funcionam, usa só 3 GB
- **Contras:** Perde todos os dados atuais (PostgreSQL, etc)

**🗂️ ALTERNATIVA 2: Aceitar 228 GB no HFS+**
- Se você tem espaço sobrando (932 GB livres - 228 GB Docker = 704 GB)
- Use script de migração: `./scripts/migrate_docker_to_ssd.sh`
- **Prós:** Tudo centralizado no SSD externo
- **Contras:** Desperdiça ~225 GB desnecessariamente

---

## 🔧 Como Mover Docker Desktop (Via Settings - MÉTODO ATUAL)

### Passo a Passo (Testado em 20/01/2026)

**1. Abrir Docker Desktop Settings**
   - Ícone Docker no menu bar
   - Settings (⚙️)
   - Resources → Advanced

**2. Alterar Disk Image Location**
   - Campo: "Disk image location"
   - Clique em "Browse"
   - Navegue até: `/Volumes/ExtMB/docker/data`
   - Selecione a pasta

**3. Aplicar Mudanças**
   - Clique em "Apply & Restart"
   - Docker moverá todos os dados automaticamente
   - Aguarde 2-3 minutos para reinicialização

**4. Verificar (após Docker iniciar)**
```bash
# Ver onde está o Docker.raw
find /Volumes/ExtMB/docker -name "Docker.raw"

# Verificar tamanho
du -sh /Volumes/ExtMB/docker/

# Testar containers
docker ps
docker-compose up -d
```

### Problemas Conhecidos e Soluções

**Problema 1: Docker.raw muito grande (228 GB)**
- Causa: HFS+ expande sparse files
- Solução:
  ```bash
  # Feche Docker Desktop primeiro
  rm /Volumes/ExtMB/docker/data/DockerDesktop/Docker.raw
  
  # Abra Docker Desktop (recria com tamanho correto)
  ```

**Problema 2: Backups antigos ocupando espaço**
- Verificar: `du -sh /Volumes/ExtMB/docker/backups/`
- Remover: `rm -rf /Volumes/ExtMB/docker/backups/`

**Problema 3: Containers não iniciam**
- Reconstruir imagens: `docker-compose build`
- Iniciar: `docker-compose up -d`

---

## 📝 Método Antigo (Via Symlink - NÃO USAR)

Esse método foi tentado mas apresentou problemas com proteções do macOS.
Use o método via Docker Desktop Settings descrito acima.

### Opção 1: Via Docker Desktop Settings (Recomendado - ACIMA)

1. Abrir Docker Desktop
2. Settings (engrenagem) → Resources → Advanced
3. **Disk image location:** Alterar para `/Volumes/ExtMB/docker/data`
4. Apply & Restart

### Opção 2: Via Symlink (Manual)

```bash
# ⚠️ ATENÇÃO: Fazer backup antes!

# 1. Parar Docker Desktop
# (Menu bar → Quit Docker Desktop)

# 2. Backup dos dados atuais
cp -R ~/Library/Containers/com.docker.docker \
      /Volumes/ExtMB/docker/backups/docker_backup_$(date +%Y%m%d)

# 3. Mover dados para SSD externo
mv ~/Library/Containers/com.docker.docker \
   /Volumes/ExtMB/docker/data/com.docker.docker

# 4. Criar symlink
ln -s /Volumes/ExtMB/docker/data/com.docker.docker \
      ~/Library/Containers/com.docker.docker

# 5. Iniciar Docker Desktop novamente
```

**Ganho:** 3 GB liberados do disco interno

---

## 🚀 Comandos Úteis

### Limpar Cache Docker (Libera muito espaço!)

```bash
# Ver uso de espaço
docker system df

# Limpar tudo não usado
docker system prune -a --volumes

# Limpar apenas build cache
docker builder prune -a

# Limpar volumes não usados
docker volume prune
```

### Verificar Espaço no SSD Externo

```bash
# Tamanho dos dados Docker
du -sh /Volumes/ExtMB/docker/

# Detalhado por pasta
du -sh /Volumes/ExtMB/docker/*

# Espaço total disponível
df -h /Volumes/ExtMB
```

### Rebuild com Cache Limpo

```bash
# Rebuild forçado (sem cache)
docker-compose build --no-cache

# Up com rebuild
docker-compose up --build
```

---

## ⚠️ Avisos Importantes

### Antes de Desconectar o SSD

```bash
# 1. Parar todos os containers
docker-compose down

# 2. Parar Docker Desktop
# (Menu bar → Quit Docker Desktop)

# 3. Aguardar
sleep 3

# 4. Ejetar disco
diskutil eject /Volumes/ExtMB
```

### Ao Reconectar o SSD

```bash
# 1. Conectar disco (monta automaticamente)

# 2. Verificar se montou
ls /Volumes/ExtMB/docker/

# 3. Iniciar Docker Desktop

# 4. Iniciar containers
docker-compose up -d
```

---

## 🔍 Troubleshooting

### Erro: "Cannot find volume"

**Causa:** Docker procurando volumes no local antigo

**Solução:**
```bash
# Remover volumes antigos
docker volume rm basecerta_redis_data 2>/dev/null || true

# Recriar com nova configuração
docker-compose up -d
```

### Next.js não reconhece cache

**Causa:** Permissões do volume

**Solução:**
```bash
# Ajustar permissões
chmod -R 777 /Volumes/ExtMB/docker/cache/nextjs/
```

### Redis perde dados

**Causa:** Volume não foi criado corretamente

**Solução:**
```bash
# Verificar se pasta existe
ls -la /Volumes/ExtMB/docker/volumes/redis/

# Se não existir, criar
mkdir -p /Volumes/ExtMB/docker/volumes/redis
chmod 777 /Volumes/ExtMB/docker/volumes/redis

# Reiniciar container
docker-compose restart redis
```

---

## 📝 Alternativa: Docker Compose Override

Se não quiser modificar o `docker-compose.yml` original, crie um `docker-compose.override.yml`:

```yaml
# docker-compose.override.yml
services:
  redis:
    volumes:
      - /Volumes/ExtMB/docker/volumes/redis:/data
  
  backend:
    volumes:
      - /Volumes/ExtMB/docker/cache/backend:/tmp
  
  frontend:
    volumes:
      - /Volumes/ExtMB/docker/cache/nextjs:/app/.next
```

Docker Compose automaticamente mescla os dois arquivos!

---

## 📚 Benefícios da Configuração

✅ **Espaço:** 350 MB - 1.5 GB liberados (ou 3+ GB se mover tudo)  
✅ **Performance:** SSD externo (842 MB/s) é rápido  
✅ **Persistência:** Cache sobrevive entre rebuilds  
✅ **Organização:** Dados Docker centralizados no SSD externo  
✅ **Backup:** Fácil fazer backup só do `/Volumes/ExtMB/docker/`  
✅ **Isolamento:** Dados de trabalho não competem com sistema

---

## 🎯 Recomendação

**Para uso normal:**
- Manter Docker Desktop no interno (~3 GB)
- Volumes de dados no externo (configuração atual) ✅

**Se precisar de muito espaço:**
- Mover tudo para externo (via symlink)
- Ganho: ~3 GB extras

**Limpeza regular:**
```bash
# Toda semana
docker system prune -a --volumes

# Após cada release
docker builder prune -a
```

---

**Última atualização:** 19/01/2026  
**Relacionado:** [GUIA_COMPLETO_IMPORTACAO_CNPJ.md](GUIA_COMPLETO_IMPORTACAO_CNPJ.md)
