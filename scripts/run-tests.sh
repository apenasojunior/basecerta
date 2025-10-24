#!/bin/bash

# Script Helper para Execução de Testes - Smart CNPJ Backend
# Issue: 2.1.8 - Testes e Documentação
# Uso: ./run-tests.sh [opção]

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   Smart CNPJ - Test Runner    ${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Função para executar comando
run_test() {
    echo -e "${YELLOW}▶ $1${NC}"
    echo ""
    docker exec basecerta_backend $2
    echo ""
}

# Menu de opções
case "$1" in
    "all")
        echo -e "${GREEN}Executando TODOS os testes...${NC}"
        echo ""
        run_test "Testes Completos" "pytest tests/ -v"
        ;;
    
    "unit")
        echo -e "${GREEN}Executando Testes Unitários...${NC}"
        echo ""
        run_test "Testes Unitários" "pytest tests/unit/test_smart_cnpj_service_simple.py -v"
        ;;
    
    "integration")
        echo -e "${GREEN}Executando Testes de Integração...${NC}"
        echo ""
        run_test "Testes de Integração" "pytest tests/integration/test_smart_cnpj_endpoints.py -v"
        ;;
    
    "models")
        echo -e "${GREEN}Executando Testes de Models...${NC}"
        echo ""
        run_test "Testes de Models" "pytest tests/test_models.py -v"
        ;;
    
    "quick")
        echo -e "${GREEN}Executando Testes Rápidos (sem models)...${NC}"
        echo ""
        run_test "Testes Rápidos" "pytest tests/unit/ tests/integration/ -v"
        ;;
    
    "coverage")
        echo -e "${GREEN}Gerando Relatório de Cobertura...${NC}"
        echo ""
        run_test "Cobertura de Código" "pytest tests/ --cov=app --cov-report=term-missing"
        ;;
    
    "summary")
        echo -e "${GREEN}Resumo de Testes...${NC}"
        echo ""
        docker exec basecerta_backend bash -c "
        echo '╔════════════════════════════════╗'
        echo '║     RESUMO DE TESTES           ║'
        echo '╚════════════════════════════════╝'
        echo ''
        echo '📦 Models:'
        pytest tests/test_models.py --tb=no -q 2>&1 | tail -1
        echo ''
        echo '🔧 Unitários:'
        pytest tests/unit/test_smart_cnpj_service_simple.py --tb=no -q 2>&1 | tail -1
        echo ''
        echo '🌐 Integração:'
        pytest tests/integration/test_smart_cnpj_endpoints.py --tb=no -q 2>&1 | tail -1
        echo ''
        echo '═══════════════════════════════════'
        "
        ;;
    
    "install")
        echo -e "${GREEN}Instalando dependências de teste...${NC}"
        echo ""
        docker exec basecerta_backend pip install pytest pytest-cov httpx
        echo ""
        echo -e "${GREEN}✅ Dependências instaladas!${NC}"
        ;;
    
    "check")
        echo -e "${GREEN}Verificando ambiente de testes...${NC}"
        echo ""
        
        echo -e "${BLUE}1. Verificando containers...${NC}"
        docker ps --filter "name=basecerta_backend" --format "{{.Names}}: {{.Status}}"
        echo ""
        
        echo -e "${BLUE}2. Verificando pytest...${NC}"
        docker exec basecerta_backend pytest --version 2>&1 || echo -e "${RED}❌ pytest não instalado${NC}"
        echo ""
        
        echo -e "${BLUE}3. Verificando banco de dados...${NC}"
        docker exec basecerta_backend python3 -c "
from app.core.database import SessionLocal
from app.models.cnpj import Estabelecimento
db = SessionLocal()
count = db.query(Estabelecimento).count()
print(f'✅ Estabelecimentos no banco: {count}')
" 2>&1 || echo -e "${RED}❌ Erro ao conectar no banco${NC}"
        echo ""
        ;;
    
    "watch")
        echo -e "${GREEN}Modo Watch - Executando testes ao detectar mudanças...${NC}"
        echo -e "${YELLOW}(Pressione Ctrl+C para sair)${NC}"
        echo ""
        docker exec basecerta_backend pytest-watch tests/ -v
        ;;
    
    "help"|"")
        echo -e "${BLUE}Uso: ./run-tests.sh [opção]${NC}"
        echo ""
        echo "Opções disponíveis:"
        echo ""
        echo -e "  ${GREEN}all${NC}          - Executar TODOS os testes (35 testes)"
        echo -e "  ${GREEN}unit${NC}         - Executar apenas testes unitários (15 testes)"
        echo -e "  ${GREEN}integration${NC}  - Executar apenas testes de integração (15 testes)"
        echo -e "  ${GREEN}models${NC}       - Executar apenas testes de models (5 testes)"
        echo -e "  ${GREEN}quick${NC}        - Executar testes rápidos sem models (30 testes)"
        echo -e "  ${GREEN}coverage${NC}     - Gerar relatório de cobertura"
        echo -e "  ${GREEN}summary${NC}      - Mostrar resumo dos testes"
        echo -e "  ${GREEN}install${NC}      - Instalar dependências (pytest, etc)"
        echo -e "  ${GREEN}check${NC}        - Verificar ambiente de testes"
        echo -e "  ${GREEN}help${NC}         - Mostrar esta mensagem"
        echo ""
        echo "Exemplos:"
        echo "  ./run-tests.sh all        # Executar todos os testes"
        echo "  ./run-tests.sh unit       # Apenas testes unitários"
        echo "  ./run-tests.sh coverage   # Ver cobertura de código"
        echo ""
        ;;
    
    *)
        echo -e "${RED}❌ Opção inválida: $1${NC}"
        echo ""
        echo "Use './run-tests.sh help' para ver opções disponíveis"
        exit 1
        ;;
esac

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ Concluído!${NC}"
echo -e "${BLUE}================================${NC}"
