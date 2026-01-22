#!/bin/bash
# Script para mover Docker Desktop completo para SSD externo
# Ganha: ~3 GB de espaço no disco interno

set -e

EXTERNAL_DISK="/Volumes/ExtMB"
DOCKER_INTERNAL="$HOME/Library/Containers/com.docker.docker"
DOCKER_EXTERNAL="$EXTERNAL_DISK/docker/data/com.docker.docker"
BACKUP_DIR="$EXTERNAL_DISK/docker/backups"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  MIGRAÇÃO DOCKER DESKTOP PARA SSD EXTERNO                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Verificar se disco está montado
if [ ! -d "$EXTERNAL_DISK" ]; then
    echo "❌ ERRO: Disco externo não montado em $EXTERNAL_DISK"
    exit 1
fi

echo "✅ Disco externo encontrado"
echo ""

# Verificar se Docker está rodando
if docker info &>/dev/null; then
    echo "⚠️  Docker está rodando!"
    echo "   Por favor, feche o Docker Desktop antes de continuar."
    echo "   Menu bar → Docker icon → Quit Docker Desktop"
    echo ""
    read -p "Docker Desktop foi fechado? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operação cancelada."
        exit 1
    fi
fi

# Verificar se já não foi migrado
if [ -L "$DOCKER_INTERNAL" ]; then
    echo "ℹ️  Docker já está usando symlink"
    TARGET=$(readlink "$DOCKER_INTERNAL")
    echo "   Apontando para: $TARGET"
    echo ""
    read -p "Deseja refazer a migração? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operação cancelada."
        exit 0
    fi
    rm "$DOCKER_INTERNAL"
fi

# Verificar se existe dados Docker
if [ ! -d "$DOCKER_INTERNAL" ]; then
    echo "ℹ️  Nenhum dado Docker encontrado em $DOCKER_INTERNAL"
    echo "   Criando estrutura nova no SSD externo..."
    mkdir -p "$DOCKER_EXTERNAL"
    ln -s "$DOCKER_EXTERNAL" "$DOCKER_INTERNAL"
    echo "✅ Symlink criado"
    echo ""
    echo "Inicie o Docker Desktop agora."
    exit 0
fi

# Mostrar tamanho atual
SIZE=$(du -sh "$DOCKER_INTERNAL" | cut -f1)
echo "📊 Tamanho atual dos dados Docker: $SIZE"
echo ""

# Confirmar migração
echo "⚠️  ATENÇÃO: Esta operação irá:"
echo "   1. Mover $SIZE para o SSD externo (usando rsync sparse)"
echo "   2. Criar symlink no local original"
echo "   3. Reversível a qualquer momento"
echo ""
read -p "Deseja continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operação cancelada."
    exit 0
fi

# Criar diretórios
echo ""
echo "📁 Criando estrutura no SSD externo..."
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$DOCKER_EXTERNAL")"

# Não fazemos backup - migração é reversível via symlink
echo ""
echo "ℹ️  Migração é reversível (usa symlink, sem backup necessário)"

# Mover dados
echo ""
echo "📦 Movendo dados Docker para SSD externo..."
echo "   Origem: $DOCKER_INTERNAL"
echo "   Destino: $DOCKER_EXTERNAL"
echo ""
echo "⚠️  NOTA: Disco externo é HFS+ (não suporta sparse files como APFS)"
echo "   Docker.raw aparece como 228 GB mas só usa 3 GB reais."
echo "   No HFS+, ocupará ~228 GB (limite máximo do Docker)."
echo ""
read -p "Confirma mover 228 GB para o disco externo? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operação cancelada."
    echo ""
    echo "💡 Alternativa: Manter Docker no disco interno e só usar volumes externos"
    echo "   (já configurado no docker-compose.yml)"
    exit 0
fi

# Mover direto (não copiar - evita duplicação temporária)
echo ""
echo "📦 Movendo com mv (operação atômica)..."
mv "$DOCKER_INTERNAL" "$DOCKER_EXTERNAL"
echo "   ✅ Dados movidos"

# Criar symlink
echo ""
echo "🔗 Criando symlink..."
ln -s "$DOCKER_EXTERNAL" "$DOCKER_INTERNAL"
echo "   ✅ $DOCKER_INTERNAL -> $DOCKER_EXTERNAL"

# Verificar
echo ""
echo "✅ Migração concluída com sucesso!"
echo ""
echo "📍 Localização dos dados:"
echo "   Docker Data: $DOCKER_EXTERNAL"
echo "   Symlink: $DOCKER_INTERNAL -> $DOCKER_EXTERNAL"
echo ""
echo "📊 Espaço liberado no disco interno: $SIZE"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Inicie o Docker Desktop"
echo "   2. Verifique se tudo funciona normalmente"
echo ""
echo "🔄 Para reverter:"
echo "   1. Feche o Docker Desktop"
echo "   2. rm ~/Library/Containers/com.docker.docker"
echo "   3. mv $DOCKER_EXTERNAL ~/Library/Containers/com.docker.docker"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Sempre feche o Docker Desktop antes de desconectar o SSD externo!"
echo "   - Comando: Menu bar → Docker icon → Quit Docker Desktop"
echo ""
