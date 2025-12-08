# 📋 Estrutura Agile (Scrum) - BaseCerta

## 🎯 Visão Geral

Este documento define a estrutura de gerenciamento de sprints seguindo metodologia Agile/Scrum para o desenvolvimento do produto BaseCerta.

## 📁 Estrutura de Diretórios

```
docs/
└── sprints/
    ├── [nome-da-sprint]/
    │   ├── README.md              # Visão geral da sprint
    │   ├── KANBAN.md              # Board Kanban de features
    │   ├── FEATURES/
    │   │   ├── FEATURE-01.md      # Documentação de feature específica
    │   │   ├── FEATURE-02.md
    │   │   └── ...
    │   ├── ISSUES/
    │   │   ├── ISSUE-01.md        # Issues detalhadas
    │   │   ├── ISSUE-02.md
    │   │   └── ...
    │   └── RETROSPECTIVE.md       # Retrospectiva da sprint
    │
    ├── smart-cnpj-search/         # Sprint: Página de Busca
    ├── smart-cnpj-results/        # Sprint: Página de Resultados
    └── smart-cnpj-detalhes/       # Sprint: Página de Detalhes
```

---

## 📖 Anatomia de uma Sprint

### 1. Nome da Sprint

**Formato:** `[produto/funcionalidade]`

**Exemplos:**
- `smart-cnpj-search` - Melhorias na página de busca
- `smart-cnpj-results` - Otimizações na página de resultados
- `smart-cnpj-detalhes` - Aprimoramentos na página de detalhes

### 2. Componentes de uma Sprint

#### 📄 README.md (Visão Geral)
Documento principal da sprint contendo:

```markdown
# Sprint: [Nome da Sprint]

## 📅 Informações
- **Início:** DD/MM/YYYY
- **Término:** DD/MM/YYYY
- **Duração:** X semanas
- **Status:** 🟢 Em Andamento | 🟡 Bloqueado | ✅ Concluído

## 🎯 Objetivos
Lista de objetivos principais da sprint

## 📊 Métricas
- Total de Features: X
- Total de Issues: Y
- Progresso: Z%

## 👥 Time
- Product Owner: Nome
- Scrum Master: Nome/IA
- Desenvolvedores: Nome, IA

## 📝 Features
Lista de features com links para documentos detalhados
```

#### 📊 KANBAN.md (Board de Acompanhamento)
Board visual para acompanhamento do status das features/issues:

```markdown
# 📊 Kanban - Sprint [Nome]

## 📋 Backlog
- [ ] FEATURE-XX: Descrição breve

## 🔜 A Fazer (To Do)
- [ ] FEATURE-01: Descrição breve
- [ ] ISSUE-01-A: Sub-tarefa

## 🏗️ Em Progresso (In Progress)
- [ ] FEATURE-02: Descrição breve (50% completo)
- [ ] ISSUE-02-A: Sub-tarefa (em análise)

## 👀 Em Revisão (Review)
- [ ] FEATURE-03: Descrição breve (aguardando validação)

## ✅ Concluído (Done)
- [x] FEATURE-04: Descrição completa
- [x] ISSUE-04-A: Sub-tarefa resolvida
```

#### 🎨 FEATURES/ (Diretório de Features)
Cada feature é uma funcionalidade ou área específica.

**Template de Feature (FEATURE-XX.md):**

