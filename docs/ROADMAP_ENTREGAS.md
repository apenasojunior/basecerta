# 🎯 ROADMAP POR ENTREGAS - BASECERTA

**Projeto:** Plataforma de Consultas e Pesquisas de Dados Empresariais  
**Estratégia:** Frontend-First Development  
**Data de Início:** Outubro/2025  
**Stack:** Next.js 15 + FastAPI + PostgreSQL + Redis + Docker

---

## 📊 VISÃO GERAL

**Total de Entregas:** 4 grandes fases  
**Duração Estimada:** 20-24 semanas (≈ 5-6 meses)

### 🎨 Estratégia Frontend-First

Diferente do roadmap tradicional, vamos **priorizar a conclusão completa do frontend** antes de implementar integrações complexas no backend. Isso permite:

✅ **Validação rápida de UX/UI** com stakeholders  
✅ **Feedback visual imediato** sobre funcionalidades  
✅ **Desenvolvimento paralelo** (frontend não bloqueia backend)  
✅ **Mocks de dados** para testar fluxos completos  
✅ **Iterações ágeis** sem depender de APIs externas  

---

## 🚀 AS 4 GRANDES ENTREGAS

### 📦 ENTREGA 1: FRONTEND COMPLETO
**Duração:** 8-10 semanas  
**Objetivo:** Interface completa e funcional com dados mockados

#### Escopo
- ✅ Todas as páginas de produtos (PF, PJ, Jurídico, Crédito, etc.)
- ✅ Sistema de Planos e Pacotes (visualização)
- ✅ Dashboard completo (analytics mockado)
- ✅ Sistema de Créditos (saldo e histórico)
- ✅ Páginas de Checkout e Pagamentos
- ✅ Formulários completos de pesquisa
- ✅ Componentes de visualização de resultados
- ✅ Relatórios em PDF (mockados)
- ✅ Responsividade total (mobile-first)
- ✅ Temas e acessibilidade (dark mode)
- ✅ Componentes UI reutilizáveis (shadcn/ui)

#### Tecnologias
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + shadcn/ui + Radix UI
- **Formulários:** React Hook Form + Zod
- **State:** Zustand / Context API
- **Charts:** Recharts
- **Maps:** Google Maps API
- **Icons:** Lucide React

#### Entregas por Módulo
1. **Sistema de Créditos e Planos** (2 semanas)
   - Página de Planos (/plans)
   - Página de Pacotes (/packages)
   - Dashboard de Créditos
   - Histórico de Transações

2. **Catálogo de Empresas** (1.5 semanas)
   - Busca avançada com filtros
   - Listagem de resultados
   - Detalhamento de empresa
   - Exportação CSV

3. **Pesquisas Pessoa Física (PF)** (2 semanas)
   - Formulário de pesquisa
   - Página de resultado completo
   - Componentes: Dados Pessoais, Endereços, Vínculos
   - Download de relatório

4. **Pesquisas Pessoa Jurídica (PJ)** (2 semanas)
   - Formulário de pesquisa
   - Página de resultado completo
   - Componentes: Cadastro, CNAEs, Sócios, Finanças
   - Grafo de relacionamentos

5. **Pesquisas Jurídicas** (1.5 semanas)
   - Formulário de pesquisa
   - Lista de processos
   - Detalhamento de processo
   - Timeline de movimentações

6. **Pesquisas de Crédito e Protestos** (2 semanas)
   - Score de crédito (visual)
   - SCR BACEN
   - Protestos e CADIN
   - Antifraude PIX

7. **Dashboard e Analytics** (1.5 semanas)
   - Dashboard principal
   - Gráficos de uso
   - Histórico completo
   - Admin dashboard

8. **Checkout e Pagamentos** (1.5 semanas)
   - Fluxo de checkout
   - Página de assinatura
   - Faturas e histórico
   - Success/Error pages

9. **Melhorias e Polish** (1-2 semanas)
   - Refinamentos de UX
   - Correções de bugs
   - Otimizações de performance
   - Testes de usabilidade

