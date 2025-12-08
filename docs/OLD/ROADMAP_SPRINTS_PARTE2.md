# 🗓️ ROADMAP DE SPRINTS - BASECERTA (PARTE 2)

> **Continuação:** Delivery 3 e 4 (Autenticação + Segurança)  
> **Pré-requisito:** Delivery 1 e 2 completos  
> **Última Atualização:** 22 de Outubro de 2025

---

## 🔐 DELIVERY 3: AUTENTICAÇÃO RBAC (2-3 SEMANAS)

> **Objetivo:** Implementar sistema completo de autenticação e autorização baseada em roles.  
> **Segurança:** JWT, refresh tokens, proteção de rotas, auditoria.  
> **Fim do mock:** Remover `user_id=1` fixo

---

### 🏃 SPRINT 3.1 - Sistema de Autenticação Backend (1.5 semanas)

**Período Estimado:** Semanas 25-26.5

#### Issues:

**Issue 3.1.1 - Models de Autenticação (2 dias)**
- [ ] Atualizar model `User`:
  - Adicionar `hashed_password` (bcrypt)
  - Adicionar `is_active` (boolean)
  - Adicionar `is_verified` (boolean)
  - Adicionar `is_superuser` (boolean)
  - Adicionar `email_verified_at` (timestamp)
  - Adicionar `last_login_at` (timestamp)
- [ ] Criar model `Role`:
  - Tipos: `admin`, `user`, `viewer`
  - Descrição, is_active
- [ ] Criar model `Permission`:
  - Granular: `can_research_pj`, `can_research_pf`, `can_view_reports`, `can_manage_users`
  - Resource, action (CRUD)
- [ ] Criar tabelas associativas:
  - `user_roles` (many-to-many: User ↔ Role)
  - `role_permissions` (many-to-many: Role ↔ Permission)
- [ ] Migration Alembic
- **Arquivos:**
  - `backend/app/models/auth.py`
  - `backend/migrations/versions/xxx_add_auth_models.py`

**Issue 3.1.2 - JWT Authentication (3 dias)**
- [ ] Criar `backend/app/core/security.py`:
  - `create_access_token(user_id, expires_delta=30min)`
  - `create_refresh_token(user_id, expires_delta=7days)`
  - `verify_password(plain, hashed)` (bcrypt)
  - `get_password_hash(password)` (bcrypt)
  - `decode_token(token)` → user_id
- [ ] Atualizar `backend/app/api/deps.py`:
  - **REMOVER mock user_id=1**
  - Implementar `get_current_user()` real:
    - Extrair token do header Authorization
    - Validar JWT
    - Buscar user no banco
    - Retornar User object
  - Implementar `get_current_active_user()`:
    - Validar is_active=True
  - Implementar `get_current_verified_user()`:
    - Validar is_verified=True
  - Implementar `require_permissions(permissions: list)`:
    - Verificar se user tem permissions necessárias
    - Raise 403 se não tiver
- [ ] Configurar SECRET_KEY em .env (gerado aleatoriamente)
- [ ] Configurar ALGORITHM (HS256)
- **Arquivos:**
  - `backend/app/core/security.py`
  - `backend/app/api/deps.py`