```markdown
# FEATURE-XX: [Nome da Feature]

## 📋 Metadados
- **ID:** FEATURE-XX
- **Prioridade:** 🔴 Alta | 🟡 Média | 🟢 Baixa
- **Status:** 📋 Backlog | 🔜 To Do | 🏗️ In Progress | 👀 Review | ✅ Done
- **Responsável:** Nome/IA
- **Estimativa:** X story points / Y horas
- **Data Início:** DD/MM/YYYY
- **Data Conclusão:** DD/MM/YYYY

## 🎯 Objetivo
Descrição clara do objetivo da feature

## 📝 Descrição Detalhada
Contexto completo e motivação para implementação

## 🔍 Issues Relacionadas
- [ ] ISSUE-XX-A: Descrição da sub-tarefa
- [ ] ISSUE-XX-B: Descrição da sub-tarefa
- [ ] ISSUE-XX-C: Descrição da sub-tarefa

## 📐 Critérios de Aceitação
1. [ ] Critério 1: Descrição testável
2. [ ] Critério 2: Descrição testável
3. [ ] Critério 3: Descrição testável

## 🎨 Design/UX
- Mockups
- Wireframes
- Fluxos de usuário

## 🔧 Implementação Técnica
### Backend
- Endpoints necessários
- Models/Schemas
- Lógica de negócio

### Frontend
- Componentes necessários
- Hooks/Services
- Rotas

## 🧪 Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Validação manual

## 📊 Métricas de Sucesso
Como medir o sucesso da feature

## 🚧 Bloqueios/Dependências
Lista de bloqueios ou dependências externas

## 📝 Notas/Observações
Informações adicionais relevantes
```

#### 🐛 ISSUES/ (Diretório de Issues)
Issues são tarefas específicas, menores que features.

**Template de Issue (ISSUE-XX.md):**

```markdown
# ISSUE-XX: [Descrição Curta]

## 📋 Metadados
- **ID:** ISSUE-XX
- **Feature Pai:** FEATURE-XX (se aplicável)
- **Tipo:** 🐛 Bug | ✨ Enhancement | 🔧 Refactor | 📝 Docs
- **Prioridade:** P0 Crítica | P1 Alta | P2 Média | P3 Baixa
- **Status:** 📋 Backlog | 🔜 To Do | 🏗️ In Progress | 👀 Review | ✅ Done
- **Responsável:** Nome/IA
- **Estimativa:** X horas
- **Data Início:** DD/MM/YYYY
- **Data Conclusão:** DD/MM/YYYY

## 🎯 Objetivo
O que precisa ser feito (objetivo claro e mensurável)

## 📝 Descrição
Contexto completo do problema ou melhoria

## 🔍 Passos para Reproduzir (se bug)
1. Passo 1
2. Passo 2
3. Resultado esperado vs obtido

## ✅ Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## 🔧 Solução Técnica
### Arquivos Afetados
- `caminho/arquivo1.ts`
- `caminho/arquivo2.py`

### Mudanças Necessárias
Descrição técnica das alterações

### Código/Pseudocódigo
```typescript
// Exemplo de implementação
```

## 🧪 Testes
- [ ] Teste manual realizado
- [ ] Testes automatizados criados
- [ ] Validação em dev
- [ ] Validação em staging

## 📸 Screenshots/Evidence
Antes e depois (se aplicável)

## 🔗 Referências
- Links para documentação
- PRs relacionados
- Discussões

## 📝 Notas
Observações adicionais
```

#### 🔄 RETROSPECTIVE.md (Retrospectiva da Sprint)

```markdown
# 🔄 Retrospectiva - Sprint [Nome]

## 📅 Data: DD/MM/YYYY

## 👥 Participantes
- Nome 1
- Nome 2
- IA Copilot

---

## ✅ O que funcionou bem? (Keep)
1. Item 1
2. Item 2
3. Item 3

## 🚧 O que pode melhorar? (Improve)
1. Item 1 - Ação sugerida
2. Item 2 - Ação sugerida
3. Item 3 - Ação sugerida

## 💡 Novas ideias (Try)
1. Ideia 1
2. Ideia 2
3. Ideia 3

## 📊 Métricas da Sprint
- **Features Planejadas:** X
- **Features Concluídas:** Y
- **Taxa de Conclusão:** Z%
- **Bugs Encontrados:** N
- **Bugs Corrigidos:** M
- **Velocity:** P story points

## 🎯 Action Items
- [ ] Ação 1 - Responsável - Prazo
- [ ] Ação 2 - Responsável - Prazo
- [ ] Ação 3 - Responsável - Prazo

## 📝 Observações Gerais
Notas adicionais sobre a sprint
```

---

## 🎭 Papéis e Responsabilidades

### Product Owner (PO)
- Define prioridades das features
- Valida critérios de aceitação
- Aprova conclusão de features
- Participa de retrospectivas

### Scrum Master (SM)
- Facilita cerimônias (planning, daily, review, retro)
- Remove impedimentos
- Monitora progresso
- Atualiza KANBAN

