# 🔐 ESTRATÉGIA DE AUTENTICAÇÃO - BASECERTA

**Data:** 20/10/2025  
**Status:** ✅ Definido e Documentado

---

## 🎯 DECISÃO ESTRATÉGICA

### Problema Identificado
O usuário solicitou que **autenticação NÃO seja implementada nas sprints iniciais**, mas sim nas **duas últimas sprints** (11 e 12), conforme especificado no documento `Estrutura_Projeto.txt`:

> "Criar roadmap de Sprints em ordem lógica, mas reservar:  
> – Penúltima Sprint → Autenticação  
> – Última Sprint → Segurança (hardening, rate-limit, audit-log, etc.)"

---

## ✅ SOLUÇÃO IMPLEMENTADA

### 1. Roadmap Atualizado

#### Sprints 1-10: DESENVOLVIMENTO ABERTO (SEM AUTENTICAÇÃO)
- **Filosofia:** Foco total nas funcionalidades core
- **Mock User:** Usar `user_id=1` fixo para desenvolvimento
- **Rotas:** Todas abertas (sem proteção)
- **Objetivo:** Desenvolver rapidamente sem complexidade de auth

**Sprints afetadas:**
- Sprint 1: Setup
- Sprint 2: Sistema de Créditos ➜ Model `User` básico (sem senha)
- Sprint 3-8: Todas as integrações (Empresas, Predictus, DirectData, Jurídico)
- Sprint 9: Dashboard e Analytics
- Sprint 10: Sistema de Pagamentos

#### Sprint 11: IMPLEMENTAR AUTENTICAÇÃO ✅
**Objetivo:** Transformar plataforma aberta em sistema protegido

**Backend:**
- Adicionar campos de autenticação ao Model `User`:
  - `password_hash` (bcrypt)
  - `email_verified`
  - `is_active`
  - `role` (user/admin)
- Implementar JWT (access + refresh tokens)
- Criar middleware de autenticação
- Proteger TODAS as rotas existentes
- Endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `POST /api/auth/verify-email`
  - `GET /api/users/me`
  - `PUT /api/users/me`

**Frontend:**
- Criar páginas: Login, Registro, Esqueci Senha, Reset Senha
- Context de autenticação (estado global)
- Protected Routes (HOC)
- Interceptor HTTP (adicionar token)
- Migrar de mock para usuário real

**Migração:**
- Adicionar proteção em todas as páginas existentes:
  - `/dashboard` ➜ Requer login
  - `/search/*` ➜ Requer login
  - `/research/*` ➜ Requer login
  - `/checkout` ➜ Requer login
  - `/admin/*` ➜ Requer role admin
- Ajustar Header com dados reais do usuário
- Buscar saldo de créditos real (não mock)

#### Sprint 12: SEGURANÇA AVANÇADA E HARDENING ✅
**Objetivo:** Camadas extras de segurança + produção

**Backend:**
- Rate Limiting (Redis)
  - Login: 5 tentativas/15min
  - Geral: 60 req/min, 1000 req/h
- Audit Log completo (todas ações críticas)
- Monitoramento de segurança (tentativas de login falhas)
- Backup automatizado
- Headers de segurança (CSP, HSTS, etc.)
- CORS configurado
- Validação rigorosa de inputs
- Proteção CSRF

**Frontend:**
- Validação client-side (Zod)
- Sanitização de inputs
- Tokens em httpOnly cookies (não localStorage)
- Loading states (prevenir duplo-clique)
- Mensagens de erro genéricas

**DevOps:**
- Deploy em produção (Render/AWS)
- SSL/TLS obrigatório
- Logs centralizados (Sentry)
- Monitoring (UptimeRobot)
- CI/CD (GitHub Actions)
- Backups automatizados

---

## 📋 MUDANÇAS REALIZADAS

### Arquivo: `ROADMAP_SPRINTS.md`

#### ✅ Sprint 2 - Atualizada
```diff
- Model: `User` (básico - sem autenticação ainda)
+ Model: `User` (básico - campos: id, nome, email - SEM senha ainda)
+ ⚠️ IMPORTANTE: Usar mock user_id=1 para testes
+ Endpoints TODOS ABERTOS (sem autenticação)
```

#### ✅ Sprint 11 - Expandida
```diff
+ ⚠️ IMPORTANTE: Até este ponto, toda a plataforma funcionou SEM autenticação
+ Agora vamos adicionar login e proteger todas as rotas
+ Seção completa de "Migração de Páginas Existentes"
+ Proteção de rotas: dashboard, search, research, checkout, admin
```

#### ✅ Sprint 12 - Detalhada
```diff
+ ⚠️ IMPORTANTE: Esta sprint fecha o ciclo de segurança iniciado na Sprint 11
+ Seção "Segurança Avançada" detalhada
+ Rate Limiting específico por endpoint
+ Audit Log com model completo
+ Testes de segurança (OWASP Top 10)
+ Testes de carga (100 usuários simultâneos)
```

