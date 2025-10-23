# 🚀 SPRINT 5 - Integração Predictus - Dossiês PJ

**Branch:** beta002  
**Release Target:** v0.5.0  
**Duração Estimada:** 2 semanas  
**Status:** 🟢 Pronto para Iniciar  
**Data de Início:** 20/10/2025

---

## 🎯 Objetivos do Sprint

Integrar API Predictus para Dossiê Pessoa Jurídica (CNPJ), implementar sistema de relacionamento Sócios ↔ Empresas, cache Redis para PJ, e criar visualização completa de dados empresariais com todos os componentes frontend.

⚠️ **IMPORTANTE:** Sistema continua **ABERTO** (sem autenticação). Usar mock `user_id=1` para desenvolvimento. **Autenticação será implementada apenas na Sprint 11 (penúltima).**

---

## 📊 Progresso Geral

| Status | Issues | % |
|--------|--------|---|
| ✅ Concluído | 0 | 0% |
| 🔄 Em Andamento | 0 | 0% |
| ⏳ Pendente | 10 | 100% |
| **TOTAL** | **10** | **0%** |

---

## 📋 BACKLOG - Issues Planejadas

### 🔴 FASE 1: Backend - Models e Integração (~1 semana)

---

#### ⏳ Issue 5.1 - Model Pessoa Jurídica Completo

**Prioridade:** 🔴 Alta  
**Estimativa:** ~3h  
**Responsável:** TBD  
**Status:** ⏳ Pendente

**Objetivo:** Criar modelo completo de Pessoa Jurídica no backend espelhando a estrutura do exemplo Predictus.

**Dependências:**
- SQLAlchemy configurado
- PostgreSQL rodando
- Alembic para migrations

**Tarefas Técnicas:**
- [ ] Criar `backend/app/models/pessoa_juridica.py`
- [ ] Model principal `PessoaJuridica`:
  - CNPJ (unique, indexed)
  - Razão Social
  - Nome Fantasia
  - Situação Cadastral
  - Data de Abertura
  - Porte da Empresa
  - Natureza Jurídica
  - Capital Social
  - Data da Situação Cadastral
  - Motivo da Situação Cadastral
- [ ] Model `CNAEPJ`:
  - cnae_fiscal_principal
  - cnae_fiscal_secundarias (JSONB ou relação)
- [ ] Model `EnderecoEmpresa`:
  - tipo_logradouro, logradouro, numero
  - complemento, bairro
  - CEP, UF, município
  - telefones (JSONB)
  - email
- [ ] Model `SocioEmpresa`:
  - nome_socio
  - cpf_cnpj_socio
  - qualificacao_socio
  - data_entrada_sociedade
  - percentual_capital_social
  - cpf_representante_legal (opcional)
- [ ] Model `HistoricoSocios`:
  - socios_atuais (relação)
  - socios_historicos (relação ou JSONB)
- [ ] Model `RedesSociaisEmpresa`:
  - facebook, instagram, linkedin, twitter
  - website, youtube
- [ ] Model `HistoricoDividasEmpresa`:
  - protestos (JSONB)
  - acoes_judiciais (JSONB)
  - recuperacao_judicial (boolean)
- [ ] Relationships configurados (ForeignKeys)
- [ ] Indexes para performance (CNPJ, Razão Social)
- [ ] Timestamps: created_at, updated_at

**Estrutura de Exemplo:**
```python
class PessoaJuridica(Base):
    __tablename__ = "pessoa_juridica"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    cnpj = Column(String(18), unique=True, index=True, nullable=False)
    razao_social = Column(String(255), index=True)
    nome_fantasia = Column(String(255))
    situacao_cadastral = Column(String(50))
    data_abertura = Column(Date)
    porte_empresa = Column(String(50))
    capital_social = Column(Numeric(15, 2))
    
    # Relationships
    enderecos = relationship("EnderecoEmpresa", back_populates="empresa")
    socios = relationship("SocioEmpresa", back_populates="empresa")
    cnaes = relationship("CNAEPJ", back_populates="empresa")
    redes_sociais = relationship("RedesSociaisEmpresa", uselist=False)
    historico_dividas = relationship("HistoricoDividasEmpresa", uselist=False)
```

**Migration:**
- [ ] Criar migration com Alembic: `alembic revision -m "add_pessoa_juridica_models"`
- [ ] Aplicar migration: `alembic upgrade head`

**Critérios de Aceitação:**
- [ ] Todos os models criados e testados
- [ ] Migration aplicada com sucesso
- [ ] Relationships funcionando (queries de JOIN)
- [ ] Indexes criados para performance
- [ ] Dados de exemplo inseridos manualmente

---

#### ⏳ Issue 5.2 - Integração Predictus API - Endpoint PJ

**Prioridade:** 🔴 Alta  
**Estimativa:** ~4h  
**Responsável:** TBD  
**Status:** ⏳ Pendente

