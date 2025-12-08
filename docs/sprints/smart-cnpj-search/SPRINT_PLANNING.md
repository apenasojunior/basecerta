# 🎯 Sprint Planning - Smart CNPJ Search

## 📅 Informações da Reunião
- **Data:** 25/10/2025
- **Horário:** 18:30 - 20:00
- **Duração:** 1h30
- **Participantes:** 
  - LinkerX (Product Owner)
  - IA Copilot (Scrum Master + Developer)

---

## 🎯 Objetivo da Sprint

Melhorar significativamente a experiência do usuário na página de busca do Smart CNPJ, tornando-a mais intuitiva, inteligente e orientada a negócios B2B.

**Foco Principal:** Transformar a página de busca de uma ferramenta técnica em uma solução estratégica B2B.

---

## 📊 Capacidade da Sprint

### Análise de Velocity

**Sprint Anterior (Query Optimization):**
- **Duração:** 5 dias úteis
- **Story Points Completados:** 24+ pontos (6 features + 3 bugfixes)
- **Velocity:** ~4.8 pts/dia

**Sprint Atual (2 semanas = 10 dias úteis):**
- **Capacidade Estimada:** 24 story points (conservador: 2.4 pts/dia)
- **Buffer:** 20% para imprevistos
- **Capacidade Real:** ~20 story points garantidos

### Conclusão
✅ **Podemos comprometer todos os 24 story points planejados** (4 features)

---

## 📋 Features Disponíveis no Backlog

| ID | Feature | Story Points | Prioridade | Dependências |
|----|---------|--------------|------------|--------------|
| FEATURE-00 | Área de Estatísticas | 8 pts | 🔴 Alta | Nenhuma |
| FEATURE-01 | Caixa "Tipo de Busca" | 5 pts | 🟡 Média | Nenhuma |
| FEATURE-02 | Caixa de Filtros | 8 pts | 🔴 Alta | Nenhuma |
| FEATURE-03 | Buscas Populares | 3 pts | 🟡 Média | Nenhuma |
| **TOTAL** | | **24 pts** | | |

---

## 🔍 Análise de Cada Feature

### FEATURE-00: Área de Estatísticas (8 pts) 🔴

**Valor de Negócio:** ⭐⭐⭐⭐⭐
- Transforma dados estáticos em insights acionáveis
- Guia usuário para buscas estratégicas
- Diferencial competitivo (estatísticas clicáveis)

**Complexidade Técnica:** ⭐⭐⭐
- Componente StatCard novo
- Configuração de INSIGHTS_CONFIG
- Integração com sistema de busca existente

**Riscos:** 
- ⚠️ Definição de métricas B2B (precisa validação cliente)
- ⚠️ Performance se estatísticas forem dinâmicas (usar estático)

**Recomendação:** ✅ **INCLUIR - Prioridade 1**
- Alto valor de negócio
- Independente das outras features
- Pode ser desenvolvida em paralelo

---

### FEATURE-01: Caixa "Tipo de Busca" (5 pts) 🟡

**Valor de Negócio:** ⭐⭐⭐
- Melhoria UX (reduz fricção)
- Mais intuitivo para novos usuários
- Nice to have, não crítico

**Complexidade Técnica:** ⭐⭐
- Reestruturação visual
- Componentes já existem, só reorganizar
- Baixo risco técnico

**Riscos:**
- ⚠️ Mudança pode confundir usuários habituados ao atual
- ⚠️ Precisa validação com usuários reais

**Recomendação:** ⏸️ **CONSIDERAR - Prioridade 3**
- Valor menor que outras features
- Pode entrar se sobrar tempo
- Alternativa: deixar para próxima sprint

---

### FEATURE-02: Caixa de Filtros (8 pts) 🔴

**Valor de Negócio:** ⭐⭐⭐⭐⭐
- **GAME CHANGER** - permite busca apenas com filtros
- Caso de uso B2B muito comum: "Empresas SP, ME, Ativas"
- Aumenta versatilidade da ferramenta

**Complexidade Técnica:** ⭐⭐⭐⭐
- Mudança na lógica de validação backend
- Schema validator novo
- Frontend: contador visual + lógica canSearch
- Precisa testes extensivos

**Riscos:**
- ⚠️ Queries muito amplas (mitigar com LIMIT)
- ⚠️ Performance com 3+ filtros simultâneos
- ⚠️ UX complexa (contador, feedback, estados)

**Recomendação:** ✅ **INCLUIR - Prioridade 2**
- Valor de negócio altíssimo
- Complementa FEATURE-00 (estatísticas)
- Risco técnico gerenciável

---

### FEATURE-03: Buscas Populares (3 pts) 🟡

**Valor de Negócio:** ⭐⭐⭐⭐
- Quick wins para usuários
- Guia para casos de uso comuns
- Aumenta engajamento

**Complexidade Técnica:** ⭐
- Componente simples
- Dados estáticos (configuração JSON)
- Baixíssimo risco

**Riscos:**
- Nenhum relevante