### Desenvolvedores
- Implementam features/issues
- Atualizam status no KANBAN
- Participam de todas as cerimônias
- Documentam soluções técnicas

### IA (Copilot/Assistant)
- Implementa código
- Documenta mudanças
- Sugere melhorias técnicas
- Mantém documentação atualizada

---

## 📅 Cerimônias Scrum

### 1. Sprint Planning
**Quando:** Início da sprint  
**Duração:** 1-2 horas  
**Objetivo:** Planejar trabalho da sprint

**Saídas:**
- Features selecionadas para sprint
- Issues criadas e estimadas
- KANBAN inicial preenchido

### 2. Daily Standup (Assíncrono via Chat)
**Quando:** Diariamente  
**Formato:** Atualização textual

**3 Perguntas:**
1. O que foi feito desde última atualização?
2. O que será feito até próxima?
3. Há impedimentos?

### 3. Sprint Review
**Quando:** Final da sprint  
**Duração:** 1 hora  
**Objetivo:** Demonstrar trabalho concluído

**Saídas:**
- Demo de features implementadas
- Feedback do PO
- Ajustes no backlog

### 4. Sprint Retrospective
**Quando:** Após Review  
**Duração:** 45min  
**Objetivo:** Melhoria contínua

**Saídas:**
- RETROSPECTIVE.md preenchido
- Action items definidos
- Melhorias para próxima sprint

---

## 📊 Sistema de Priorização

### Features
- 🔴 **Alta:** Impacto direto no negócio, bloqueio para outros trabalhos
- 🟡 **Média:** Importante mas não urgente, melhoria significativa
- 🟢 **Baixa:** Nice to have, otimizações menores

### Issues
- **P0 - Crítica:** Sistema quebrado, bug em produção
- **P1 - Alta:** Funcionalidade importante afetada
- **P2 - Média:** Bug menor, melhoria de UX
- **P3 - Baixa:** Refatoração, otimização

---

## 🏷️ Sistema de Status

### Estados do KANBAN

```
📋 Backlog      → Identificado mas não priorizado
🔜 To Do        → Priorizado para sprint atual
🏗️ In Progress  → Em desenvolvimento ativo
👀 Review       → Aguardando validação/aprovação
✅ Done         → Concluído e validado
🚫 Cancelled    → Cancelado (com justificativa)
⏸️ Blocked      → Bloqueado (identificar impedimento)
```

---

## 📏 Estimativas

### Story Points (Features)
- **1 pt:** Tarefa trivial (< 2h)
- **2 pts:** Tarefa simples (2-4h)
- **3 pts:** Tarefa média (4-8h)
- **5 pts:** Tarefa complexa (1-2 dias)
- **8 pts:** Tarefa muito complexa (2-4 dias)
- **13+ pts:** Feature grande (quebrar em menores)

### Horas (Issues)
- Estimativa direta em horas de trabalho
- Usado para tarefas mais técnicas e específicas

---

## 🔄 Workflow de Desenvolvimento

### 1. Feature/Issue criada
- PO cria documento em `/FEATURES` ou `/ISSUES`
- Define prioridade e critérios de aceitação
- Adiciona ao KANBAN em "Backlog"

### 2. Sprint Planning
- Time seleciona Features/Issues
- Move para "To Do" no KANBAN
- Estima esforço necessário

### 3. Desenvolvimento
- Dev/IA move para "In Progress"
- Implementa solução
- Atualiza documento com detalhes técnicos
- Commita código

### 4. Review/Validação
- Move para "Review"
- PO valida critérios de aceitação
- Testes são executados

### 5. Conclusão
- Move para "Done"
- Atualiza RETROSPECTIVE.md
- Fecha issue/feature

---

## 📝 Exemplo Prático: Smart CNPJ Search

