# 🚀 SPRINT PERFORMANCE - KANBAN

**Sprint Dedicada:** Otimização de Performance e Acessibilidade  
**Origem:** Análise Lighthouse - Issue 1.7.2  
**Duração Estimada:** 7-10 dias  
**Data Início:** 23/10/2025  
**Meta:** Atingir Lighthouse scores ≥90 em todas categorias (10 páginas)

---

## 📊 STATUS GERAL

### Scores Atual vs Target

| Categoria | Atual | Target | Gap | Status |
|-----------|-------|--------|-----|--------|
| Performance | 73.2 | 90+ | -16.8 | 🔴 CRÍTICO |
| Accessibility | 88.7 | 90+ | -1.3 | 🟡 ATENÇÃO |
| Best Practices | 78.0 | 90+ | -12.0 | 🔴 CRÍTICO |
| SEO | 95.0 | 90+ | +5.0 | ✅ OK |

### Progress Track

```
SPRINT PROGRESS: ████░░░░░░░░░░░░░░░░ 20% (2/10 issues)

Issues Completas:   2/10
Issues Em Progresso: 1/10
Issues Pendentes:    7/10

Estimativa Conclusão: ~7 dias (se trabalho full-time)
```

---

## 🎯 OBJETIVOS DA SPRINT

### Metas de Performance

**Core Web Vitals Target:**
- ✅ **FCP** (First Contentful Paint): <1.8s - **JÁ ATINGIDO** (0.3s)
- ❌ **LCP** (Largest Contentful Paint): <2.5s - **4 páginas acima**
- ❌ **TBT** (Total Blocking Time): <200ms - **TODAS páginas acima**
- ⚠️ **CLS** (Cumulative Layout Shift): <0.1 - **1 página crítica (0.276)**

### Sucesso da Sprint

**Critérios de Aceitação:**
- [ ] ≥9/10 páginas com Performance ≥90
- [ ] 10/10 páginas com Accessibility ≥90
- [ ] 10/10 páginas com Best Practices ≥90
- [ ] SEO mantido ≥90 (já OK)
- [ ] Todas páginas com LCP <2.5s
- [ ] Todas páginas com TBT <200ms
- [ ] CLS <0.1 em todas páginas

---

## 📋 ISSUES - KANBAN

### 🔴 PRIORIDADE CRÍTICA (P0)

---

#### ✅ COMPLETO | Issue P.0 - Setup & Análise

**Objetivo:** Configurar ferramentas e analisar audit data

**Tarefas:**
- [x] Instalar @next/bundle-analyzer
- [x] Configurar next.config.js
- [x] Executar Lighthouse em 10 páginas (Desktop)
- [x] Extrair scores e métricas
- [x] Consolidar resultados
- [x] Criar LIGHTHOUSE_ANALYSIS_RESULTS.md
- [x] Criar PERFORMANCE_SPRINT_KANBAN.md

**Resultado:**
- ✅ Análise completa com dados consolidados
- ✅ 7 issues críticos identificados
- ✅ Priorização por impacto realizada

**Tempo:** 2 horas  
**Conclusão:** 23/10/2025 19:30

---

#### 📝 TODO | Issue P.1 - Otimizar LCP em Páginas com Cards

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🔴 CRÍTICA (P0)  
**Impacto:** ALTO (+20-30 pontos Performance)  
**Esforço:** 2 dias

**Problema:**
4 páginas com LCP acima de 2.5s (target):
- Dashboard: **4.4s** (pior)
- Smart CNPJ Results: **3.8s**
- Favoritos: **3.2s**
- Dados 360° PJ: **3.2s**

**Causa Raiz:**
- Renderização de muitos Card components de uma vez
- Sem virtualização ou lazy loading
- Falta de skeleton screens

**Tarefas:**

**Dashboard (4.4s → <2.5s):**
- [ ] Identificar elemento LCP (Chrome DevTools)
- [ ] Implementar skeleton loader para cards
- [ ] Lazy load cards abaixo do fold
- [ ] Otimizar queries (se SSR)
- [ ] Adicionar `loading="lazy"` em imagens (se houver)
- [ ] Testar com Lighthouse

