# 📊 SPRINT 02 - INTEGRAÇÃO BASE CNPJ
## Resumo Executivo para Reconexão

**Data**: 01 de Fevereiro de 2026  
**Status**: 🔴 Planejamento Concluído - Pronto para Execução

---

## 🎯 Objetivo

**Conectar a aplicação BaseCerta à base de dados CNPJ** (322M+ registros) corrigindo divergências estruturais e implementando APIs REST completas para consultas empresariais.

---

## 📋 Situação Atual

### ✅ **O que temos:**
- PostgreSQL 17.7 com 322M+ registros no schema `cnpj`
- 19 tabelas principais: empresas, estabelecimentos, sócios, simples
- ~60GB de dados atualizados da Receita Federal
- Models SQLAlchemy básicos em `backend/app/models/cnpj.py`

### ❌ **O que precisa corrigir:**
- **6 divergências críticas** entre models e banco real
- Falta camada de CRUDs otimizados
- Falta schemas Pydantic para validação
- Falta endpoints REST para consultas
- Falta testes de integração

---

## 🔍 Divergências Críticas Encontradas

### 1. 🔥 **Tabela `socios` - SEM PRIMARY KEY**
```python
# ❌ ERRADO (código atual)
class Socio(Base):
    id = Column(Integer, primary_key=True, autoincrement=True)

# ✅ CORRETO (banco real)
class Socio(Base):
    cnpj_basico = Column(String(8), primary_key=True)
    identificador_socio = Column(String(1), primary_key=True)
    # Banco usa PK COMPOSTA, não tem id!
```

### 2. 🟠 **Campo renomeado em `empresas`**
```python
# ❌ ERRADO
ente_federativo_responsavel = Column(String(100))

# ✅ CORRETO  
ente_federativo = Column(String(100))
```

### 3. 🟠 **Tamanhos varchar() incorretos**
```python
# ❌ ERRADO (vários campos)
qualificacao_responsavel = Column(String(5))  # Banco tem varchar(10)

# ✅ CORRETO
qualificacao_responsavel = Column(String(10))
```

### 4. 🟡 **ForeignKeys que não existem no banco**
```python
# ❌ ERRADO
natureza_juridica = Column(String(10), ForeignKey('cnpj.naturezas_juridicas.codigo'))

# ✅ CORRETO (banco NÃO tem FK)
natureza_juridica = Column(String(10))  # Sem ForeignKey!
# Manter relationship() para ORM, mas sem constraint
```

---

## 📦 Estrutura da Sprint

### **5 Features | 55 Story Points | ~14 dias**

```
S02: INTEGRAÇÃO BASE CNPJ
├── S02-F01: CORRIGIR MODELS SQLALCHEMY (13 pts) 🔥
│   ├── I01: Corrigir model Socio (PK composta)
│   ├── I02: Renomear campo ente_federativo
│   ├── I03: Ajustar tamanhos varchar
│   ├── I04: Remover ForeignKeys de tabelas auxiliares
│   ├── I05: Script de validação contra JSON
│   └── I06: Testar conexão e queries
│
├── S02-F02: IMPLEMENTAR CRUD REPOSITORY (13 pts) 🔥
│   ├── I01: Estrutura base CNPJRepository
│   ├── I02: Busca por CNPJ (básico/completo)
│   ├── I03: Busca por razão social
│   ├── I04: Consultas de sócios
│   ├── I05: Consulta Simples Nacional
│   └── I06: Testes unitários
│
├── S02-F03: CRIAR SCHEMAS PYDANTIC (8 pts) 🟠
│   ├── I01: Schemas base
│   ├── I02: Schemas detalhados
│   ├── I03: Computed fields
│   ├── I04: Request schemas
│   └── I05: Validações
│
├── S02-F04: IMPLEMENTAR ENDPOINTS REST (13 pts) 🟠
│   ├── I01: Router e estrutura
│   ├── I02: GET /empresa/{cnpj_basico}
│   ├── I03: GET /search/empresas
│   ├── I04: GET /estabelecimento/{cnpj}
│   ├── I05: GET /socios/empresa/{cnpj}
│   ├── I06: GET /socios/search
│   └── I07: Registrar router
│
└── S02-F05: TESTES E VALIDAÇÃO (8 pts) 🟡
    ├── I01: Testes de integração
    ├── I02: Testes de performance
    ├── I03: Validar uso de índices
    ├── I04: Edge cases
    └── I05: Documentação resultados
```

---

## 📁 Documentação Gerada

### ✅ **Documentos Criados:**

1. **[S02-INTEGRACAO-CNPJ.md](./S02-INTEGRACAO-CNPJ.md)**
   - Planejamento completo da sprint
   - 5 features detalhadas
   - Cronograma e métricas

2. **[S02/features/S02-F01.md](./S02/features/S02-F01.md)**
   - Detalhamento completo da Feature 01
   - 6 issues com tarefas específicas
   - Exemplos de código antes/depois

3. **[../../db/deepdive_cnpj_20260201_222015.md](../../db/deepdive_cnpj_20260201_222015.md)**
   - Análise técnica completa do banco
   - 606 linhas de documentação
   - Estrutura de todas as 19 tabelas

4. **[../../db/deepdive_cnpj_20260201_222015.json](../../db/deepdive_cnpj_20260201_222015.json)**
   - Dados estruturados para validação
   - Metadados de todas as colunas

