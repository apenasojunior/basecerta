# 📋 Estrutura de Organização do Projeto BaseCerta

> **Documento**: Metodologia de hierarquia de atividades (Sprints > Features > Issues)

**Data de Criação**: 2 de Janeiro de 2026  
**Versão**: 1.0.0  
**Status**: ✅ Estrutura definida e pronta para uso

---

## 🎯 Objetivo

Este documento define a **estrutura hierárquica** para organização e rastreamento de todas as atividades do projeto BaseCerta, garantindo clareza, organização e fácil acompanhamento do progresso.

---

## 📊 Hierarquia de Organização

A estrutura é dividida em **3 níveis hierárquicos**:

```
1. SPRINTS
   └── 1.1 FEATURES
       └── 1.1.1 ISSUES
```

### Nível 1: SPRINTS
Ciclos de desenvolvimento de 2 semanas com objetivos macro definidos.

### Nível 2: FEATURES (dentro de cada Sprint)
Funcionalidades ou módulos específicos a serem desenvolvidos na sprint.

### Nível 3: ISSUES (dentro de cada Feature)
Tarefas atômicas e específicas necessárias para completar a feature.

---

## 🏷️ Nomenclatura Padronizada

### Formato de Identificação

**SPRINTS:**
- Formato: `S##`
- Exemplo: `S01`, `S02`, `S03`

**FEATURES:**
- Formato: `S## - F##`
- Exemplo: `S01-F01`, `S01-F02`, `S02-F01`

**ISSUES:**
- Formato: `S## - F## - I##`
- Exemplo: `S01-F01-I01`, `S01-F02-I03`

### Regras de Numeração
- Numeração sempre com **2 dígitos** (01, 02, 03... 10, 11...)
- Numeração **sequencial** dentro de cada nível
- Issues sempre vinculadas à sua Feature pai
- Features sempre vinculadas à sua Sprint pai

---

## 📝 Exemplo Prático

### Sprint 01: MUDAR FRONTEND

```
S01: MUDAR FRONTEND
├── S01-F01: CRIAR MENUS DE BUSCA
│   ├── S01-F01-I01: Definir tipo do Menu
│   ├── S01-F01-I02: Criar componente de busca
│   └── S01-F01-I03: Implementar filtros avançados
│
├── S01-F02: MUDAR CORES DOS BOTÕES
│   ├── S01-F02-I01: Aplicar cores laranja
│   ├── S01-F02-I02: Atualizar paleta de cores
│   └── S01-F02-I03: Testar contraste e acessibilidade
│
└── S01-F03: OTIMIZAR PERFORMANCE
    ├── S01-F03-I01: Implementar lazy loading
    ├── S01-F03-I02: Minificar assets
    └── S01-F03-I03: Configurar cache
```

---

## 📐 Template de Documentação

### Sprint Template

```markdown
# S## - [NOME DA SPRINT]

**Período**: [Data Início] - [Data Fim]  
**Objetivo**: [Descrição do objetivo macro da sprint]  
**Story Points Total**: [XX pontos]

## Features desta Sprint

### S##-F01 - [Nome da Feature 1]
**Story Points**: X pontos  
**Responsável**: [Nome]  
**Status**: 🔴 To Do / 🟡 In Progress / 🟢 Done

#### Issues:
- [ ] S##-F01-I01: [Descrição da issue]
- [ ] S##-F01-I02: [Descrição da issue]
- [ ] S##-F01-I03: [Descrição da issue]

### S##-F02 - [Nome da Feature 2]
...
```

### Feature Template

```markdown
# S##-F## - [NOME DA FEATURE]

**Sprint**: S##  
**Story Points**: X pontos  
**Responsável**: [Nome]  
**Status**: 🔴 To Do / 🟡 In Progress / 🟢 Done

## Descrição
[Descrição detalhada da feature]

## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Issues desta Feature

### S##-F##-I01: [Nome da Issue]
**Status**: 🔴 To Do  
**Estimativa**: Xh  
**Descrição**: [Descrição da tarefa]

### S##-F##-I02: [Nome da Issue]
...
```