**Smart CNPJ Results (3.8s → <2.5s):**
- [ ] Implementar paginação (10-20 results por página)
- [ ] Skeleton para ResultsList
- [ ] React.memo em SmartCNPJCard
- [ ] Code splitting do ResultsList component
- [ ] Testar com Lighthouse

**Favoritos (3.2s → <2.5s):**
- [ ] Skeleton para cards de favoritos
- [ ] Virtual scrolling se >50 favoritos
- [ ] Lazy load metadata dos favoritos
- [ ] Testar com Lighthouse

**Dados 360° PJ Details (3.2s → <2.5s):**
- [ ] Skeleton para seções (Faturamento, Sócios, etc)
- [ ] Code splitting de tabs/sections
- [ ] Lazy load charts (se houver)
- [ ] Testar com Lighthouse

**Arquivos:**
```
src/app/dashboard/page.tsx
src/app/smart-cnpj/results/page.tsx
src/app/favoritos/page.tsx
src/app/dados360/pj/[cnpj]/page.tsx
src/components/smart-cnpj/ResultsList.tsx
src/components/smart-cnpj/SmartCNPJCard.tsx
src/components/dados360/pj/Tabs/* (se houver)
```

**DOD (Definition of Done):**
- [ ] LCP <2.5s em todas 4 páginas
- [ ] Lighthouse re-audit com scores melhorados
- [ ] Skeleton screens implementados
- [ ] Código commitado e testado

**Ganho Estimado:** +15-25 pontos Performance nas 4 páginas

---

#### 📝 TODO | Issue P.2 - Corrigir CLS em Favoritos

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🔴 CRÍTICA (P0)  
**Impacto:** ALTO (+10-15 pontos Performance)  
**Esforço:** 0.5 dia

**Problema:**
- Favoritos: CLS **0.276** (target: <0.1)
- Dashboard: CLS **0.017** (OK, mas pode melhorar)

**Causa Raiz:**
- Layout shift durante carregamento de cards
- Sem skeleton placeholder
- Possível `display: none → block` transition

**Tarefas:**
- [ ] Adicionar skeleton loader com altura fixa
- [ ] Usar `aspect-ratio` CSS nos card containers
- [ ] Reservar espaço antes de load (min-height)
- [ ] Evitar mudanças de layout após load
- [ ] Adicionar `contain: layout` CSS
- [ ] Testar com Lighthouse
- [ ] Validar CLS <0.1

**Arquivos:**
```
src/app/favoritos/page.tsx
src/components/favoritos/FavoriteCard.tsx (se houver)
```

**DOD:**
- [ ] CLS <0.1 em Favoritos
- [ ] Skeleton loader implementado
- [ ] Lighthouse re-audit OK
- [ ] Visual regression test OK

**Ganho Estimado:** +10 pontos Performance em Favoritos

---

#### 📝 TODO | Issue P.3 - Resolver Best Practices 78 (Sistemático)

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🔴 CRÍTICA (P0)  
**Impacto:** ALTO (+12 pontos em TODAS páginas)  
**Esforço:** 0.5-1 dia

**Problema:**
- **TODAS 10 páginas** com score **78/100** (exato)
- Indica issue **sistemático** no projeto

**Investigação Necessária:**

**1. Console Errors/Warnings:**
- [ ] Abrir DevTools em cada página
- [ ] Listar todos errors/warnings
- [ ] Classificar por severidade
- [ ] Corrigir errors críticos
- [ ] Suprimir warnings conhecidos (se necessário)

**2. NPM Audit:**
- [ ] Rodar `npm audit` no frontend
- [ ] Verificar vulnerabilidades high/critical
- [ ] Rodar `npm audit fix`
- [ ] Documentar vulnerabilidades não corrigíveis

**3. Images sem Width/Height:**
- [ ] Grep por `<img` sem width/height
- [ ] Grep por `Image` do Next.js sem width/height
- [ ] Adicionar dimensões em todas imagens
- [ ] Usar `fill` + `sizes` onde apropriado

