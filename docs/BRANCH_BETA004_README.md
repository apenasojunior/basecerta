# 🚀 Branch: beta004 - Backend Smart CNPJ

**Criada em:** 24/10/2025  
**Base:** beta003 (Frontend Delivery 1 - Performance 98/100)  
**Objetivo:** Desenvolvimento do Backend completo para Smart CNPJ 360°

---

## 📋 Escopo da Branch

### Delivery 2 - Backend Smart CNPJ
Implementação completa do backend para o produto Smart CNPJ utilizando base de dados local PostgreSQL (schema cnpj com 100M+ registros).

---

## ✅ Issue 2.1.0 - CONCLUÍDA (beta003)

### Análise e Mapeamento Frontend ↔ Backend
- ✅ Estrutura do banco descoberta (schema cnpj: 10 tabelas, 64M empresas)
- ✅ Mapeamento completo de 50+ campos frontend→backend
- ✅ 7 tipos de busca documentados com SQL otimizado
- ✅ 8 filtros mapeados com índices de performance
- ✅ 14 índices novos criados (total: 43 índices)
- ✅ 6 tabelas antigas redundantes removidas
- ✅ Sistema de créditos integrado (reutilizando tabelas existentes)
- ✅ Tabela pesquisa_cnpj criada com trigger automático

**Documentos:**
- `docs/DE_PARA_FRONTEND_BACKEND.md`
- `docs/ISSUE_2.1.0_CONCLUIDA.md`
- `docs/DECISAO_REUTILIZAR_TABELAS.md`
- `docs/SPRINT_2.1_SMART_CNPJ_BACKEND.md`

**Scripts SQL:**
- `backend/scripts/00_cleanup_old_tables.sql` (executado)
- `backend/scripts/01_descobrir_estrutura.sql`
- `backend/scripts/02_create_indexes.sql` (executado)
- `backend/scripts/03_create_support_tables.sql` (executado)

---

## 🎯 Issues Pendentes (Sprint 2.1)

### Issue 2.1.1 - Criar Models SQLAlchemy
**Estimativa:** 3 horas  
**Status:** 🔜 Próxima

**Tarefas:**
- [ ] Criar `backend/app/models/cnpj.py`
  - [ ] Model Empresa (schema cnpj)
  - [ ] Model Estabelecimento (schema cnpj)
  - [ ] Model Socio (schema cnpj)
  - [ ] Model CNAE (schema cnpj)
  - [ ] Model Municipio (schema cnpj)
  - [ ] Model NaturezaJuridica (schema cnpj)
  - [ ] Relationships ORM
- [ ] Criar `backend/app/models/pesquisa.py`
  - [ ] Model PesquisaCNPJ (schema public)
- [ ] Documentar models existentes a reutilizar
  - [ ] User, UserCredit (já existem)
  - [ ] CreditTransaction, Plan (já existem)

### Issue 2.1.2 - Criar Schemas Pydantic
**Estimativa:** 2 horas  
**Status:** ⏳ Aguardando 2.1.1

**Tarefas:**
- [ ] `backend/app/schemas/cnpj.py`
  - [ ] EmpresaBase, EmpresaResponse
  - [ ] EstabelecimentoBase, EstabelecimentoResponse
  - [ ] SocioBase, SocioResponse
  - [ ] CNAEBase, CNAEResponse
  - [ ] SmartCNPJCompanyResponse (completo)
- [ ] `backend/app/schemas/pesquisa.py`
  - [ ] PesquisaCNPJCreate, PesquisaCNPJResponse
  - [ ] FiltrosAplicados (JSONB)
- [ ] Validators e formatters (CNPJ, CEP, telefone)

### Issue 2.1.3 - Criar CRUD Functions
**Estimativa:** 3 horas  
**Status:** ⏳ Aguardando 2.1.2

**Tarefas:**
- [ ] `backend/app/crud/cnpj.py`
  - [ ] buscar_por_cnpj()
  - [ ] buscar_por_razao_social()
  - [ ] buscar_por_segmento()
  - [ ] buscar_por_email()
  - [ ] buscar_por_telefone()
  - [ ] buscar_por_nome_socio()
  - [ ] buscar_por_cep()
  - [ ] aplicar_filtros()
- [ ] `backend/app/crud/pesquisa.py`
  - [ ] criar_pesquisa()
  - [ ] listar_historico()

### Issue 2.1.4 - Criar Service Layer
**Estimativa:** 4 horas  
**Status:** ⏳ Aguardando 2.1.3

**Tarefas:**
- [ ] `backend/app/services/smart_cnpj.py`
  - [ ] SmartCNPJService class
  - [ ] Lógica de transformação DB→Frontend
  - [ ] Formatação de campos (CNPJ, CEP, telefone)
  - [ ] Mapeamento de enums (porte, situação)
  - [ ] Agregação de dados (empresa + estabelecimento + sócios)