**Objetivo:** Criar serviço de integração com Predictus API para consultar Dossiê de Pessoa Jurídica.

**Dependências:**
- Issue 5.1 (Models criados)
- Credenciais Predictus API
- Redis configurado

**Tarefas Técnicas:**
- [ ] Criar `backend/app/services/predictus_service.py`
- [ ] Classe `PredictusAPIClient`:
  - `__init__()` com API key
  - `get_dossie_pj(cnpj: str)` → JSON
  - Tratamento de erros HTTP (401, 404, 500, timeout)
  - Retry logic (3 tentativas com backoff)
  - Timeout configurável (30s)
- [ ] Parser: `parse_predictus_pj_response(json_data) -> PessoaJuridica`
  - Mapear campos do JSON para models
  - Validação de CNPJ
  - Tratamento de campos opcionais/nulos
  - Conversão de datas (ISO string → Date)
  - Conversão de valores monetários
- [ ] Sistema de cache Redis:
  - Key pattern: `predictus:pj:{cnpj}`
  - TTL: 7 dias (dados empresariais mudam lentamente)
  - Cache hit → retornar do Redis
  - Cache miss → consultar Predictus → salvar Redis + DB
- [ ] Salvar no banco após consulta:
  - Verificar se já existe (CNPJ)
  - Se existe → atualizar (com timestamp)
  - Se não → criar novo
  - Salvar relacionamentos (socios, endereços, etc.)
- [ ] Variáveis de ambiente:
  - `PREDICTUS_API_URL`
  - `PREDICTUS_API_KEY`
  - `PREDICTUS_TIMEOUT=30`

**Critérios de Aceitação:**
- [ ] Consulta Predictus funcionando
- [ ] Cache Redis implementado
- [ ] Parser convertendo JSON → Models
- [ ] Dados salvos no PostgreSQL
- [ ] Tratamento de erros robusto
- [ ] Retry logic funcionando

---

#### ⏳ Issue 5.3 - Endpoints FastAPI para Dossiê PJ

**Prioridade:** 🔴 Alta  
**Estimativa:** ~2h  
**Responsável:** TBD  
**Status:** ⏳ Pendente

**Objetivo:** Criar endpoints REST para solicitar e consultar dossiês de Pessoa Jurídica.

**Dependências:**
- Issue 5.2 (Integração Predictus)
- FastAPI configurado

**Tarefas Técnicas:**
- [ ] Criar `backend/app/api/routes/research_pj.py`
- [ ] Endpoint: `POST /api/research/pj`
  - Body: `{ "cnpj": "12.345.678/0001-90" }`
  - Validação de CNPJ (Pydantic schema)
  - Mock user_id=1 (sem autenticação ainda)
  - Verificar saldo de créditos (deduzir X créditos)
  - Chamar `PredictusAPIClient.get_dossie_pj()`
  - Salvar no histórico de pesquisas
  - Response: `{ "id": "uuid", "status": "completed", "data": {...} }`
- [ ] Endpoint: `GET /api/research/pj/{id}`
  - Buscar resultado por ID (UUID)
  - Response: Dados completos do dossiê
- [ ] Pydantic Schemas:
  - `PessoaJuridicaRequest` (CNPJ validado)
  - `PessoaJuridicaResponse` (dados completos)
  - `SocioResponse`, `EnderecoResponse`, etc.
- [ ] Documentação Swagger

**Critérios de Aceitação:**
- [ ] Endpoint POST funcionando
- [ ] Endpoint GET funcionando
- [ ] Validação de CNPJ correta
- [ ] Dedução de créditos funcionando
- [ ] Histórico salvo
- [ ] Swagger documentado

---

#### ⏳ Issue 5.4 - Sistema de Relacionamento Sócios ↔ Empresas

**Prioridade:** 🟡 Média  
**Estimativa:** ~2h  
**Responsável:** TBD  
**Status:** ⏳ Pendente

**Objetivo:** Criar lógica de vinculação entre sócios e empresas.

**Tarefas Técnicas:**
- [ ] Criar `backend/app/crud/socios.py`
- [ ] Função: `get_empresas_by_socio(cpf_cnpj_socio: str)`
- [ ] Função: `get_socios_by_empresa(cnpj: str)`
- [ ] Função: `get_relacao_societaria_graph(cnpj: str, depth: int = 2)`
- [ ] Endpoints:
  - `GET /api/socios/empresas/{cpf_cnpj}`
  - `GET /api/empresas/{cnpj}/socios`
  - `GET /api/empresas/{cnpj}/grafo`

**Critérios de Aceitação:**
- [ ] Busca de empresas por sócio funcionando
- [ ] Busca de sócios por empresa funcionando
- [ ] Grafo de relacionamentos implementado

---

### 🟡 FASE 2: Frontend - Páginas e Componentes (~1 semana)