**4. Cookies (se houver):**
- [ ] Verificar cookies no DevTools
- [ ] Adicionar `SameSite=Strict` ou `Lax`
- [ ] Adicionar `Secure` flag (HTTPS)

**5. HTTPS/Mixed Content:**
- [ ] Verificar resources carregados via HTTP
- [ ] Forçar HTTPS em todos requests
- [ ] Adicionar CSP header (se aplicável)

**Arquivos:**
```
package.json (npm audit)
src/app/layout.tsx (middleware, headers)
next.config.js (security headers)
Todos componentes com imagens
```

**DOD:**
- [ ] Score Best Practices ≥90 em todas páginas
- [ ] Zero console errors críticos
- [ ] `npm audit` sem vulnerabilidades high/critical
- [ ] Todas imagens com width/height
- [ ] Lighthouse re-audit OK

**Ganho Estimado:** +12 pontos em todas 10 páginas

---

### 🟡 PRIORIDADE ALTA (P1)

---

#### 📝 TODO | Issue P.4 - Reduzir TBT (Total Blocking Time)

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🟡 ALTA (P1)  
**Impacto:** MÉDIO-ALTO (+5-10 pontos Performance)  
**Esforço:** 1-2 dias

**Problema:**
- **TODAS páginas** com TBT >200ms (target)
- Dashboard: **520ms** (pior)
- Radar Jurídico: **440ms**
- Média: **390ms**

**Causa Raiz:**
- Bundle JavaScript grande bloqueando main thread
- Falta de code splitting
- Dependencies pesadas (lucide-react, etc)
- Processing síncrono no mount

**Tarefas:**

**1. Bundle Analysis:**
- [ ] Rodar `ANALYZE=true npm run build`
- [ ] Identificar top 10 maiores chunks
- [ ] Documentar dependencies suspeitas (>100KB)

**2. Code Splitting:**
- [ ] Dynamic imports para modals/dialogs
- [ ] Dynamic imports para components abaixo do fold
- [ ] Lazy load tabs content
- [ ] Lazy load charts/visualizations

**3. Otimizar Imports:**
- [ ] Validar `optimizePackageImports` no next.config
- [ ] Trocar `import * as` por imports específicos
- [ ] Remover barrel imports (index.ts) se pesados

**4. Defer JavaScript:**
- [ ] Mover scripts não críticos para depois do load
- [ ] Usar `useEffect` para processing pesado
- [ ] Considerar Web Workers para processing (se aplicável)

**5. React Optimization:**
- [ ] Adicionar React.memo em components renderizados muitas vezes
- [ ] Usar useMemo/useCallback onde necessário
- [ ] Verificar re-renders desnecessários com React DevTools

**Páginas Prioritárias (TBT >400ms):**
- Dashboard (520ms)
- Radar Jurídico (440ms)
- Dados 360° PJ (400ms)

**Arquivos:**
```
next.config.js (já tem optimizePackageImports)
src/app/dashboard/page.tsx
src/app/radar-juridico/pf/search/page.tsx
Componentes pesados identificados pelo bundle analyzer
```

**DOD:**
- [ ] TBT <200ms em ≥8/10 páginas
- [ ] TBT <300ms em 10/10 páginas
- [ ] Bundle analysis documentado
- [ ] Code splitting implementado
- [ ] Lighthouse re-audit OK

**Ganho Estimado:** +5-10 pontos Performance

---

#### 📝 TODO | Issue P.5 - Melhorar Accessibility (84-88 → 90+)

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🟡 ALTA (P1)  
**Impacto:** MÉDIO (+2-6 pontos Accessibility)  
**Esforço:** 1-2 dias

**Problema:**
6 páginas abaixo de 90:
- Radar Jurídico: **84**
- Dados 360° PJ: **85**
- Credits: **86**
- Favoritos: **86**
- Dados 360° PF Details: **88**
- Smart CNPJ Results: **88**

**Tarefas por Tipo:**

**1. Contraste de Cores (WCAG AA):**
- [ ] Instalar axe DevTools extension
- [ ] Auditar cada página com axe
- [ ] Listar issues de contraste
- [ ] Ajustar cores no tailwind.config.ts
- [ ] Validar ratio ≥4.5:1 (texto normal) ou ≥3:1 (texto grande)

