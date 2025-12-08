# 🚀 ROADMAP DE SPRINTS - BASECERTA

**Projeto:** Plataforma de Consultas e Pesquisas de Dados Empresariais  
**Data de Início:** Outubro/2025  
**Metodologia:** Sprints de 2 semanas  
**Stack:** FastAPI + Next.js 14 + PostgreSQL + Redis + Docker

---

## 📋 VISÃO GERAL

**Total de Sprints:** 12 (24 semanas ≈ 6 meses)

- **Sprints 1-10:** Desenvolvimento de funcionalidades core
- **Sprint 11:** Autenticação e Gestão de Usuários
- **Sprint 12:** Segurança e Hardening

---

## 🎯 SPRINT 1: Fundação e Setup Inicial
**Duração:** 2 semanas  
**Objetivo:** Estabelecer infraestrutura base e ambiente de desenvolvimento

### Backend
- [ ] Setup inicial do projeto FastAPI
- [ ] Configuração do Docker e Docker Compose
- [ ] Conexão com PostgreSQL (DB: basecerta)
- [ ] Configuração do Redis
- [ ] Setup do Celery para tarefas assíncronas
- [ ] Estrutura de pastas e arquitetura (MVC/Clean Architecture)
- [ ] Models base do SQLAlchemy
- [ ] Migrations com Alembic
- [ ] Configuração de variáveis de ambiente (.env)
- [ ] Health check endpoint (`/health`)

### Frontend
- [ ] Setup Next.js 14 com TypeScript
- [ ] Configuração Tailwind CSS + shadcn/ui
- [ ] Estrutura de pastas (app router)
- [ ] Componentes base (Layout, Header, Footer)
- [ ] Setup de variáveis de ambiente
- [ ] Configuração de API client (axios/fetch)

### DevOps
- [ ] Dockerfile para backend e frontend
- [ ] docker-compose.yml completo
- [ ] Scripts de inicialização
- [ ] README.md com instruções de setup

### Entregável
✅ Ambiente de desenvolvimento funcional  
✅ Aplicação rodando em Docker  
✅ Documentação básica de setup

---

## 🎯 SPRINT 2: Sistema de Créditos e Planos
**Duração:** 2 semanas  
**Objetivo:** Implementar sistema de créditos e gestão de planos comerciais

⚠️ **IMPORTANTE:** Nesta sprint, o sistema funciona SEM autenticação. Usar mock de usuário (user_id=1) para testes.

### Backend
- [ ] Model: `User` (básico - campos: id, nome, email - SEM senha ainda)
- [ ] Model: `Plan` (Basic, Smart, Pro, Empresarial)
- [ ] Model: `CreditPackage` (pacotes avulsos)
- [ ] Model: `UserCredits` (saldo de créditos por usuário)
- [ ] Model: `CreditTransaction` (histórico de consumo)
- [ ] CRUD de Planos (aberto, sem proteção)
- [ ] CRUD de Pacotes de Créditos (aberto)
- [ ] Lógica de cálculo de créditos
- [ ] Lógica de débito/crédito
- [ ] Endpoints (TODOS ABERTOS - sem autenticação):
  - `GET /api/plans` - Listar planos
  - `GET /api/packages` - Listar pacotes
  - `GET /api/credits/balance/{user_id}` - Saldo do usuário
  - `GET /api/credits/history/{user_id}` - Histórico de transações
  - `POST /api/credits/add` - Adicionar créditos (aberto para testes)
  - `POST /api/credits/deduct` - Deduzir créditos (usado nas pesquisas)

### Frontend
- [ ] Página de Planos (/plans)
- [ ] Página de Pacotes de Créditos (/packages)
- [ ] Componente: Card de Plano
- [ ] Componente: Card de Pacote
- [ ] Dashboard: Exibição de saldo de créditos
- [ ] Página de Histórico de Créditos

### Entregável
✅ Sistema de créditos funcional  
✅ Interface de visualização de planos  
✅ Histórico de transações

---