#### ⚠️ IMPORTANTE: Uso de Dados Mockados
Durante esta entrega, **TUDO funcionará com dados fictícios**:
- Mock de usuário: `user_id=1` (hardcoded)
- Respostas de API simuladas (JSON estáticos)
- Sem integração real com Predictus/DirectData
- Créditos fictícios (não deduz de verdade)
- Pagamentos simulados (sem gateway real)

**Critérios de Aceite:**
✅ Todas as páginas navegáveis  
✅ Formulários com validação funcionando  
✅ Componentes responsivos  
✅ Fluxos completos testados  
✅ UX aprovada por stakeholders  
✅ Acessibilidade básica (WCAG AA)  

---

### 🔧 ENTREGA 2: BACKEND COMPLETO
**Duração:** 6-8 semanas  
**Objetivo:** APIs completas e integrações externas funcionais

#### Escopo
- ✅ Models completos no PostgreSQL
- ✅ Integração Predictus API (PF e PJ)
- ✅ Integração DirectData (Crédito, Protestos, CADIN)
- ✅ Integração Pesquisas Jurídicas
- ✅ Sistema de cache (Redis)
- ✅ Sistema de filas (Celery)
- ✅ Lógica de créditos real (débito/crédito)
- ✅ Gateway de pagamento (Stripe/Mercado Pago)
- ✅ Webhooks de pagamento
- ✅ Sistema de assinaturas
- ✅ Geração de PDFs (backend)
- ✅ Endpoints RESTful completos
- ✅ Documentação Swagger/OpenAPI
- ✅ Testes unitários básicos

#### Tecnologias
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Cache:** Redis
- **Queue:** Celery + Redis
- **DB:** PostgreSQL
- **HTTP Client:** httpx (async)
- **PDF:** ReportLab / WeasyPrint
- **Validation:** Pydantic

#### Entregas por Módulo
1. **Models e Database** (1 semana)
   - Models completos (User, Plan, Credits, Company, PF, PJ, etc.)
   - Migrations Alembic
   - Seed data para testes
   - Índices e otimizações

2. **Sistema de Créditos e Planos** (1.5 semanas)
   - CRUD de Planos e Pacotes
   - Lógica de débito/crédito
   - Histórico de transações
   - Validações de saldo

3. **Integração Predictus** (2 semanas)
   - Client API (retry + cache)
   - Parser PF (Pessoa Física)
   - Parser PJ (Pessoa Jurídica)
   - Endpoints: POST /research/pf, POST /research/pj
   - Sistema de relacionamentos (sócios ↔ empresas)

4. **Integração DirectData** (2 semanas)
   - Client API
   - Score de Crédito + SCR BACEN
   - Protestos Nacional e SP
   - CADIN-SP
   - Antifraude PIX
   - Dossiê de Crédito Completo

5. **Integração Pesquisas Jurídicas** (1.5 semanas)
   - Client API (tribunal)
   - Parser de processos
   - Classificação de risco
   - Movimentações e partes

6. **Sistema de Pagamentos** (2 semanas)
   - Integração Stripe/Mercado Pago
   - Checkout sessions
   - Webhooks (confirmação)
   - Assinaturas recorrentes
   - Sistema de faturas
   - Renovação automática

7. **Geração de Relatórios (PDF)** (1 semana)
   - Templates HTML
   - Conversão PDF
   - Cache de relatórios
   - Endpoints de download

8. **Analytics e Logs** (1 semana)
   - Histórico de pesquisas
   - Estatísticas de uso
   - Logs estruturados
   - Métricas de performance

9. **Melhorias e Testes** (1 semana)
   - Testes unitários (pytest)
   - Otimizações de queries
   - Refatorações
   - Documentação final

