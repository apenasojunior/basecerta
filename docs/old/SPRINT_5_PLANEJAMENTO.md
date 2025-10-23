# 🚀 SPRINT 5 - Backend Integration & Authentication

**Branch:** beta002  
**Release Target:** v0.5.0  
**Duração Estimada:** 2-3 dias  
**Status:** 🔄 Em Planejamento

---

## 🎯 Objetivos do Sprint

Integrar o frontend desenvolvido nos Sprints anteriores com o backend FastAPI, implementar autenticação completa e estabelecer comunicação segura entre as camadas da aplicação.

---

## 📋 Backlog - Issues Planejadas

### FASE 1: Autenticação e Autorização (~4-5h)

#### Issue 5.1 - Sistema de Login/Logout ⏳
**Prioridade:** 🔴 Alta  
**Estimativa:** ~1.5h  
**Dependências:** Backend Auth endpoints

**Tarefas:**
- [ ] Criar página `/login` com formulário
  - Email/username + senha
  - "Lembrar-me" checkbox
  - Link "Esqueci senha"
  - Validação client-side
- [ ] Criar `/logout` handler
- [ ] Hook `useAuth()` para gerenciar autenticação
  - Login/logout functions
  - Token management
  - User state
- [ ] Integrar com backend `/api/v1/auth/login`
- [ ] Armazenar JWT em httpOnly cookie ou localStorage
- [ ] Redirect após login para `/dashboard`
- [ ] Protected routes com middleware
- [ ] Toast notifications de feedback

**Critérios de Aceitação:**
- Login funcional com backend
- Token JWT persistido
- Logout limpa sessão
- Rotas protegidas redirecionam para login

---

#### Issue 5.2 - Sistema de Registro ⏳
**Prioridade:** 🔴 Alta  
**Estimativa:** ~1h  
**Dependências:** Backend User creation endpoint

**Tarefas:**
- [ ] Criar página `/registro`
  - Nome completo
  - Email
  - Senha + confirmação
  - Termos de uso checkbox
  - Validação de senha forte
- [ ] Integrar com `/api/v1/users/`
- [ ] Validação de email único
- [ ] Feedback de erros (email já existe, senha fraca)
- [ ] Redirect para `/dashboard` após registro
- [ ] Email de confirmação (opcional - backend)

**Critérios de Aceitação:**
- Registro cria usuário no backend
- Validações funcionando
- Auto-login após registro
- Feedback claro de erros

---

#### Issue 5.3 - Recuperação de Senha ⏳
**Prioridade:** 🟡 Média  
**Estimativa:** ~1.5h  
**Dependências:** Backend Password reset endpoints

**Tarefas:**
- [ ] Criar página `/esqueci-senha`
  - Input de email
  - Envio de link de reset
- [ ] Criar página `/reset-senha/:token`
  - Nova senha + confirmação
  - Validação de token
- [ ] Integrar com backend endpoints
- [ ] Toast de confirmação "Email enviado"
- [ ] Expiração de token (backend)
- [ ] Redirect para login após reset

**Critérios de Aceitação:**
- Email de reset enviado
- Link funciona por tempo limitado
- Senha alterada com sucesso
- Feedback adequado em cada etapa

---

#### Issue 5.4 - Middleware de Autenticação ⏳
**Prioridade:** 🔴 Alta  
**Estimativa:** ~1h  
**Dependências:** Issues 5.1, 5.2

**Tarefas:**
- [ ] Criar middleware `withAuth()`
  - Verifica token JWT válido
  - Refresh token automático (se disponível)
  - Redirect para /login se inválido
- [ ] Proteger rotas:
  - `/dashboard`
  - `/favoritos`
  - `/historico`
  - `/produtos/*`
  - `/configuracoes/*`
- [ ] Header com informações do usuário
  - Avatar/iniciais
  - Nome
  - Dropdown com logout
- [ ] Loading state durante verificação
- [ ] Handle token expiration gracefully

**Critérios de Aceitação:**
- Rotas protegidas inacessíveis sem login
- Token refresh automático
- UX suave (sem flashes)
- Logout funcional em todas as páginas

---

### FASE 2: Integração com APIs de Produtos (~3-4h)

#### Issue 5.5 - Integrar API de Dados Cadastrais PF ⏳
**Prioridade:** 🔴 Alta  
**Estimativa:** ~1h  
**Dependências:** Backend endpoints `/api/v1/persons/*`

**Tarefas:**
- [ ] Conectar `usePersonSearch` com backend real
- [ ] Implementar queries com React Query
  - Cache de 5 minutos
  - Retry logic (3x)
  - Loading/Error states