**Recomendação:** ✅ **INCLUIR - Prioridade 4**
- Baixo esforço, alto valor
- Pode ser implementada rapidamente
- Boa para finalizar sprint

---

## ✅ Decisão: Features Comprometidas para Sprint

### 🎯 Sprint Commitment

Após análise, **TODAS as 4 features** entram na sprint:

| Prioridade | Feature | Story Points | Justificativa |
|------------|---------|--------------|---------------|
| **P1** 🔴 | FEATURE-00: Estatísticas | 8 pts | Alto valor, independente, primeira entrega |
| **P2** 🔴 | FEATURE-02: Filtros | 8 pts | Game changer, crítico para B2B |
| **P3** 🟡 | FEATURE-01: Tipo Busca | 5 pts | Melhoria UX, complementa as outras |
| **P4** 🟡 | FEATURE-03: Buscas Populares | 3 pts | Rápido, fecha sprint com chave de ouro |

**Total:** 24 story points ✅

---

## 📅 Ordem de Implementação

### Semana 1 (25/10 - 01/11)

#### Sprint Day 1-3: FEATURE-00 (Estatísticas)
```
Dia 1 (25/10): 
  ✓ Sprint Planning
  → ISSUE-00-A: Definir estatísticas B2B (3h)

Dia 2 (26/10):
  → ISSUE-00-B: Implementar StatCard (5h)
  → Integração com busca

Dia 3 (27/10):
  → Testes e refinamentos
  → Review com PO
  ✅ FEATURE-00 DONE
```

#### Sprint Day 4-6: FEATURE-02 (Filtros)
```
Dia 4 (28/10):
  → ISSUE-02-A: Lógica backend (6h)
  → Schema validators

Dia 5 (29/10):
  → ISSUE-02-B: Validação mínima 3 filtros (2h)
  → Frontend: contador + canSearch

Dia 6 (30/10):
  → ISSUE-02-C: UX feedback (3h)
  → Testes extensivos
  ✅ FEATURE-02 DONE
```

### Semana 2 (03/11 - 08/11)

#### Sprint Day 7-8: FEATURE-01 (Tipo de Busca)
```
Dia 7 (03/11):
  → ISSUE-01-A: UX reestruturada (3h)
  → Design components

Dia 8 (04/11):
  → ISSUE-01-B: Implementação (4h)
  → Testes
  ✅ FEATURE-01 DONE
```

#### Sprint Day 9: FEATURE-03 (Buscas Populares)
```
Dia 9 (05/11):
  → ISSUE-03-A: Definir buscas (2h)
  → ISSUE-03-B: Reposicionar (2h)
  → ISSUE-03-C: Design cards (3h)
  ✅ FEATURE-03 DONE
```

#### Sprint Day 10: Buffer & Review
```
Dia 10 (06/11):
  → Testes integrados
  → Ajustes finais
  → Documentação
  → Preparar demo

Dia 11 (07/11):
  → Sprint Review (demo)
  → Sprint Retrospective
  → Planning próxima sprint
```

---

## 🎯 Sprint Goals (SMART)

1. **Estatísticas Acionáveis**
   - ✅ Specific: Implementar 6+ estatísticas clicáveis que executam buscas
   - ✅ Measurable: StatCard component + INSIGHTS_CONFIG
   - ✅ Achievable: 8 pts em 3 dias
   - ✅ Relevant: Transforma dados em ações
   - ✅ Time-bound: Até 27/10

2. **Busca por Filtros**
   - ✅ Specific: Permitir busca APENAS com 3+ filtros (sem valor)
   - ✅ Measurable: Backend validator + frontend counter
   - ✅ Achievable: 8 pts em 3 dias
   - ✅ Relevant: Case B2B crítico
   - ✅ Time-bound: Até 30/10

3. **UX Aprimorado**
   - ✅ Specific: Tipo de busca reestruturado + buscas populares no topo
   - ✅ Measurable: 2 features (FEATURE-01 + FEATURE-03)
   - ✅ Achievable: 8 pts em 2 dias
   - ✅ Relevant: Reduz fricção, aumenta engajamento
   - ✅ Time-bound: Até 05/11

---

## 📊 Distribuição de Story Points

```
Semana 1: 16 pts (FEATURE-00 + FEATURE-02)
├─ FEATURE-00: 8 pts (Estatísticas) ████████
└─ FEATURE-02: 8 pts (Filtros)      ████████

Semana 2: 8 pts (FEATURE-01 + FEATURE-03)
├─ FEATURE-01: 5 pts (Tipo Busca)   █████
└─ FEATURE-03: 3 pts (Buscas Pop.)  ███

Total: 24 pts ████████████████████████
```

---

## 🚦 Definition of Ready (DoR)

Todas as features atendem DoR? ✅

- [x] **User Story clara** - Objetivos definidos
- [x] **Critérios de Aceitação** - Must/Should/Could definidos
- [x] **Estimativa** - Story points atribuídos
- [x] **Prioridade** - Alta/Média definida
- [x] **Dependências** - Nenhuma bloqueante
- [x] **Design/UX** - Mockups documentados
- [x] **Implementação técnica** - Código exemplo fornecido