## 🎯 SPRINT 3: Catálogo de Pesquisas - Categoria 1 (Empresas)
**Duração:** 2 semanas  
**Objetivo:** Implementar busca e filtros de dados de empresas

### Backend
- [ ] Model: `Company` (espelhando dados existentes no DB)
- [ ] Model: `SearchQuery` (histórico de buscas)
- [ ] Service: Busca por CNPJ
- [ ] Service: Busca por Razão Social
- [ ] Service: Busca por Segmento
- [ ] Service: Busca por E-mail
- [ ] Service: Busca por Telefone
- [ ] Service: Busca por Nome de Sócio
- [ ] Service: Busca por CEP
- [ ] Implementação de filtros:
  - Situação Cadastral (Ativa, Suspensa, Inapta, Baixada)
  - Tipo (Matriz/Filial)
  - Porte da Empresa
  - Capital Social (range)
  - Opção MEI (sim/não)
  - Opção Simples (sim/não)
  - Data de Abertura (range)
- [ ] Paginação de resultados
- [ ] Endpoints:
  - `POST /api/search/companies` - Busca com filtros
  - `GET /api/companies/{cnpj}` - Detalhes da empresa
  - `GET /api/search/history` - Histórico de buscas

### Frontend
- [ ] Página de Busca de Empresas (/search/companies)
- [ ] Componente: Formulário de Busca
- [ ] Componente: Filtros Avançados
- [ ] Componente: Card de Resultado
- [ ] Componente: Tabela de Resultados
- [ ] Página de Detalhes da Empresa (/company/[cnpj])
- [ ] Paginação de resultados
- [ ] Exportação de resultados (CSV)

### Entregável
✅ Busca de empresas com todos os filtros  
✅ Visualização de resultados  
✅ Detalhamento completo de empresa

---

## 🎯 SPRINT 4: Integração Predictus - Dossiês PF
**Duração:** 2 semanas  
**Objetivo:** Integrar API Predictus para Dossiê Pessoa Física

### Backend
- [ ] Service: `PredictusAPI` (cliente HTTP)
- [ ] Model: `PessoaFisica` (modelo completo do exemplo)
- [ ] Model: `ResearchRequest` (controle de requisições)
- [ ] Integração com Predictus API
- [ ] Parser de resposta Predictus → Model
- [ ] Sistema de cache (Redis) para evitar consultas duplicadas
- [ ] Lógica de débito de créditos
- [ ] Endpoints:
  - `POST /api/research/pf` - Solicitar dossiê PF (CPF)
  - `GET /api/research/pf/{id}` - Buscar resultado
  - `GET /api/research/status/{id}` - Status da pesquisa

### Frontend
- [ ] Página de Pesquisa PF (/research/pf)
- [ ] Formulário de solicitação (CPF)
- [ ] Exibição de custo em créditos
- [ ] Confirmação de débito
- [ ] Página de Resultado PF (/research/pf/[id])
- [ ] Componentes de visualização:
  - Dados Pessoais
  - Endereços
  - Telefones e E-mails
  - Parentes
  - Experiências Profissionais
  - Vínculos Societários
  - Mapa (Google Maps)
- [ ] Download do relatório (PDF)

### Entregável
✅ Integração Predictus funcionando  
✅ Dossiê PF completo  
✅ Sistema de cache implementado

---

## 🎯 SPRINT 5: Integração Predictus - Dossiês PJ
**Duração:** 2 semanas  
**Objetivo:** Integrar API Predictus para Dossiê Pessoa Jurídica

### Backend
- [ ] Model: `PessoaJuridica` (modelo completo do exemplo)
- [ ] Integração Predictus - endpoint PJ
- [ ] Parser de resposta PJ
- [ ] Sistema de relacionamento Sócios ↔ Empresas
- [ ] Cache Redis para PJ
- [ ] Endpoints:
  - `POST /api/research/pj` - Solicitar dossiê PJ (CNPJ)
  - `GET /api/research/pj/{id}` - Buscar resultado

