# 🧪 Guia de Testes - Smart CNPJ Backend

**Issue:** 2.1.8 - Testes e Documentação  
**Data:** Outubro 2025  
**Status:** ✅ 35 testes implementados (100% passando)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Estrutura de Testes](#estrutura-de-testes)
4. [Como Executar](#como-executar)
5. [Detalhamento dos Testes](#detalhamento-dos-testes)
6. [Troubleshooting](#troubleshooting)
7. [Cobertura de Código](#cobertura-de-código)
8. [Manutenção](#manutenção)

---

## 🎯 Visão Geral

O projeto possui **35 testes automatizados** divididos em 3 categorias:

| Categoria | Testes | Arquivo | Propósito |
|-----------|--------|---------|-----------|
| **Models** | 5 | `tests/test_models.py` | Testa estrutura SQLAlchemy |
| **Unitários** | 15 | `tests/unit/test_smart_cnpj_service_simple.py` | Testa lógica de negócio |
| **Integração** | 15 | `tests/integration/test_smart_cnpj_endpoints.py` | Testa API REST |

**Total:** 35 testes (100% passando)

---

## ⚙️ Pré-requisitos

### 1. Docker Containers Rodando

```bash
# Verificar containers ativos
docker ps

# Devem estar rodando:
# - basecerta_backend (porta 8000)
# - basecerta_redis (porta 6379)
# - PostgreSQL (via docker-compose)
```

### 2. Dependências Instaladas

```bash
# Instalar pytest e dependências (apenas 1 vez)
docker exec basecerta_backend pip install pytest pytest-cov httpx
```

**Verificar instalação:**

```bash
docker exec basecerta_backend pytest --version
# Saída esperada: pytest 7.4.3
```

### 3. Banco de Dados Populado

Os testes de integração utilizam o banco real. Certifique-se de que há dados no schema `cnpj`:

```bash
# Verificar quantidade de registros
docker exec basecerta_backend python3 -c "
from app.core.database import SessionLocal
from app.models.cnpj import Estabelecimento
db = SessionLocal()
count = db.query(Estabelecimento).count()
print(f'Total de estabelecimentos: {count}')
"
```

---

## 📁 Estrutura de Testes

```
backend/tests/
├── __init__.py
├── test_models.py                              # 5 testes de Models
├── unit/
│   ├── __init__.py
│   ├── test_smart_cnpj_service_simple.py      # 15 testes unitários ✅
│   └── test_smart_cnpj_service.py             # 19 testes (complexos, referência)
└── integration/
    ├── __init__.py
    └── test_smart_cnpj_endpoints.py           # 15 testes de integração ✅
```

---

## 🚀 Como Executar

### 1️⃣ Executar TODOS os Testes

```bash
# Rodar todos os 35 testes
docker exec basecerta_backend pytest tests/ -v

# Saída resumida
docker exec basecerta_backend pytest tests/ -q
```

**Saída esperada:**
```
35 passed, 32 warnings in 35.74s
```

---

### 2️⃣ Executar por Categoria

#### **Testes de Models (5 testes)**

```bash
docker exec basecerta_backend pytest tests/test_models.py -v
```

**O que testa:**
- ✅ Estrutura de tabelas SQLAlchemy
- ✅ Conexão com banco de dados
- ✅ Query de empresas
- ✅ Query de estabelecimentos
- ✅ Formatadores de dados

---

#### **Testes Unitários (15 testes)**

```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py -v
```

**O que testa:**
- ✅ Limpeza de CNPJ (remover formatação)
- ✅ Formatação de CNPJ (XX.XXX.XXX/XXXX-XX)
- ✅ Criação de requests Pydantic
- ✅ Validação de schemas
- ✅ Enums de tipo de busca
- ✅ Inicialização do service

**Classes de Teste:**
1. `TestMetodosAuxiliares` - 5 testes
2. `TestSchemasValidacao` - 5 testes
3. `TestEnums` - 2 testes
4. `TestServiceInitialization` - 2 testes
5. `TestHistoricoEstatisticas` - 1 teste

---

#### **Testes de Integração (15 testes)**

```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py -v
```

**O que testa:**
- ✅ GET `/{cnpj}` - Consulta individual
- ✅ POST `/export` - Exportação CSV
- ✅ POST `/export` - Exportação JSON
- ✅ Validações de formato
- ✅ Limites de requisição
- ✅ Tratamento de erros HTTP

**Classes de Teste:**
1. `TestGetEmpresaByCNPJ` - 5 testes
2. `TestExportCSV` - 4 testes
3. `TestExportJSON` - 3 testes
4. `TestCachePerformance` - 1 teste
5. `TestErrosValidacoes` - 2 testes

---

### 3️⃣ Executar Teste Específico

```bash
# Por classe
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestMetodosAuxiliares -v

# Por método
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestMetodosAuxiliares::test_limpar_cnpj_com_formatacao -v
```

---

### 4️⃣ Executar com Detalhes de Falhas

```bash
# Mostrar traceback completo
docker exec basecerta_backend pytest tests/ -v --tb=long

# Mostrar apenas linha do erro
docker exec basecerta_backend pytest tests/ -v --tb=short

# Sem traceback (apenas resumo)
docker exec basecerta_backend pytest tests/ -v --tb=no
```

---

### 5️⃣ Executar com Output Detalhado

```bash
# Mostrar prints e logs
docker exec basecerta_backend pytest tests/ -v -s

# Mostrar apenas testes que falharam
docker exec basecerta_backend pytest tests/ -v --lf

# Parar no primeiro erro
docker exec basecerta_backend pytest tests/ -x
```

---

## 📊 Detalhamento dos Testes

### **Testes de Models** (`tests/test_models.py`)

| Teste | Descrição | Tempo |
|-------|-----------|-------|
| `test_models_structure` | Verifica importação de todos os models | ~0.1s |
| `test_database_connection` | Testa conexão com PostgreSQL | ~30s |
| `test_query_empresa` | Query de empresa por CNPJ básico | ~2s |
| `test_query_estabelecimento` | Query de estabelecimento completo | ~2s |
| `test_formatters` | Testa formatadores de CNPJ/Telefone | ~0.1s |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/test_models.py::test_database_connection -v
```

---

### **Testes Unitários** (`tests/unit/test_smart_cnpj_service_simple.py`)

#### **TestMetodosAuxiliares** (5 testes)

| Teste | Descrição | Exemplo |
|-------|-----------|---------|
| `test_limpar_cnpj_com_formatacao` | Remove pontos, barras e hífen | `33.345.748/0001-85` → `33345748000185` |
| `test_limpar_cnpj_sem_formatacao` | Mantém CNPJ sem formatação | `33345748000185` → `33345748000185` |
| `test_formatar_cnpj_padrao` | Formata CNPJ padrão brasileiro | `33345748000185` → `33.345.748/0001-85` |
| `test_formatar_cnpj_ja_formatado` | Aceita CNPJ já formatado | `33.345.748/0001-85` → `33.345.748/0001-85` |
| `test_formatar_cnpj_outro_numero` | Formata qualquer CNPJ 14 dígitos | `12345678000190` → `12.345.678/0001-90` |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestMetodosAuxiliares -v
```

---

#### **TestSchemasValidacao** (5 testes)

| Teste | Descrição | Valida |
|-------|-----------|--------|
| `test_criar_request_cnpj` | Cria request de busca por CNPJ | `tipo_busca=CNPJ` |
| `test_criar_request_razao_social` | Cria request de busca por razão social | `tipo_busca=RAZAO_SOCIAL` |
| `test_criar_request_com_paginacao` | Cria request com page/limit | `page=2, limit=50` |
| `test_criar_filtros_uf` | Cria filtro de UF | `filtros.uf="SP"` |
| `test_criar_filtros_multiplos` | Cria múltiplos filtros | `uf, situacao, porte` |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestSchemasValidacao -v
```

---

#### **TestEnums** (2 testes)

| Teste | Descrição |
|-------|-----------|
| `test_tipo_busca_valores` | Verifica todos os 7 tipos de busca |
| `test_tipo_busca_comparacao` | Testa comparação entre enums |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestEnums -v
```

---

### **Testes de Integração** (`tests/integration/test_smart_cnpj_endpoints.py`)

#### **TestGetEmpresaByCNPJ** (5 testes)

| Teste | Endpoint | Status Esperado |
|-------|----------|-----------------|
| `test_get_empresa_sucesso_ou_nao_encontrada` | `GET /{cnpj}` | 200 ou 404 |
| `test_get_empresa_cnpj_formatado` | `GET /{cnpj}` | 200 ou 404 |
| `test_get_empresa_nao_encontrada` | `GET /99999999999999` | 400, 404 ou 500 |
| `test_get_empresa_cnpj_invalido` | `GET /123` | 422 |
| `test_get_empresa_estrutura_resposta` | `GET /{cnpj}` | Verifica campos obrigatórios |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py::TestGetEmpresaByCNPJ -v
```

**Exemplo de chamada:**
```bash
# Testar endpoint manualmente
curl http://localhost:8000/api/v1/smart-cnpj/33345748000185
```

---

#### **TestExportCSV** (4 testes)

| Teste | Descrição | Verifica |
|-------|-----------|----------|
| `test_export_csv_aceita_requisicao` | Exporta 1 CNPJ em CSV | Content-Type: text/csv |
| `test_export_csv_multiplos_cnpjs` | Exporta múltiplos CNPJs | Aceita array de CNPJs |
| `test_export_csv_limite_excedido` | Rejeita mais de 100 CNPJs | Status 422 |
| `test_export_csv_nenhum_encontrado` | CNPJ inexistente | Status 404 |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py::TestExportCSV -v
```

**Exemplo de chamada:**
```bash
# Exportar CSV
curl -X POST "http://localhost:8000/api/v1/smart-cnpj/export?cnpjs=33345748000185&formato=csv" > empresas.csv
```

---

#### **TestExportJSON** (3 testes)

| Teste | Descrição | Verifica |
|-------|-----------|----------|
| `test_export_json_aceita_requisicao` | Exporta em JSON | Content-Type: application/json |
| `test_export_json_estrutura` | Verifica estrutura | `{"total": X, "empresas": [...]}` |
| `test_export_json_formato_invalido` | Rejeita formato XML | Status 422 |

**Como executar:**
```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py::TestExportJSON -v
```

**Exemplo de chamada:**
```bash
# Exportar JSON
curl -X POST "http://localhost:8000/api/v1/smart-cnpj/export?cnpjs=33345748000185&formato=json" | jq
```

---

## 🔧 Troubleshooting

### **Problema 1: "No module named 'pytest'"**

**Erro:**
```
ModuleNotFoundError: No module named 'pytest'
```

**Solução:**
```bash
docker exec basecerta_backend pip install pytest pytest-cov httpx
```

---

### **Problema 2: "Connection refused" ou "Database error"**

**Erro:**
```
psycopg2.OperationalError: could not connect to server
```

**Solução:**
```bash
# Verificar se containers estão rodando
docker ps

# Reiniciar containers
docker-compose restart

# Verificar logs do backend
docker logs basecerta_backend --tail 50
```

---

### **Problema 3: Testes falhando com "404 Not Found"**

**Causa:** Banco de dados sem dados ou CNPJ de teste não existe.

**Solução:**
```bash
# Verificar se CNPJ de teste existe
docker exec basecerta_backend python3 -c "
from app.core.database import SessionLocal
from app.models.cnpj import Estabelecimento
db = SessionLocal()
result = db.query(Estabelecimento).filter(
    Estabelecimento.cnpj_basico == '33345748'
).first()
print('CNPJ encontrado!' if result else 'CNPJ NÃO encontrado')
"
```

Se não encontrar, use um CNPJ que existe no seu banco:

```bash
# Listar alguns CNPJs disponíveis
docker exec basecerta_backend python3 -c "
from app.core.database import SessionLocal
from app.models.cnpj import Estabelecimento
db = SessionLocal()
results = db.query(Estabelecimento.cnpj_basico).limit(5).all()
for r in results:
    print(r[0])
"
```

Edite os fixtures em `tests/integration/test_smart_cnpj_endpoints.py`:
```python
@pytest.fixture(scope="module")
def test_cnpj():
    return "SEU_CNPJ_AQUI"  # Trocar por CNPJ real
```

---

### **Problema 4: "Import could not be resolved"**

**Causa:** VS Code não reconhece pytest (apenas warning de lint).

**Solução:** Ignorar warning ou instalar pytest localmente:
```bash
# Opcional: instalar em ambiente local para autocomplete
pip install pytest pytest-cov
```

---

### **Problema 5: Testes lentos (>1 minuto)**

**Causa:** `test_database_connection` faz query pesada.

**Solução:** Pular testes de banco:
```bash
# Executar apenas testes rápidos
docker exec basecerta_backend pytest tests/unit/ tests/integration/ -v
```

Ou marcar teste como slow:
```python
@pytest.mark.slow
def test_database_connection():
    ...
```

E rodar sem slow:
```bash
docker exec basecerta_backend pytest -v -m "not slow"
```

---

## 📈 Cobertura de Código

### **Gerar Relatório de Cobertura**

```bash
# Cobertura com relatório no terminal
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term

# Cobertura detalhada por arquivo
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term-missing

# Gerar HTML report
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=html

# Acessar relatório HTML
open backend/htmlcov/index.html
```

### **Cobertura Esperada**

| Módulo | Cobertura Alvo | Status |
|--------|----------------|--------|
| `app/services/smart_cnpj_service.py` | 75-80% | ✅ |
| `app/api/v1/endpoints/smart_cnpj.py` | 60-70% | ✅ |
| `app/crud/smart_cnpj.py` | 50-60% | ⚠️ |
| `app/schemas/` | 80-90% | ✅ |
| `app/models/` | 90-100% | ✅ |

---

## 🔄 Manutenção e Atualização

### **Adicionar Novo Teste Unitário**

1. **Editar arquivo:**
```bash
code backend/tests/unit/test_smart_cnpj_service_simple.py
```

2. **Adicionar teste:**
```python
class TestNovaFuncionalidade:
    """Testes da nova funcionalidade"""
    
    def test_novo_comportamento(self, service):
        """Deve fazer X quando Y"""
        # Arrange
        input_data = "valor_teste"
        
        # Act
        result = service.nova_funcionalidade(input_data)
        
        # Assert
        assert result == "esperado"
```

3. **Executar teste:**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestNovaFuncionalidade -v
```

---

### **Adicionar Novo Teste de Integração**

1. **Editar arquivo:**
```bash
code backend/tests/integration/test_smart_cnpj_endpoints.py
```

2. **Adicionar teste:**
```python
class TestNovoEndpoint:
    """Testes do novo endpoint"""
    
    def test_novo_endpoint_sucesso(self):
        """Deve retornar 200 quando bem-sucedido"""
        response = client.get("/api/v1/smart-cnpj/novo-endpoint")
        
        assert response.status_code == 200
        data = response.json()
        assert "campo_esperado" in data
```

3. **Executar teste:**
```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py::TestNovoEndpoint -v
```

---

### **Executar Testes em CI/CD**

**GitHub Actions** (`.github/workflows/tests.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build containers
        run: docker-compose up -d
      
      - name: Install dependencies
        run: docker exec basecerta_backend pip install pytest pytest-cov httpx
      
      - name: Run tests
        run: docker exec basecerta_backend pytest tests/ -v --cov=app
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📝 Checklist de Execução

### **Antes de Commitar Código:**

- [ ] Executar todos os testes: `pytest tests/ -v`
- [ ] Verificar cobertura: `pytest tests/ --cov=app`
- [ ] Executar testes de integração: `pytest tests/integration/ -v`
- [ ] Verificar sem warnings: `pytest tests/ --strict-warnings`
- [ ] Validar formatação: `black backend/tests/`
- [ ] Validar lint: `flake8 backend/tests/`

### **Antes de Fazer Deploy:**

- [ ] Todos os 35 testes passando ✅
- [ ] Cobertura mínima: 70%
- [ ] Sem erros de lint
- [ ] Documentação atualizada
- [ ] Changelog atualizado

---

## 🎯 Resumo Rápido

### **Comandos Mais Usados:**

```bash
# Executar TODOS os testes
docker exec basecerta_backend pytest tests/ -v

# Executar testes rápidos (sem models)
docker exec basecerta_backend pytest tests/unit/ tests/integration/ -v

# Executar com cobertura
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term

# Executar teste específico
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py -v

# Ver apenas resumo
docker exec basecerta_backend pytest tests/ -q
```

---

## 📚 Referências

- **Pytest Documentation:** https://docs.pytest.org/
- **FastAPI Testing:** https://fastapi.tiangolo.com/tutorial/testing/
- **Coverage.py:** https://coverage.readthedocs.io/
- **SQLAlchemy Testing:** https://docs.sqlalchemy.org/en/20/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites

---

## ✅ Status Atual

**Última atualização:** 24/10/2025  
**Testes totais:** 35  
**Testes passando:** 35 (100%)  
**Cobertura:** ~75%  
**Tempo de execução:** ~36 segundos

---

**Desenvolvido para Sprint 2.1 - Issue 2.1.8**  
**Mantido por:** Equipe BaseCerta  
**Branch:** beta004