---

## 🎯 Definition of Done (DoD)

Uma feature é "Done" quando:

- [ ] ✅ Código implementado e commitado (branch beta004)
- [ ] ✅ Testes manuais realizados e aprovados
- [ ] ✅ Sem erros TypeScript/Python
- [ ] ✅ Performance OK (buscas < 200ms)
- [ ] ✅ Responsivo (mobile + desktop)
- [ ] ✅ Validação do Product Owner
- [ ] ✅ Deploy em dev (docker-compose up)
- [ ] ✅ Documentação atualizada (README/KANBAN)

---

## ⚠️ Riscos Identificados

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Performance com filtros complexos | 🔴 Alto | 🟡 Média | LIMIT hard + índices existentes |
| Estatísticas dinâmicas lentas | 🟡 Médio | 🟢 Baixa | Usar dados estáticos/cache |
| UX confusa para usuários antigos | 🟡 Médio | 🟡 Média | Manter retrocompatibilidade |
| Escopo aumentar (scope creep) | 🔴 Alto | 🟢 Baixa | Seguir DoD rigorosamente |

**Plano de Contingência:**
- Se FEATURE-02 travar → Priorizar FEATURE-00 + FEATURE-03 (mínimo viável)
- Se faltar tempo → FEATURE-01 move para próxima sprint

---

## 📝 Action Items

### Imediato (hoje, 25/10)
- [x] ✅ Sprint Planning concluído
- [ ] 🔜 Atualizar KANBAN (mover features para "To Do")
- [ ] 🔜 Criar branches de trabalho
- [ ] 🔜 Iniciar ISSUE-00-A (definir estatísticas)

### Próximos Dias
- [ ] Daily update no KANBAN (todo dia 18h)
- [ ] Commit com tags [FEATURE-XX]
- [ ] Review parcial dia 30/10 (meio da sprint)

---

## 💬 Notas da Reunião

### Discussões Principais

**1. Por que incluir todas as 4 features?**
- Velocity anterior foi alta (4.8 pts/dia)
- Features independentes (podem ser paralelas)
- 2 semanas é tempo suficiente
- Se sobrar tempo, polimos detalhes

**2. Ordem de prioridade justificada:**
- FEATURE-00 primeiro: fundação (estatísticas guiam usuário)
- FEATURE-02 segundo: maior valor B2B (busca por filtros)
- FEATURE-01 terceiro: complementa as outras
- FEATURE-03 quarto: rápida, fecha sprint bem

**3. Preocupações técnicas:**
- Performance com filtros → Mitigado (índices já existem)
- Queries muito amplas → LIMIT hard de 1000
- Complexidade UX → Iterações rápidas com PO

### Decisões Tomadas

✅ **Commit: 24 story points (4 features)**  
✅ **Ordem de implementação definida**  
✅ **DoD e DoR validados**  
✅ **Riscos identificados com mitigações**  

---

## 📊 Burndown Esperado

```
Story Points Restantes

24 │●
   │  ●
20 │    ●
   │      ●
16 │        ●  ← FEATURE-00 done (dia 3)
   │          ●
12 │            ●
   │              ●
 8 │                ●  ← FEATURE-02 done (dia 6)
   │                  ●
 5 │                    ●  ← FEATURE-01 done (dia 8)
   │                      ●
 0 │________________________● ← Sprint done (dia 10)
   0  1  2  3  4  5  6  7  8  9  10
          Dias da Sprint
```

---

## 🎉 Expectativas de Entrega

### Entrega Mínima Viável (MVP)
- ✅ FEATURE-00: Estatísticas acionáveis
- ✅ FEATURE-02: Busca por filtros

**Com isso, já entregamos 80% do valor!**

### Entrega Ideal (Full Sprint)
- ✅ FEATURE-00: Estatísticas
- ✅ FEATURE-02: Filtros
- ✅ FEATURE-01: Tipo de busca
- ✅ FEATURE-03: Buscas populares

**Entrega completa = 100% valor planejado**

---

## 📚 Referências

- [README da Sprint](README.md)
- [KANBAN](KANBAN.md)
- [FEATURE-00: Estatísticas](FEATURES/FEATURE-00-ESTATISTICAS.md)
- [FEATURE-01: Tipo Busca](FEATURES/FEATURE-01-TIPO-BUSCA.md)
- [FEATURE-02: Filtros](FEATURES/FEATURE-02-FILTROS.md)
- [FEATURE-03: Buscas Populares](FEATURES/FEATURE-03-BUSCAS-POPULARES.md)
- [Metodologia Agile](../../ESTRUTURA_DE_REFERENCIA_PARA_IA/README_AGILE_SCRUM.md)

---

**Sprint Planning Concluído! 🚀**

**Próximo passo:** Atualizar KANBAN e iniciar FEATURE-00 (Estatísticas)

---

**Documentado por:** IA Copilot (Scrum Master)  
**Aprovado por:** LinkerX (Product Owner)  
**Data:** 25/10/2025  
**Versão:** 1.0