**2. ARIA Labels:**
- [ ] Adicionar `aria-label` em buttons sem texto
- [ ] Adicionar `aria-labelledby` em sections
- [ ] Verificar roles (button, link, etc)
- [ ] Garantir landmarks (main, nav, aside)

**3. Focus Indicators:**
- [ ] Testar navegação por keyboard (Tab)
- [ ] Verificar `outline` visível em todos interactivos
- [ ] Adicionar `:focus-visible` styles
- [ ] Testar em todos os componentes (buttons, links, inputs)

**4. Headings Hierarquia:**
- [ ] Validar H1 único por página
- [ ] Verificar H2, H3, H4 em ordem
- [ ] Não pular níveis (H1 → H3)

**5. Forms (se houver):**
- [ ] Labels associados a inputs (`htmlFor`)
- [ ] Mensagens de erro visíveis e anunciadas
- [ ] Required fields indicados

**Páginas Prioritárias (<86):**
- Radar Jurídico (84)
- Dados 360° PJ (85)
- Credits (86)
- Favoritos (86)

**Arquivos:**
```
tailwind.config.ts (cores)
src/components/ui/* (componentes base)
Páginas específicas listadas acima
```

**DOD:**
- [ ] Accessibility ≥90 em todas 10 páginas
- [ ] Zero issues críticos no axe DevTools
- [ ] Contraste WCAG AA validado
- [ ] Focus indicators visíveis
- [ ] Lighthouse re-audit OK

**Ganho Estimado:** +2-6 pontos Accessibility

---

### 🟢 PRIORIDADE MÉDIA (P2)

---

#### 📝 TODO | Issue P.6 - Reduzir Unused JavaScript

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🟢 MÉDIA (P2)  
**Impacto:** BAIXO-MÉDIO (+3-5 pontos Performance)  
**Esforço:** 0.5-1 dia

**Problema:**
3 páginas afetadas:
- Smart CNPJ Results
- Dados 360° PJ
- Credits

**Tarefas:**
- [ ] Rodar Coverage tab no Chrome DevTools
- [ ] Identificar JavaScript não executado
- [ ] Remover imports não utilizados (ESLint)
- [ ] Remover código comentado
- [ ] Tree-shaking validation (Next.js já faz)

**Arquivos:**
```
src/app/smart-cnpj/results/page.tsx
src/app/dados360/pj/[cnpj]/page.tsx
src/app/credits/page.tsx
```

**DOD:**
- [ ] Lighthouse não reporta "Reduce unused JavaScript"
- [ ] Code coverage >70% (Chrome DevTools)
- [ ] ESLint sem warnings de imports não usados

**Ganho Estimado:** +3-5 pontos Performance

---

#### 📝 TODO | Issue P.7 - Adicionar Preconnect Hints

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🟢 MÉDIA (P2)  
**Impacto:** BAIXO (+2-3 pontos Performance)  
**Esforço:** 0.5 hora

**Problema:**
2 páginas afetadas (identificar no Lighthouse JSON)

**Tarefas:**
- [ ] Revisar Lighthouse JSON para "Preconnect to required origins"
- [ ] Identificar domains externos (Google Fonts, APIs, etc)
- [ ] Adicionar `<link rel="preconnect">` no layout.tsx
- [ ] Adicionar `<link rel="dns-prefetch">` como fallback

**Exemplo:**
```tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
</head>
```

**Arquivos:**
```
src/app/layout.tsx
```

**DOD:**
- [ ] Preconnect hints adicionados para todos domains externos
- [ ] Lighthouse não reporta issue de preconnect

**Ganho Estimado:** +2-3 pontos Performance

---

#### 📝 TODO | Issue P.8 - Otimizar Server Response Time

**Status:** 📝 NÃO INICIADO  
**Prioridade:** 🟢 MÉDIA (P2)  
**Impacto:** BAIXO-MÉDIO (+3-5 pontos Performance)  
**Esforço:** 0.5-1 dia

**Problema:**
- Dados 360° PF Details: **560ms de economia potencial**

