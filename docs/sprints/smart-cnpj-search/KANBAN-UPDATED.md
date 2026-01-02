# 📊 Kanban - Sprint Smart CNPJ Search

**Sprint:** Smart CNPJ Search  
**Período:** 25/10/2025 - 08/11/2025  
**Última atualização:** 08/12/2025 às 15:30 ⚠️ **SUB-SPRINT INICIADA**

---

## 🚨 ATENÇÃO: SUB-SPRINT EM ANDAMENTO

**Status:** ⏸️ **FEATURE-02 PAUSADA - Bloqueio Técnico**

### 🔴 **SUB-SPRINT: Correção dos 6 Tipos de Busca**

**Problema Identificado (08/12/2025):**
- ❌ Busca por Razão Social **TRAVANDO** (>2min, 3 queries paradas)
- ❌ Email, Telefone, Nome Sócio, CEP **NÃO FUNCIONAM**
- ✅ Apenas CNPJ funciona corretamente (55ms)

**Decisão:** Pausar FEATURE-02 (Filtros) até corrigir tipos de busca básicos.

**📄 Documentação:** [SUB-SPRINT-FIX-SEARCH-TYPES.md](SUB-SPRINTS/SUB-SPRINT-FIX-SEARCH-TYPES.md)

---

## 📋 Backlog

*Todas as features foram movidas para "To Do" após Sprint Planning.*

---

## 🏗️ Em Progresso (In Progress) - SUB-SPRINT

### 🔧 **SUB-SPRINT: Correção dos 6 Tipos de Busca (13 pts)**

**Período:** 08/12 - 10/12 (3 dias)  
**Prioridade:** 🔴 CRÍTICA (bloqueante)

#### **Dia 1 (08/12) - P0/P1:**
- [ ] 🔴 **ISSUE-FIX-01:** Razão Social (3 pts) - **EM ANDAMENTO**
  - Diagnóstico com EXPLAIN ANALYZE
  - REINDEX se necessário
  - LIMIT hardcoded (1000 max)
  - Meta: < 200ms
  
- [ ] 🟡 **ISSUE-FIX-02:** Segmento/CNAE (2 pts)
  - Testar query atual
  - Verificar índices
  - Meta: < 150ms

#### **Dia 2 (09/12) - P1/P2:**
- [ ] 🟡 **ISSUE-FIX-03:** Email (2 pts)
  - REINDEX email
  - LIMIT hardcoded
  - Meta: < 200ms
  
- [ ] 🟢 **ISSUE-FIX-04:** Telefone (3 pts)
  - Criar índices concatenados
  - Busca exata (sem ILIKE)
  - Meta: < 100ms

#### **Dia 3 (10/12) - P2/P3:**
- [ ] 🟢 **ISSUE-FIX-05:** Nome Sócio (2 pts)
  - Criar índice GIN trigram
  - Implementar query + JOIN
  - Meta: < 250ms
  
- [ ] 🟢 **ISSUE-FIX-06:** CEP (1 pt)
  - Implementar query simples
  - Meta: < 50ms

**Progresso Sub-Sprint:** 0/13 pts (0%)

---

## ⏸️ Pausado (Blocked) - Sprint Principal

### **🔴 P2: FEATURE-02 - Caixa de Filtros (8 pts)** ⏸️ BLOQUEADA

**Motivo:** Não faz sentido permitir busca por filtros se busca por tipo não funciona.

**Bloqueio:** Aguardando conclusão da SUB-SPRINT (mín. 5/6 tipos funcionando)

- [ ] **ISSUE-02-A:** Filtros como busca principal (7h) ⏸️
  - Backend: aceitar busca sem valor
  - Schema validator (mínimo 3 filtros)
  - Ajustar endpoint + cache Redis
  
- [ ] **ISSUE-02-B:** Validação mínima de 3 filtros (2h) ⏸️
  - Contador visual de filtros
  - Lógica canSearch
  
- [ ] **ISSUE-02-C:** UX para indicar filtros obrigatórios (3h) ⏸️
  - Badge "X/3 filtros"
  - Highlight filtros selecionados

---

## 🔜 A Fazer (To Do) - Sprint Principal

### **Semana 2 (após SUB-SPRINT):**

**🟡 P3: FEATURE-01 - Caixa "Tipo de Busca" (5 pts)**
- [ ] **ISSUE-01-A:** Reestruturar tipos de busca (UX) (3h)
- [ ] **ISSUE-01-B:** Implementar nova interface de seleção (4h)