### Frontend
- [ ] Página de Pesquisa PJ (/research/pj)
- [ ] Formulário de solicitação (CNPJ)
- [ ] Página de Resultado PJ (/research/pj/[id])
- [ ] Componentes de visualização:
  - Dados Cadastrais
  - CNAEs
  - Sócios (histórico)
  - Endereços e Contatos
  - Redes Sociais
  - Histórico de Dívidas
  - Mapa de Localização
- [ ] Download do relatório (PDF)
- [ ] Link para processos jurídicos (preparação Sprint 6)

### Entregável
✅ Dossiê PJ completo  
✅ Visualização de vínculos societários  
✅ Relatórios em PDF

---

## 🎯 SPRINT 6: Integração Pesquisas Jurídicas
**Duração:** 2 semanas  
**Objetivo:** Implementar consulta de processos jurídicos

### Backend
- [ ] Service: `JudicialAPI` (integração fornecedor)
- [ ] Model: `ProcessoJuridico`
- [ ] Model: `MovimentacaoProcesso`
- [ ] Model: `ParteProcesso`
- [ ] Parser de processos (TJ-SP, TST, TRT, etc.)
- [ ] Classificação de risco (BAIXO, MÉDIO, ALTO)
- [ ] Cache de processos
- [ ] Endpoints:
  - `POST /api/research/judicial` - Buscar processos (CPF/CNPJ)
  - `GET /api/research/judicial/{id}` - Detalhes do processo
  - `GET /api/research/judicial/summary/{cpf_cnpj}` - Resumo

### Frontend
- [ ] Página de Pesquisa Jurídica (/research/judicial)
- [ ] Formulário (CPF ou CNPJ)
- [ ] Página de Resultados (/research/judicial/[id])
- [ ] Componente: Lista de Processos (resumida)
- [ ] Componente: Card de Processo
  - Status (badge colorido)
  - Ramo/Classe
  - Valor
  - Indicador de Risco
- [ ] Modal/Página: Detalhamento completo
  - Partes envolvidas
  - Movimentações (timeline)
  - Processos relacionados
- [ ] Filtros: Status, Ramo, Tribunal, Risco
- [ ] Download de relatório jurídico (PDF)

### Entregável
✅ Consulta de processos funcionando  
✅ Visualização clara de riscos  
✅ Detalhamento completo de movimentações

---

## 🎯 SPRINT 7: Integração DirectData - Crédito e Score
**Duração:** 2 semanas  
**Objetivo:** Implementar pesquisas de situação financeira (parte 1)

### Backend
- [ ] Service: `DirectDataAPI` (cliente HTTP)
- [ ] Model: `DossieCreditoCompleto`
- [ ] Model: `ScoreCredito`
- [ ] Model: `SCRDetalhada` (Sistema de Crédito BACEN)
- [ ] Integração endpoints DirectData:
  - Dossiê de Crédito Completo
  - Score de Crédito QUOD
  - SCR Detalhada e Resumo BACEN
- [ ] Lógica de créditos (produtos "Ultra" - maior custo)
- [ ] Cache Redis
- [ ] Endpoints:
  - `POST /api/research/credit/dossie` - Dossiê completo
  - `POST /api/research/credit/score` - Score QUOD
  - `POST /api/research/credit/scr` - SCR BACEN

### Frontend
- [ ] Página de Pesquisas de Crédito (/research/credit)
- [ ] Abas para cada tipo de pesquisa
- [ ] Formulário unificado (CPF/CNPJ)
- [ ] Exibição de custo por pesquisa
- [ ] Dashboard de Score:
  - Gráfico de score
  - Interpretação do score
  - Recomendações
- [ ] Visualização SCR:
  - Total de operações
  - Valores por modalidade
  - Histórico de consultas
- [ ] Download de relatório financeiro

### Entregável
✅ Score de crédito funcional  
✅ SCR BACEN integrado  
✅ Dossiê de crédito completo

---

