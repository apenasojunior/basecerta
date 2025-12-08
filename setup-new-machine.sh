#!/bin/bash

################################################################################
# BaseCerta - Setup Automatizado para Novo Computador
# 
# Este script configura todo o ambiente necessário para rodar o projeto
# incluindo instalação de dependências, Docker, Node.js, etc.
#
# Uso: ./setup-new-machine.sh
################################################################################

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se está rodando em macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "Este script foi feito para macOS"
    exit 1
fi

print_header "🚀 BaseCerta - Setup Automatizado"
print_info "Este script irá configurar todo o ambiente automaticamente"
print_warning "Pode demorar alguns minutos na primeira execução"
echo ""
read -p "Pressione ENTER para continuar ou Ctrl+C para cancelar..."

################################################################################
# 1. HOMEBREW (Gerenciador de Pacotes)
################################################################################

print_header "1️⃣  Verificando Homebrew"

if ! command -v brew &> /dev/null; then
    print_warning "Homebrew não encontrado. Instalando..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Adicionar ao PATH (para Apple Silicon)
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    print_success "Homebrew instalado"
else
    print_success "Homebrew já instalado: $(brew --version | head -n1)"
fi

################################################################################
# 2. DOCKER DESKTOP
################################################################################

print_header "2️⃣  Verificando Docker"

if ! command -v docker &> /dev/null; then
    print_warning "Docker não encontrado. Instalando Docker Desktop..."
    
    brew install --cask docker
    
    print_info "Aguardando Docker Desktop iniciar..."
    print_warning "⚠️  IMPORTANTE: Abra o Docker Desktop manualmente e aceite os termos"
    print_warning "⚠️  Depois pressione ENTER para continuar"
    read -p ""
    
    # Aguardar Docker ficar disponível
    echo "Aguardando Docker inicializar..."
    for i in {1..30}; do
        if docker info &> /dev/null; then
            break
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    
    if docker info &> /dev/null; then
        print_success "Docker instalado e funcionando"
    else
        print_error "Docker não está respondendo. Abra o Docker Desktop e tente novamente."
        exit 1
    fi
else
    if docker info &> /dev/null; then
        print_success "Docker já instalado e rodando: $(docker --version)"
    else
        print_warning "Docker instalado mas não está rodando"
        print_info "Iniciando Docker Desktop..."
        open -a Docker
        
        echo "Aguardando Docker inicializar..."
        for i in {1..30}; do
            if docker info &> /dev/null; then
                break
            fi
            echo -n "."
            sleep 2
        done
        echo ""
        
        if docker info &> /dev/null; then
            print_success "Docker iniciado"
        else
            print_error "Não foi possível iniciar o Docker. Abra manualmente."
            exit 1
        fi
    fi
fi

################################################################################
# 3. NODE.JS E NPM
################################################################################

print_header "3️⃣  Verificando Node.js"

if ! command -v node &> /dev/null; then
    print_warning "Node.js não encontrado. Instalando via Homebrew..."
    brew install node@20
    brew link node@20
    print_success "Node.js instalado"
else
    NODE_VERSION=$(node --version)
    print_success "Node.js já instalado: $NODE_VERSION"
    
    # Verificar se é versão 18+
    NODE_MAJOR=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js versão antiga ($NODE_VERSION). Recomendado: v18+"
        read -p "Deseja atualizar? (s/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            brew upgrade node
        fi
    fi
fi

################################################################################
# 4. PYTHON 3.11+
################################################################################

print_header "4️⃣  Verificando Python"

if ! command -v python3 &> /dev/null; then
    print_warning "Python 3 não encontrado. Instalando..."
    brew install python@3.11
    print_success "Python instalado"
else
    PYTHON_VERSION=$(python3 --version)
    print_success "Python já instalado: $PYTHON_VERSION"
fi

################################################################################
# 5. GIT (já deve estar, mas garantir)
################################################################################

print_header "5️⃣  Verificando Git"

if ! command -v git &> /dev/null; then
    print_warning "Git não encontrado. Instalando..."
    brew install git
    print_success "Git instalado"
else
    print_success "Git já instalado: $(git --version)"
fi

################################################################################
# 6. CONFIGURAR PROJETO
################################################################################

print_header "6️⃣  Configurando Projeto BaseCerta"

# Detectar diretório do projeto automaticamente (funciona em qualquer usuário/máquina)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

print_info "Diretório do projeto: $PROJECT_DIR"
print_info "Usuário atual: $USER"

# 6.1. Arquivos .env
print_info "Configurando arquivos de ambiente (.env)..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Arquivo .env criado"
    else
        print_warning ".env.example não encontrado, criando .env básico..."
        cat > .env << 'EOF'
# PostgreSQL
POSTGRES_USER=aian_db
POSTGRES_PASSWORD=P@lm315@s
POSTGRES_DB=basecerta
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123

# JWT
JWT_SECRET_KEY=seu_jwt_secret_key_super_seguro_aqui_123456
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
EOF
        print_success "Arquivo .env criado com configurações padrão"
    fi
else
    print_success "Arquivo .env já existe"
fi

# 6.2. Frontend .env.local
if [ -d "frontend" ]; then
    cd frontend
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_success "Frontend .env.local criado"
        else
            print_warning "Frontend .env.example não encontrado, criando .env.local básico..."
            cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
EOF
            print_success "Frontend .env.local criado"
        fi
    else
        print_success "Frontend .env.local já existe"
    fi
    
    cd "$PROJECT_DIR"