- [ ] Integrar filtros avançados
- [ ] Paginação server-side
- [ ] Tratar erros 404, 500, etc
- [ ] Loading skeletons na tabela
- [ ] Dedução de créditos após consulta
- [ ] Adicionar ao histórico automaticamente

**Critérios de Aceitação:**
- Busca retorna dados reais do backend
- Filtros funcionando
- Paginação operacional
- Créditos deduzidos corretamente
- Histórico atualizado automaticamente

---

#### Issue 5.6 - Integrar API de Dados Cadastrais PJ ⏳
**Prioridade:** 🔴 Alta  
**Estimativa:** ~1h  
**Dependências:** Backend endpoints `/api/v1/companies/*`

**Tarefas:**
- [ ] Conectar `useCompanySearch` com backend real
- [ ] Implementar queries com React Query
- [ ] Integrar filtros (situação, porte, UF)
- [ ] Paginação server-side
- [ ] Loading/Error states
- [ ] Dedução de créditos
- [ ] Adicionar ao histórico

**Critérios de Aceitação:**
- Busca CNPJ retorna dados reais
- Filtros funcionando
- Créditos deduzidos
- Histórico atualizado

---

#### Issue 5.7 - Integrar API de Dossiê Financeiro ⏳
**Prioridade:** 🔴 Alta  
**Estimativa:** ~1.5h  
**Dependências:** Backend endpoints `/api/v1/financial/*`

**Tarefas:**
- [ ] Conectar `useFinancialDossie` com backend
- [ ] Queries para:
  - Protestos
  - Dívidas
  - Score de crédito
- [ ] Loading states por seção
- [ ] Error handling específico
- [ ] Dedução de créditos (15 por dossiê)
- [ ] Adicionar ao histórico
- [ ] Exportação integrada com dados reais

**Critérios de Aceitação:**
- Dossiê carrega dados reais
- Cada seção com loading individual
- Erros tratados apropriadamente
- Créditos deduzidos (15)
- Exportação funcionando

---

#### Issue 5.8 - Sistema de Créditos em Tempo Real ⏳
**Prioridade:** 🟡 Média  
**Estimativa:** ~0.5h  
**Dependências:** Backend credits endpoint

**Tarefas:**
- [ ] Integrar `useCredits` com `/api/v1/credits/:userId/balance`
- [ ] Header mostrando saldo atualizado
- [ ] Warning quando créditos < 10
- [ ] Bloqueio de consultas quando créditos = 0
- [ ] Modal "Créditos insuficientes" com link para compra
- [ ] Atualização automática após consultas

**Critérios de Aceitação:**
- Saldo sempre atualizado
- Warnings funcionando
- Bloqueio quando sem créditos
- UX clara

---

### FASE 3: Persistência e Sincronização (~2-3h)

#### Issue 5.9 - Sincronizar Favoritos com Backend ⏳
**Prioridade:** 🟡 Média  
**Estimativa:** ~1h  
**Dependências:** Backend favoritos endpoint

**Tarefas:**
- [ ] Criar endpoint `/api/v1/favorites/` no backend (se não existir)
- [ ] Migrar de localStorage para API
- [ ] Sincronização bidirecional:
  - Pull ao login
  - Push ao adicionar/remover
- [ ] Merge inteligente (localStorage + backend)
- [ ] Limite de 50 mantido no backend
- [ ] Loading states durante sync
- [ ] Fallback para localStorage offline

**Critérios de Aceitação:**
- Favoritos persistem entre dispositivos
- Sync automático ao login
- Funciona offline (localStorage)
- Merge sem duplicatas

---

#### Issue 5.10 - Sincronizar Histórico com Backend ⏳
**Prioridade:** 🟢 Baixa  
**Estimativa:** ~1h  
**Dependências:** Backend histórico endpoint

**Tarefas:**
- [ ] Criar endpoint `/api/v1/history/` no backend
- [ ] Migrar de localStorage para API
- [ ] Auto-save após cada consulta
- [ ] Paginação para histórico grande (>20)
- [ ] Filtros server-side
- [ ] Limite no backend (ex: últimos 100)
- [ ] Fallback para localStorage

**Critérios de Aceitação:**
- Histórico persiste entre sessões
- Auto-save funcionando
- Paginação operacional
- Funciona offline

---

#### Issue 5.11 - Settings e Preferências do Usuário ⏳
**Prioridade:** 🟢 Baixa  
**Estimativa:** ~1h  
**Dependências:** Backend user settings endpoint