## 🎯 SPRINT 8: Integração DirectData - Protestos e CADIN
**Duração:** 2 semanas  
**Objetivo:** Implementar pesquisas de situação financeira (parte 2)

### Backend
- [ ] Model: `Protesto`
- [ ] Model: `CADIN`
- [ ] Model: `AntifrauchePix`
- [ ] Integração endpoints DirectData:
  - Protestos Nacional
  - Protestos SP
  - CADIN-SP
  - Antifraude Chave PIX
- [ ] Endpoints:
  - `POST /api/research/protestos/nacional` - Protestos nacional
  - `POST /api/research/protestos/sp` - Protestos SP
  - `POST /api/research/cadin` - CADIN-SP
  - `POST /api/research/antifraude-pix` - Antifraude PIX

### Frontend
- [ ] Página de Protestos (/research/protestos)
- [ ] Visualização de protestos:
  - Lista de cartórios
  - Valores
  - Datas
  - Status
- [ ] Página CADIN (/research/cadin)
- [ ] Página Antifraude PIX (/research/pix)
- [ ] Dashboard consolidado de Restrições:
  - Alertas visuais (vermelho/verde)
  - Resumo executivo
  - Score de risco
- [ ] Exportação de relatórios

### Entregável
✅ Consulta de protestos funcionando  
✅ Verificação CADIN  
✅ Antifraude PIX operacional

---

## 🎯 SPRINT 9: Dashboard e Analytics
**Duração:** 2 semanas  
**Objetivo:** Criar dashboards administrativos e de usuário

### Backend
- [ ] Service: `AnalyticsService`
- [ ] Endpoints de estatísticas:
  - `GET /api/stats/user` - Estatísticas do usuário
  - `GET /api/stats/admin` - Estatísticas gerais (admin)
  - `GET /api/stats/research-types` - Pesquisas por tipo
  - `GET /api/stats/credits-usage` - Uso de créditos
- [ ] Model: `UserActivity` (log de atividades)
- [ ] Relatórios agendados (Celery)
- [ ] Exportação de dados (Excel, CSV, PDF)

### Frontend
- [ ] Dashboard Principal (/dashboard)
  - Saldo de créditos (destaque)
  - Pesquisas recentes
  - Gráficos de uso
  - Atalhos rápidos
- [ ] Dashboard Admin (/admin/dashboard)
  - Usuários ativos
  - Consumo de créditos
  - Pesquisas por tipo
  - Receita (simulada)
  - Gráficos e métricas
- [ ] Componentes de visualização:
  - Charts (Recharts ou Chart.js)
  - Tabelas interativas
  - Filtros de data
- [ ] Página de Histórico (/history)
  - Todas as pesquisas realizadas
  - Filtros e busca
  - Re-download de relatórios

### Entregável
✅ Dashboard funcional  
✅ Analytics implementado  
✅ Histórico completo de pesquisas

---

## 🎯 SPRINT 10: Sistema de Pagamentos e Checkout
**Duração:** 2 semanas  
**Objetivo:** Implementar fluxo de compra de créditos e assinaturas

### Backend
- [ ] Model: `Payment`
- [ ] Model: `Subscription`
- [ ] Model: `Invoice`
- [ ] Integração gateway de pagamento (Stripe/Mercado Pago)
- [ ] Webhooks de confirmação de pagamento
- [ ] Lógica de renovação automática (assinaturas)
- [ ] Sistema de faturas
- [ ] Endpoints:
  - `POST /api/payments/checkout` - Criar checkout
  - `POST /api/payments/webhook` - Receber confirmações
  - `GET /api/payments/history` - Histórico de pagamentos
  - `POST /api/subscriptions/create` - Criar assinatura
  - `POST /api/subscriptions/cancel` - Cancelar assinatura
  - `GET /api/invoices` - Listar faturas

### Frontend
- [ ] Página de Checkout (/checkout)
  - Seleção de plano/pacote
  - Resumo da compra
  - Integração com gateway
- [ ] Página de Assinatura (/subscription)
  - Plano atual
  - Histórico de pagamentos
  - Cancelamento
  - Upgrade/Downgrade