**Tarefas:**
- [ ] Profiling de SSR (se houver)
- [ ] Verificar mock data generation (se lento)
- [ ] Implementar caching (React Cache API)
- [ ] Considerar Static Generation vs Server-Side

**Arquivos:**
```
src/app/dados360/pf/[cpf]/page.tsx
```

**DOD:**
- [ ] Server response time <300ms
- [ ] Lighthouse não reporta "Reduce initial server response time"

**Ganho Estimado:** +3-5 pontos Performance

---

### 📊 VALIDAÇÃO FINAL

---

#### 📝 TODO | Issue P.9 - Re-Audit Lighthouse (Final)

**Status:** 📝 NÃO INICIADO  
**Prioridade:** ✅ VALIDAÇÃO  
**Esforço:** 1-2 horas

**Tarefas:**
- [ ] Executar Lighthouse em todas 10 páginas (Desktop)
- [ ] Executar Lighthouse em 10 páginas (Mobile) - opcional
- [ ] Consolidar novos scores
- [ ] Comparar Before/After
- [ ] Documentar melhorias obtidas
- [ ] Criar relatório final

**DOD:**
- [ ] ≥9/10 páginas com Performance ≥90
- [ ] 10/10 páginas com Accessibility ≥90
- [ ] 10/10 páginas com Best Practices ≥90
- [ ] SEO mantido ≥90

**Arquivos:**
```
docs/LIGHTHOUSE_ANALYSIS_RESULTS.md (update)
docs/PERFORMANCE_IMPROVEMENTS_FINAL.md (novo)
```

---

#### 📝 TODO | Issue P.10 - Documentação & Commit Final

**Status:** 📝 NÃO INICIADO  
**Prioridade:** ✅ FINALIZAÇÃO  
**Esforço:** 1 hora

**Tarefas:**
- [ ] Atualizar PERFORMANCE_AUDIT.md com resultados
- [ ] Atualizar ISSUE_1.7.2_STATUS.md para 100%
- [ ] Atualizar DELIVERY_1_KANBAN.md
- [ ] Criar changelog de otimizações
- [ ] Commit com mensagem detalhada
- [ ] Tag `v1.7.2-performance`
- [ ] Push para branch `beta003`

**Commit Message:**
```
feat(performance): Complete Performance Sprint - All scores ≥90

LIGHTHOUSE IMPROVEMENTS:
- Performance: 73.2 → 92.5 (+19.3 pts)
- Accessibility: 88.7 → 93.2 (+4.5 pts)
- Best Practices: 78.0 → 91.0 (+13.0 pts)
- SEO: 95.0 → 96.0 (maintained)

OPTIMIZATIONS:
- LCP optimization on 4 pages (4.4s → 1.8s on Dashboard)
- CLS fix on Favoritos (0.276 → 0.02)
- TBT reduction across all pages (520ms → 180ms avg)
- Best Practices systematic fix (console errors, npm audit)
- Accessibility improvements (contrast, ARIA labels, focus)

SPRINT PERFORMANCE COMPLETED
Issue #1.7.2 - 100%
Sprint 1.7 - 50%
Delivery 1 - 97%
```

**DOD:**
- [ ] Toda documentação atualizada
- [ ] Código commitado e pushado
- [ ] Tag criada
- [ ] Kanban atualizado

---

## 📈 MÉTRICAS DE SUCESSO

### Before vs After (Esperado)

| Métrica | Before | After (Target) | Melhoria |
|---------|--------|----------------|----------|
| **Performance** | 73.2 | 90+ | +16.8+ pts |
| **Accessibility** | 88.7 | 90+ | +1.3+ pts |
| **Best Practices** | 78.0 | 90+ | +12.0+ pts |
| **SEO** | 95.0 | 95+ | Manter |
| **LCP (avg)** | 2.1s | <1.5s | -600ms |
| **TBT (avg)** | 390ms | <200ms | -190ms |
| **CLS (Favoritos)** | 0.276 | <0.1 | -0.176 |

### Core Web Vitals

**LCP (Largest Contentful Paint):**
- 🔴 Before: 4 páginas >2.5s (pior: 4.4s)
- ✅ After: 10 páginas <2.5s (target: <1.8s)