**Issue 3.1.3 - Endpoints de Autenticação (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/auth.py`
- [ ] Criar schemas em `backend/app/schemas/auth.py`:
  - `UserRegister` (email, password, name)
  - `UserLogin` (email, password)
  - `Token` (access_token, refresh_token, token_type)
  - `TokenRefresh` (refresh_token)
  - `PasswordReset` (email)
  - `PasswordResetConfirm` (token, new_password)
- [ ] Endpoints:
  - **POST /api/v1/auth/register** (cadastro):
    - Validar email único
    - Hash password
    - Criar user (is_verified=False)
    - Enviar email verificação
    - Retornar user criado
  - **POST /api/v1/auth/login** (login):
    - Validar email + password
    - Validar is_active=True
    - Gerar access_token + refresh_token
    - Atualizar last_login_at
    - Retornar tokens
  - **POST /api/v1/auth/refresh** (renovar token):
    - Validar refresh_token
    - Gerar novo access_token
    - Retornar novo token
  - **POST /api/v1/auth/logout** (invalidar token):
    - Adicionar token em blacklist (Redis)
    - Retornar 200 OK
  - **POST /api/v1/auth/forgot-password**:
    - Validar email existe
    - Gerar token reset (expira 1h)
    - Enviar email com link
    - Retornar 200 OK
  - **POST /api/v1/auth/reset-password**:
    - Validar token reset
    - Hash nova senha
    - Atualizar user
    - Retornar 200 OK
  - **POST /api/v1/auth/verify-email**:
    - Validar token verificação
    - Atualizar is_verified=True
    - Retornar 200 OK
- **Arquivos:**
  - `backend/app/api/v1/endpoints/auth.py`
  - `backend/app/schemas/auth.py`

**Issue 3.1.4 - Proteção de Rotas Backend (1 dia)**
- [ ] Adicionar `Depends(get_current_user)` em **TODOS** endpoints protegidos:
  - `/api/v1/smart-cnpj/*`
  - `/api/v1/dados360/*`
  - `/api/v1/radar-juridico/*`
  - `/api/v1/radar-financeiro/*` (quando criados)
  - `/api/v1/credits/*`
  - `/api/v1/plans/*`
  - `/api/v1/packages/*`
  - `/api/v1/favorites/*`
  - `/api/v1/alerts/*`
  - `/api/v1/reports/*`
- [ ] Adicionar `Depends(require_permissions(['admin']))` em endpoints admin:
  - `/api/v1/users/*` (gerenciar usuários)
  - `/api/v1/audit/*` (logs)
- [ ] **REMOVER user_id=1 fixo de TODOS os lugares**
- [ ] Obter user_id do token JWT: `current_user = Depends(get_current_user)`
- [ ] Passar `user_id=current_user.id` para funções de créditos, pesquisas, etc.
- **Arquivos:**
  - Atualizar todos endpoints criados nas Sprints 2.1-2.7

---

### 🏃 SPRINT 3.2 - Sistema de Autenticação Frontend (1 semana)

**Período Estimado:** Semanas 27-28

#### Issues:

**Issue 3.2.1 - Páginas de Autenticação (3 dias)**
- [ ] Criar `/app/auth/login/page.tsx`:
  - Formulário email + password
  - Link "Esqueci minha senha"
  - Link "Criar conta"
- [ ] Criar `/app/auth/register/page.tsx`:
  - Formulário name, email, password, confirm_password
  - Validação força senha
  - Termos de uso (checkbox)
- [ ] Criar `/app/auth/forgot-password/page.tsx`:
  - Formulário email
  - Mensagem sucesso
- [ ] Criar `/app/auth/reset-password/page.tsx`:
  - Recebe token por query param
  - Formulário nova senha
- [ ] Criar `/app/auth/verify-email/page.tsx`:
  - Recebe token por query param
  - Verificação automática
  - Redirect para login
- [ ] Componentes:
  - `LoginForm.tsx`
  - `RegisterForm.tsx`
  - `PasswordResetForm.tsx`
- [ ] Validação com `react-hook-form` + `zod`
- [ ] Design paleta Shopee (laranja + branco)
- **Arquivos:**
  - `frontend/app/auth/login/page.tsx`
  - `frontend/app/auth/register/page.tsx`
  - `frontend/app/auth/forgot-password/page.tsx`
  - `frontend/app/auth/reset-password/page.tsx`
  - `frontend/app/auth/verify-email/page.tsx`
  - `frontend/components/auth/LoginForm.tsx`
  - `frontend/components/auth/RegisterForm.tsx`
  - `frontend/components/auth/PasswordResetForm.tsx`

**Issue 3.2.2 - Context e Hooks de Auth (2 dias)**
- [ ] Criar `contexts/AuthContext.tsx`:
  - State: `user` (User object), `isAuthenticated` (boolean), `isLoading` (boolean)
  - Functions:
    - `login(email, password)` → POST /api/v1/auth/login
    - `logout()` → POST /api/v1/auth/logout + limpar tokens
    - `register(data)` → POST /api/v1/auth/register
    - `refreshToken()` → POST /api/v1/auth/refresh
    - `forgotPassword(email)` → POST /api/v1/auth/forgot-password
    - `resetPassword(token, password)` → POST /api/v1/auth/reset-password
  - Provider wrapper `<AuthProvider>`
- [ ] Hook `useAuth()`:
  - Acesso ao context
  - Retorna: user, isAuthenticated, isLoading, login, logout, register, etc.
- [ ] Persistir tokens no `localStorage`:
  - `access_token` (expire 30min)
  - `refresh_token` (expire 7 dias)
  - Usar `js-cookie` ou localStorage direto
- [ ] Auto-refresh token:
  - Interceptor Axios/Fetch
  - Se access_token expirado, chamar refreshToken() automaticamente
  - Se refresh_token expirado, logout + redirect /auth/login
- [ ] HTTP Interceptor:
  - Adicionar `Authorization: Bearer {access_token}` em todas requisições
  - Tratar 401 (token expirado) → refresh
  - Tratar 403 (sem permissão) → redirect /unauthorized
- **Arquivos:**
  - `frontend/contexts/AuthContext.tsx`
  - `frontend/hooks/useAuth.ts`
  - `frontend/lib/api-client.ts` (HTTP client com interceptor)

**Issue 3.2.3 - Proteção de Rotas Frontend (2 dias)**
- [ ] Criar middleware `middleware.ts` (Next.js 15):
  - Verificar token em cookies/localStorage
  - Validar token não expirado
  - Proteger rotas:
    - `/smart-cnpj/*` → requer autenticação
    - `/dados360/*` → requer autenticação
    - `/radar-juridico/*` → requer autenticação
    - `/radar-financeiro/*` → requer autenticação
    - `/credits/*` → requer autenticação
    - `/admin/*` → requer role admin
  - Redirect para `/auth/login` se não autenticado
  - Redirect para `/unauthorized` se sem permissão
- [ ] Criar componente `ProtectedRoute.tsx`:
  - Wrapper para páginas protegidas
  - Mostra loading durante verificação
  - Redirect automático se não autenticado
- [ ] Criar `/app/unauthorized/page.tsx`:
  - Mensagem "Você não tem permissão"
  - Link voltar para home
- [ ] Atualizar Header:
  - Mostrar nome do usuário (se autenticado)
  - Dropdown: Perfil, Configurações, Sair
  - Esconder "Saldo de Créditos" se não autenticado
- **Arquivos:**
  - `frontend/middleware.ts`
  - `frontend/components/auth/ProtectedRoute.tsx`
  - `frontend/app/unauthorized/page.tsx`
  - `frontend/components/layout/Header.tsx` (atualizar)

---

### 🏃 SPRINT 3.3 - RBAC e Auditoria (1 semana)

**Período Estimado:** Semanas 29-30

#### Issues:

**Issue 3.3.1 - Sistema de Roles e Permissions (3 dias)**
- [ ] Criar `/app/admin/users/page.tsx` (admin only):
  - Lista usuários (tabela paginada)
  - Filtros: is_active, is_verified, role
  - Ações: Editar, Desativar, Ativar, Deletar
- [ ] Criar `/app/admin/users/[id]/edit/page.tsx`:
  - Editar dados usuário
  - Atribuir roles (multi-select)
  - Ativar/Desativar
- [ ] Criar `/app/admin/roles/page.tsx` (admin only):
  - Lista roles
  - CRUD de roles
  - Atribuir permissions a role
- [ ] Endpoints backend:
  - GET /api/v1/users (listar - admin only)
  - GET /api/v1/users/{id} (detalhes - admin ou próprio user)
  - PUT /api/v1/users/{id} (editar - admin ou próprio user)
  - DELETE /api/v1/users/{id} (deletar - admin only)
  - POST /api/v1/users/{id}/roles (atribuir roles - admin only)
  - GET /api/v1/roles (listar roles - admin only)
  - POST /api/v1/roles (criar role - admin only)
  - GET /api/v1/users/{id}/permissions (listar permissions do user)
- [ ] Frontend: Conditional rendering baseado em permissions:
  - `useAuth()` retornar `user.permissions`
  - Componente `<Can permission="can_research_pj">...</Can>`
  - Hook `usePermission('can_research_pj')` → boolean
- **Arquivos:**
  - `frontend/app/admin/users/page.tsx`
  - `frontend/app/admin/users/[id]/edit/page.tsx`
  - `frontend/app/admin/roles/page.tsx`
  - `backend/app/api/v1/endpoints/users.py`
  - `backend/app/api/v1/endpoints/roles.py`
  - `frontend/components/auth/Can.tsx`
  - `frontend/hooks/usePermission.ts`

**Issue 3.3.2 - Auditoria de Ações (2 dias)**
- [ ] Criar model `AuditLog`:
  - user_id (quem fez)
  - action (o que fez: login, logout, search_pj, purchase_credits, etc.)
  - resource_type (tipo: pj, pf, process, etc.)
  - resource_id (id do recurso)
  - ip_address (IP do cliente)
  - user_agent (navegador)
  - metadata (JSONB - dados extras)
  - created_at (timestamp)
- [ ] Middleware de auditoria em operações críticas:
  - Login/Logout
  - Pesquisas (PJ, PF, Processos)
  - Compras (créditos, planos)
  - Alterações de usuários (admin)
- [ ] Endpoint GET /api/v1/audit/logs (admin only):
  - Listar logs (paginado)
  - Filtros: user_id, action, resource_type, date_range
- [ ] Frontend: Página `/app/admin/audit/page.tsx` (admin only):
  - Tabela de logs
  - Filtros avançados
  - Exportar CSV
- **Arquivos:**
  - `backend/app/models/audit.py`
  - `backend/app/middleware/audit_middleware.py`
  - `backend/app/api/v1/endpoints/audit.py`
  - `frontend/app/admin/audit/page.tsx`

**Issue 3.3.3 - Email Verification (2 dias)**
- [ ] Configurar SendGrid ou Amazon SES:
  - API Key no .env
  - Template email verificação
  - Template email reset senha
- [ ] Criar `backend/app/services/email_service.py`:
  - `send_verification_email(user, token)`
  - `send_password_reset_email(user, token)`
  - `send_welcome_email(user)`
- [ ] Integrar em endpoints:
  - POST /api/v1/auth/register → enviar email verificação
  - POST /api/v1/auth/forgot-password → enviar email reset
- [ ] Bloquear acesso se email não verificado:
  - Adicionar validação `is_verified=True` em endpoints críticos
  - Mostrar banner no frontend "Verifique seu email"
- [ ] Frontend: Banner verificação email:
  - Componente `EmailVerificationBanner.tsx`
  - Botão "Reenviar email"
  - Mostrar no header/dashboard se não verificado
- **Arquivos:**
  - `backend/app/services/email_service.py`
  - `backend/app/core/config.py` (adicionar configs email)
  - `frontend/components/auth/EmailVerificationBanner.tsx`

---

### ✅ MILESTONE DELIVERY 3 - AUTENTICAÇÃO RBAC COMPLETA

**Critérios de Aceitação:**
- [ ] Sistema de login/registro funcionando
- [ ] JWT com refresh token implementado
- [ ] Todas rotas protegidas (frontend + backend)
- [ ] RBAC com 3 roles (admin, user, viewer) + permissions granulares
- [ ] Auditoria de ações críticas
- [ ] Email verification ativo
- [ ] Password reset funcionando
- [ ] Middleware de autenticação em todos endpoints
- [ ] Proteção contra CSRF, XSS básica
- [ ] Testes de segurança (OWASP Top 10 básico)
- [ ] Session management seguro (tokens em httpOnly cookies)

**Entregáveis:**
- Sistema de autenticação completo
- Documentação de RBAC (roles + permissions)
- Guia de segurança
- Testes de penetração básicos (Postman/Insomnia)
- Política de senhas documentada (min 8 chars, 1 upper, 1 number, 1 special)

---

## 🛡️ DELIVERY 4: SEGURANÇA E PRODUÇÃO (2-3 SEMANAS)

> **Objetivo:** Hardening do sistema para ambiente de produção.  
> **Foco:** Rate limiting, DDoS protection, XSS/CSRF, monitoramento, deploy, compliance.

---

### 🏃 SPRINT 4.1 - Hardening de Segurança (1.5 semanas)

**Período Estimado:** Semanas 31-32.5

#### Issues:

**Issue 4.1.1 - Rate Limiting (2 dias)**
- [ ] Implementar slowapi (FastAPI):
  - Instalar `pip install slowapi`
  - Configurar limiter global
- [ ] Definir limites por endpoint:
  - **Login:** 5 tentativas / 15 min (por IP)
  - **Register:** 3 tentativas / 1 hora (por IP)
  - **Pesquisa Smart CNPJ:** 50 / hora (por user_id)
  - **Pesquisa Dados 360° PJ:** 30 / hora (por user_id)
  - **Pesquisa Dados 360° PF:** 30 / hora (por user_id)
  - **Pesquisa Radar Jurídico:** 20 / hora (por user_id)
  - **API geral:** 100 req/min (por user_id)
  - **Endpoints públicos:** 20 req/min (por IP)
- [ ] Redis para armazenar contadores
- [ ] Resposta customizada 429 (Too Many Requests):
  - JSON: `{"detail": "Too many requests", "retry_after": 900}`
- [ ] Frontend: Tratar 429 com toast notification
- **Arquivos:**
  - `backend/app/core/rate_limit.py`
  - Atualizar todos endpoints com `@limiter.limit()`

**Issue 4.1.2 - Proteção DDoS e Firewall (2 dias)**
- [ ] Configurar Cloudflare:
  - Criar conta Cloudflare
  - Adicionar domínio
  - Ativar proxy (nuvem laranja)
  - Configurar DNS
- [ ] Configurar WAF (Web Application Firewall) rules:
  - Bloquear países suspeitos (se necessário)
  - Rate limiting por IP (Cloudflare)
  - Challenge suspeitos (CAPTCHA)
- [ ] Blocklist de IPs maliciosos:
  - Integrar com AbuseIPDB ou similar
  - Middleware para verificar IP em blocklist
- [ ] Implementar hCaptcha em formulários sensíveis:
  - Login (após 3 tentativas falhas)
  - Register
  - Forgot password
- [ ] Frontend: Componente `<Captcha />` (hCaptcha React)
- **Arquivos:**
  - `backend/app/middleware/ip_blocklist_middleware.py`
  - `frontend/components/auth/Captcha.tsx`

**Issue 4.1.3 - XSS, CSRF, SQL Injection (2 dias)**
- [ ] **XSS (Cross-Site Scripting):**
  - Sanitizar inputs no frontend (DOMPurify)
  - Validar schemas Pydantic no backend (já fazemos)
  - Escape HTML em outputs (React já faz)
  - Content Security Policy (CSP) headers
- [ ] **CSRF (Cross-Site Request Forgery):**
  - Usar SameSite cookies (`SameSite=Strict`)
  - CSRF tokens em formulários (não APIs REST com JWT)
  - Validar Origin/Referer headers
- [ ] **SQL Injection:**
  - Usar prepared statements (SQLAlchemy ORM já faz)
  - Validar inputs com Pydantic
  - Never concatenar strings em queries
- [ ] **Command Injection:**
  - Evitar `os.system()`, `subprocess.call()` com inputs do usuário
  - Validar paths de arquivos
- [ ] Adicionar security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';`
- [ ] Middleware de security headers:
  - Criar `backend/app/middleware/security_headers_middleware.py`
- [ ] Instalar Helmet.js no Next.js:
  - Configurar `next.config.js` com security headers
- **Arquivos:**
  - `backend/app/middleware/security_headers_middleware.py`
  - `frontend/next.config.js` (atualizar headers)
  - `frontend/lib/sanitize.ts` (DOMPurify wrapper)

**Issue 4.1.4 - HTTPS e Certificados (1 dia)**
- [ ] Obter certificado SSL/TLS:
  - Let's Encrypt (gratuito, renovação automática)
  - Certbot para gerar certificado
- [ ] Configurar Nginx (se usado):
  - Forçar HTTPS (redirect HTTP → HTTPS)
  - Configurar SSL certificate e key
  - HSTS headers (Strict-Transport-Security)
- [ ] Configurar cookies seguros:
  - `httpOnly=True` (não acessível via JavaScript)
  - `secure=True` (somente HTTPS)
  - `sameSite=Strict` (proteção CSRF)
- [ ] Testar com SSL Labs:
  - https://www.ssllabs.com/ssltest/
  - Alvo: Nota A ou A+
- **Arquivos:**
  - `/etc/nginx/sites-available/basecerta` (config Nginx)
  - `backend/app/core/config.py` (cookie settings)

---

### 🏃 SPRINT 4.2 - Monitoramento e Logs (1 semana)

**Período Estimado:** Semanas 33-34

#### Issues:

**Issue 4.2.1 - Sistema de Logs (2 dias)**
- [ ] Configurar logging estruturado (JSON):
  - Usar `python-json-logger`
  - Formato: `{"timestamp": "...", "level": "...", "message": "...", "user_id": "...", "request_id": "..."}`
- [ ] Níveis de log:
  - **DEBUG:** Desenvolvimento
  - **INFO:** Ações normais (login, logout, pesquisas)
  - **WARNING:** Situações anormais (rate limit atingido, tentativa login falha)
  - **ERROR:** Erros de aplicação (exceções, falha API externa)
  - **CRITICAL:** Falhas graves (banco offline, memória esgotada)
- [ ] Rotação de logs:
  - Usar `logrotate` (Linux)
  - Manter últimos 30 dias
  - Comprimir logs antigos (gzip)
- [ ] Centralização de logs:
  - Opção 1: ELK Stack (Elasticsearch + Logstash + Kibana)
  - Opção 2: Grafana Loki + Promtail
  - Opção 3: CloudWatch Logs (AWS)
- [ ] Logs de auditoria separados:
  - Arquivo dedicado: `audit.log`
  - Formato JSON com todos detalhes
- [ ] Request ID tracking:
  - Middleware para gerar UUID por request
  - Incluir em todos logs
  - Retornar no header `X-Request-ID`
- **Arquivos:**
  - `backend/app/core/logging.py`
  - `backend/app/middleware/request_id_middleware.py`
  - `/etc/logrotate.d/basecerta`

**Issue 4.2.2 - Monitoramento de Performance (3 dias)**
- [ ] Configurar Prometheus:
  - Instalar Prometheus server
  - Expor métricas no backend: `/metrics` endpoint
  - Usar `prometheus_client` (Python)
- [ ] Métricas a coletar:
  - **Tempo de resposta API:**
    - Percentis 50, 95, 99
    - Por endpoint
    - Histograms
  - **Taxa de erro:**
    - 5xx errors (servidor)
    - 4xx errors (cliente)
    - Por endpoint
  - **Uso de créditos:**
    - Total consumido por dia
    - Por tipo de pesquisa
    - Counter
  - **Cache hit rate (Redis):**
    - Hits vs Misses
    - Gauge
  - **Requests por segundo:**
    - Total RPS
    - Por endpoint
  - **Database query time:**
    - Tempo médio de queries
    - Queries mais lentas
- [ ] Configurar Grafana:
  - Instalar Grafana
  - Conectar com Prometheus
  - Criar dashboards:
    - **Overview:** RPS, latency, errors, uptime
    - **Performance:** Response time por endpoint, DB query time
    - **Business:** Uso de créditos, pesquisas por tipo, usuários ativos
    - **Errors:** Taxa de erro por endpoint, logs de erro
- [ ] Configurar alertas:
  - **Critical:**
    - API down (uptime < 99%)
    - Error rate > 5%
    - Response time p95 > 5s
    - Database down
    - Redis down
  - **Warning:**
    - Error rate > 1%
    - Response time p95 > 2s
    - Disk usage > 80%
    - Memory usage > 85%
  - Notificar via: Slack, PagerDuty ou Email
- **Arquivos:**
  - `backend/app/core/metrics.py`
  - `backend/app/middleware/metrics_middleware.py`
  - `docker-compose.monitoring.yml` (Prometheus + Grafana)
  - `prometheus.yml` (config)
  - `grafana/dashboards/*.json`

**Issue 4.2.3 - Health Checks (2 dias)**
- [ ] Endpoint `GET /health`:
  - Status geral: `{"status": "healthy"}`
  - Checks:
    - **PostgreSQL:** Tentar query simples
    - **Redis:** Tentar ping
    - **APIs externas:** Verificar conectividade (Predictus, DirectData)
  - Se algum check falhar: `{"status": "unhealthy", "details": {...}}`
  - Status codes:
    - 200: Tudo OK
    - 503: Algum serviço down
- [ ] Endpoint `GET /ready`:
  - Verifica se app está pronto para receber tráfego
  - Usado por load balancer / Kubernetes
- [ ] Endpoint `GET /metrics`:
  - Expõe métricas Prometheus
  - Formato: Prometheus text-based exposition format
- [ ] Integração com load balancer:
  - Configurar health check no ALB/ELB (AWS)
  - Interval: 30s
  - Timeout: 5s
  - Unhealthy threshold: 2 falhas consecutivas
- **Arquivos:**
  - `backend/app/api/v1/endpoints/health.py`
  - `backend/app/services/health_service.py`

---

### 🏃 SPRINT 4.3 - Deploy e CI/CD (1 semana)

**Período Estimado:** Semanas 35-36

#### Issues:

**Issue 4.3.1 - Containerização Completa (2 dias)**
- [ ] Otimizar Dockerfiles (multi-stage builds):
  - **Backend Dockerfile:**
    - Stage 1 (builder): Instalar deps, compilar
    - Stage 2 (runtime): Copiar apenas necessário
    - Usar imagem slim (python:3.11-slim)
    - Não rodar como root (USER app)
  - **Frontend Dockerfile:**
    - Stage 1: Build Next.js (npm run build)
    - Stage 2: Servir com Node.js ou Nginx
    - Usar imagem slim
- [ ] Docker Compose para produção:
  - Arquivo separado: `docker-compose.prod.yml`
  - Sem volumes de desenvolvimento
  - Environment variables de .env (não commitar)
  - Healthchecks em todos serviços
  - Restart policy: `unless-stopped`
- [ ] Configurar .env seguro:
  - Usar secrets management (AWS Secrets Manager, HashiCorp Vault)
  - Nunca commitar .env no Git
  - Template: `.env.example` (valores fake)
- [ ] Healthchecks nos containers:
  - PostgreSQL: `pg_isready`
  - Redis: `redis-cli ping`
  - Backend: `curl http://localhost:8000/health`
  - Frontend: `curl http://localhost:3000`
- [ ] Resource limits (CPU, RAM):
  - Backend: 1 CPU, 2GB RAM
  - Frontend: 0.5 CPU, 1GB RAM
  - PostgreSQL: 2 CPU, 4GB RAM
  - Redis: 0.5 CPU, 512MB RAM
- **Arquivos:**
  - `backend/Dockerfile.prod`
  - `frontend/Dockerfile.prod`
  - `docker-compose.prod.yml`
  - `.env.example`

**Issue 4.3.2 - CI/CD Pipeline (3 dias)**
- [ ] Configurar GitHub Actions:
  - Arquivo: `.github/workflows/ci-cd.yml`
- [ ] Pipeline stages:
  - **1. Lint:**
    - Frontend: ESLint (`npm run lint`)
    - Backend: flake8 (`flake8 .`)
    - Backend: black (format check) (`black --check .`)
    - Backend: mypy (type check) (`mypy .`)
  - **2. Tests:**
    - Frontend: Jest (`npm run test`)
    - Backend: pytest (`pytest --cov=app`)
    - Coverage threshold: > 80%
  - **3. Build:**
    - Build Docker images (backend, frontend)
    - Tag com commit SHA
    - Push para Docker Hub ou ECR
  - **4. Security Scan:**
    - Snyk ou Trivy (scan vulnerabilidades)
    - Fail se vulnerabilidades críticas
  - **5. Deploy Staging:**
    - Deploy automático para staging (após merge na branch `develop`)
    - Executar migrations
    - Smoke tests
  - **6. Deploy Production:**
    - Deploy manual (approval required)
    - Somente de branch `main`
    - Blue-green deployment ou rolling update
    - Rollback automático se healthcheck falhar
- [ ] Configurar secrets no GitHub:
  - DOCKER_USERNAME, DOCKER_PASSWORD
  - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (se AWS)
  - DATABASE_URL, REDIS_URL (staging/prod)
  - SECRET_KEY, PREDICTUS_API_KEY, DIRECTDATA_API_KEY
- [ ] Notificações:
  - Slack: Notificar sucesso/falha de pipeline
  - Email: Notificar falhas em prod
- **Arquivos:**
  - `.github/workflows/ci-cd.yml`
  - `.github/workflows/staging.yml`
  - `.github/workflows/production.yml`

**Issue 4.3.3 - Deploy em Produção (2 dias)**
- [ ] Escolher provider de cloud:
  - **Opção 1:** AWS (ECS/Fargate + RDS + ElastiCache)
  - **Opção 2:** DigitalOcean (App Platform + Managed PostgreSQL + Managed Redis)
  - **Opção 3:** Google Cloud (Cloud Run + Cloud SQL + Memorystore)
  - **Opção 4:** Self-hosted (VPS com Docker Swarm ou Kubernetes)
- [ ] Configurar infraestrutura:
  - **Frontend:** Vercel (mais fácil) ou Netlify ou Cloudflare Pages
  - **Backend:** ECS/Fargate ou DigitalOcean App Platform
  - **Database:** RDS PostgreSQL (AWS) ou Managed PostgreSQL (DigitalOcean)
  - **Cache:** ElastiCache Redis (AWS) ou Managed Redis (DigitalOcean)
  - **Load Balancer:** ALB (AWS) ou incluído (DigitalOcean)
- [ ] Configurar domínio:
  - Registrar domínio (se ainda não tiver)
  - DNS: Cloudflare (proxy + CDN grátis)
  - Subdomínios:
    - `basecerta.com.br` → Frontend
    - `api.basecerta.com.br` → Backend
- [ ] Configurar backup automático do banco:
  - Snapshots diários
  - Retention: 30 dias
  - Teste de restore (importante!)
- [ ] Configurar CDN para assets:
  - Cloudflare CDN (grátis) ou CloudFront (AWS)
  - Cache de imagens, CSS, JS
  - Invalidação automática em deploys
- [ ] Setup de ambientes:
  - **Development:** Local (Docker Compose)
  - **Staging:** Cloud (branch develop)
  - **Production:** Cloud (branch main)
- **Arquivos:**
  - `infrastructure/terraform/*.tf` (se usar Terraform)
  - `infrastructure/cloudformation/*.yml` (se usar CloudFormation)
  - `docs/DEPLOYMENT.md` (guia de deploy)

---

### 🏃 SPRINT 4.4 - Documentação e Compliance (1 semana)

**Período Estimado:** Semanas 37-38

#### Issues:

**Issue 4.4.1 - Documentação Técnica (3 dias)**
- [ ] README.md completo:
  - Descrição do projeto
  - Features principais
  - Screenshots
  - Stack tecnológico
  - Instruções de instalação (dev)
  - Comandos úteis
  - Contribuindo
  - Licença
- [ ] Guia de instalação:
  - `docs/INSTALLATION.md`
  - Setup development (passo a passo)
  - Setup production (passo a passo)
  - Troubleshooting comum
- [ ] Guia de contribuição:
  - `CONTRIBUTING.md`
  - Git workflow (feature branches)
  - Code style (ESLint, black)
  - Commit messages (Conventional Commits)
  - Pull request template
- [ ] Arquitetura do sistema:
  - `docs/ARCHITECTURE.md`
  - Diagramas (draw.io ou mermaid):
    - Arquitetura geral (frontend, backend, banco, APIs)
    - Fluxo de autenticação
    - Fluxo de pesquisa (Smart CNPJ, Dados 360°, Radar Jurídico)
    - Fluxo de créditos
  - Decisões arquiteturais (ADRs)
- [ ] Documentação API:
  - Swagger UI (já incluído no FastAPI)
  - ReDoc (alternativa mais bonita)
  - Adicionar descrições em todos endpoints
  - Adicionar exemplos de request/response
  - Agrupar por tags (Smart CNPJ, Dados 360°, etc.)
- [ ] Changelog e versioning:
  - `CHANGELOG.md`
  - Semantic Versioning (SemVer): MAJOR.MINOR.PATCH
  - Releases no GitHub (tags)
  - Automação com `standard-version` ou similar
- **Arquivos:**
  - `README.md`
  - `docs/INSTALLATION.md`
  - `CONTRIBUTING.md`
  - `docs/ARCHITECTURE.md`
  - `CHANGELOG.md`
  - `docs/diagrams/*.drawio` ou `*.mmd` (mermaid)

**Issue 4.4.2 - Documentação de Usuário (2 dias)**
- [ ] Manual do usuário:
  - `docs/USER_MANUAL.md`
  - Como usar cada produto:
    - Smart CNPJ 360°
    - Dados 360° (PF e PJ)
    - Radar Jurídico
    - Radar Financeiro
  - Como comprar créditos
  - Como assinar planos
  - Como favoritar empresas
  - Como gerar relatórios
- [ ] Tutoriais em vídeo:
  - Gravar screencasts (Loom ou OBS)
  - Upload no YouTube (canal privado ou não listado)
  - Playlist de tutoriais
  - Embed vídeos no site ou help center
- [ ] FAQ (Frequently Asked Questions):
  - `docs/FAQ.md`
  - Perguntas comuns:
    - Como funciona o sistema de créditos?
    - Posso pesquisar o mesmo CPF/CNPJ múltiplas vezes?
    - Como cancelo minha assinatura?
    - Os dados estão atualizados?
    - Qual a diferença entre Smart CNPJ e Dados 360°?
- [ ] Base de conhecimento (Help Center):
  - Usar Notion, GitBook ou plataforma própria
  - Categorias: Produtos, Créditos, Segurança, Integrações
  - Artigos detalhados
  - Search bar
- [ ] Guia de primeiros passos:
  - Onboarding flow no sistema
  - Tooltips e dicas contextuais
  - Tour guiado (Shepherd.js ou Intro.js)
- **Arquivos:**
  - `docs/USER_MANUAL.md`
  - `docs/FAQ.md`
  - `docs/TUTORIALS.md`
  - Videos: Upload no YouTube

**Issue 4.4.3 - Compliance e Legal (2 dias)**
- [ ] Política de Privacidade:
  - `docs/PRIVACY_POLICY.md`
  - Conforme LGPD (Lei Geral de Proteção de Dados - Brasil)
  - Seções:
    - Quais dados coletamos
    - Como usamos os dados
    - Com quem compartilhamos
    - Quanto tempo armazenamos
    - Direitos do titular (acesso, correção, exclusão)
    - Cookies e rastreamento
    - Contato do DPO (Data Protection Officer)
- [ ] Termos de Uso:
  - `docs/TERMS_OF_SERVICE.md`
  - Regras de uso da plataforma
  - Restrições de uso
  - Propriedade intelectual
  - Limitações de responsabilidade
  - Lei aplicável e foro
- [ ] LGPD compliance:
  - Consentimento explícito (checkbox no cadastro)
  - Possibilidade de exportar dados (endpoint GET /api/v1/users/me/export)
  - Possibilidade de deletar conta (endpoint DELETE /api/v1/users/me)
  - Anonimização de dados após período (GDPR: 90 dias inativo)
  - Logs de consentimento (audit log)
- [ ] Política de cookies:
  - Banner de consentimento (Cookie Consent)
  - Categorias: Essenciais, Funcionais, Analytics, Marketing
  - Opção de aceitar/rejeitar por categoria
  - Link para Política de Privacidade
- [ ] Páginas no frontend:
  - `/app/legal/privacy/page.tsx` (Política de Privacidade)
  - `/app/legal/terms/page.tsx` (Termos de Uso)
  - `/app/legal/cookies/page.tsx` (Política de Cookies)
  - Link no footer
- [ ] Componente `<CookieConsent />`:
  - Banner no primeiro acesso
  - Salvar preferências no localStorage
  - Respeitar preferências (não carregar analytics se rejeitado)
- **Arquivos:**
  - `docs/PRIVACY_POLICY.md`
  - `docs/TERMS_OF_SERVICE.md`
  - `docs/COOKIES_POLICY.md`
  - `frontend/app/legal/privacy/page.tsx`
  - `frontend/app/legal/terms/page.tsx`
  - `frontend/app/legal/cookies/page.tsx`
  - `frontend/components/legal/CookieConsent.tsx`

---

### ✅ MILESTONE DELIVERY 4 - PRODUÇÃO READY

**Critérios de Aceitação:**
- [ ] Rate limiting ativo em todos endpoints
- [ ] HTTPS forçado com certificado Let's Encrypt (nota A+ no SSL Labs)
- [ ] WAF configurado no Cloudflare
- [ ] Monitoramento 24/7 (Prometheus + Grafana + alertas)
- [ ] CI/CD pipeline funcionando (GitHub Actions)
- [ ] Deploys automáticos para staging
- [ ] Deploys manuais para production (com approval)
- [ ] Backups automáticos diários (retention 30 dias)
- [ ] Teste de restore de backup bem-sucedido
- [ ] Zero vulnerabilidades críticas (scan Snyk/Trivy)
- [ ] Documentação completa (técnica + usuário + legal)
- [ ] LGPD compliance implementado
- [ ] Uptime SLA > 99.5% (objetivo)
- [ ] Performance: Response time p95 < 500ms

**Entregáveis:**
- Sistema em produção (domínio próprio)
- Documentação completa hospedada (GitBook ou Notion)
- Monitoramento e alertas configurados (Grafana dashboards)
- Plano de disaster recovery documentado
- Runbook de operações (procedimentos comum: deploy, rollback, backup restore)
- Certificação de segurança:
  - OWASP Top 10 mitigado
  - SSL Labs: Nota A+
  - Snyk scan: Zero vulnerabilidades críticas

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs Técnicos

**Performance:**
- Tempo de resposta API < 500ms (p95)
- Tempo de carregamento página < 2s (First Contentful Paint)
- Lighthouse Score > 90 (Performance, Accessibility, Best Practices, SEO)

**Disponibilidade:**
- Uptime > 99.5% (objetivo: 99.9%)
- Zero downtime em deploys (blue-green ou rolling)
- RTO (Recovery Time Objective) < 1h
- RPO (Recovery Point Objective) < 15min

**Segurança:**
- Zero vulnerabilidades críticas (scan Snyk)
- 100% rotas protegidas (autenticação)
- Rate limiting ativo
- WAF ativo (Cloudflare)
- HTTPS forçado

**Qualidade:**
- Cobertura de testes > 80%
- Zero erros no console (produção)
- Code review em 100% PRs
- Documentação completa

### KPIs de Produto

**Adoção:**
- 100 usuários ativos no primeiro mês
- 500 pesquisas realizadas no primeiro mês
- Taxa de conversão trial→paid > 20%

**Engajamento:**
- DAU/MAU (Daily Active Users / Monthly Active Users) > 30%
- Pesquisas por usuário/mês > 10
- Tempo médio na plataforma > 5min

**Retenção:**
- Churn rate < 5% mensal
- Net Promoter Score (NPS) > 50
- CAC (Customer Acquisition Cost) payback < 6 meses

**Financeiro:**
- MRR (Monthly Recurring Revenue) crescimento > 20% mês
- LTV (Lifetime Value) / CAC > 3
- Receita por usuário (ARPU) > R$ 200/mês

---

## 🎯 CRONOGRAMA CONSOLIDADO

| Delivery | Sprint | Semanas | Esforço | Status |
|----------|--------|---------|---------|--------|
| **1 - Frontend (4 Produtos)** | 1.1-1.6 | 1-11.5 | 8-10 semanas | ⏳ Pendente |
| **2 - Backend (4 Produtos)** | 2.1-2.7 | 12-24 | 6-8 semanas | ⏳ Pendente |
| **3 - Auth RBAC** | 3.1-3.3 | 25-30 | 2-3 semanas | ⏳ Pendente |
| **4 - Segurança + Produção** | 4.1-4.4 | 31-38 | 2-3 semanas | ⏳ Pendente |
| **TOTAL** | - | **38 semanas** | **~9.5 meses** | - |

---

## 📝 NOTAS FINAIS

### Dependências Críticas

1. **Sprint 2.1 (Smart CNPJ Backend):** Base PostgreSQL já existe ✅ - PRIORIDADE MÁXIMA
2. **Sprint 2.2 (Dados 360° PJ):** Retomar Issues 5.2-5.3 (90% prontas)
3. **Delivery 3:** Só iniciar após Delivery 2 completo (evitar retrabalho)
4. **Delivery 4:** Pode começar em paralelo com Delivery 3 (últimas sprints)

### Radar Financeiro (7 subprodutos)

**Nota:** Sprint 1.6 cria apenas os MENUS. Páginas individuais dos 7 subprodutos serão desenvolvidas em sprints futuras (após Delivery 4 ou em Delivery 5 - futuro).

### Equipe Recomendada

**Delivery 1-2:**
- 2 Frontend Developers (React/Next.js)
- 2 Backend Developers (Python/FastAPI)
- 1 UI/UX Designer (Design System Shopee)
- 1 Tech Lead (Arquitetura + Code Review)

**Delivery 3-4:**
- 1 Security Engineer (Hardening + Pentests)
- 1 DevOps Engineer (CI/CD + Deploy)
- Manter 1 Frontend + 1 Backend para correções/ajustes

### Tech Debt

- Reservar **15% do tempo** em cada sprint para refatoração
- Code review obrigatório (2 aprovações)
- Documentar decisões arquiteturais (ADRs)

### Processo de Atualização

Este roadmap deve ser revisado:
- **Semanalmente:** Ajustar issues dentro da sprint atual
- **Quinzenalmente:** Sprint review com stakeholders
- **Mensalmente:** Atualizar cronograma baseado em velocity real
- **Por milestone:** Retrospectiva + planning próxima delivery

**Última Revisão:** 22 de Outubro de 2025  
**Próxima Revisão:** 29 de Outubro de 2025

---

## ✅ APROVAÇÃO

- [ ] Product Owner: _______________
- [ ] Tech Lead: _______________
- [ ] Stakeholders: _______________

**Data de Aprovação:** ____ / ____ / ____

---

*Este roadmap substitui completamente a versão anterior. Nova estratégia: 4 Produtos Principais ao invés de funcionalidades dispersas. Design Shopee para UX alegre. Foco em Smart CNPJ primeiro (base local pronta).*