### Issue Template

```markdown
# S##-F##-I## - [NOME DA ISSUE]

**Sprint**: S##  
**Feature**: S##-F##  
**Responsável**: [Nome]  
**Status**: 🔴 To Do / 🟡 In Progress / 🟢 Done  
**Estimativa**: Xh  
**Story Points**: X

## Descrição
[Descrição detalhada da tarefa]

## Checklist
- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

## Dependências
- Depende de: S##-F##-I##
- Bloqueia: S##-F##-I##

## Notas
[Observações importantes]
```

---

## 📂 Organização de Arquivos

### Estrutura de Pastas Recomendada

```
agile/
├── sprints/
│   ├── S01/
│   │   ├── sprint-planning.md
│   │   ├── sprint-retrospective.md
│   │   ├── features/
│   │   │   ├── S01-F01.md
│   │   │   ├── S01-F02.md
│   │   │   └── S01-F03.md
│   │   └── issues/
│   │       ├── S01-F01-I01.md
│   │       ├── S01-F01-I02.md
│   │       └── ...
│   │
│   ├── S02/
│   │   └── ...
│   │
│   └── ...
│
├── templates/
├── docs/
└── estrutura/
    └── ESTRUTURA.md (este arquivo)
```

---

## 🎨 Código de Cores e Status

### Status das Tarefas

| Emoji | Status | Descrição |
|-------|--------|-----------|
| 🔴 | To Do | Não iniciada |
| 🟡 | In Progress | Em andamento |
| 🟢 | Done | Concluída |
| ⚫ | Blocked | Bloqueada |
| 🔵 | Review | Em revisão |

### Prioridades

| Emoji | Prioridade | Quando usar |
|-------|------------|-------------|
| 🔥 | Critical | Bloqueador, precisa ser resolvido imediatamente |
| 🟠 | High | Importante, deve ser feito nesta sprint |
| 🟡 | Medium | Relevante, mas pode esperar se necessário |
| 🟢 | Low | Nice to have, pode ser movido para próxima sprint |

---

## 📊 Rastreamento e Métricas

### Informações a Acompanhar

**Por Sprint:**
- Total de Story Points planejados
- Total de Story Points concluídos
- Velocity (média de pontos por sprint)
- Número de features planejadas vs concluídas
- Burndown chart

**Por Feature:**
- Story Points estimados
- Tempo real gasto
- Número de issues
- Dependências
- Responsável

**Por Issue:**
- Estimativa de tempo
- Tempo real gasto
- Bloqueios encontrados
- Commits relacionados

---

## 🔄 Workflow Recomendado