- [ ] Validação de créditos suficientes
- [ ] Cálculo de tempo de resposta

### Issue 2.1.5 - Criar Endpoints FastAPI
**Estimativa:** 3 horas  
**Status:** ⏳ Aguardando 2.1.4

**Tarefas:**
- [ ] `backend/app/api/v1/endpoints/smart_cnpj.py`
  - [ ] POST /api/v1/smart-cnpj/buscar
  - [ ] GET /api/v1/smart-cnpj/historico
  - [ ] GET /api/v1/smart-cnpj/exportar/{formato}
- [ ] Documentação OpenAPI/Swagger
- [ ] Tratamento de erros

### Issue 2.1.6 - Implementar Cache Redis
**Estimativa:** 2 horas  
**Status:** ⏳ Aguardando 2.1.5

**Tarefas:**
- [ ] Cache para busca direta por CNPJ (TTL 24h)
- [ ] Invalidação de cache
- [ ] Métricas de hit/miss

### Issue 2.1.7 - Testes Unitários
**Estimativa:** 4 horas  
**Status:** ⏳ Aguardando 2.1.6

**Tarefas:**
- [ ] Tests para models
- [ ] Tests para CRUD
- [ ] Tests para services
- [ ] Tests para endpoints
- [ ] Coverage > 80%

### Issue 2.1.8 - Testes de Performance
**Estimativa:** 3 horas  
**Status:** ⏳ Aguardando 2.1.7

**Tarefas:**
- [ ] Validar target <500ms p95
- [ ] Validar busca direta CNPJ <200ms
- [ ] EXPLAIN ANALYZE queries críticas
- [ ] Otimizações se necessário

---

## 📊 Progresso da Sprint 2.1

| Issue | Status | Estimativa | Real | Eficiência |
|-------|--------|-----------|------|------------|
| 2.1.0 | ✅ Concluída | 2h | 1.5h | 125% |
| 2.1.1 | 🔜 Próxima | 3h | - | - |
| 2.1.2 | ⏳ Pendente | 2h | - | - |
| 2.1.3 | ⏳ Pendente | 3h | - | - |
| 2.1.4 | ⏳ Pendente | 4h | - | - |
| 2.1.5 | ⏳ Pendente | 3h | - | - |
| 2.1.6 | ⏳ Pendente | 2h | - | - |
| 2.1.7 | ⏳ Pendente | 4h | - | - |
| 2.1.8 | ⏳ Pendente | 3h | - | - |
| **TOTAL** | **11%** | **24h** | **1.5h** | - |

---

## 🗄️ Estrutura do Banco de Dados

### Schema: cnpj (Dados Receita Federal)
```
empresas              - 64.888.615 registros
estabelecimentos      - 68.048.884 registros (matriz + filiais)
socios                - 26.510.557 registros
cnaes                 - 2.718 registros
naturezas_juridicas   - auxiliar
municipios            - auxiliar
paises                - auxiliar
qualificacoes_socios  - auxiliar
motivos_situacao_cadastral - auxiliar
simples               - regime tributário
```

### Schema: public (Aplicação)
```
users                 - Usuários
user_credits          - Saldo de créditos
credit_transactions   - Histórico de transações
plans                 - Planos de assinatura
credit_packages       - Pacotes de créditos
pesquisa_cnpj         - Histórico Smart CNPJ (NOVA)
alembic_version       - Migrações
```

---

## 🎯 Metas de Performance

- **Busca direta por CNPJ:** <200ms
- **Buscas com filtros:** <500ms (p95)
- **Cache hit rate:** >60%
- **API response time:** <100ms (sem DB)

---

## �� Links Importantes

- **Documento DE/PARA:** `docs/DE_PARA_FRONTEND_BACKEND.md`
- **Sprint Kanban:** `docs/SPRINT_2.1_SMART_CNPJ_BACKEND.md`
- **Decisão Arquitetural:** `docs/DECISAO_REUTILIZAR_TABELAS.md`

---

## 📝 Convenções da Branch

### Commits
```
feat(backend): descrição da feature
fix(backend): descrição do fix
docs(backend): atualização de documentação
test(backend): adição de testes
perf(backend): otimização de performance
refactor(backend): refatoração de código
```

### Pull Requests
- Base: `beta003` (frontend completo)
- Merge target: `main` (após testes completos)

---

**Branch criada em:** 24/10/2025  
**Status:** 🟢 Ativa - Desenvolvimento Backend  
**Próxima Issue:** 2.1.1 - Criar Models SQLAlchemy