**🟡 P4: FEATURE-03 - Buscas Populares (3 pts)**
- [ ] **ISSUE-03-A:** Definir buscas populares B2B (2h)
- [ ] **ISSUE-03-B:** Mover para topo da página (2h)
- [ ] **ISSUE-03-C:** Design de cards de buscas rápidas (3h)

---

## 👀 Em Revisão (Review)

*Nenhuma tarefa em revisão no momento.*

---

## ✅ Concluído (Done)

### 📦 **FEATURE-00: Área de Estatísticas - COMPLETA** ✅ (26/10/2025)

**Story Points:** 8 de 24 (33.3% do Sprint)

**ISSUE-00-A: Definir Estatísticas B2B (26/10/2025)** ✅
- ✅ 15 insights definidos (6 setores + 5 estados + 4 capital)
- ✅ Tabela insights_cache criada (PostgreSQL)
- ✅ Cache populado com dados reais (27M empresas)
- ✅ Endpoint API funcionando (<10ms)
- ✅ Documentação V4 FINAL completa

**ISSUE-00-B: Implementar StatCard no Frontend (26/10/2025)** ✅
- ✅ TypeScript types criados
- ✅ Service layer implementado
- ✅ Componente InsightCard responsivo
- ✅ Página de insights com grid 3 seções
- ✅ Click navigation para /results com filtros
- ✅ Integração testada (200 OK)

---

## 📊 Métricas Atualizadas (08/12/2025)

### **Sprint Principal:**
| Métrica | Valor |
|---------|-------|
| Features Total | 4 |
| Features Concluídas | 1 (FEATURE-00) ✅ |
| Features Bloqueadas | 1 (FEATURE-02) ⏸️ |
| Features Pendentes | 2 |
| Story Points Total | 24 |
| Story Points Concluídos | 8 (33.3%) |
| **Progresso Sprint** | **33.3%** ⏸️ PAUSADO |

### **Sub-Sprint Ativa:**
| Métrica | Valor |
|---------|-------|
| Issues Total | 6 |
| Issues Concluídas | 0 |
| Story Points Total | 13 |
| Story Points Concluídos | 0 |
| **Progresso Sub-Sprint** | **0%** 🏗️ INICIANDO |

### **Projeção Atualizada:**
- **Dias perdidos:** 3 dias (sub-sprint)
- **Nova data fim sprint:** 11/11 → **18/11** (prorrogação)
- **Velocity real:** 2.6 pts/dia (ajustado)

---

## 🎯 Próximas Ações IMEDIATAS

### ✅ **Agora (08/12 - tarde):**
1. 🔴 **ISSUE-FIX-01:** Diagnóstico Razão Social
   - EXPLAIN ANALYZE na query travada
   - Verificar índice GIN trigram
   - REINDEX se necessário
   - Testar com LIMIT 1000

### 📅 **Amanhã (09/12):**
2. 🟡 **ISSUE-FIX-02:** Testar Segmento/CNAE
3. 🟡 **ISSUE-FIX-03:** Corrigir Email

### 📅 **Depois de amanhã (10/12):**
4. 🟢 Implementar Telefone + Nome Sócio + CEP
5. 🎯 **Retomar FEATURE-02** (se 5/6 tipos OK)

---

## 🔄 Histórico de Atualizações

| Data | Evento | Descrição |
|------|--------|-----------|
| 25/10 18:00 | Criação | Kanban criado com 4 features |
| 25/10 20:00 | Sprint Planning | 24 pts comprometidos |
| 26/10 03:05 | ISSUE-00-A Done | Backend completo (3 pts) |
| 26/10 04:30 | ISSUE-00-B Done | Frontend completo (5 pts) |
| 26/10 04:30 | FEATURE-00 Done | Estatísticas 100% (8 pts) |
| **08/12 15:00** | **⚠️ SUB-SPRINT** | **Tipos de busca travando - Sub-sprint iniciada** |
| **08/12 15:00** | **⏸️ FEATURE-02 Bloqueada** | **Pausada até correção dos tipos** |
| **08/12 15:30** | **Timeline ajustada** | **Sprint estendida até 18/11** |

---

## 📝 Legenda

### Status Especiais:
- ⏸️ **Blocked** - Bloqueado aguardando dependência
- 🏗️ **Sub-Sprint** - Sub-sprint técnica em andamento

### Prioridade:
- 🔴 P0-P1: Crítica/Alta
- 🟡 P2: Média  
- 🟢 P3: Baixa

---

**Última atualização:** 08/12/2025 15:30  
**Status:** ⚠️ SUB-SPRINT EM ANDAMENTO  
**Bloqueio:** FEATURE-02 pausada até correção dos tipos de busca  
**Próxima ação:** ISSUE-FIX-01 (Razão Social)