#### ⚠️ IMPORTANTE: Ainda SEM Autenticação
Nesta entrega, **endpoints ainda estão abertos** (sem proteção):
- Usar mock: `user_id=1` nos endpoints
- Headers sem validação JWT
- Testes diretos via Swagger
- Foco em funcionalidade, não segurança

**Critérios de Aceite:**
✅ Todas as integrações funcionando  
✅ Cache Redis operacional  
✅ Pagamentos processando (sandbox)  
✅ PDFs sendo gerados  
✅ Webhooks respondendo corretamente  
✅ Documentação Swagger completa  
✅ Testes cobrindo casos principais  

---

### 🔐 ENTREGA 3: AUTENTICAÇÃO E RBAC
**Duração:** 2-3 semanas  
**Objetivo:** Sistema completo de login e controle de acesso

#### Escopo
- ✅ Sistema de registro e login
- ✅ JWT (Access + Refresh tokens)
- ✅ Recuperação de senha (email)
- ✅ Verificação de email
- ✅ RBAC (Role-Based Access Control)
  - **user:** Acesso normal
  - **admin:** Acesso total + estatísticas
  - **superadmin:** Gestão de usuários
- ✅ Proteção de todas as rotas (backend)
- ✅ Protected Routes (frontend)
- ✅ Context de autenticação (frontend)
- ✅ Interceptors HTTP (auto-refresh token)
- ✅ Gestão de perfil de usuário
- ✅ Upload de avatar
- ✅ Logout e invalidação de tokens

#### Tecnologias Backend
- **Auth:** JWT (python-jose)
- **Password:** bcrypt (passlib)
- **Email:** FastAPI-Mail
- **Tokens:** Redis (blacklist de tokens)

#### Tecnologias Frontend
- **State:** Zustand (auth store)
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios interceptors
- **Storage:** httpOnly cookies (preferencial)

#### Entregas
1. **Backend - Auth System** (1 semana)
   - Model User (com hash de senha)
   - Service: AuthService
   - JWT generation/validation
   - Middleware de autenticação
   - RBAC decorator
   - Proteção de rotas
   - Endpoints:
     - POST /auth/register
     - POST /auth/login
     - POST /auth/refresh
     - POST /auth/logout
     - POST /auth/forgot-password
     - POST /auth/reset-password
     - POST /auth/verify-email
     - GET /users/me
     - PUT /users/me

2. **Frontend - Auth UI** (1 semana)
   - Página de Login
   - Página de Registro
   - Página de Recuperação de Senha
   - Página de Reset de Senha
   - Página de Verificação de Email
   - Página de Perfil
   - Protected Routes HOC
   - Auth Context/Store
   - HTTP Interceptors

3. **Migração de Páginas** (0.5 semana)
   - Adicionar proteção em todas as páginas
   - Substituir mock user_id=1 por usuário real
   - Ajustar Dashboard (dados reais)
   - Testar fluxos completos

4. **Melhorias e Testes** (0.5 semana)
   - Testes E2E (Playwright)
   - Testes de permissões
   - Edge cases (token expirado, etc.)
   - Documentação de auth

#### ⚠️ MUDANÇA CRÍTICA
Após esta entrega, **sistema deixa de ser aberto**:
- ❌ Não é mais possível acessar sem login
- ✅ Todos os endpoints protegidos
- ✅ Usuários reais no banco
- ✅ Controle de acesso por role

**Critérios de Aceite:**
✅ Login/Logout funcionando  
✅ Registro com verificação de email  
✅ Recuperação de senha operacional  
✅ Todas as rotas protegidas  
✅ RBAC implementado e testado  
✅ Tokens sendo refreshados automaticamente  
✅ Perfil de usuário editável  
✅ Testes E2E passando  

---

### 🛡️ ENTREGA 4: SEGURANÇA E HARDENING
**Duração:** 2-3 semanas  
**Objetivo:** Proteção contra ataques e preparação para produção

#### Escopo - Proteções Contra Ataques