fi

################################################################################
# 7. DOCKER COMPOSE - SUBIR BACKEND
################################################################################

print_header "7️⃣  Iniciando Backend (Docker)"

print_info "Parando containers existentes (se houver)..."
docker-compose down 2>/dev/null || true

print_info "Iniciando containers (PostgreSQL, Redis, Backend)..."
docker-compose up -d

print_info "Aguardando containers iniciarem..."
sleep 10

# Verificar se containers estão rodando
if docker-compose ps | grep -q "Up"; then
    print_success "Containers Docker iniciados"
    docker-compose ps
else
    print_error "Erro ao iniciar containers"
    docker-compose logs
    exit 1
fi

################################################################################
# 8. POPULAR CACHE DE INSIGHTS (Primeira vez)
################################################################################

print_header "8️⃣  Populando Cache de Insights"

print_info "Executando script de população do cache..."
docker-compose exec -T backend python scripts/populate_insights_cache.py || {
    print_warning "Erro ao popular cache. Tentando novamente em 5 segundos..."
    sleep 5
    docker-compose exec -T backend python scripts/populate_insights_cache.py || {
        print_error "Não foi possível popular o cache. Execute manualmente depois:"
        print_info "docker-compose exec backend python scripts/populate_insights_cache.py"
    }
}

################################################################################
# 9. FRONTEND - INSTALAR DEPENDÊNCIAS
################################################################################

print_header "9️⃣  Configurando Frontend"

if [ -d "frontend" ]; then
    cd frontend
    
    print_info "Instalando dependências do frontend (pode demorar)..."
    npm install
    
    print_success "Dependências do frontend instaladas"
    
    cd "$PROJECT_DIR"
else
    print_warning "Pasta frontend não encontrada"
fi

################################################################################
# 10. VERIFICAR FUNCIONAMENTO
################################################################################

print_header "🔍 Verificando Funcionamento"

print_info "Testando Backend Health Check..."
sleep 3

if curl -s http://localhost:8000/health | grep -q "ok"; then
    print_success "Backend está respondendo"
else
    print_warning "Backend não está respondendo ainda. Pode demorar alguns segundos..."
fi

print_info "Testando endpoint de insights..."
if curl -s http://localhost:8000/api/v1/insights/grouped | grep -q "setores"; then
    print_success "Endpoint de insights funcionando"
else
    print_warning "Endpoint de insights ainda não está pronto"
fi

################################################################################
# 11. CRIAR SCRIPTS DE ATALHO
################################################################################

print_header "🔧 Criando Scripts de Atalho"

# Script para iniciar tudo
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando BaseCerta..."

# Backend
echo "📦 Iniciando Backend (Docker)..."
docker-compose up -d

# Frontend
echo "🎨 Iniciando Frontend..."
cd frontend && npm run dev &

echo ""
echo "✅ BaseCerta iniciado!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   Docs API: http://localhost:8000/docs"
echo ""
EOF
chmod +x start.sh
print_success "Script start.sh criado"

# Script para parar tudo
cat > stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Parando BaseCerta..."

# Parar frontend
pkill -f "next dev" 2>/dev/null || true

# Parar backend
docker-compose down

echo "✅ BaseCerta parado"
EOF
chmod +x stop.sh
print_success "Script stop.sh criado"

# Script para logs
cat > logs.sh << 'EOF'
#!/bin/bash
echo "📋 Logs do Backend:"
docker-compose logs -f backend
EOF
chmod +x logs.sh
print_success "Script logs.sh criado"

################################################################################
# 12. INSTRUÇÕES FINAIS
################################################################################

print_header "✅ Setup Concluído!"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    🎉 SETUP COMPLETO!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "📋 Resumo da Instalação:"
echo "   ✅ Homebrew"
echo "   ✅ Docker Desktop"
echo "   ✅ Node.js $(node --version)"
echo "   ✅ Python $(python3 --version | cut -d' ' -f2)"
echo "   ✅ Git $(git --version | cut -d' ' -f3)"
echo "   ✅ Backend (Docker) - Rodando"
echo "   ✅ Frontend (dependências instaladas)"
echo ""

print_info "🚀 Como usar:"
echo ""
echo "   1️⃣  Iniciar tudo automaticamente:"
echo "      ./start.sh"
echo ""
echo "   2️⃣  Iniciar apenas Frontend (Backend já está rodando):"
echo "      cd frontend && npm run dev"
echo ""
echo "   3️⃣  Parar tudo:"
echo "      ./stop.sh"
echo ""
echo "   4️⃣  Ver logs do Backend:"
echo "      ./logs.sh"
echo ""

print_info "🌐 URLs importantes:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo "   Redoc:     http://localhost:8000/redoc"
echo ""

print_info "📦 Comandos úteis:"
echo "   docker-compose ps                    # Ver containers rodando"
echo "   docker-compose logs backend          # Logs do backend"
echo "   docker-compose exec backend bash     # Entrar no container"
echo "   docker-compose down                  # Parar containers"
echo "   docker-compose up -d                 # Iniciar containers"
echo ""

print_warning "⚠️  IMPORTANTE:"
echo "   - O Backend já está rodando em Docker"
echo "   - Para iniciar o Frontend, rode: cd frontend && npm run dev"
echo "   - Ou use o script: ./start.sh"
echo ""

print_success "Tudo pronto! Bom desenvolvimento! 🚀"
echo ""