- [ ] Página de Faturas (/invoices)
- [ ] Confirmação de pagamento (/payment/success)
- [ ] Página de erro (/payment/error)
- [ ] Notificações de pagamento

### Entregável
✅ Fluxo de pagamento completo  
✅ Assinaturas funcionando  
✅ Sistema de faturas

---

## 🎯 SPRINT 11: Autenticação e Gestão de Usuários
**Duração:** 2 semanas  
**Objetivo:** Implementar sistema completo de autenticação e transformar plataforma em ambiente protegido

⚠️ **IMPORTANTE:** Até este ponto, toda a plataforma funcionou SEM autenticação (ambiente aberto para desenvolvimento). Agora vamos adicionar login e proteger todas as rotas.

### Backend
- [ ] Atualização Model `User`:
  - Hash de senha (bcrypt)
  - Email verification
  - Tokens de recuperação
  - Roles (user, admin)
  - Campo `is_active`, `email_verified`
- [ ] Service: `AuthService`
  - Registro de usuários
  - Login com validação de senha
  - Geração de tokens JWT
  - Refresh de tokens
  - Recuperação de senha (email)
  - Verificação de email
- [ ] JWT (access token + refresh token)
  - Access token: 15 minutos
  - Refresh token: 7 dias
- [ ] Middleware de autenticação
  - Decorator `@requires_auth`
  - Extração e validação de JWT
  - Verificação de permissões
- [ ] Proteção de todas as rotas existentes:
  - `/api/research/*` (todas as pesquisas)
  - `/api/credits/*` (saldo e histórico)
  - `/api/plans/*` (visualização, exceto listagem pública)
  - `/api/payments/*` (checkout e pagamentos)
  - `/api/stats/*` (estatísticas)
  - Manter públicas: `/api/health`, `/api/plans` (listagem)
- [ ] Sistema de permissões (RBAC)
  - Role: `user` (acesso normal)
  - Role: `admin` (acesso total + estatísticas)
  - Verificação por rota
- [ ] Endpoints:
  - `POST /api/auth/register` - Registro
  - `POST /api/auth/login` - Login
  - `POST /api/auth/refresh` - Refresh token
  - `POST /api/auth/logout` - Logout (invalidar token)
  - `POST /api/auth/forgot-password` - Recuperar senha
  - `POST /api/auth/reset-password` - Resetar senha
  - `POST /api/auth/verify-email` - Verificar email
  - `GET /api/users/me` - Perfil do usuário logado
  - `PUT /api/users/me` - Atualizar perfil
  - `PUT /api/users/me/password` - Alterar senha

### Frontend
- [ ] Página de Login (/login)
  - Formulário com validação (React Hook Form + Zod)
  - Link para "Esqueci senha"
  - Link para "Criar conta"
  - Mensagens de erro
- [ ] Página de Registro (/register)
  - Formulário completo (nome, email, senha, confirmação)
  - Validação de força de senha
  - Termos de uso (checkbox)
  - Email de verificação
- [ ] Página de Esqueci Senha (/forgot-password)
  - Input de email
  - Envio de link de recuperação
- [ ] Página de Reset de Senha (/reset-password/[token])
  - Nova senha + confirmação
  - Validação de token
- [ ] Página de Perfil (/profile)
  - Dados pessoais
  - Alterar senha
  - Avatar (upload)
  - Preferências
- [ ] Context API / Zustand para autenticação
  - Estado global do usuário
  - Funções: login, logout, register
  - Persistência do token (localStorage ou cookie)
- [ ] Protected Routes (HOC/Middleware)
  - Componente `<ProtectedRoute>`
  - Redirect para /login se não autenticado
  - Aplicar em todas as rotas internas
- [ ] Interceptor HTTP (Axios)
  - Adicionar token em todas as requisições
  - Header: `Authorization: Bearer {token}`
  - Refresh automático de token expirado
  - Logout se refresh falhar