### Estrutura de Diretório
```
docs/sprints/smart-cnpj-search/
├── README.md
├── KANBAN.md
├── FEATURES/
│   ├── FEATURE-00-ESTATISTICAS.md
│   ├── FEATURE-01-TIPO-BUSCA.md
│   ├── FEATURE-02-FILTROS.md
│   └── FEATURE-03-BUSCAS-POPULARES.md
├── ISSUES/
│   ├── ISSUE-00-A-REDEFINIR-ESTATISTICAS.md
│   ├── ISSUE-00-B-ESTATISTICAS-CLICAVEIS.md
│   ├── ISSUE-01-A-REESTRUTURAR-TIPOS.md
│   ├── ISSUE-02-A-FILTROS-COMO-BUSCA.md
│   └── ISSUE-02-B-MINIMO-3-FILTROS.md
└── RETROSPECTIVE.md
```

### Exemplo de KANBAN.md
```markdown
# 📊 Kanban - Sprint Smart CNPJ Search

## 📋 Backlog
- [ ] FEATURE-04: Histórico de buscas recentes

## 🔜 A Fazer (To Do)
- [ ] FEATURE-00: Área de Estatísticas (8 pts)
- [ ] ISSUE-00-A: Redefinir estatísticas relevantes (3h)
- [ ] ISSUE-00-B: Estatísticas clicáveis (5h)

## 🏗️ Em Progresso (In Progress)
- [ ] FEATURE-01: Caixa "Tipo de Busca" (5 pts) - 60% completo
- [ ] ISSUE-01-A: Reestruturar tipos de busca (4h)

## 👀 Em Revisão (Review)
- [ ] FEATURE-02: Caixa de Filtros (8 pts)
- [ ] ISSUE-02-A: Filtros como busca principal (6h)

## ✅ Concluído (Done)
- [x] FEATURE-03: Buscas Populares (3 pts)
- [x] ISSUE-03-A: Mover buscas populares para topo (2h)
```

---

## 🎯 Boas Práticas

### ✅ DO (Fazer)
- Manter KANBAN sempre atualizado
- Documentar decisões técnicas nas issues
- Estimar realisticamente
- Quebrar features grandes em menores
- Validar critérios de aceitação antes de marcar "Done"
- Participar ativamente das retrospectivas
- Commitar código com referência à issue (ex: `[ISSUE-01-A] Implementa novo tipo de busca`)

### ❌ DON'T (Não Fazer)
- Começar trabalho sem issue/feature documentada
- Deixar issues em "In Progress" por muito tempo sem atualização
- Pular cerimônias de retrospectiva
- Criar features sem critérios de aceitação claros
- Ignorar bloqueios sem comunicar
- Marcar como "Done" sem validação do PO

---

## 🔍 Monitoramento e Métricas

### Métricas por Sprint
- **Velocity:** Story points concluídos por sprint
- **Burndown Chart:** Progresso diário da sprint
- **Cycle Time:** Tempo médio de conclusão de issues
- **Taxa de Conclusão:** % de features concluídas vs planejadas

### Métricas de Qualidade
- **Bug Rate:** Bugs encontrados por feature
- **Reopen Rate:** % de issues reabertas
- **Code Coverage:** Cobertura de testes
- **Tech Debt:** Tempo gasto em refatoração

---

## 🚀 Getting Started

### Para começar uma nova sprint:

1. **Criar estrutura:**
   ```bash
   mkdir -p docs/sprints/[nome-sprint]/{FEATURES,ISSUES}
   ```

2. **Criar arquivos base:**
   - README.md (visão geral)
   - KANBAN.md (board inicial)

3. **Sprint Planning:**
   - Definir features prioritárias
   - Criar documentos de features
   - Quebrar em issues
   - Estimar esforço
   - Preencher KANBAN

4. **Durante a sprint:**
   - Daily updates no KANBAN
   - Documentar progresso nas issues
   - Commitar com referências

5. **Fim da sprint:**
   - Sprint Review (demo)
   - Preencher RETROSPECTIVE.md
   - Atualizar métricas
   - Planejar próxima sprint

---

## 📚 Referências

- [Scrum Guide](https://scrumguides.org/)
- [Agile Manifesto](https://agilemanifesto.org/)
- Documentação interna: `/docs/ESTRUTURA_DE_REFERENCIA_PARA_IA/`

---

**Última atualização:** 25/10/2025  
**Versão:** 1.0  
**Mantido por:** Product Owner + IA Copilot