**Tarefas:**
- [ ] Criar página `/configuracoes/perfil`
  - Editar nome
  - Editar email
  - Alterar senha
  - Avatar upload (opcional)
- [ ] Criar página `/configuracoes/preferencias`
  - Dark/Light mode
  - Idioma (pt-BR default)
  - Notificações
  - Formato de data
- [ ] Salvar no backend
- [ ] Apply preferences em toda app
- [ ] Toast de confirmação

**Critérios de Aceitação:**
- Perfil editável
- Preferências salvas
- Aplicadas globalmente
- Feedback adequado

---

### FASE 4: Melhorias e Polish (~2-3h)

#### Issue 5.12 - Loading States e Skeletons ⏳
**Prioridade:** 🟡 Média  
**Estimativa:** ~1h  

**Tarefas:**
- [ ] Criar componentes Skeleton para:
  - Tabelas (PersonTable, CompanyTable, etc)
  - Cards (Stats, Favorites, History)
  - Forms (Search forms)
- [ ] Implementar em todas as páginas
- [ ] Loading spinners consistentes
- [ ] Progress bars para operações longas
- [ ] Skeleton screens com animação

**Critérios de Aceitação:**
- Todos os loading states cobertos
- UX suave sem telas brancas
- Animações sutis

---

#### Issue 5.13 - Error Handling Global ⏳
**Prioridade:** 🟡 Média  
**Estimativa:** ~1h  

**Tarefas:**
- [ ] Criar Error Boundary React
- [ ] Página `/erro` customizada
- [ ] Toast para erros de API
- [ ] Retry automático (3x com backoff)
- [ ] Logs para Sentry/similar (opcional)
- [ ] Mensagens de erro amigáveis:
  - 401: "Sessão expirada, faça login"
  - 403: "Sem permissão"
  - 404: "Não encontrado"
  - 500: "Erro no servidor, tente novamente"
  - Network: "Sem conexão com internet"

**Critérios de Aceitação:**
- Erros nunca quebram a aplicação
- Mensagens claras para usuário
- Retry automático quando apropriado
- Logs para debug

---

#### Issue 5.14 - Performance Optimization ⏳
**Prioridade:** 🟢 Baixa  
**Estimativa:** ~1h  

**Tarefas:**
- [ ] Code splitting por rota
- [ ] Lazy loading de componentes pesados
- [ ] Image optimization (Next.js Image)
- [ ] Cache strategies no React Query:
  - staleTime: 5min para dados estáticos
  - cacheTime: 10min
  - refetchOnWindowFocus: false (onde apropriado)
- [ ] Debounce em search inputs (500ms)
- [ ] Virtual scrolling em tabelas grandes
- [ ] Lighthouse audit e melhorias

**Critérios de Aceitação:**
- Lighthouse Score > 90
- Tempo de carregamento < 2s
- Smooth scrolling
- Sem re-renders desnecessários

---

## 📦 Dependências Técnicas

### Backend Endpoints Necessários

**Autenticação:**
- `POST /api/v1/auth/login` - Login com email/senha
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Solicitar reset
- `POST /api/v1/auth/reset-password` - Resetar senha

**Usuários:**
- `POST /api/v1/users/` - Criar usuário (registro)
- `GET /api/v1/users/me` - Dados do usuário logado
- `PATCH /api/v1/users/me` - Atualizar perfil
- `PUT /api/v1/users/me/password` - Alterar senha

**Créditos:**
- `GET /api/v1/credits/:userId/balance` - Saldo atual
- `POST /api/v1/credits/:userId/deduct` - Deduzir créditos
- `GET /api/v1/credits/:userId/history` - Histórico de transações

**Produtos (já existentes, verificar):**
- `GET /api/v1/persons/search` - Buscar PF
- `GET /api/v1/companies/search` - Buscar PJ
- `GET /api/v1/financial/dossier` - Dossiê financeiro

**Favoritos (novo):**
- `GET /api/v1/favorites/` - Listar favoritos
- `POST /api/v1/favorites/` - Adicionar favorito
- `DELETE /api/v1/favorites/:id` - Remover favorito

**Histórico (novo):**
- `GET /api/v1/history/` - Listar histórico
- `POST /api/v1/history/` - Adicionar ao histórico

**Settings (novo):**
- `GET /api/v1/settings/` - Preferências do usuário
- `PATCH /api/v1/settings/` - Atualizar preferências

---

## 🛠️ Stack Técnico

### Frontend
- **Auth:** JWT tokens + httpOnly cookies
- **State Management:** React Query + Context API
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios com interceptors
- **Loading:** React Query + Custom skeletons
- **Error Handling:** Error Boundary + Toast