##### 1. **Proteção contra XSS (Cross-Site Scripting)**
- ✅ Sanitização de inputs (frontend e backend)
- ✅ Content Security Policy (CSP)
- ✅ Escape de HTML em outputs
- ✅ Validação rigorosa com Zod/Pydantic
- ✅ Headers de segurança
  - `X-XSS-Protection: 1; mode=block`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`

##### 2. **Proteção contra Brute Force**
- ✅ Rate Limiting por IP
  - Login: 5 tentativas / 15 minutos
  - Registro: 3 tentativas / hora
  - Forgot Password: 3 tentativas / hora
- ✅ Bloqueio temporário após tentativas falhas
- ✅ CAPTCHA após 3 tentativas (opcional)
- ✅ Log de tentativas suspeitas
- ✅ Alert para admin após 10 IPs diferentes

##### 3. **Proteção contra DDoS**
- ✅ Rate Limiting global (Redis)
  - 60 requisições / minuto por IP
  - 1000 requisições / hora por IP
- ✅ Rate Limiting por endpoint
  - Pesquisas: 10 / minuto
  - Checkout: 5 / minuto
- ✅ Cloudflare ou AWS Shield (recomendado)
- ✅ Nginx rate limiting (camada adicional)
- ✅ Timeout configurado (30s máximo)

##### 4. **Proteção contra Exploração de APIs**
- ✅ Validação rigorosa de inputs (Pydantic schemas)
- ✅ Whitelist de métodos HTTP
- ✅ CORS configurado corretamente
- ✅ API Key rotation (chaves externas)
- ✅ Logs de acesso suspeitos
- ✅ Limites de payload (max 10MB)
- ✅ Timeout de conexão
- ✅ Retry com backoff exponencial

##### 5. **Outras Proteções**
- ✅ SQL Injection (SQLAlchemy protege)
- ✅ CSRF Protection (tokens)
- ✅ HTTPS obrigatório (redirect)
- ✅ HSTS Header
- ✅ Secrets management (variáveis de ambiente)
- ✅ Criptografia de dados sensíveis
- ✅ Audit Log completo
- ✅ Backup automatizado (diário)

#### Tecnologias
- **Rate Limiting:** slowapi + Redis
- **Security Headers:** FastAPI middleware
- **CAPTCHA:** reCAPTCHA v3 (Google)
- **Monitoring:** Sentry (erros) + LogTail (logs)
- **Firewall:** Cloudflare (CDN + WAF)
- **Backup:** Scripts Python + S3/Storage

#### Entregas
1. **Rate Limiting e Anti-Brute Force** (0.5 semana)
   - Implementar slowapi
   - Configurar limites por endpoint
   - Sistema de bloqueio temporário
   - Logs de tentativas

2. **Security Headers e CSP** (0.5 semana)
   - Middleware de headers
   - CSP configurado
   - HTTPS redirect
   - HSTS

3. **Validação e Sanitização** (0.5 semana)
   - Schemas Pydantic completos
   - Validação de CPF/CNPJ (dígitos)
   - Sanitização de HTML
   - Escape de outputs

4. **Audit Log e Monitoring** (0.5 semana)
   - Model AuditLog
   - Log de ações críticas
   - Integração Sentry
   - Alertas de segurança

5. **Proteção de APIs Externas** (0.5 semana)
   - Timeout configurado
   - Retry com backoff
   - API key rotation
   - Cache para reduzir calls

6. **Backup e Recovery** (0.5 semana)
   - Script de backup diário
   - Retenção: 7 dias + 4 semanais
   - Teste de restore
   - Documentação

7. **Testes de Segurança** (1 semana)
   - OWASP Top 10 checklist
   - Pen test básico
   - Scan de vulnerabilidades
   - Testes de carga (100 users)
   - Testes de rate limiting

8. **Deploy em Produção** (0.5 semana)
   - Configuração Render/AWS
   - Variáveis de ambiente
   - SSL/TLS
   - Domínio customizado
   - Monitoring ativo
   - Health checks

#### Critérios de Aceite
✅ Rate limiting funcionando (testes de stress)  
✅ Brute force bloqueado (5 tentativas = block)  
✅ Headers de segurança configurados  
✅ OWASP Top 10 mitigado  
✅ Audit log registrando ações  
✅ Backup automatizado rodando  
✅ Monitoring ativo (Sentry)  
✅ Deploy em produção funcionando  
✅ SSL válido e HTTPS forçado  
✅ Testes de penetração passando  

---

## 📊 CRONOGRAMA RESUMIDO

| Entrega | Foco | Duração | Status Autenticação |
|---------|------|---------|---------------------|
| **1 - Frontend Completo** | UI/UX + Mocks | 8-10 sem | ❌ Aberto (mock user) |
| **2 - Backend Completo** | APIs + Integrações | 6-8 sem | ❌ Aberto (mock user) |
| **3 - Autenticação RBAC** | Login + Proteção | 2-3 sem | ✅ **IMPLEMENTAR** |
| **4 - Segurança Avançada** | Hardening + Produção | 2-3 sem | ✅ Rate limit + Proteções |

**Total:** 18-24 semanas (≈ 4.5-6 meses)

---

## 🎯 VANTAGENS DESTA ABORDAGEM

### ✅ Frontend-First
1. **Validação rápida de UX** sem depender de backend
2. **Feedback visual imediato** para stakeholders
3. **Desenvolvimento paralelo** (front não bloqueia back)
4. **Iterações ágeis** com dados mockados
5. **Redução de retrabalho** (UI aprovada antes da integração)

### ✅ Backend Focado
1. **Integrações complexas** sem pressão de prazos visuais
2. **Testes aprofundados** de lógica de negócio
3. **Otimizações** sem impactar desenvolvimento front
4. **Documentação** completa antes da integração

### ✅ Autenticação Tardia
1. **Desenvolvimento mais rápido** sem burocracia de auth
2. **Testes facilitados** (acesso direto aos endpoints)
3. **Implementação única** (não refatorar auth 10 vezes)
4. **RBAC bem planejado** (conhecemos todos os endpoints)

### ✅ Segurança como Fase Final
1. **Hardening completo** após funcionalidades prontas
2. **Testes focados** em produção real
3. **Deploy seguro** sem pressa
4. **Compliance** LGPD e OWASP

---

## 📝 OBSERVAÇÕES IMPORTANTES

### Durante Entrega 1 e 2 (Frontend + Backend)
⚠️ **Sistema funciona ABERTO** (sem autenticação):
- Usar mock: `user_id=1` em todo código
- Endpoints acessíveis sem token
- Foco em funcionalidade, não segurança
- Ambiente: **DEVELOPMENT ONLY**

### Após Entrega 3 (Autenticação)
✅ **Sistema se torna PROTEGIDO**:
- Login obrigatório para todas as páginas
- Endpoints validam JWT
- Roles controlam acesso (user/admin/superadmin)
- Usuários reais no banco

### Após Entrega 4 (Segurança)
🛡️ **Sistema pronto para PRODUÇÃO**:
- Rate limiting ativo
- Proteções contra ataques
- Monitoring 24/7
- Backups automatizados
- Deploy seguro

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Aprovar roadmap** com stakeholders
2. ✅ **Iniciar Entrega 1** - Frontend Completo
3. ⏭️ Após aprovação visual: **Entrega 2** - Backend
4. ⏭️ Quando APIs funcionarem: **Entrega 3** - Auth
5. ⏭️ Antes de produção: **Entrega 4** - Segurança

---

**Documento criado em:** Outubro/2025  
**Última atualização:** Outubro/2025  
**Versão:** 2.0 (Frontend-First Strategy)

---

📖 **Leia também:**
- [ROADMAP_SPRINTS.md](./ROADMAP_SPRINTS.md) - Detalhamento sprint por sprint
- [SPRINT_X_KANBAN.md](./SPRINT_X_KANBAN.md) - Kanbans de cada sprint