- [ ] Logout automático
  - Token expirado
  - Inatividade (opcional)
- [ ] Verificação de email (página)
  - `/verify-email/[token]`
  - Confirmação visual

### Migração de Páginas Existentes
- [ ] Adicionar proteção em todas as páginas:
  - `/dashboard` → Requer autenticação
  - `/search/*` → Requer autenticação
  - `/research/*` → Requer autenticação
  - `/checkout` → Requer autenticação
  - `/subscription` → Requer autenticação
  - `/history` → Requer autenticação
  - `/admin/*` → Requer role admin
- [ ] Ajustar Header:
  - Mostrar nome/email do usuário logado
  - Avatar real do banco
  - Menu de logout
- [ ] Ajustar Dashboard:
  - Buscar dados do usuário real (não mock)
  - Saldo de créditos real
  - Histórico real

### Entregável
✅ Sistema de autenticação completo  
✅ Todas as rotas protegidas  
✅ Login/Logout funcionando  
✅ Gestão de perfil de usuário  
✅ Recuperação de senha implementada

---

## 🎯 SPRINT 12: Segurança, Hardening e Deploy Final
**Duração:** 2 semanas  
**Objetivo:** Implementar camadas avançadas de segurança, auditoria e preparar para produção

⚠️ **IMPORTANTE:** Esta sprint fecha o ciclo de segurança iniciado na Sprint 11, adicionando camadas extras de proteção, monitoramento e preparação para ambiente de produção.

### Backend - Segurança Avançada
- [ ] **Rate Limiting** (por IP e por usuário)
  - Implementar com Redis
  - Limite de requisições por minuto: 60/min
  - Limite de requisições por hora: 1000/h
  - Limite de pesquisas por dia (baseado no plano)
  - Endpoints específicos com limites menores:
    - Login: 5 tentativas/15min
    - Register: 3 tentativas/hora
    - Forgot Password: 3 tentativas/hora
- [ ] **CORS** configurado corretamente
  - Whitelist de domínios permitidos
  - Métodos HTTP específicos
  - Headers permitidos
  - Credentials habilitados
- [ ] **Validação rigorosa de inputs** (Pydantic)
  - Schemas para todos os endpoints
  - Validação de CPF/CNPJ (dígitos verificadores)
  - Regex para emails, telefones
  - Sanitização de strings
- [ ] **SQL Injection prevention**
  - Verificar queries (SQLAlchemy já protege)
  - Nunca usar raw SQL sem parametrização
- [ ] **XSS prevention**
  - Escape de HTML em responses
  - Content-Type headers corretos
- [ ] **CSRF protection**
  - Tokens CSRF para ações críticas
  - Validação de origin/referer
- [ ] **Audit Log** completo
  - Model: `AuditLog`
    - user_id, action, resource, details (JSON)
    - ip_address, user_agent
    - timestamp, status (success/fail)
  - Log de todas as ações críticas:
    - Login/Logout
    - Alteração de senha
    - Compra de créditos
    - Pesquisas realizadas
    - Alteração de perfil
    - Ações administrativas
  - Endpoint admin: `GET /api/admin/audit-logs`
- [ ] **Monitoramento de segurança**
  - Tentativas de login falhas (contador por IP)
  - Bloqueio temporário após 5 tentativas (15 minutos)
  - Alert para admin após 10 tentativas de IPs diferentes
  - Detecção de padrões suspeitos
- [ ] **Backup automático do banco**
  - Script diário (Celery beat)
  - Retenção: 7 dias completos + 4 semanais
  - Backup em S3/storage externo
- [ ] **Secrets management**
  - Nunca commitar .env
  - Usar variáveis de ambiente em produção
  - Rotação de secrets (JWT secret, API keys)
- [ ] **HTTPS obrigatório**
  - Redirect HTTP → HTTPS
  - HSTS header