### 1. Planejamento da Sprint (Sprint Planning)
1. Definir objetivo macro da sprint (S##)
2. Listar features necessárias (S##-F##)
3. Quebrar features em issues (S##-F##-I##)
4. Estimar story points
5. Distribuir responsabilidades

### 2. Durante a Sprint
1. Atualizar status das issues diariamente
2. Mover issues entre To Do → In Progress → Done
3. Documentar bloqueios
4. Atualizar burndown chart

### 3. Fim da Sprint (Sprint Review + Retrospective)
1. Revisar features concluídas
2. Demonstrar funcionalidades
3. Calcular velocity
4. Documentar aprendizados
5. Planejar melhorias

---

## 🎯 Exemplo Completo de Sprint

### Sprint 01: IMPLEMENTAR AUTENTICAÇÃO E FRONTEND BASE

```
S01: IMPLEMENTAR AUTENTICAÇÃO E FRONTEND BASE
Período: 02/01/2026 - 16/01/2026
Story Points: 34 pontos

├── S01-F01: CRIAR SISTEMA DE AUTENTICAÇÃO
│   Story Points: 13 pontos
│   ├── S01-F01-I01: Criar tabela users no PostgreSQL (2h)
│   ├── S01-F01-I02: Implementar endpoint de registro (4h)
│   ├── S01-F01-I03: Implementar endpoint de login (4h)
│   ├── S01-F01-I04: Gerar JWT tokens (3h)
│   ├── S01-F01-I05: Criar middleware de autenticação (3h)
│   └── S01-F01-I06: Testes unitários de autenticação (4h)
│
├── S01-F02: DESENVOLVER INTERFACE DE LOGIN
│   Story Points: 8 pontos
│   ├── S01-F02-I01: Criar página de login (4h)
│   ├── S01-F02-I02: Criar página de registro (4h)
│   ├── S01-F02-I03: Validação de formulários (3h)
│   └── S01-F02-I04: Integrar com API de auth (3h)
│
├── S01-F03: CONFIGURAR REDIS PARA SESSÕES
│   Story Points: 5 pontos
│   ├── S01-F03-I01: Configurar conexão Redis (2h)
│   ├── S01-F03-I02: Implementar armazenamento de sessões (3h)
│   └── S01-F03-I03: Implementar logout e invalidação (2h)
│
└── S01-F04: CRIAR DASHBOARD INICIAL
    Story Points: 8 pontos
    ├── S01-F04-I01: Estrutura base do dashboard (4h)
    ├── S01-F04-I02: Menu de navegação (3h)
    ├── S01-F04-I03: Cards informativos (3h)
    └── S01-F04-I04: Gráficos básicos (4h)
```

---

## 🔗 Integração com Git

### Convenção de Commits

Relacionar commits com issues usando o ID na mensagem:

```bash
git commit -m "S01-F01-I02: Implement user registration endpoint

- Created POST /api/auth/register route
- Added email validation
- Hash password with bcrypt
- Return JWT token on success"
```

### Branches

Criar branches seguindo a estrutura:

```bash
# Para features
git checkout -b feature/S01-F01-authentication

# Para issues específicas
git checkout -b feature/S01-F01-I02-register-endpoint

# Para bugs
git checkout -b bugfix/S01-F02-I03-form-validation
```

---

## 📌 Regras e Boas Práticas

### ✅ Fazer

- ✅ Sempre documentar issues com descrição clara
- ✅ Atualizar status regularmente
- ✅ Estimar antes de iniciar
- ✅ Relacionar commits com issues
- ✅ Quebrar features grandes em issues menores
- ✅ Documentar bloqueios imediatamente
- ✅ Revisar retrospectivas das sprints anteriores

### ❌ Evitar

- ❌ Issues muito grandes (> 8 horas)
- ❌ Features sem issues definidas
- ❌ Mudanças sem rastreamento
- ❌ Status desatualizados
- ❌ Pular etapas de planejamento
- ❌ Não documentar decisões importantes

---

## 🚀 Como Começar

### Passo 1: Criar Primeira Sprint
1. Criar pasta `agile/sprints/S01/`
2. Copiar templates de planning e retrospective
3. Definir objetivo da sprint

### Passo 2: Definir Features
1. Listar principais funcionalidades
2. Criar arquivo para cada feature em `S01/features/`
3. Estimar story points

### Passo 3: Quebrar em Issues
1. Para cada feature, listar tarefas atômicas
2. Criar arquivo para cada issue em `S01/issues/`
3. Estimar tempo de cada issue

### Passo 4: Executar e Acompanhar
1. Daily standup para status
2. Atualizar burndown chart
3. Documentar bloqueios
4. Fazer review e retrospective ao final

---

## 📚 Referências

- [Agile README](../README.md)
- [Sprint Planning Template](../templates/sprint-planning-template.md)
- [Sprint Retrospective Template](../templates/sprint-retrospective-template.md)
- [User Story Template](../templates/user-story-template.md)
- [Bug Report Template](../templates/bug-report-template.md)
- [GENESIS - Documentação Completa](../../docs/estrutura/genesis/GENESIS.md)

---

**Criado em**: 2 de Janeiro de 2026  
**Localização**: `agile/estrutura/ESTRUTURA.md`  
**Status**: ✅ Ativo e pronto para uso

---

🎯 **BaseCerta - Estrutura clara para evolução organizada!**
