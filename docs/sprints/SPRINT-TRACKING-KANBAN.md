# 📊 SPRINT TRACKING - KANBAN

**Projeto:** BaseCerta - Insights Estratégicos  
**Período:** Sprint S03, S04, S05  
**Última Atualização:** 2026-02-10 02:15 UTC  
**Status Geral:** 🟢 Em Progresso - FASE 2 Concluída

---

## 📋 Índice Rápido

- [Visão Geral](#visão-geral)
- [Sprint S03 - F03](#sprint-s03---f03-insights-estratégicos)
- [Sprint S03 - F03.0](#sprint-s03---f030-infraestrutura-de-dados)
- [Sprint S04 - F04](#sprint-s04---f04-dashboard-ml--features-avançadas)
- [Sprint S05 - F05](#sprint-s05---f05-busca-nlp)
- [Backlog e Futuro](#backlog-e-futuro)

---

## 🎯 Visão Geral

### Resumo Executivo

| Sprint | Story Points | Concluído | Em Andamento | Bloqueado | Não Iniciado |
|--------|-------------|-----------|--------------|-----------|--------------|
| **S03 - F03** | 34 pts | 34 pts (100%) | 0 pts | 0 pts | 0 pts |
| **S03 - F03.0** | 47 pts | 18 pts (38%) | 0 pts | 0 pts | 29 pts |
| **S04 - F04** | 29 pts | 0 pts | 0 pts | 0 pts | 29 pts |
| **S05 - F05** | 21 pts | 0 pts | 0 pts | 0 pts | 21 pts |
| **TOTAL** | **131 pts** | **52 pts (40%)** | **0 pts** | **0 pts** | **79 pts (60%)** |

### Status Visual

```
📊 Progresso Geral: ████████████░░░░░░░░░░░░░ 40% (52/131 pts)

✅ Completo:     ████████████████████████ 52 pts (F03 + F03.0 FASE 1-2)
🟢 Desbloqueado: ████████                 29 pts (F04 - infraestrutura pronta)
⏳ Não Iniciado: ████████████████         50 pts (F03.0 FASE 3-4, F05)
```

---

## 📦 Sprint S03 - F03: Insights Estratégicos

**Story Points:** 34 pts  
**Status:** ✅ **100% FUNCIONAL** (código + dados + API 200 OK)  
**Data Início:** 2024-02-03  
**Data Conclusão Código:** 2024-02-03  
**Data Conclusão Infraestrutura:** 2026-02-09

### 🎯 Objetivo
Implementar 4 melhorias principais: Insights IA, Drill-Down, Evolução Temporal, Exportação

### 📊 KANBAN - F03

```
┌─────────────────┬──────────────────┬──────────────────┬─────────────────┐
│   📋 TODO       │  🔄 IN PROGRESS  │   ✅ DONE        │  ⚠️ BLOCKED     │
├─────────────────┼──────────────────┼──────────────────┼─────────────────┤
│                 │                  │ P1: Insights IA  │                 │
│                 │                  │   (13 pts)       │                 │
│                 │                  │ ✅ Backend       │                 │
│                 │                  │ ✅ Frontend      │                 │
│                 │                  │ ✅ Widget        │                 │
│                 │                  │                  │                 │
│                 │                  │ P3: Drill-Down   │                 │
│                 │                  │   (13 pts)       │                 │
│                 │                  │ ✅ Modal         │                 │
│                 │                  │ ✅ Gráficos      │                 │
│                 │                  │ ✅ 5 seções      │                 │
│                 │                  │                  │                 │
│                 │                  │ P6: Evolução     │                 │
│                 │                  │   (8 pts)        │                 │
│                 │                  │ ✅ MiniChart     │                 │
│                 │                  │ ✅ Integração    │                 │
│                 │                  │                  │                 │
│                 │                  │ P8: Exportação   │                 │
│                 │                  │   (5 pts)        │                 │
│                 │                  │ ✅ PDF/PNG/CSV   │                 │
│                 │                  │ ✅ ExportButton  │                 │
└─────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

### ✅ Entregáveis Completos

#### P1: Insights Automáticos (IA) - 13 pts ✅
- [x] Backend: `IntelligentInsightsService` (388 linhas)
- [x] Endpoint: `GET /api/v1/insights/intelligent`
- [x] Frontend: `IntelligentInsightsWidget.tsx` (280 linhas)
- [x] Algoritmos: Z-score, anomalias, priorização
- [x] 3 níveis de prioridade (alta/média/baixa)
- [x] Dependências: scikit-learn, numpy, pandas, scipy

**Arquivos:**
```
backend/app/services/intelligent_insights.py
backend/app/api/v1/endpoints/insights.py (modificado)
frontend/src/components/IntelligentInsightsWidget.tsx
```

#### P3: Drill-Down Interativo - 13 pts ✅
- [x] Backend: Endpoint `GET /api/v1/insights/{key}/details`
- [x] Frontend: `DrillDownModal.tsx` (450 linhas)
- [x] 5 seções: Evolução, CNAEs, Geografia, Capital, Saúde
- [x] Gráficos: LineChart, PieChart, BarChart (Recharts)
- [x] Modal Radix UI (acessível)

**Arquivos:**
```
backend/app/api/v1/endpoints/insights.py (endpoint details)
frontend/src/components/DrillDownModal.tsx
```

#### P6: Evolução Temporal - 8 pts ✅
- [x] Componente: `MiniEvolutionChart.tsx` (40 linhas)
- [x] Integração: Modificado `InsightCard.tsx`
- [x] Mini gráfico 12 meses (64px altura)
- [x] Percentual de crescimento automático
- [x] Loading state com skeleton

**Arquivos:**
```
frontend/src/components/MiniEvolutionChart.tsx
frontend/src/components/smart-cnpj/InsightCard.tsx (modificado)
```

#### P8: Exportação Inteligente - 5 pts ✅
- [x] Componente: `ExportButton.tsx` (280 linhas)
- [x] 3 formatos: PDF (jsPDF), PNG (html2canvas), CSV
- [x] Dropdown menu estilizado
- [x] Loading states por formato
- [x] Dependências instaladas

**Arquivos:**
```
frontend/src/components/ExportButton.tsx
frontend/package.json (jspdf@2.5.2, html2canvas@1.4.1)
```

### ⚠️ Problemas Conhecidos

| Problema | Severidade | Impacto | Resolução |
|----------|-----------|---------|-----------|
| **Tabela `insights_cache` não existe** | 🔴 CRÍTICO | API retorna erro 500 | F03.0 FASE 1 |
| **Nenhum dado populado** | 🔴 CRÍTICO | Frontend não exibe nada | F03.0 FASE 1 |
| **Testes não executados** | 🟡 Médio | 0% cobertura | F03.5 (futuro) |
| **1 vulnerabilidade critical (npm)** | 🟡 Médio | html2canvas | Atualizar lib |

### 📚 Documentação F03
- ✅ [S03-F03-IMPLEMENTACAO.md](./features/S03-F03-IMPLEMENTACAO.md) (764 linhas)
- ✅ [S03-F03-RESUMO-EXECUTIVO.md](./features/S03-F03-RESUMO-EXECUTIVO.md)
- ✅ Testes unitários (criados, execução pendente)
- ✅ **API funcionando:** `GET /api/v1/insights/intelligent` retorna 200 OK
- ✅ **Frontend acessível:** http://localhost:3000/smart-cnpj

---

## 🏗️ Sprint S03 - F03.0: Infraestrutura de Dados

**Story Points:** 47 pts (dividido em 4 fases)  
**Status:** 🟢 **FASE 1 COMPLETA** (5 pts concluídos - 11%)  
**Prioridade:** 🟢 **FASE 2 Próxima** (13 pts)

### 🎯 Objetivo
Criar TODAS as tabelas necessárias para suportar F03, F04 e F05

### 📊 KANBAN - F03.0

```
┌─────────────────────┬──────────────────┬──────────────────┬─────────────────┐
│   📋 TODO           │  🔄 IN PROGRESS  │   ✅ DONE        │  ⚠️ BLOCKED     │
├─────────────────────┼──────────────────┼──────────────────┼─────────────────┤
│ FASE 2: F04         │                  │ FASE 1: Crítico  │                 │
│   (13 pts)          │                  │   (5 pts) ✅     │                 │
│ ⏳ users            │                  │ ✅ insights_cache│                 │
│ ⏳ user_preferences │                  │ ✅ insights_hist │                 │
│ ⏳ search_history   │                  │ ✅ Seed 19 insig │                 │
│ ⏳ insights_views   │                  │ ✅ Seed 12 meses │                 │
│ ⏳ ml_recommend...  │                  │ ✅ Migrations OK │                 │
│ ⏳ comparisons_...  │                  │ ✅ API 200 OK    │                 │
│ ⏳ comparison_cache │                  │                  │                 │
│ ⏳ favorites        │                  │                  │                 │
│ ⏳ favorite_cat...  │                  │                  │                 │
│ ⏳ geographic_stats │                  │                  │                 │
│ ⏳ map_cache        │                  │                  │                 │
│                     │                  │                  │                 │
│ FASE 3: F05         │                  │                  │                 │
│   (8 pts)           │                  │                  │                 │
│ ⏳ nlp_queries      │                  │                  │                 │
│ ⏳ insights_embed.. │                  │                  │                 │
│ ⏳ Generate embedd. │                  │                  │                 │
│                     │                  │                  │                 │
│ FASE 4: Dados Reais │                  │                  │                 │
│   (21 pts)          │                  │                  │                 │
│ ⏳ Calculate script │                  │                  │                 │
│ ⏳ Celery job       │                  │                  │                 │
└─────────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

### 📦 Fases de Execução

#### FASE 1: Infraestrutura Crítica (URGENTE) - 5 pts ⚡
**Tempo:** 30-45 min | **Bloqueia:** F03

**Tabelas:**
- [ ] `insights_cache` (2 pts)
- [ ] `insights_history` (3 pts)

**Scripts:**
- [x] Migration `001_create_insights_cache.py` ✅
- [x] Migration `002_create_insights_history.py` ✅
- [x] Seed `seed_insights_cache.py` (19 insights) ✅
- [x] Seed `seed_insights_history.py` (12 meses × 19 insights = 228 registros) ✅

**Validação:**
```bash
curl http://localhost:8000/api/v1/insights/intelligent
# ✅ SUCESSO: 200 OK com JSON de 3 insights (2026-02-09 22:45 UTC)
```

**Resultado:** F03 totalmente funcional - API + Frontend operacionais

---

#### FASE 2: Infraestrutura F04 (ALTA) - 13 pts 📦 ✅
**Tempo:** 2-3 horas | **Bloqueia:** F04  
**Status:** ✅ **CONCLUÍDA** (2026-02-10 02:15 UTC)

**Tabelas (11):**
- [x] `users` (1 pt) ✅
- [x] `user_preferences` (1 pt) ✅
- [x] `search_history` (1 pt) ✅
- [x] `insights_views` (1 pt) ✅
- [x] `ml_recommendations` (2 pts) ✅
- [x] `comparisons_history` (1 pt) ✅
- [x] `comparison_cache` (1 pt) ✅
- [x] `favorites` (1 pt) ✅
- [x] `favorite_categories` (1 pt) ✅
- [x] `geographic_stats` (2 pts) ✅
- [x] `map_cache` (1 pt) ✅

**Scripts:**
- [x] Migrations `003` a `013` ✅
- [x] Seed `seed_users_demo.py` (5 usuários) ✅
- [x] Seed `seed_user_preferences.py` (5 preferências) ✅
- [x] Seed `seed_geographic_stats.py` (27 estados + 20 municípios = 47 registros) ✅

**Validação:**
```bash
# 13 tabelas criadas (2 FASE 1 + 11 FASE 2)
psql -c "\dt public.*"  # ✅ 14 tabelas (incluindo alembic_version)

# Dados populados
users: 5 registros
user_preferences: 5 registros
geographic_stats: 47 registros
insights_cache: 19 registros (FASE 1)
insights_history: 228 registros (FASE 1)
```

**Resultado:** F04 **DESBLOQUEADO** - Infraestrutura completa para desenvolvimento

---

#### FASE 3: Infraestrutura F05 (MÉDIA) - 8 pts 🔮
**Tempo:** 1-2 horas | **Bloqueia:** F05

**Tabelas:**
- [ ] `nlp_queries` (3 pts)
- [ ] `insights_embeddings` (5 pts)

**Pré-requisitos:**
- [ ] Extensão `pgvector` instalada

**Scripts:**
- [ ] Migration `014_create_nlp_queries.py`
- [ ] Migration `015_create_insights_embeddings.py`
- [ ] Script `generate_embeddings.py`

---

#### FASE 4: Dados Reais do CNPJ (BAIXA) - 21 pts 🚀
**Tempo:** 5-8 horas | **Bloqueia:** Nada (melhoria)

**Objetivos:**
- [ ] Substituir dados mock por cálculos reais
- [ ] Conectar com schema `cnpj_brasil`
- [ ] Job Celery para atualização automática
- [ ] Queries otimizadas (<200ms)

**Scripts:**
- [ ] `calculate_insights.py`
- [ ] `calculate_history.py`
- [ ] `update_insights_job.py` (Celery)

---

### 📚 Documentação F03.0
- ✅ [S03-F03.0-INFRAESTRUTURA-DADOS.md](./features/S03-F03.0-INFRAESTRUTURA-DADOS.md)

---

## 🚀 Sprint S04 - F04: Dashboard ML + Features Avançadas

**Story Points:** 29 pts  
**Status:** � **DESBLOQUEADO** (infraestrutura F03.0 FASE 2 concluída)  
**Data Prevista:** Pode iniciar imediatamente

### 🎯 Objetivo
Implementar Dashboard Personalizado, Modo Comparativo, Mapa e Favoritos

### 📊 KANBAN - F04

```
┌─────────────────────┬──────────────────┬──────────────────┬─────────────────┐
│   📋 TODO           │  🔄 IN PROGRESS  │   ✅ DONE        │  ⚠️ BLOCKED     │
├─────────────────────┼──────────────────┼──────────────────┼─────────────────┤
│ P2: Dashboard       │                  │                  │                 │
│   Personalizado     │                  │                  │                 │
│   (21 pts)          │                  │                  │                 │
│ 🟢 PRONTO           │                  │                  │                 │
│   (tabelas OK)      │                  │                  │                 │
│                     │                  │                  │                 │
│ P4: Comparativo     │                  │                  │                 │
│   (8 pts)           │                  │                  │                 │
│ 🟢 PRONTO           │                  │                  │                 │
│                     │                  │                  │                 │
│ P9: Mapa            │                  │                  │                 │
│   (13 pts)          │                  │                  │                 │
│ 🟢 PRONTO           │                  │                  │                 │
│                     │                  │                  │                 │
│ P10: Favoritos      │                  │                  │                 │
│   (8 pts)           │                  │                  │                 │
│ 🟢 PRONTO           │                  │                  │                 │
└─────────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

### 📦 Features Planejadas

#### P2: Dashboard Personalizado (ML) - 21 pts
**Tecnologia:** Collaborative Filtering, scikit-learn  
**Dependências:** users, user_preferences, search_history, insights_views, ml_recommendations

**Tasks:**
- [ ] T01: Algoritmo de recomendação (8 pts)
- [ ] T02: Tracking de interações (5 pts)
- [ ] T03: Dashboard adaptativo (5 pts)
- [ ] T04: Testes A/B (3 pts)

---

#### P4: Modo Comparativo - 8 pts
**Tecnologia:** Google Gemini 1.5 Flash (gratuito), Recharts  
**Dependências:** insights_cache, comparisons_history, comparison_cache

**Tasks:**
- [ ] T01: Multiselect de insights (2 pts)
- [ ] T02: View de comparação (3 pts)
- [ ] T03: Integração Gemini (2 pts)
- [ ] T04: Cache de análises (1 pt)

---

#### P9: Mapa Interativo - 13 pts
**Tecnologia:** Mapbox GL JS, GeoJSON  
**Dependências:** geographic_stats, map_cache

**Tasks:**
- [ ] T01: Integração Mapbox (5 pts)
- [ ] T02: Heatmap de concentração (4 pts)
- [ ] T03: Drill-down por estado/município (3 pts)
- [ ] T04: Filtros dinâmicos (1 pt)

---

#### P10: Favoritos Auto-Categorização - 8 pts
**Tecnologia:** SQLAlchemy, Radix UI  
**Dependências:** users, favorites, favorite_categories

**Tasks:**
- [ ] T01: CRUD de favoritos (3 pts)
- [ ] T02: Auto-categorização (3 pts)
- [ ] T03: UI de gerenciamento (2 pts)

---

### 📚 Documentação F04 (a criar)
- [ ] S04-F04-PLANEJAMENTO.md
- [ ] S04-F04-IMPLEMENTACAO.md

---

## 🔍 Sprint S05 - F05: Busca em Linguagem Natural

**Story Points:** 21 pts  
**Status:** 🔴 **BLOQUEADO** (aguardando F03.0 FASE 3)  
**Data Prevista:** Após F04 completo

### 🎯 Objetivo
Implementar busca por perguntas em linguagem natural

### 📊 KANBAN - F05

```
┌─────────────────────┬──────────────────┬──────────────────┬─────────────────┐
│   📋 TODO           │  🔄 IN PROGRESS  │   ✅ DONE        │  ⚠️ BLOCKED     │
├─────────────────────┼──────────────────┼──────────────────┼─────────────────┤
│                     │                  │                  │ P7: Busca NLP   │
│                     │                  │                  │   (21 pts)      │
│                     │                  │                  │ 🔴 BLOQUEADO    │
│                     │                  │                  │   (sem tabelas) │
│                     │                  │                  │   (sem pgvector)│
└─────────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

### 📦 Feature Planejada

#### P7: Busca em Linguagem Natural - 21 pts
**Tecnologia:** Google Gemini 1.5 Flash + Groq (LLaMA 3.1 70B), pgvector  
**Dependências:** nlp_queries, insights_embeddings

**Tasks:**
- [ ] T01: Integração Gemini/Groq (5 pts)
- [ ] T02: Processamento NLP (5 pts)
- [ ] T03: Semantic search (pgvector) (5 pts)
- [ ] T04: Cache de queries (3 pts)
- [ ] T05: UI de busca (3 pts)

**Exemplos de Queries:**
- "Quais setores crescem mais rápido em SP?"
- "Compare tecnologia e saúde"
- "Mostre empresas de médio porte no Sul"

---

### 📚 Documentação F05 (a criar)
- [ ] S05-F05-PLANEJAMENTO.md
- [ ] S05-F05-IMPLEMENTACAO.md

---

## 📋 Backlog e Futuro

### Features Removidas
- ❌ **P5: Alertas Inteligentes** (13 pts) - Excluído do escopo

### Features Futuras (Não Planejadas)
- 🔮 **Dashboard Mobile-First (PWA)** - TBD
- 🔮 **Widgets Customizáveis (Drag & Drop)** - TBD
- 🔮 **Integração WhatsApp** - TBD
- 🔮 **API Pública (Widgets embeddáveis)** - TBD

---

## 📊 Métricas de Acompanhamento

### Velocity (Story Points por Dia)

| Data | Sprint | Feature | Pts Concluídos | Pts Acumulados | Velocity |
|------|--------|---------|----------------|----------------|----------|
| 2024-02-03 | S03 | F03 | 34 pts | 34 pts | 34 pts/dia |
| 2024-02-04 | S03 | F03.0 | 0 pts | 34 pts | 0 pts/dia |

**Velocity Média:** 17 pts/dia (considerando apenas F03)

### Burndown Chart

```
Story Points
    140│                               
       │●                               Total: 131 pts
    120│ ●                              
       │  ●                             
    100│   ●                            
       │    ●                           
     80│     ●                          
       │      ●                         
     60│       ●                        
       │        ●         ← Linha ideal
     40│         ●                      
       │          ●                     
     20│           ●                    
       │            ●                   
      0│─────────────●──────────────→   
        D1  D2  D3  D4  D5  D6  D7  D8
        
        ● Real: 34 pts (D1) → 34 pts (D2, bloqueado)
        ─ Ideal: -16 pts/dia
```

**Status:** 🔴 Atrasado (bloqueado por falta de dados)

---

## 🚦 Dependências e Bloqueios

### Árvore de Dependências

```
F03.0 FASE 1 (5 pts) 🔴 CRÍTICO
    └─> F03 (34 pts) ✅ PODE FUNCIONAR
    
F03.0 FASE 2 (13 pts) 🟡 ALTA
    └─> F04 (29 pts) 🔴 BLOQUEADO
    
F03.0 FASE 3 (8 pts) 🟢 MÉDIA
    └─> F05 (21 pts) 🔴 BLOQUEADO
    
F03.0 FASE 4 (21 pts) 🟢 BAIXA
    └─> Dados reais (melhoria contínua)
```

### Bloqueios Ativos

| Feature | Bloqueado Por | Severidade | ETA Desbloqueio |
|---------|--------------|------------|-----------------|
| F03 (funcionamento) | FASE 1 não executada | 🔴 Crítico | 30-45 min |
| F04 (todas features) | FASE 2 não executada | 🔴 Alto | 2-3 horas |
| F05 (busca NLP) | FASE 3 não executada | 🟡 Médio | 1-2 horas |

---

## 🎯 Próximas Ações (Prioridade)

### Imediatas (Hoje)
1. ✅ **APROVAR** documento de infraestrutura
2. ⏳ **EXECUTAR FASE 1** (30-45 min)
   - Criar migrations 001, 002
   - Criar seeds
   - Executar no Docker
   - Testar F03 funcionando
3. ⏳ **Commit e Push** das migrations

### Curto Prazo (Esta Semana)
4. ⏳ **EXECUTAR FASE 2** (2-3 horas)
   - 11 tabelas para F04
   - Seeds de usuários e geografia
5. ⏳ **Iniciar F04** (Dashboard ML)

### Médio Prazo (Próxima Semana)
6. ⏳ **EXECUTAR FASE 3** (1-2 horas)
   - Tabelas NLP
   - Gerar embeddings
7. ⏳ **Iniciar F05** (Busca NLP)

### Longo Prazo (Mês)
8. ⏳ **FASE 4** - Dados reais do CNPJ
9. ⏳ **Otimizações** e **Melhorias contínuas**

---

## 📞 Comunicação

### Status Reports
- **Diário:** Atualizar este KANBAN ao fim do dia
- **Semanal:** Sprint review e retrospectiva
- **Bloqueios:** Reportar imediatamente

### Canais
- 📝 **Documentação:** Este arquivo (KANBAN)
- 💬 **Chat:** code4us + GitHub Copilot
- 🐛 **Issues:** GitHub Issues (para bugs)
- 📊 **Métricas:** Seção de métricas neste doc

---

## 📚 Referências Rápidas

### Documentos Essenciais
- [S03-F02-PROPOSTAS-MELHORIAS.md](./features/S03-F02-PROPOSTAS-MELHORIAS.md) - Propostas aprovadas
- [S03-F03-IMPLEMENTACAO.md](./features/S03-F03-IMPLEMENTACAO.md) - F03 completo (código)
- [S03-F03.0-INFRAESTRUTURA-DADOS.md](./features/S03-F03.0-INFRAESTRUTURA-DADOS.md) - Plano de dados
- [S03-DASHBOARD.md](./S03-DASHBOARD.md) - Planejamento original S03

### Comandos Úteis
```bash
# Executar migrations
docker-compose exec backend alembic upgrade head

# Executar seed
docker-compose exec backend python app/scripts/seed_insights_cache.py

# Testar API
curl http://localhost:8000/api/v1/insights/intelligent

# Verificar tabelas
docker-compose exec backend psql -U postgres -d basecerta -c "\dt public.*"

# Ver logs
docker logs basecerta_backend --tail 50
```

---

**Última atualização:** 2024-02-04 02:00 UTC  
**Próxima revisão:** 2024-02-04 18:00 UTC (após FASE 1)  
**Responsável:** code4us + GitHub Copilot  
**Status:** 🟡 **Aguardando Aprovação do Plano F03.0**