---

#### ⏳ Issue 5.5 - Página de Pesquisa PJ

**Prioridade:** 🔴 Alta  
**Estimativa:** ~2h  
**Status:** ⏳ Pendente

**Tarefas:**
- [ ] Criar `frontend/src/app/research/pj/page.tsx`
- [ ] Formulário com CNPJ (máscara + validação)
- [ ] Modal de confirmação de créditos
- [ ] Hook: `useResearchPJ()` com React Query
- [ ] Histórico de pesquisas recentes

---

#### ⏳ Issue 5.6 - Página de Resultado PJ - Dados Cadastrais

**Prioridade:** 🔴 Alta  
**Estimativa:** ~3h  
**Status:** ⏳ Pendente

**Tarefas:**
- [ ] Criar `/research/pj/[id]/page.tsx`
- [ ] Componente: `DadosCadastraisCard`
- [ ] Componente: `CNAECard`
- [ ] Botões de ação (PDF, Favoritos, Compartilhar)

---

#### ⏳ Issue 5.7 - Componentes de Endereços e Contatos

**Prioridade:** 🔴 Alta  
**Estimativa:** ~2h  
**Status:** ⏳ Pendente

**Tarefas:**
- [ ] Componente: `EnderecosCard`
- [ ] Componente: `ContatosCard`
- [ ] Componente: `RedesSociaisCard`
- [ ] Integração Google Maps

---

#### ⏳ Issue 5.8 - Componente de Sócios e Relacionamentos

**Prioridade:** 🔴 Alta  
**Estimativa:** ~3h  
**Status:** ⏳ Pendente

**Tarefas:**
- [ ] Componente: `SociosCard` (Atuais + Histórico)
- [ ] Modal: `EmpresasDoSocioModal`
- [ ] Timeline de eventos societários
- [ ] Links para novas pesquisas

---

#### ⏳ Issue 5.9 - Componente de Histórico Financeiro

**Prioridade:** 🟡 Média  
**Estimativa:** ~2h  
**Status:** ⏳ Pendente

**Tarefas:**
- [ ] Componente: `HistoricoFinanceiroCard`
- [ ] Seção: `ProtestosTable`
- [ ] Seção: `AcoesJudiciaisTable`
- [ ] Alert de Recuperação Judicial
- [ ] Score de Risco visual

---

#### ⏳ Issue 5.10 - Download de Relatório PJ (PDF)

**Prioridade:** 🟢 Baixa  
**Estimativa:** ~2h  
**Status:** ⏳ Pendente

**Tarefas:**
- [ ] Criar `pdf_generator.py` (backend)
- [ ] Endpoint: `GET /api/research/pj/{id}/pdf`
- [ ] Template HTML → PDF
- [ ] Botão "Download PDF" (frontend)
- [ ] Cache Redis do PDF

---

## 🛠️ Stack Técnico

### Backend
- FastAPI, SQLAlchemy, PostgreSQL, Redis, Alembic
- Predictus API integration
- reportlab/weasyprint (PDF)

### Frontend
- Next.js 14, TypeScript, React Query
- shadcn/ui, Tailwind CSS, lucide-react
- Google Maps API

---

## 📊 Métricas de Sucesso

| Métrica | Meta | Status |
|---------|------|--------|
| Issues Completas | 10/10 | ⏳ 0% |
| Models Criados | 7+ | ⏳ |
| Endpoints Backend | 6+ | ⏳ |
| Componentes Frontend | 15+ | ⏳ |
| Cache Funcionando | 100% | ⏳ |
| PDF Generation | Sim | ⏳ |

---

## 🎯 Ordem de Execução

### Semana 1: Backend
1. Issue 5.1 - Models (3h)
2. Issue 5.2 - Predictus Integration (4h)
3. Issue 5.3 - Endpoints (2h)
4. Issue 5.4 - Relacionamentos (2h)

### Semana 2: Frontend
5. Issue 5.5 - Página Pesquisa (2h)
6. Issue 5.6 - Dados Cadastrais (3h)
7. Issue 5.7 - Endereços (2h)
8. Issue 5.8 - Sócios (3h)
9. Issue 5.9 - Histórico Financeiro (2h)
10. Issue 5.10 - PDF (2h)

**Total:** ~25h (2 semanas)

---

## 🎯 Critérios de Conclusão

- [ ] Todas as 10 issues completas
- [ ] Integração Predictus funcionando
- [ ] Cache Redis implementado
- [ ] Página completa de dossiê PJ
- [ ] Download de PDF funcionando
- [ ] 0 erros de build
- [ ] Sistema ABERTO (sem auth - Sprint 11)

---

**Próxima Sprint:** Sprint 6 - Integração Pesquisas Jurídicas  
**Autenticação:** Sprint 11 (penúltima) 🔐  
**Segurança:** Sprint 12 (última) 🛡️