#### ✅ Resumo do Cronograma - Atualizado
```diff
+ Coluna "Autenticação" adicionada
+ Sprints 1-10: ❌ Aberto
+ Sprint 11: ✅ IMPLEMENTAR AQUI
+ Sprint 12: ✅ Auditoria e segurança avançada
+ Seção "Estratégia de Autenticação" explicativa
```

---

## 🎯 SPRINT FRONTEND - AJUSTES

### Arquivo: `SPRINT_FRONTEND_KANBAN.md`

#### Issues Movidas para Sprint 11:
1. **useAuth Hook** ➜ Sprint 11
2. **Páginas de Autenticação** (Login, Register) ➜ Sprint 11
3. **Protected Routes** ➜ Sprint 11

#### Issues que permanecem (SEM auth):
1. ✅ TypeScript Types (entidades)
2. ✅ API Client (SEM interceptor de auth)
3. ✅ useCredits Hook (com mock user_id=1)
4. ✅ Todas as páginas de produtos
5. ✅ Dashboard
6. ✅ Configurações

---

## 📝 TODO LIST - ATUALIZADA

### Tarefas Imediatas (Sprint Frontend)
- [x] Test dashboard (http://localhost:3001) ✅
- [ ] Create TypeScript types (1h)
- [ ] Create API client - SEM auth (2h)
- [ ] Create useCredits hook - mock user_id=1 (1.5h)

### Tarefas Movidas para Sprint 11
- [ ] **SPRINT 11:** Create useAuth hook
- [ ] **SPRINT 11:** Create auth pages (Login, Register)
- [ ] **SPRINT 11:** Implement Protected Routes
- [ ] **SPRINT 11:** Add auth interceptor to API client

---

## 🚀 BENEFÍCIOS DESTA ESTRATÉGIA

### ✅ Vantagens

1. **Desenvolvimento mais rápido** nas sprints iniciais
   - Sem complexidade de JWT, tokens, sessões
   - Foco 100% nas funcionalidades de negócio
   
2. **Testes mais simples**
   - Não precisa fazer login a cada teste
   - Mock user_id=1 fixo
   
3. **Integrações facilitadas**
   - APIs externas (Predictus, DirectData) testadas sem auth
   - Fluxos de créditos validados rapidamente
   
4. **Migração organizada**
   - Sprint 11 dedica 2 semanas INTEIRAS para auth
   - Tempo suficiente para proteger todas as rotas
   - Testes de migração completos
   
5. **Segurança robusta**
   - Sprint 12 inteira para hardening
   - Não apressar implementação de segurança
   - Tempo para auditorias e testes

### ⚠️ Cuidados

1. **Não commitar para produção** antes da Sprint 11
2. **Marcar claramente** que é ambiente de desenvolvimento
3. **Documentar** que user_id=1 é mock
4. **Lembrar** de testar migração na Sprint 11

---

## 📊 IMPACTO NAS SPRINTS

| Sprint | Antes | Depois | Mudança |
|--------|-------|--------|---------|
| Sprint 2 | User com auth | User básico (sem senha) | ✅ Simplificado |
| Sprint 3-10 | Assumia auth | Aberto (mock) | ✅ Simplificado |
| Sprint 11 | Só segurança | **Auth completa + migração** | ⚠️ Expandida |
| Sprint 12 | Hardening | **Segurança avançada + deploy** | ⚠️ Detalhada |

---

## 🎓 LIÇÕES APRENDIDAS

1. **Ler especificação completamente** antes de planejar
2. **Seguir diretrizes do cliente** (Estrutura_Projeto.txt era claro)
3. **Autenticação pode ser adicionada depois** (não precisa ser desde o início)
4. **Desenvolvimento iterativo** permite focar em uma coisa de cada vez

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Documentação atualizada:
- [x] `ROADMAP_SPRINTS.md` atualizado
- [x] Sprint 2 marcada como "ABERTO"
- [x] Sprint 11 expandida (autenticação)
- [x] Sprint 12 expandida (segurança)
- [x] Resumo do cronograma com coluna "Autenticação"
- [x] `SPRINT_FRONTEND_KANBAN.md` revisado
- [x] TODO list atualizada
- [x] Este documento criado ✅

### Próximos passos:
- [ ] Testar dashboard em http://localhost:3001
- [ ] Criar tipos TypeScript
- [ ] Criar API client (SEM auth)
- [ ] Continuar desenvolvimento sem se preocupar com login

---

**Documento criado por:** GitHub Copilot  
**Revisado em:** 20/10/2025 - 18:50  
**Status:** ✅ Pronto para desenvolvimento

