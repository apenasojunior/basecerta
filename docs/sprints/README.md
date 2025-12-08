# 📚 Índice de Sprints - BaseCerta

## 🎯 Visão Geral

Este diretório contém todas as sprints do projeto BaseCerta, organizadas seguindo metodologia Agile/Scrum.

Para entender como funciona nossa estrutura de sprints, leia: [**README Agile/Scrum**](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md)

---

## 📊 Status das Sprints

| Sprint | Status | Progresso | Início | Término | Features |
|--------|--------|-----------|--------|---------|----------|
| [Smart CNPJ Query Optimization](#sprint-smart-cnpj-query) | ✅ Concluída | 100% | 20/10 | 24/10 | 6 features |
| [Smart CNPJ Search](#sprint-smart-cnpj-search) | 📋 Planejamento | 0% | 25/10 | 08/11 | 4 features |
| [Smart CNPJ Results](#sprint-smart-cnpj-results) | 📋 Backlog | - | - | - | - |
| [Smart CNPJ Detalhes](#sprint-smart-cnpj-detalhes) | 📋 Backlog | - | - | - | - |

---

## 📁 Sprints Ativas

### Sprint: Smart CNPJ Query Optimization
**Diretório:** `/docs/SPRINTSMARTCNPJ_QUERY/`  
**Status:** ✅ Concluída  
**Período:** 20/10/2025 - 24/10/2025  

**Objetivo:** Otimizar performance de queries do Smart CNPJ para < 100ms

**Features Implementadas:**
- ✅ SCNPJ-01: Índices PostgreSQL (28 índices, pg_trgm)
- ✅ SCNPJ-02: LIMIT+1 pattern (remoção de COUNT)
- ✅ SCNPJ-03: Paginação frontend corrigida
- ✅ SCNPJ-04: Eager loading sócios (N+1 resolvido)
- ✅ SCNPJ-05: Sincronização filtros frontend/backend
- ✅ SCNPJ-06: Loading states e error boundaries
- ✅ BONUS: CNAEs secundários implementados
- ✅ BONUS: Telefones formatados
- ✅ BUGFIX: Navegação "Voltar aos Resultados"

**Resultados:**
- **Performance:** 37s → 112ms (330x mais rápido!)
- **Queries:** Todas < 200ms
- **Issues:** 9 features + 3 bugfixes concluídas

[Ver documentação completa →](../SPRINTSMARTCNPJ_QUERY/)

---

### Sprint: Smart CNPJ Search
**Diretório:** `/docs/sprints/smart-cnpj-search/`  
**Status:** 🔜 Planejamento  
**Período:** 25/10/2025 - 08/11/2025  

**Objetivo:** Melhorar experiência de busca com foco em cenários B2B

**Features Planejadas:**
- 📋 FEATURE-00: Área de Estatísticas (8 pts) 🔴
- 📋 FEATURE-01: Caixa "Tipo de Busca" (5 pts) 🟡
- 📋 FEATURE-02: Caixa de Filtros (8 pts) 🔴
- 📋 FEATURE-03: Buscas Populares (3 pts) 🟡

**Story Points Totais:** 24 pts

[Ver README →](smart-cnpj-search/README.md) | [Ver KANBAN →](smart-cnpj-search/KANBAN.md)

---

### Sprint: Smart CNPJ Results
**Diretório:** `/docs/sprints/smart-cnpj-results/`  
**Status:** 📋 Backlog  
**Período:** A definir  

**Objetivo:** Otimizar página de resultados e experiência de navegação

**Escopo (a ser detalhado):**
- Melhorias em cards de empresas
- Filtros quick-apply na página de resultados
- Comparação de empresas
- Ações em lote
- Exportação avançada

[Ver diretório →](smart-cnpj-results/)

---

### Sprint: Smart CNPJ Detalhes
**Diretório:** `/docs/sprints/smart-cnpj-detalhes/`  
**Status:** 📋 Backlog  
**Período:** A definir  

**Objetivo:** Enriquecer página de detalhes com informações estratégicas

**Escopo (a ser detalhado):**
- Timeline de eventos da empresa
- Análise de vínculos societários
- Histórico de mudanças
- Score de confiabilidade
- Recomendações de empresas similares

[Ver diretório →](smart-cnpj-detalhes/)

---

## 📋 Backlog Global

### Features Futuras (Sem Sprint Definida)

#### Smart CNPJ - Geral
- [ ] Histórico de buscas persistente
- [ ] Salvamento de filtros favoritos
- [ ] Alertas de mudanças em empresas favoritas
- [ ] API pública para integrações
- [ ] Webhooks para eventos de empresas

#### Analytics & Insights
- [ ] Dashboard de tendências de mercado
- [ ] Relatórios personalizados
- [ ] Exportação agendada
- [ ] Integrações com CRM (Salesforce, HubSpot)

#### UX/UI
- [ ] Dark mode
- [ ] Atalhos de teclado
- [ ] Tour guiado para novos usuários
- [ ] Acessibilidade WCAG 2.1 AA

---

## 🎯 Roadmap de Sprints

```
Timeline 2025:
───────────────────────────────────────────────────────

Out │ [Query Opt] → [Search UX]
    │   ✅ 100%      🔜 0%

Nov │ [Search UX] → [Results] → [Detalhes]
    │   🏗️ ...      📋 ...     📋 ...

Dez │ [Polish] → [Analytics] → [Deploy v2.0]
    │   📋 ...    📋 ...        🎯

```

---

## 📊 Métricas Globais

### Velocidade do Time
- **Sprint Query Opt:** 24 story points em 5 dias = 4.8 pts/dia
- **Estimativa Sprint Search:** 24 pts / 10 dias = 2.4 pts/dia (mais conservador)

### Qualidade
- **Bug Rate:** < 5% (muito baixo)
- **Reopen Rate:** 0% (nenhuma feature reaberta)
- **Test Coverage:** 80%+ (backend), 60%+ (frontend)

### Entrega
- **On-Time Delivery:** 100% (Sprint Query concluída no prazo)
- **Scope Creep:** +3 features bonus (positivo, agregou valor)

---

## 🔄 Processo de Sprint

### 1. Planejamento (Sprint Planning)
- Duração: 1-2 horas
- Output: Features selecionadas, KANBAN preenchido
- Participantes: PO + Dev + IA

### 2. Execução (Daily Updates)
- Formato: Assíncrono via chat
- Atualização: KANBAN diário
- Comunicação: Bloqueios reportados imediatamente

### 3. Review (Sprint Review)
- Duração: 1 hora
- Output: Demo de features, feedback PO
- Validação: Critérios de aceitação

### 4. Retrospectiva (Sprint Retrospective)
- Duração: 45min
- Output: RETROSPECTIVE.md, action items
- Foco: Melhoria contínua

---

## 📚 Documentação

### Templates
- [Template de Feature](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md#template-de-feature)
- [Template de Issue](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md#template-de-issue)
- [Template de KANBAN](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md#kanban-template)
- [Template de Retrospectiva](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md#retrospective-template)

### Guias
- [README Agile/Scrum Completo](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md)
- [Workflow de Desenvolvimento](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md#workflow)
- [Definition of Done](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md#definition-of-done)

---

## 🎓 Como Usar Este Sistema

### Para Iniciar Nova Sprint:

1. **Criar Estrutura:**
   ```bash
   mkdir -p docs/sprints/[nome-sprint]/{FEATURES,ISSUES}
   ```

2. **Copiar Templates:**
   - README.md (visão geral)
   - KANBAN.md (board)
   
3. **Sprint Planning:**
   - Definir features
   - Criar documentos de features
   - Estimar story points
   - Preencher KANBAN

4. **Durante Sprint:**
   - Atualizar KANBAN diariamente
   - Documentar progresso nas issues
   - Commitar com referências ([FEATURE-XX])

5. **Fim da Sprint:**
   - Review (demo)
   - RETROSPECTIVE.md
   - Atualizar métricas
   - Planejar próxima

---

## 🔗 Links Úteis

- [Estrutura Completa Agile/Scrum](../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md)
- [Sprint Query Optimization (concluída)](../SPRINTSMARTCNPJ_QUERY/)
- [Sprint Search (ativa)](smart-cnpj-search/)
- [Documentação de Referência](../ESTRUTURA_DE_REFERENCIA_PARA_IA/)

---

**Mantido por:** Product Owner + IA Copilot  
**Última atualização:** 25/10/2025  
**Versão:** 1.0