- [ ] **Headers de segurança**
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security`
  - `Referrer-Policy: no-referrer`
- [ ] **Proteção de dados sensíveis**
  - Criptografar dados sensíveis (CPF, dados bancários)
  - Mascaramento em logs
  - LGPD compliance básico

### Frontend - Segurança e UX Final
- [ ] **Validação client-side** (Zod)
  - Schemas para todos os formulários
  - Mensagens de erro claras
  - Validação em tempo real
- [ ] **Sanitização de inputs**
  - Remover scripts de campos texto
  - Escapar HTML
- [ ] **Content Security Policy**
  - Meta tag CSP
  - Whitelist de recursos externos
- [ ] **Proteção contra XSS**
  - Sanitizar dados exibidos
  - Usar `dangerouslySetInnerHTML` com cuidado
- [ ] **Tratamento seguro de tokens**
  - ✅ Armazenar em httpOnly cookies (preferência)
  - ❌ Evitar localStorage (vulnerável a XSS)
  - Expiração automática
  - Limpeza ao logout
- [ ] **Loading states** para prevenir duplo-clique
  - Botões desabilitados durante requisições
  - Spinners e feedback visual
- [ ] **Mensagens de erro genéricas**
  - Não expor detalhes internos
  - "Erro ao processar solicitação" (log detalhado no backend)
- [ ] **Páginas 404 e 500** customizadas
- [ ] **Acessibilidade (WCAG 2.1 AA)**
  - ARIA labels
  - Navegação por teclado
  - Contraste de cores
  - Screen reader friendly

### DevOps & Deploy
- [ ] **Configuração Render** (ou AWS)
  - Setup de containers
  - Configuração de domínio
  - SSL/TLS automático
- [ ] **Variáveis de ambiente em produção**
  - Secrets no painel do Render/AWS
  - Não usar .env em produção
- [ ] **SSL/TLS configurado**
  - Certificado válido
  - Força HTTPS
- [ ] **Backup automatizado**
  - Banco de dados
  - Arquivos estáticos
  - Configurações
- [ ] **Logs centralizados**
  - Integração com LogTail ou Sentry
  - Níveis: ERROR, WARN, INFO
  - Alertas para erros críticos
- [ ] **Monitoring**
  - UptimeRobot (status do site)
  - New Relic ou DataDog (performance)
  - Alertas de downtime
- [ ] **Scripts de deploy automatizado**
  - CI/CD com GitHub Actions
  - Deploy automático em push para `main`
  - Testes antes do deploy
- [ ] **Rollback strategy**
  - Manter versão anterior disponível
  - Script de rollback rápido
- [ ] **Health checks**
  - Endpoint `/health` robusto
  - Verificação de DB, Redis, APIs externas
  - Status page pública

### Documentação Final
- [ ] **README.md completo**
  - Descrição do projeto
  - Stack tecnológica
  - Como rodar localmente
  - Estrutura de pastas
  - Comandos úteis
- [ ] **API Documentation** (Swagger/OpenAPI)
  - Documentação automática
  - Exemplos de requisições
  - Códigos de erro
- [ ] **Guia de segurança**
  - Boas práticas implementadas
  - Como reportar vulnerabilidades
- [ ] **Guia de deploy**
  - Passo a passo
  - Variáveis necessárias
  - Troubleshooting comum
- [ ] **Troubleshooting guide**
  - Erros comuns e soluções
  - FAQ técnico
- [ ] **CHANGELOG.md**
  - Histórico de versões
  - Features adicionadas
  - Bugs corrigidos

### Testes Finais
- [ ] **Testes de segurança**
  - Pen test básico
  - OWASP Top 10 checklist
  - Scan de vulnerabilidades
- [ ] **Testes de carga**
  - Simular 100 usuários simultâneos
  - Identificar gargalos
  - Otimizar queries lentas
- [ ] **Testes E2E**
  - Fluxo completo: registro → login → pesquisa → logout
  - Fluxo de pagamento
  - Fluxo de recuperação de senha
- [ ] **Testes de compatibilidade**
  - Browsers: Chrome, Firefox, Safari, Edge
  - Mobile: iOS, Android
  - Responsividade: 320px → 1920px

### Entregável Final
✅ Aplicação segura e hardened (OWASP compliance)  
✅ Sistema completo de logs e auditoria  
✅ Deploy em produção (Render/AWS)  
✅ Monitoramento e alertas ativos  
✅ Documentação completa  
✅ Backups automatizados  
✅ CI/CD configurado  
✅ Plataforma pronta para uso real 🚀

---

## 📊 RESUMO DO CRONOGRAMA

| Sprint | Foco | Duração | Entrega Principal | Autenticação |
|--------|------|---------|-------------------|--------------|
| 1 | Setup | 2 sem | Infraestrutura base | ❌ Aberto |
| 2 | Créditos | 2 sem | Sistema de créditos | ❌ Aberto (mock user_id=1) |
| 3 | Empresas | 2 sem | Busca de empresas | ❌ Aberto |
| 4 | Predictus PF | 2 sem | Dossiê Pessoa Física | ❌ Aberto |
| 5 | Predictus PJ | 2 sem | Dossiê Pessoa Jurídica | ❌ Aberto |
| 6 | Jurídico | 2 sem | Consulta de processos | ❌ Aberto |
| 7 | DirectData 1 | 2 sem | Score e SCR | ❌ Aberto |
| 8 | DirectData 2 | 2 sem | Protestos e CADIN | ❌ Aberto |
| 9 | Dashboard | 2 sem | Analytics e relatórios | ❌ Aberto |
| 10 | Pagamentos | 2 sem | Checkout e assinaturas | ❌ Aberto |
| 11 | **Autenticação** | 2 sem | **Login e proteção de rotas** | ✅ **IMPLEMENTAR AQUI** |
| 12 | **Segurança** | 2 sem | **Hardening e produção** | ✅ **Auditoria e segurança avançada** |

**Total: 24 semanas (≈ 6 meses)**

### 📝 Estratégia de Autenticação
- **Sprints 1-10:** Sistema funciona ABERTO (sem login)
  - Usar mock: `user_id=1` para desenvolvimento
  - Focar em funcionalidades core
  - Não se preocupar com segurança ainda
- **Sprint 11:** Adicionar autenticação
  - Implementar login/registro
  - Proteger todas as rotas
  - Migrar de mock para usuários reais
- **Sprint 12:** Segurança avançada
  - Rate limiting
  - Audit logs
  - Deploy seguro em produção

---

## 🎓 PÓS-SPRINT 12: Configuração do Agente de Dev

Após todas as entregas:
- [ ] Configurar GitHub Copilot Workspace
- [ ] Documentar padrões de código
- [ ] Criar templates de componentes
- [ ] Configurar linters e formatters
- [ ] Setup de testes automatizados (E2E, Unitários)
- [ ] CI/CD pipeline completo

---

## 📝 OBSERVAÇÕES IMPORTANTES

### Prioridades por Sprint
- **Alta:** Funcionalidades core, integrações críticas
- **Média:** Melhorias de UX, otimizações
- **Baixa:** Nice to have, features secundárias

### Critérios de Aceite
Cada sprint deve ter:
1. ✅ Código funcional em produção
2. ✅ Testes básicos implementados
3. ✅ Documentação atualizada
4. ✅ Code review aprovado
5. ✅ Deploy realizado

### Dependências Externas
- **Predictus API:** Sprints 4-5
- **DirectData API:** Sprints 7-8
- **Gateway Pagamento:** Sprint 10

### Riscos
- ⚠️ Disponibilidade das APIs externas
- ⚠️ Complexidade das integrações
- ⚠️ Mudanças de requisitos
- ⚠️ Performance com grande volume de dados

---

## 🚀 PRÓXIMOS PASSOS

1. **Validar roadmap** com stakeholders
2. **Definir equipe** e alocação
3. **Setup do ambiente** de desenvolvimento
4. **Iniciar Sprint 1** 🎯

---

**Documento criado em:** Outubro/2025  
**Última atualização:** Outubro/2025  
**Versão:** 1.0