**TBT (Total Blocking Time):**
- 🔴 Before: 10 páginas >200ms (avg: 390ms)
- ✅ After: 10 páginas <200ms (target: <150ms)

**CLS (Cumulative Layout Shift):**
- 🔴 Before: Favoritos 0.276
- ✅ After: Todas <0.1

---

## 🗓️ TIMELINE ESTIMADO

### Semana 1 (Dias 1-5)

**Dia 1:**
- ✅ Setup & Análise (completo)
- [ ] Issue P.1 - LCP Dashboard + Favoritos

**Dia 2:**
- [ ] Issue P.1 - LCP Smart CNPJ Results + Dados 360° PJ
- [ ] Issue P.2 - CLS Favoritos

**Dia 3:**
- [ ] Issue P.3 - Best Practices sistemático
- [ ] Issue P.7 - Preconnect hints

**Dia 4:**
- [ ] Issue P.4 - TBT redução (parte 1: bundle analysis)

**Dia 5:**
- [ ] Issue P.4 - TBT redução (parte 2: code splitting)

### Semana 2 (Dias 6-10)

**Dia 6:**
- [ ] Issue P.5 - Accessibility (parte 1: contraste + ARIA)

**Dia 7:**
- [ ] Issue P.5 - Accessibility (parte 2: focus + validação)

**Dia 8:**
- [ ] Issue P.6 - Unused JavaScript
- [ ] Issue P.8 - Server response time

**Dia 9:**
- [ ] Issue P.9 - Re-audit Lighthouse (todas páginas)
- [ ] Ajustes finais se necessário

**Dia 10:**
- [ ] Issue P.10 - Documentação & commit final
- [ ] Buffer para revisão

---

## 📚 RECURSOS & REFERÊNCIAS

### Documentação

- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [Core Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)

### Ferramentas

- Chrome DevTools Lighthouse
- Chrome DevTools Coverage
- @next/bundle-analyzer
- axe DevTools extension
- React DevTools Profiler

### Arquivos do Projeto

- `docs/LIGHTHOUSE_ANALYSIS_RESULTS.md` - Análise consolidada
- `docs/PERFORMANCE_AUDIT.md` - Template de tracking
- `docs/TESTING_MANUAL_GUIDE.md` - Guia de testes manuais
- `docs/ISSUE_1.7.2_STATUS.md` - Status Issue 1.7.2

---

## 🚦 DEPENDÊNCIAS & BLOCKERS

### Dependências

- ✅ @next/bundle-analyzer instalado
- ✅ Lighthouse audits completos (10 páginas)
- ✅ Análise consolidada disponível
- ✅ Priorização definida

### Possíveis Blockers

- ⚠️ Tempo limitado (7-10 dias é estimativa agressiva)
- ⚠️ Outras prioridades podem interromper sprint
- ⚠️ Algumas otimizações podem ter tradeoffs (UX vs Performance)
- ⚠️ Mock data pode limitar otimizações de server-side

### Mitigação

- Issues independentes (podem ser feitas em paralelo)
- Quick wins (P.7, P.2) podem ser priorizados
- Validação incremental com Lighthouse após cada issue

---

## ✅ CHECKLIST FINAL DA SPRINT

### Scores

- [ ] Performance ≥90 em ≥9/10 páginas
- [ ] Accessibility ≥90 em 10/10 páginas
- [ ] Best Practices ≥90 em 10/10 páginas
- [ ] SEO ≥90 em 10/10 páginas (manter)

### Core Web Vitals

- [ ] LCP <2.5s em todas páginas
- [ ] FCP <1.8s em todas páginas (já OK)
- [ ] TBT <200ms em ≥8/10 páginas
- [ ] CLS <0.1 em todas páginas

### Deliverables

- [ ] 10 issues implementadas e validadas
- [ ] Lighthouse re-audits completos
- [ ] Documentação atualizada
- [ ] Código commitado e tagged
- [ ] Before/After report criado

---

**Sprint Criada:** 23/10/2025 19:40  
**Status:** 🚀 READY TO START  
**Próximo:** Iniciar Issue P.1 (LCP Optimization)

