#!/bin/bash
# Criar Docker Desktop do zero no SSD externo
# Melhor solução para HFS+ (evita problema de sparse files)

set -e

EXTERNAL_DISK="/Volumes/ExtMB"
DOCKER_INTERNAL="$HOME/Library/Containers/com.docker.docker"
DOCKER_EXTERNAL="$EXTERNAL_DISK/docker/data/com.docker.docker"
BACKUP_DIR="$EXTERNAL_DISK/docker/backups"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  DOCKER DESKTOP NOVO NO SSD EXTERNO                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Verificar se disco está montado
if [ ! -d "$EXTERNAL_DISK" ]; then
    echo "❌ ERRO: Disco externo não montado em $EXTERNAL_DISK"
    exit 1
fi

echo "✅ Disco externo encontrado (HFS+)"
echo ""

# Verificar se Docker está rodando
if docker info &>/dev/null; then
    echo "⚠️  Docker está rodando!"
    echo "   Por favor, feche o Docker Desktop antes de continuar."
    echo "   Menu bar → Docker icon → Quit Docker Desktop"
    echo ""
    exit 1
fi

# Verificar se já existe Docker
if [ -L "$DOCKER_INTERNAL" ]; then
    echo "ℹ️  Docker já está usando symlink para:"
    readlink "$DOCKER_INTERNAL"
    echo ""
    echo "✅ Configuração já aplicada!"
    echo "   Apenas inicie o Docker Desktop."
    exit 0
fi

if [ -d "$DOCKER_INTERNAL" ]; then
    SIZE=$(du -sh "$DOCKER_INTERNAL" | cut -f1)
    echo "📊 Docker Desktop atual: $SIZE"
    echo ""
    echo "Esta operação irá:"
    echo "   1. REMOVER Docker atual (sem backup)"
    echo "   2. Criar symlink para SSD externo"
    echo "   3. Docker Desktop criará estrutura NOVA no SSD"
    echo "   4. Você fará rebuild das imagens (5-10 min)"
    echo ""
    echo "⚠️  Será removido:"
    echo "   • Imagens Docker atuais (serão recriadas)"
    echo "   • Cache e configurações do Docker Desktop"
    echo ""
    echo "✅ Estará SEGURO:"
    echo "   • Volumes do projeto (bind mounts externos)"
    echo "   • Código do projeto"
    echo "   • Dados PostgreSQL, Redis, etc"
    echo ""
    read -p "Confirma remoção do Docker atual? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operação cancelada."
        exit 0
    fi
    
    # Remover Docker atual (com sudo para proteção do macOS)
    echo ""
    echo "🗑️  Removendo Docker atual..."
    echo "   (pode pedir senha - diretório protegido pelo macOS)"
    sudo rm -rf "$DOCKER_INTERNAL"
    echo "   ✅ Docker removido ($SIZE liberados temporariamente)"
fi

# Criar estrutura no SSD
echo ""
echo "📁 Criando estrutura no SSD externo..."
mkdir -p "$(dirname "$DOCKER_EXTERNAL")"

# Criar symlink
echo ""
echo "🔗 Criando symlink..."
ln -s "$DOCKER_EXTERNAL" "$DOCKER_INTERNAL"
echo "   ✅ $DOCKER_INTERNAL -> $DOCKER_EXTERNAL"

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📍 Localização:"
echo "   Symlink: $DOCKER_INTERNAL"
echo "   Destino: $DOCKER_EXTERNAL"
echo ""
echo "🚀 Próximos passos:"
echo ""
echo "1. Inicie o Docker Desktop"
echo "   → Docker criará estrutura NOVA no SSD externo"
echo ""
echo "2. Rebuild as imagens do projeto:"
echo "   cd /Users/code4us/Documents/ADACODE/basecerta"
echo "   docker-compose build"
echo "   docker-compose up -d"
echo ""
echo "3. Verifique se tudo funciona:"
echo "   docker ps"
echo "   docker-compose logs"
echo ""
echo "💾 Uso de espaço:"
echo "   • Docker.raw começará com ~1-2 GB"
echo "   • Crescerá conforme você usa"
echo "   • HFS+ funciona normalmente (sem sparse file)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   • Sempre feche Docker Desktop antes de desconectar SSD!"
echo "   • Comando: Menu bar → Docker icon → Quit Docker Desktop"
echo ""