### Backend (FastAPI)
- **Auth:** OAuth2 + JWT (já implementado)
- **Database:** PostgreSQL + Alembic
- **Cache:** Redis (sessões, rate limiting)
- **Validation:** Pydantic models

---

## 📊 Métricas de Sucesso

| Métrica | Meta | Status |
|---------|------|--------|
| Issues Completas | 14/14 | ⏳ 0% |
| Endpoints Integrados | 15+ | ⏳ |
| Auth Flow Completo | 100% | ⏳ |
| Rotas Protegidas | 100% | ⏳ |
| Loading States | 100% | ⏳ |
| Error Handling | 100% | ⏳ |
| Lighthouse Score | >90 | ⏳ |
| Build Errors | 0 | ⏳ |

---

## 🎯 Ordem de Execução Sugerida

### Dia 1: Autenticação Base
1. Issue 5.1 - Login/Logout (1.5h)
2. Issue 5.2 - Registro (1h)
3. Issue 5.4 - Middleware (1h)
4. Issue 5.8 - Créditos (0.5h)

**Total Dia 1:** ~4h

### Dia 2: Integração de Produtos
5. Issue 5.5 - API Dados PF (1h)
6. Issue 5.6 - API Dados PJ (1h)
7. Issue 5.7 - API Dossiê (1.5h)
8. Issue 5.3 - Recuperação de Senha (1.5h)

**Total Dia 2:** ~5h

### Dia 3: Persistência e Polish
9. Issue 5.9 - Sync Favoritos (1h)
10. Issue 5.10 - Sync Histórico (1h)
11. Issue 5.12 - Loading States (1h)
12. Issue 5.13 - Error Handling (1h)
13. Issue 5.11 - Settings (1h) - opcional
14. Issue 5.14 - Performance (1h) - opcional

**Total Dia 3:** ~4-6h

---

## 🚧 Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Backend endpoints não prontos | Alto | Média | Mock data + adapters para fácil troca |
| Token expiration issues | Médio | Baixa | Refresh token automático |
| CORS problems | Alto | Média | Configurar CORS no backend FastAPI |
| Performance com dados reais | Médio | Média | Cache agressivo + paginação |
| Bugs de autenticação | Alto | Baixa | Testes extensivos + error handling robusto |

---

## 📝 Notas de Desenvolvimento

### Estrutura de Pastas Sugerida

```
frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   ├── esqueci-senha/page.tsx
│   │   └── reset-senha/[token]/page.tsx
│   │
│   ├── configuracoes/
│   │   ├── perfil/page.tsx
│   │   └── preferencias/page.tsx
│   │
│   └── erro/page.tsx
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── layout/
│   │   ├── AuthHeader.tsx (com user dropdown)
│   │   └── UserMenu.tsx
│   │
│   └── skeletons/
│       ├── TableSkeleton.tsx
│       ├── CardSkeleton.tsx
│       └── FormSkeleton.tsx
│
├── hooks/
│   ├── useAuth.ts (login, logout, user)
│   ├── useProtectedRoute.ts
│   └── useApiClient.ts (axios com interceptors)
│
├── lib/
│   ├── api/
│   │   ├── client.ts (axios instance)
│   │   ├── auth.ts (auth endpoints)
│   │   └── interceptors.ts (token, errors)
│   │
│   └── utils/
│       ├── token.ts (get, set, remove, validate)
│       └── error-messages.ts
│
├── contexts/
│   └── AuthContext.tsx
│
└── middleware.ts (Next.js 14 middleware)
```

---

## 🎯 Critérios de Conclusão do Sprint

- [ ] Todas as 14 issues completas
- [ ] Auth flow 100% funcional
- [ ] Todas as APIs de produtos integradas
- [ ] Créditos deduzindo corretamente
- [ ] Favoritos e histórico sincronizados
- [ ] 0 erros de build
- [ ] 0 erros de tipos TypeScript
- [ ] Loading states em todas as páginas
- [ ] Error handling robusto
- [ ] Documentação atualizada
- [ ] Testes manuais completos
- [ ] Deploy em staging bem-sucedido

---

## 📚 Recursos e Referências

- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [JWT Best Practices](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)
- [FastAPI OAuth2](https://fastapi.tiangolo.com/tutorial/security/)
- [Error Handling in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**Status:** 🔄 Pronto para iniciar  
**Próxima Ação:** Começar Issue 5.1 - Sistema de Login/Logout  
**Branch Atual:** beta002  
**Data de Início Prevista:** 20/10/2025
