
# 🗓️ ROADMAP DE SPRINTS - BASECERTA

> **Modelo de Desenvolvimento:** Frontend-First com 4 Entregas Principais  
> **Última Atualização:** 21 de Outubro de 2025  
> **Status:** Em Desenvolvimento - Delivery 1

---

## 📋 ÍNDICE

- [Visão Geral](#visão-geral)
- [Delivery 1: Frontend Completo](#delivery-1-frontend-completo-8-10-semanas)
- [Delivery 2: Backend Completo](#delivery-2-backend-completo-6-8-semanas)
- [Delivery 3: Autenticação RBAC](#delivery-3-autenticação-rbac-2-3-semanas)
- [Delivery 4: Segurança e Produção](#delivery-4-segurança-e-produção-2-3-semanas)

---

## 🎯 VISÃO GERAL

### Estratégia de Desenvolvimento

**Frontend-First Approach:**
- Construir todas as interfaces primeiro com dados mockados
- Desenvolvimento paralelo de UI/UX sem bloqueio de integrações
- Feedback visual rápido para validação de funcionalidades
- Usuário mock: `user_id=1` durante Deliveries 1-2

**Faseamento:**
1. **Delivery 1:** UI completa + mockdata (8-10 semanas)
2. **Delivery 2:** Integração backend + APIs externas (6-8 semanas)
3. **Delivery 3:** Sistema de autenticação completo (2-3 semanas)
4. **Delivery 4:** Hardening para produção (2-3 semanas)

### Convenções de Nomenclatura

- **Sprint:** Período de 1-2 semanas de trabalho focado
- **Issue:** Tarefa específica dentro de uma sprint
- **Delivery:** Conjunto de sprints que formam uma entrega principal
- **Milestone:** Marco importante de conclusão

---

## 📦 DELIVERY 1: FRONTEND COMPLETO (8-10 SEMANAS)

> **Objetivo:** Construir todas as páginas e componentes do frontend com dados mockados.  
> **Autenticação:** NÃO implementada (user_id=1 fixo)  
> **Backend:** Endpoints abertos sem proteção (ambiente dev)

---

### 🏃 SPRINT 1.1 - Sistema de Créditos e Planos (2 semanas)

**Período Estimado:** Semanas 1-2

#### Issues:

**Issue 1.1.1 - Estrutura Base e Layout Principal (3 dias)**
- [ ] Criar layout responsivo base (`/app/layout.tsx`)
- [ ] Implementar Header com navegação
- [ ] Implementar Sidebar com menu
- [ ] Criar Footer
- [ ] Setup Tailwind CSS themes (light/dark)
- [ ] Componentes base: Button, Card, Badge, Alert
- **Arquivos:**
  - `frontend/app/layout.tsx`
  - `frontend/components/layout/Header.tsx`
  - `frontend/components/layout/Sidebar.tsx`
  - `frontend/components/layout/Footer.tsx`
  - `frontend/components/ui/Button.tsx`
  - `frontend/components/ui/Card.tsx`

**Issue 1.1.2 - Página de Planos (2 dias)**
- [ ] Criar `/app/plans/page.tsx`
- [ ] Componente `PlanCard.tsx` (display plano)
- [ ] Componente `PlanComparison.tsx` (tabela comparativa)
- [ ] Mock data em `mocks/plans.ts`
- [ ] Hook `usePlans()` para gerenciar estado
- [ ] Lógica de seleção/upgrade de plano (mockado)
- **Mockdata:**
  - Plano Básico: 50 créditos/mês - R$ 99/mês
  - Plano Profissional: 200 créditos/mês - R$ 299/mês
  - Plano Empresarial: 500 créditos/mês - R$ 699/mês

**Issue 1.1.3 - Página de Pacotes de Créditos (2 dias)**
- [ ] Criar `/app/packages/page.tsx`
- [ ] Componente `PackageCard.tsx`
- [ ] Modal `PurchaseConfirmationModal.tsx`
- [ ] Mock data em `mocks/packages.ts`
- [ ] Hook `usePackages()` para compra simulada
- [ ] Animação de "compra bem-sucedida"
- **Mockdata:**
  - Pacote 50 créditos: R$ 89
  - Pacote 100 créditos: R$ 159
  - Pacote 250 créditos: R$ 379
  - Pacote 500 créditos: R$ 699

**Issue 1.1.4 - Dashboard de Créditos (2 dias)**
- [ ] Criar `/app/dashboard/page.tsx`
- [ ] Componente `CreditBalance.tsx` (saldo atual)
- [ ] Componente `CreditUsageChart.tsx` (gráfico consumo)
- [ ] Componente `QuickActions.tsx` (ações rápidas)
- [ ] Mock histórico de uso em `mocks/credits.ts`
- [ ] Hook `useCredits()` para estado de créditos
- **Features:**
  - Saldo disponível: Mock 150 créditos
  - Gráfico de consumo mensal (Chart.js ou Recharts)
  - Alertas de saldo baixo

**Issue 1.1.5 - Histórico de Transações (1 dia)**
- [ ] Criar `/app/credits/history/page.tsx`
- [ ] Componente `TransactionTable.tsx`
- [ ] Filtros: tipo (compra/uso), data, valor
- [ ] Paginação com `useTable()` hook
- [ ] Mock data em `mocks/transactions.ts`
- **Mockdata:**
  - 50 transações históricas
  - Tipos: Compra Pacote, Pesquisa PJ, Pesquisa PF, Estorno

---

### 🏃 SPRINT 1.2 - Catálogo de Empresas e Busca (1.5 semanas)

**Período Estimado:** Semanas 3-4.5

#### Issues:

**Issue 1.2.1 - Página de Busca de Empresas (3 dias)**
- [ ] Criar `/app/search/companies/page.tsx`
- [ ] Componente `SearchForm.tsx` (CNPJ/Razão Social)
- [ ] Componente `FilterPanel.tsx` (UF, Porte, Situação)
- [ ] Componente `SearchResults.tsx` (lista resultados)
- [ ] Mock data em `mocks/companies.ts` (100 empresas)
- [ ] Hook `useCompanySearch()` para busca local
- [ ] Máscara de CNPJ com react-input-mask

**Issue 1.2.2 - Card de Empresa (2 dias)**
- [ ] Componente `CompanyCard.tsx`
- [ ] Mostrar: CNPJ, Razão Social, UF, Situação Cadastral
- [ ] Badge de risco (Verde/Amarelo/Vermelho)
- [ ] Botão "Ver Dossiê Completo"
- [ ] Botão "Adicionar aos Favoritos"
- [ ] Responsivo (grid mobile/desktop)

**Issue 1.2.3 - Página de Detalhes da Empresa (2 dias)**
- [ ] Criar `/app/company/[cnpj]/page.tsx`
- [ ] Componente `CompanyHeader.tsx` (dados principais)
- [ ] Componente `CompanyTabs.tsx` (abas de navegação)
- [ ] Tabs: Dados Cadastrais, Sócios, Endereços, Financeiro
- [ ] Mock dossiê completo em `mocks/company-details.ts`
- [ ] Breadcrumb de navegação

---

### 🏃 SPRINT 1.3 - Pesquisa PJ Completa (2 semanas)

**Período Estimado:** Semanas 5-6

#### Issues:

**Issue 1.3.1 - Formulário de Pesquisa PJ (2 dias)**
- [ ] Criar `/app/research/pj/page.tsx`
- [ ] Formulário CNPJ com validação
- [ ] Modal `ConfirmResearchModal.tsx` (confirma custo créditos)
- [ ] Mock data custo: 10 créditos por pesquisa
- [ ] Hook `useResearchPJ()` para simular pesquisa
- [ ] Histórico de pesquisas recentes (sidebar)

**Issue 1.3.2 - Página Resultado PJ - Dados Cadastrais (3 dias)**
- [ ] Criar `/app/research/pj/[id]/page.tsx`
- [ ] Componente `DadosCadastraisCard.tsx`
- [ ] Componente `CNAECard.tsx` (primário + secundários)
- [ ] Componente `ActionButtons.tsx` (PDF/Favoritos/Compartilhar)
- [ ] Mock dossiê completo em `mocks/dossie-pj.ts`
- [ ] Hook `useDossiePJ()` para carregar dossiê
- **Dados mockados:**
  - CNPJ, Razão Social, Nome Fantasia
  - Data Abertura, Situação Cadastral, Capital Social
  - CNAE Primário + 5 Secundários

**Issue 1.3.3 - Componente Endereços e Contatos (2 dias)**
- [ ] Componente `EnderecosCard.tsx`
- [ ] Componente `ContatosCard.tsx`
- [ ] Componente `RedesSociaisCard.tsx`
- [ ] Integração Google Maps (iframe estático mockado)
- [ ] Ícones lucide-react para redes sociais
- [ ] Responsivo

**Issue 1.3.4 - Componente Sócios e Relacionamentos (3 dias)**
- [ ] Componente `SociosCard.tsx` (sócios atuais + histórico)
- [ ] Modal `EmpresasDoSocioModal.tsx` (empresas vinculadas)
- [ ] Timeline de eventos societários
- [ ] Links para novas pesquisas (PJ/PF)
- [ ] Mock data: 3 sócios por empresa
- **Features:**
  - Sócio Administrador destacado
  - CPF mascarado: `***.123.456-**`
  - Participação % no capital social

---

### 🏃 SPRINT 1.4 - Análise Financeira PJ (1.5 semanas)

**Período Estimado:** Semanas 7-8.5

#### Issues:

**Issue 1.4.1 - Componente Histórico Financeiro (3 dias)**
- [ ] Componente `HistoricoFinanceiroCard.tsx`
- [ ] Componente `ProtestosTable.tsx`
- [ ] Componente `AcoesJudiciaisTable.tsx`
- [ ] Alert de Recuperação Judicial
- [ ] Score de Risco visual (0-100 com gauge chart)
- [ ] Mock data em `mocks/historico-financeiro.ts`

**Issue 1.4.2 - Download Relatório PJ (Mock) (2 dias)**
- [ ] Botão "Baixar PDF" no header do dossiê
- [ ] Modal `DownloadPDFModal.tsx` (progresso fake)
- [ ] Simular download com delay de 3s
- [ ] Gerar PDF estático com jsPDF (client-side)
- [ ] Incluir: Dados cadastrais, CNAEs, Sócios, Score

---

### 🏃 SPRINT 1.5 - Pesquisa PF Completa (2 semanas)

**Período Estimado:** Semanas 9-10

#### Issues:

**Issue 1.5.1 - Formulário de Pesquisa PF (2 dias)**
- [ ] Criar `/app/research/pf/page.tsx`
- [ ] Formulário CPF com validação e máscara
- [ ] Modal confirmação custo (8 créditos)
- [ ] Mock data em `mocks/pessoas-fisicas.ts`
- [ ] Hook `useResearchPF()`

**Issue 1.5.2 - Página Resultado PF - Dados Cadastrais (3 dias)**
- [ ] Criar `/app/research/pf/[id]/page.tsx`
- [ ] Componente `DadosPessoaisCard.tsx`
- [ ] Componente `DocumentosCard.tsx` (RG, CNH, Título Eleitor)
- [ ] Componente `ContatosPFCard.tsx`
- [ ] Mock dossiê PF completo
- **Dados mockados:**
  - Nome Completo, CPF, Data Nascimento, Sexo
  - RG, Órgão Expedidor, CNH
  - Telefones, E-mails, Endereços

**Issue 1.5.3 - Componente Empresas Vinculadas (2 dias)**
- [ ] Componente `EmpresasVinculadasCard.tsx`
- [ ] Lista empresas onde é sócio
- [ ] Participação % em cada empresa
- [ ] Link para dossiê PJ
- [ ] Mock: 2-3 empresas por pessoa

**Issue 1.5.4 - Análise Financeira PF (3 dias)**
- [ ] Componente `HistoricoFinanceiroPFCard.tsx`
- [ ] Componente `RendaEstimadaCard.tsx`
- [ ] Componente `RestricoesCPFCard.tsx` (SPC/Serasa)
- [ ] Score de Crédito visual (0-1000)
- [ ] Mock data em `mocks/financeiro-pf.ts`

---

### 🏃 SPRINT 1.6 - Compliance e Consultas Avançadas (1.5 semanas)

**Período Estimado:** Semanas 11-12.5

#### Issues:

**Issue 1.6.1 - Página de Listas Restritivas (3 dias)**
- [ ] Criar `/app/compliance/lists/page.tsx`
- [ ] Componente `RestrictiveListsCard.tsx`
- [ ] Listas: PEP, Sanções ONU, OFAC, Interpol
- [ ] Busca por nome/CPF/CNPJ
- [ ] Mock data em `mocks/listas-restritivas.ts`
- [ ] Badge de criticidade (Alta/Média/Baixa)

**Issue 1.6.2 - Consulta CNEP/CEIS (2 dias)**
- [ ] Componente `CNEPConsultaCard.tsx`
- [ ] Componente `CEISConsultaCard.tsx`
- [ ] Formulário CPF/CNPJ
- [ ] Mock data: 10 registros CNEP, 15 CEIS
- [ ] Exportar resultados CSV (mock)

**Issue 1.6.3 - Dashboard de Compliance (2 dias)**
- [ ] Criar `/app/compliance/dashboard/page.tsx`
- [ ] Componente `ComplianceOverview.tsx`
- [ ] Gráficos: Consultas por tipo, Alertas ativos
- [ ] Lista últimas consultas de compliance
- [ ] Mock data em `mocks/compliance-stats.ts`

---

### 🏃 SPRINT 1.7 - Sistema de Favoritos e Alertas (1 semana)

**Período Estimado:** Semanas 13-14

#### Issues:

**Issue 1.7.1 - Página de Favoritos (3 dias)**
- [ ] Criar `/app/favorites/page.tsx`
- [ ] Componente `FavoritesList.tsx`
- [ ] Filtros: PJ/PF, Data Adição
- [ ] Botão remover favorito
- [ ] Mock localStorage para persistir favoritos
- [ ] Hook `useFavorites()`

**Issue 1.7.2 - Sistema de Alertas (2 dias)**
- [ ] Criar `/app/alerts/page.tsx`
- [ ] Componente `AlertsList.tsx`
- [ ] Tipos: Mudança cadastral, Novo protesto, Alteração societária
- [ ] Mock notificações em `mocks/alerts.ts`
- [ ] Badge contador de não lidos no header

---

### 🏃 SPRINT 1.8 - Relatórios e Exportações (1 semana)

**Período Estimado:** Semanas 15-16

#### Issues:

**Issue 1.8.1 - Página de Relatórios (3 dias)**
- [ ] Criar `/app/reports/page.tsx`
- [ ] Componente `ReportGenerator.tsx`
- [ ] Tipos: Relatório Mensal, Relatório por Empresa, Relatório Compliance
- [ ] Mock geração com progresso visual
- [ ] Download PDF/Excel (mock)

**Issue 1.8.2 - Histórico de Relatórios (2 dias)**
- [ ] Componente `ReportsHistory.tsx`
- [ ] Lista relatórios gerados
- [ ] Filtros: tipo, data, status
- [ ] Botão re-download
- [ ] Mock data em `mocks/reports-history.ts`

---

### ✅ MILESTONE DELIVERY 1 - FRONTEND COMPLETO

**Critérios de Aceitação:**
- [ ] Todas as 18 páginas funcionais com mockdata
- [ ] Navegação completa entre páginas
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Theme switcher (light/dark) funcionando
- [ ] Todos componentes UI documentados
- [ ] Performance: Lighthouse Score > 90
- [ ] Acessibilidade: WCAG 2.1 AA
- [ ] Zero erros no console
- [ ] Build de produção otimizado

**Entregáveis:**
- Frontend completo hospedado em ambiente dev
- Storybook com todos componentes
- Documentação de componentes
- Guia de estilo visual
- Demo navegável para stakeholders

---

## 🔧 DELIVERY 2: BACKEND COMPLETO (6-8 SEMANAS)

> **Objetivo:** Implementar todas as integrações backend e substituir mockdata por APIs reais.  
> **Autenticação:** AINDA NÃO implementada (user_id=1 fixo)  
> **Endpoints:** Abertos sem proteção (ambiente dev)

---

### 🏃 SPRINT 2.1 - Integração Predictus API (Retomar Issue 5.2-5.3) (1.5 semanas)

**Período Estimado:** Semanas 17-18.5

#### Issues:

**Issue 2.1.1 - Finalizar Endpoints PJ (Retomar 5.3) (2 dias)**
- [ ] **RETOMAR:** Commit código criado na Issue 5.3
  - `backend/app/schemas/research_pj.py` (330 lines)
  - `backend/app/api/v1/endpoints/research_pj.py` (455 lines)
  - `backend/app/api/deps.py` (125 lines)
- [ ] Testar POST /api/v1/research/pj
- [ ] Testar GET /api/v1/research/pj/{id}
- [ ] Testar GET /api/v1/research/pj (paginação)
- [ ] Testar GET /api/v1/research/pj/cnpj/{cnpj}
- [ ] Validar integração com PredictusAPIClient
- [ ] Validar cache Redis
- [ ] Commit final Issue 5.3

**Issue 2.1.2 - Conectar Frontend → Backend PJ (3 dias)**
- [ ] Atualizar `useResearchPJ()` hook para chamar API real
- [ ] Atualizar `useDossiePJ()` para GET /api/v1/research/pj/{id}
- [ ] Remover mockdata de `mocks/dossie-pj.ts`
- [ ] Tratamento de erros (402 - sem créditos, 404 - não encontrado)
- [ ] Loading states durante chamadas API
- [ ] Toast notifications para feedback

**Issue 2.1.3 - Sistema de Relacionamento Sócios (Retomar 5.4) (2 dias)**
- [ ] **RETOMAR:** Issue 5.4 do Sprint 5 original
- [ ] CRUD `socios.py`
- [ ] Endpoints:
  - GET /api/v1/socios/{cpf_cnpj}/empresas
  - GET /api/v1/empresas/{cnpj}/socios
  - GET /api/v1/socios/{cpf_cnpj}/graph
- [ ] Conectar frontend `EmpresasDoSocioModal.tsx`

---

### 🏃 SPRINT 2.2 - Integração DirectData API PF (2 semanas)

**Período Estimado:** Semanas 19-20

#### Issues:

**Issue 2.2.1 - DirectData API Client (3 dias)**
- [ ] Criar `backend/app/services/directdata_service.py`
- [ ] Classe `DirectDataAPIClient`
- [ ] Método `get_dossie_pf(cpf: str)`
- [ ] Parser JSON → Models PF
- [ ] Cache Redis (7 dias TTL)
- [ ] Retry logic (3x)
- [ ] Testes unitários

**Issue 2.2.2 - Models Pessoa Física (2 dias)**
- [ ] Criar `backend/app/models/pessoa_fisica.py`
- [ ] Models: PessoaFisica, DocumentoPF, ContatoPF, EnderecoPF, EmpresaVinculadaPF, HistoricoFinanceiroPF
- [ ] Migration Alembic
- [ ] Relationships e indexes

**Issue 2.2.3 - Endpoints FastAPI PF (3 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/research_pf.py`
- [ ] Schemas Pydantic em `backend/app/schemas/research_pf.py`
- [ ] Endpoints:
  - POST /api/v1/research/pf (solicitar dossiê)
  - GET /api/v1/research/pf/{id}
  - GET /api/v1/research/pf/cpf/{cpf}
- [ ] Dedução de créditos (8 créditos)
- [ ] Registrar router no main.py

**Issue 2.2.4 - Conectar Frontend PF (2 days)**
- [ ] Atualizar `useResearchPF()` hook
- [ ] Atualizar páginas `/app/research/pf/[id]/page.tsx`
- [ ] Remover mockdata PF
- [ ] Tratamento de erros

---

### 🏃 SPRINT 2.3 - Sistema de Créditos e Planos Real (1.5 semanas)

**Período Estimado:** Semanas 21-22.5

#### Issues:

**Issue 2.3.1 - Endpoints Planos (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/plans.py`
- [ ] Schemas em `backend/app/schemas/plans.py`
- [ ] Endpoints:
  - GET /api/v1/plans (listar planos)
  - POST /api/v1/plans/subscribe (assinar plano)
  - PUT /api/v1/plans/upgrade (upgrade plano)
- [ ] Conectar frontend `/app/plans/page.tsx`

**Issue 2.3.2 - Endpoints Pacotes de Créditos (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/packages.py`
- [ ] Schemas em `backend/app/schemas/packages.py`
- [ ] Endpoints:
  - GET /api/v1/packages (listar pacotes)
  - POST /api/v1/packages/purchase (comprar pacote)
- [ ] Conectar frontend `/app/packages/page.tsx`

**Issue 2.3.3 - Sistema de Dedução de Créditos (1 dia)**
- [ ] Criar `backend/app/services/credit_service.py`
- [ ] Funções:
  - `check_user_credits(user_id, amount)`
  - `deduct_credits(user_id, amount, description)`
  - `add_credits(user_id, amount, description)`
- [ ] Integrar em endpoints PJ/PF
- [ ] Histórico de transações

**Issue 2.3.4 - Conectar Dashboard Créditos (2 dias)**
- [ ] Endpoint GET /api/v1/credits/balance
- [ ] Endpoint GET /api/v1/credits/history
- [ ] Atualizar `useCredits()` hook
- [ ] Atualizar `/app/dashboard/page.tsx`
- [ ] Remover mockdata de créditos

---

### 🏃 SPRINT 2.4 - Integração Gateway de Pagamentos (2 semanas)

**Período Estimado:** Semanas 23-24

#### Issues:

**Issue 2.4.1 - Stripe/Asaas Integration (4 dias)**
- [ ] Escolher gateway: Stripe (internacional) ou Asaas (Brasil)
- [ ] Criar `backend/app/services/payment_service.py`
- [ ] Configurar webhooks
- [ ] Criar checkout session
- [ ] Processar pagamentos aprovados/rejeitados
- [ ] Testes com sandbox

**Issue 2.4.2 - Endpoints de Pagamento (3 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/payments.py`
- [ ] Schemas em `backend/app/schemas/payments.py`
- [ ] Endpoints:
  - POST /api/v1/payments/checkout (criar sessão)
  - POST /api/v1/payments/webhook (receber notificações)
  - GET /api/v1/payments/history
- [ ] Conectar frontend modal de compra

**Issue 2.4.3 - Assinatura Recorrente (3 dias)**
- [ ] Implementar assinatura mensal
- [ ] Renovação automática de créditos
- [ ] Cancelamento de assinatura
- [ ] E-mails de cobrança (SendGrid)
- [ ] Atualizar frontend `/app/plans/page.tsx`

---

### 🏃 SPRINT 2.5 - Compliance e Listas Restritivas (1.5 semanas)

**Período Estimado:** Semanas 25-26.5

#### Issues:

**Issue 2.5.1 - Integração APIs Compliance (3 dias)**
- [ ] Integrar API PEP (Pessoas Politicamente Expostas)
- [ ] Integrar API OFAC (sanções EUA)
- [ ] Integrar API ONU (sanções internacionais)
- [ ] Integrar consulta CNEP/CEIS (portaltransparencia.gov.br)
- [ ] Cache Redis (30 dias TTL)
- [ ] Criar `backend/app/services/compliance_service.py`

**Issue 2.5.2 - Endpoints Compliance (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/compliance.py`
- [ ] Endpoints:
  - POST /api/v1/compliance/check (verificar PEP/OFAC/ONU)
  - GET /api/v1/compliance/cnep/{cpf_cnpj}
  - GET /api/v1/compliance/ceis/{cpf_cnpj}
- [ ] Conectar frontend `/app/compliance/lists/page.tsx`

---

### 🏃 SPRINT 2.6 - Sistema de Favoritos e Alertas Backend (1 semana)

**Período Estimado:** Semanas 27-28

#### Issues:

**Issue 2.6.1 - CRUD Favoritos (2 dias)**
- [ ] Criar model `Favorito` (SQLAlchemy)
- [ ] Endpoints:
  - POST /api/v1/favorites (adicionar)
  - GET /api/v1/favorites (listar)
  - DELETE /api/v1/favorites/{id} (remover)
- [ ] Conectar frontend `/app/favorites/page.tsx`

**Issue 2.6.2 - Sistema de Alertas (3 dias)**
- [ ] Criar model `Alerta`
- [ ] Background job (Celery) para verificar mudanças
- [ ] Endpoints:
  - GET /api/v1/alerts (listar alertas)
  - PUT /api/v1/alerts/{id}/read (marcar lido)
  - POST /api/v1/alerts/subscribe (criar alerta)
- [ ] Notificações push (web push)
- [ ] Conectar frontend `/app/alerts/page.tsx`

---

### 🏃 SPRINT 2.7 - Geração de Relatórios PDF Backend (1.5 semanas)

**Período Estimado:** Semanas 29-30.5

#### Issues:

**Issue 2.7.1 - PDF Generator (Retomar Issue 5.10) (3 dias)**
- [ ] **RETOMAR:** Issue 5.10 do Sprint 5 original
- [ ] Criar `backend/app/services/pdf_generator.py`
- [ ] Template HTML → PDF (WeasyPrint ou ReportLab)
- [ ] Incluir: Logo, Dados cadastrais, CNAEs, Sócios, Score
- [ ] Cache Redis (24h TTL)

**Issue 2.7.2 - Endpoint Download PDF (2 dias)**
- [ ] Endpoint GET /api/v1/research/pj/{id}/pdf
- [ ] Endpoint GET /api/v1/research/pf/{id}/pdf
- [ ] Stream PDF file
- [ ] Conectar frontend botão "Baixar PDF"
- [ ] Remover geração client-side (jsPDF)

**Issue 2.7.3 - Relatórios Personalizados (2 dias)**
- [ ] Endpoint POST /api/v1/reports/generate
- [ ] Tipos: Mensal, Por Empresa, Compliance
- [ ] Parâmetros: data_inicio, data_fim, filtros
- [ ] Gerar Excel com openpyxl
- [ ] Conectar frontend `/app/reports/page.tsx`

---

### ✅ MILESTONE DELIVERY 2 - BACKEND COMPLETO

**Critérios de Aceitação:**
- [ ] Todas APIs externas integradas (Predictus, DirectData, Compliance)
- [ ] Zero mockdata no frontend
- [ ] Sistema de créditos funcionando end-to-end
- [ ] Gateway de pagamentos configurado (sandbox)
- [ ] Relatórios PDF gerados server-side
- [ ] Background jobs rodando (Celery + Redis)
- [ ] Cobertura de testes > 80%
- [ ] Documentação Swagger completa
- [ ] Performance: Tempo resposta < 2s (95 percentil)

**Entregáveis:**
- Backend completo com todas integrações
- Documentação API (Swagger)
- Guia de deployment
- Testes automatizados (pytest)
- Monitoramento básico (logs)

---

## 🔐 DELIVERY 3: AUTENTICAÇÃO RBAC (2-3 SEMANAS)

> **Objetivo:** Implementar sistema completo de autenticação e autorização baseada em roles.  
> **Segurança:** JWT, refresh tokens, proteção de rotas, auditoria.

---

### 🏃 SPRINT 3.1 - Sistema de Autenticação Backend (1.5 semanas)

**Período Estimado:** Semanas 31-32.5

#### Issues:

**Issue 3.1.1 - Models de Autenticação (2 dias)**
- [ ] Atualizar model `User` (hash password, is_active, is_verified)
- [ ] Criar model `Role` (admin, user, viewer)
- [ ] Criar model `Permission` (granular: can_research_pj, can_research_pf, can_view_reports)
- [ ] Relationship User ↔ Role ↔ Permission (many-to-many)
- [ ] Migration Alembic

**Issue 3.1.2 - JWT Authentication (3 dias)**
- [ ] Atualizar `backend/app/api/deps.py`:
  - Implementar `get_current_user()` real (não mock)
  - Implementar `get_current_active_user()`
  - Implementar `require_permissions(permissions: list)`
- [ ] Criar `backend/app/core/security.py`:
  - `create_access_token(user_id, expires_delta)`
  - `create_refresh_token(user_id)`
  - `verify_password(plain, hashed)`
  - `get_password_hash(password)`
- [ ] Configurar SECRET_KEY em .env

**Issue 3.1.3 - Endpoints de Autenticação (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/auth.py`
- [ ] Endpoints:
  - POST /api/v1/auth/register (cadastro)
  - POST /api/v1/auth/login (login → access_token + refresh_token)
  - POST /api/v1/auth/refresh (renovar token)
  - POST /api/v1/auth/logout (invalidar token)
  - POST /api/v1/auth/forgot-password
  - POST /api/v1/auth/reset-password
- [ ] Schemas em `backend/app/schemas/auth.py`

**Issue 3.1.4 - Proteção de Rotas Backend (1 dia)**
- [ ] Adicionar `Depends(get_current_user)` em TODOS endpoints:
  - `/api/v1/research/pj/*`
  - `/api/v1/research/pf/*`
  - `/api/v1/credits/*`
  - `/api/v1/plans/*`
  - `/api/v1/packages/*`
  - `/api/v1/favorites/*`
  - `/api/v1/alerts/*`
  - `/api/v1/reports/*`
- [ ] Remover user_id=1 fixo
- [ ] Obter user_id do token JWT

---

### 🏃 SPRINT 3.2 - Sistema de Autenticação Frontend (1 semana)

**Período Estimado:** Semanas 33-34

#### Issues:

**Issue 3.2.1 - Páginas de Autenticação (3 dias)**
- [ ] Criar `/app/auth/login/page.tsx`
- [ ] Criar `/app/auth/register/page.tsx`
- [ ] Criar `/app/auth/forgot-password/page.tsx`
- [ ] Criar `/app/auth/reset-password/page.tsx`
- [ ] Componentes: LoginForm, RegisterForm, PasswordResetForm
- [ ] Validação com react-hook-form + zod

**Issue 3.2.2 - Context e Hooks de Auth (2 dias)**
- [ ] Criar `contexts/AuthContext.tsx`
- [ ] State: user, isAuthenticated, isLoading
- [ ] Functions: login(), logout(), register(), refreshToken()
- [ ] Hook `useAuth()`
- [ ] Persistir tokens no localStorage (com segurança)
- [ ] Auto-refresh token antes de expirar

**Issue 3.2.3 - Proteção de Rotas Frontend (2 dias)**
- [ ] Criar middleware `middleware.ts` (Next.js 15)
- [ ] Proteger rotas:
  - `/dashboard/*` → requer autenticação
  - `/research/*` → requer autenticação
  - `/credits/*` → requer autenticação
  - `/admin/*` → requer role admin
- [ ] Redirect para /auth/login se não autenticado
- [ ] Loading state durante verificação de token

---

### 🏃 SPRINT 3.3 - RBAC e Auditoria (1 semana)

**Período Estimado:** Semanas 35-36

#### Issues:

**Issue 3.3.1 - Sistema de Roles e Permissions (3 dias)**
- [ ] Criar `/app/admin/users/page.tsx` (admin only)
- [ ] Criar `/app/admin/roles/page.tsx` (admin only)
- [ ] CRUD de roles e permissions
- [ ] Atribuir roles a usuários
- [ ] Endpoint GET /api/v1/users/{id}/permissions
- [ ] Frontend: Conditional rendering baseado em permissions

**Issue 3.3.2 - Auditoria de Ações (2 dias)**
- [ ] Criar model `AuditLog` (user_id, action, resource, timestamp, ip_address)
- [ ] Middleware de auditoria em todas operações críticas
- [ ] Endpoint GET /api/v1/audit/logs (admin only)
- [ ] Frontend: Página de logs `/app/admin/audit/page.tsx`

**Issue 3.3.3 - Email Verification (2 dias)**
- [ ] Endpoint POST /api/v1/auth/verify-email
- [ ] Enviar email com link de verificação (SendGrid)
- [ ] Frontend: Página `/app/auth/verify-email/page.tsx`
- [ ] Bloquear acesso se email não verificado

---

### ✅ MILESTONE DELIVERY 3 - AUTENTICAÇÃO RBAC COMPLETA

**Critérios de Aceitação:**
- [ ] Sistema de login/registro funcionando
- [ ] JWT com refresh token implementado
- [ ] Todas rotas protegidas (frontend + backend)
- [ ] RBAC com roles e permissions
- [ ] Auditoria de ações críticas
- [ ] Email verification ativo
- [ ] Password reset funcionando
- [ ] Testes de segurança (OWASP Top 10)
- [ ] Session management seguro

**Entregáveis:**
- Sistema de autenticação completo
- Documentação de RBAC
- Guia de segurança
- Testes de penetração básicos
- Política de senhas documentada

---

## 🛡️ DELIVERY 4: SEGURANÇA E PRODUÇÃO (2-3 SEMANAS)

> **Objetivo:** Hardening do sistema para ambiente de produção.  
> **Foco:** Rate limiting, DDoS protection, XSS/CSRF, monitoramento, deploy.

---

### 🏃 SPRINT 4.1 - Hardening de Segurança (1.5 semanas)

**Período Estimado:** Semanas 37-38.5

#### Issues:

**Issue 4.1.1 - Rate Limiting (2 dias)**
- [ ] Implementar slowapi (FastAPI)
- [ ] Limites:
  - Login: 5 tentativas / 15 min
  - Pesquisa PJ: 50 / hora
  - Pesquisa PF: 30 / hora
  - API geral: 100 req/min
- [ ] Redis para armazenar contadores
- [ ] Resposta 429 (Too Many Requests)

**Issue 4.1.2 - Proteção DDoS e Firewall (2 dias)**
- [ ] Configurar Cloudflare (proxy reverso)
- [ ] Rate limiting por IP (Cloudflare)
- [ ] WAF rules (Web Application Firewall)
- [ ] Blocklist de IPs maliciosos
- [ ] Captcha em formulários sensíveis (hCaptcha)

**Issue 4.1.3 - XSS, CSRF, SQL Injection (2 dias)**
- [ ] Sanitizar inputs (DOMPurify no frontend)
- [ ] CSRF tokens em formulários
- [ ] Content Security Policy (CSP) headers
- [ ] Prepared statements (SQLAlchemy já faz)
- [ ] Validação de schemas Pydantic em todos endpoints
- [ ] Helmet.js no Next.js

**Issue 4.1.4 - HTTPS e Certificados (1 dia)**
- [ ] Configurar SSL/TLS (Let's Encrypt)
- [ ] Forçar HTTPS (redirect HTTP → HTTPS)
- [ ] HSTS headers (Strict-Transport-Security)
- [ ] Secure cookies (httpOnly, secure, sameSite)

---

### 🏃 SPRINT 4.2 - Monitoramento e Logs (1 semana)

**Período Estimado:** Semanas 39-40

#### Issues:

**Issue 4.2.1 - Sistema de Logs (2 dias)**
- [ ] Configurar logging estruturado (JSON)
- [ ] Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL
- [ ] Rotação de logs (logrotate)
- [ ] Centralização de logs (ELK Stack ou Loki)
- [ ] Logs de auditoria separados

**Issue 4.2.2 - Monitoramento de Performance (3 dias)**
- [ ] Configurar Prometheus + Grafana
- [ ] Métricas:
  - Tempo de resposta API (percentis 50, 95, 99)
  - Taxa de erro (5xx, 4xx)
  - Uso de créditos
  - Cache hit rate (Redis)
- [ ] Dashboards Grafana
- [ ] Alertas (PagerDuty ou Slack)

**Issue 4.2.3 - Health Checks (2 dias)**
- [ ] Endpoint GET /health (status dos serviços)
- [ ] Checks: PostgreSQL, Redis, APIs externas
- [ ] Integração com load balancer
- [ ] Endpoint GET /metrics (Prometheus)

---

### 🏃 SPRINT 4.3 - Deploy e CI/CD (1 semana)

**Período Estimado:** Semanas 41-42

#### Issues:

**Issue 4.3.1 - Containerização Completa (2 dias)**
- [ ] Otimizar Dockerfiles (multi-stage builds)
- [ ] Docker Compose para produção
- [ ] .env seguro (secrets management)
- [ ] Health checks nos containers
- [ ] Resource limits (CPU, RAM)

**Issue 4.3.2 - CI/CD Pipeline (3 dias)**
- [ ] Configurar GitHub Actions
- [ ] Pipeline:
  - Lint (ESLint, flake8)
  - Testes (pytest, jest)
  - Build (Docker images)
  - Security scan (Snyk ou Trivy)
  - Deploy staging
  - Deploy production (manual approval)
- [ ] Rollback automático em caso de falha

**Issue 4.3.3 - Deploy em Produção (2 dias)**
- [ ] Escolher provider: AWS, GCP, DigitalOcean, Vercel
- [ ] Configurar:
  - Frontend: Vercel ou Netlify
  - Backend: ECS/Fargate ou DigitalOcean App Platform
  - Database: RDS PostgreSQL ou Managed PostgreSQL
  - Cache: ElastiCache Redis ou Managed Redis
- [ ] Backup automático do banco (daily)
- [ ] CDN para assets (Cloudflare ou CloudFront)

---

### 🏃 SPRINT 4.4 - Documentação e Treinamento (1 semana)

**Período Estimado:** Semanas 43-44

#### Issues:

**Issue 4.4.1 - Documentação Técnica (3 dias)**
- [ ] README.md completo
- [ ] Guia de instalação (dev + prod)
- [ ] Guia de contribuição
- [ ] Arquitetura do sistema (diagramas)
- [ ] Documentação API (Swagger + ReDoc)
- [ ] Changelog e versioning (SemVer)

**Issue 4.4.2 - Documentação de Usuário (2 dias)**
- [ ] Manual do usuário
- [ ] Tutoriais em vídeo
- [ ] FAQ
- [ ] Base de conhecimento (Help Center)
- [ ] Guia de primeiros passos

**Issue 4.4.3 - Compliance e Legal (2 dias)**
- [ ] Política de Privacidade
- [ ] Termos de Uso
- [ ] LGPD compliance (consentimento, dados pessoais)
- [ ] Política de cookies
- [ ] Página `/app/legal/privacy/page.tsx`
- [ ] Página `/app/legal/terms/page.tsx`

---

### ✅ MILESTONE DELIVERY 4 - PRODUÇÃO READY

**Critérios de Aceitação:**
- [ ] Rate limiting ativo em produção
- [ ] HTTPS forçado com certificado válido
- [ ] WAF configurado (Cloudflare)
- [ ] Monitoramento 24/7 (Prometheus + Grafana)
- [ ] CI/CD pipeline funcionando
- [ ] Backups automáticos (daily + retention 30 dias)
- [ ] Zero vulnerabilidades críticas (scan Snyk)
- [ ] Documentação completa
- [ ] LGPD compliance
- [ ] Uptime SLA > 99.5%

**Entregáveis:**
- Sistema em produção
- Documentação completa (técnica + usuário)
- Monitoramento e alertas configurados
- Plano de disaster recovery
- Runbook de operações
- Certificação de segurança (OWASP Top 10)

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs Técnicos

**Performance:**
- Tempo de resposta API < 500ms (p95)
- Tempo de carregamento página < 2s
- Lighthouse Score > 90

**Disponibilidade:**
- Uptime > 99.5%
- Zero downtime em deploys
- RTO < 1h, RPO < 15min

**Segurança:**
- Zero vulnerabilidades críticas
- 100% rotas protegidas
- Rate limiting ativo

**Qualidade:**
- Cobertura de testes > 80%
- Zero erros no console produção
- Code review em 100% PRs

### KPIs de Produto

**Adoção:**
- 100 usuários ativos (primeiro mês)
- 500 pesquisas realizadas (primeiro mês)
- Taxa de conversão trial→paid > 20%

**Retenção:**
- Churn rate < 5% mensal
- NPS > 50
- CAC payback < 6 meses

---

## 🎯 CRONOGRAMA CONSOLIDADO

| Delivery | Sprint | Semanas | Esforço | Status |
|----------|--------|---------|---------|--------|
| **1 - Frontend** | 1.1-1.8 | 1-16 | 8-10 semanas | 🔄 Em Progresso |
| **2 - Backend** | 2.1-2.7 | 17-30 | 6-8 semanas | ⏳ Pendente |
| **3 - Auth RBAC** | 3.1-3.3 | 31-36 | 2-3 semanas | ⏳ Pendente |
| **4 - Segurança** | 4.1-4.4 | 37-44 | 2-3 semanas | ⏳ Pendente |
| **TOTAL** | - | **44 semanas** | **~11 meses** | - |

---

## 📝 NOTAS IMPORTANTES

### Dependências Críticas

1. **Delivery 2 depende de Delivery 1:**
   - Frontend deve estar completo antes de integrar backend
   - Mockdata facilita desenvolvimento paralelo de UI/UX

2. **Delivery 3 depende de Delivery 2:**
   - Todas integrações devem estar funcionando antes de adicionar autenticação
   - Evita retrabalho em endpoints

3. **Delivery 4 é incremental:**
   - Pode começar em paralelo com Delivery 3 (sprints finais)
   - Monitoramento pode ser configurado desde Delivery 2

### Flexibilidade do Roadmap

- **Sprints ajustáveis:** Duração pode variar ±20% baseado em complexidade real
- **Priorização dinâmica:** Issues podem ser reordenadas dentro de uma Sprint
- **Feedback loops:** Revisões quinzenais com stakeholders
- **Tech debt:** Reservar 15% do tempo para refatoração

### Equipe Recomendada

**Delivery 1-2:**
- 2 Frontend Developers
- 2 Backend Developers
- 1 UI/UX Designer
- 1 Tech Lead

**Delivery 3-4:**
- 1 Security Engineer
- 1 DevOps Engineer
- Manter equipe de dev para correções

---

## 🔄 PROCESSO DE ATUALIZAÇÃO

Este roadmap deve ser revisado:
- **Semanalmente:** Ajustar issues dentro da sprint atual
- **Quinzenalmente:** Revisar prioridades com stakeholders
- **Mensalmente:** Atualizar cronograma baseado em velocity real
- **Por milestone:** Retrospectiva e planejamento próxima delivery

**Última Revisão:** 21 de Outubro de 2025  
**Próxima Revisão:** 28 de Outubro de 2025

---

## ✅ APROVAÇÃO

- [ ] Product Owner: _______________
- [ ] Tech Lead: _______________
- [ ] Stakeholders: _______________

**Data de Aprovação:** ____ / ____ / ____

---

*Este roadmap substitui o ROADMAP_SPRINTS.md anterior (modelo 12 sprints backend-first). O novo modelo Frontend-First acelera feedback visual e reduz bloqueios de integração.*