---

## 🎯 Cronograma Sugerido

### **Semana 1 (Dias 1-7):**
- **Dia 1-2**: S02-F01 - Corrigir Models (issues I01-I03)
- **Dia 3**: S02-F01 - Finalizar correções (issues I04-I06)
- **Dia 4-5**: S02-F02 - CRUD Repository (issues I01-I04)
- **Dia 6-7**: S02-F02 - Finalizar CRUDs (issues I05-I06)

### **Semana 2 (Dias 8-14):**
- **Dia 8-9**: S02-F03 - Schemas Pydantic (todos issues)
- **Dia 10-11**: S02-F04 - Endpoints REST (issues I01-I04)
- **Dia 12**: S02-F04 - Finalizar endpoints (issues I05-I07)
- **Dia 13-14**: S02-F05 - Testes e Validação (todos issues)

---

## 🚀 Como Começar

### **Passo 1: Configurar Ambiente**
```bash
cd /Users/code4us/Documents/ADACODE/basecerta
source .venv/bin/activate  # ou criar novo venv

# Instalar dependências
pip install -r backend/requirements.txt

# Testar conexão com banco
psql -h localhost -p 5432 -U aian_db -d basecerta -c "\dt cnpj.*"
```

### **Passo 2: Iniciar Feature S02-F01**
```bash
# Criar branch
git checkout -b feature/S02-F01-corrigir-models

# Abrir arquivo principal
code backend/app/models/cnpj.py

# Seguir: docs/estrutura/sprints/S02/features/S02-F01.md
```

### **Passo 3: Validar cada Issue**
- Completar issue
- Executar testes
- Commit com padrão: `S02-F01-I01: Descrição`
- Passar para próxima issue

---

## 📊 Métricas de Sucesso

| Métrica | Meta | Ferramenta |
|---------|------|------------|
| **Coverage** | > 80% | `pytest --cov` |
| **Performance** | < 500ms/query | `EXPLAIN ANALYZE` |
| **Endpoints** | 100% funcionais | Testes integração |
| **Docs** | Swagger completo | FastAPI auto-docs |

---

## 🔗 Arquivos Principais

### **Para Editar:**
```
backend/app/models/cnpj.py              # Feature F01
backend/app/crud/cnpj.py                # Feature F02 (criar)
backend/app/schemas/cnpj.py             # Feature F03 (criar)
backend/app/api/v1/cnpj.py              # Feature F04 (criar)
backend/tests/test_cnpj_models.py       # Feature F05 (criar)
```

### **Para Consultar:**
```
docs/estrutura/db/deepdive_cnpj_*.json  # Estrutura do banco
docs/estrutura/db/deepdive_cnpj_*.md    # Documentação técnica
docs/estrutura/sprints/S02/*.md         # Planejamento sprint
```

---

## ⚠️ Pontos de Atenção

### **1. Não Criar Migrations**
- Banco já existe com dados
- Models devem REFLETIR o banco, não criar estrutura
- Usar `extend_existing=True` em todos os models

### **2. Tabelas Auxiliares sem PK**
- Banco real não tem PKs em tabelas de domínio
- Models precisam de PK para ORM funcionar
- Manter `primary_key=True` nos models mesmo sem PK no banco

### **3. Performance**
- Banco tem 322M+ registros
- SEMPRE usar `limit()` em queries de pesquisa
- Usar índices existentes (conferir no deep dive)

### **4. ForeignKeys**
- Remover constraints de FK
- Manter relationships para conveniência
- Usar LEFT JOIN ao invés de INNER JOIN

---

## 📞 Próximos Passos Imediatos

### **Hoje (01/02/2026):**
1. ✅ Review completo desta documentação
2. ✅ Confirmar acesso ao banco PostgreSQL
3. ✅ Configurar ambiente de desenvolvimento
4. 🔴 **Iniciar S02-F01-I01** (Corrigir model Socio)

### **Esta Semana:**
- Completar Feature F01 (Models)
- Completar Feature F02 (CRUDs)
- Iniciar Feature F03 (Schemas)

### **Próxima Sprint (S03):**
- Cache Redis para queries frequentes
- Busca avançada com filtros compostos
- Dashboard analytics
- Exportação de dados

---

## ✅ Checklist Inicial

- [ ] Documentação da sprint lida e compreendida
- [ ] Ambiente de desenvolvimento configurado
- [ ] Acesso ao PostgreSQL validado
- [ ] Deep dive JSON disponível localmente
- [ ] Branch `feature/S02-F01` criada
- [ ] Pronto para começar primeira issue

---

**🎯 Sprint S02 - Transformando 322 milhões de registros em APIs de alto desempenho!**

---

## 📚 Links Rápidos

- [Sprint Completa](./S02-INTEGRACAO-CNPJ.md)
- [Feature F01 Detalhada](./S02/features/S02-F01.md)
- [Deep Dive Banco](../../db/deepdive_cnpj_20260201_222015.md)
- [Estrutura de Sprints](./ESTRUTURA.md)

---

**Documento criado**: 01/02/2026 22:30  
**Localização**: `docs/estrutura/sprints/S02-RESUMO-EXECUTIVO.md`  
**Status**: ✅ Pronto para execução
