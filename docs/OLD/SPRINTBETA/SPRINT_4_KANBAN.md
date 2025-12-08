# 🎨 Sprint 4 - Páginas de Produtos & Features Avançadas
## BaseCerta - Kanban Detalhado

**Data de Criação:** 20/10/2025  
**Estimativa Total:** 28-32 horas  
**Issues Totais:** 24 issues  
**Sprint Anterior:** Sprint 3 - Componentes UI (100% completa)

---

## 📊 Progresso Sprint 4

- **Total de Issues:** 24
- **Concluídas:** 6 (25%)
- **Em Progresso:** 0 (0%)
- **Não Iniciadas:** 18 (75%)
- **Tempo Gasto:** ~5h de 28-32h estimadas

**Meta:** Criar 3 novas páginas de produtos funcionais + features avançadas

**Status Atual:** FASE 1 COMPLETA ✅ - Todos os 6 issues da página PF concluídos!

---

## 🎯 FASE 1: PÁGINA DADOS CADASTRAIS PF (6 issues) - 7h ✅ COMPLETA

### 1.1 📄 Estrutura da Página PF ✅
- **Status:** ✅ Concluído
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1h | **Real:** 1h
- **Descrição:**
  - ✅ Criado `/produtos/dados-cadastrais-pf/page.tsx`
  - ✅ Layout com grid responsivo (1 col mobile, 4 cols desktop)
  - ✅ Breadcrumbs: Produtos > Dados Cadastrais > Pessoa Física
  - ✅ Header com ícone azul User, título e descrição
  - ✅ Sidebar para filtros (desktop) + main content
  - ✅ Empty state com 3 dicas de busca
  - ✅ Build: 6.15 kB, 198 kB First Load

### 1.2 🔍 Formulário de Busca PF ✅
- **Status:** ✅ Concluído
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1.5h | **Real:** 1h
- **Descrição:**
  - ✅ Criado PersonSearchForm.tsx com React Hook Form + Zod
  - ✅ Busca por CPF (com máscara ###.###.###-##) ou Nome Completo
  - ✅ Validação CPF com algoritmo mod 11 (refine no schema Zod)
  - ✅ Auto-formatação em tempo real no onChange
  - ✅ Ícones Search (esquerda) e X (clear, direita)
  - ✅ Botões Buscar (azul primary) e Limpar (outline)
  - ✅ Help text dinâmico por tipo de busca
- **Arquivos:**
  - `components/produtos/PersonSearchForm.tsx` (170 linhas)

### 1.3 🎛️ Filtros Específicos PF ✅
- **Status:** ✅ Concluído
- **Prioridade:** 🟡 Alta
- **Estimativa:** 1.5h | **Real:** 1h
- **Descrição:**
  - ✅ Criado constants/person-filters.ts com 4 arrays de opções
  - ✅ Criado PersonFilters.tsx com Accordion de 4 seções
  - ✅ Filtros: UF (27 estados), Sexo (M/F/O/NI), Estado Civil (7 opções), Faixa Etária (5 ranges)
  - ✅ Badge com contador de filtros ativos no header
  - ✅ Badge individual em cada seção do accordion
  - ✅ Resumo de filtros ativos com badges removíveis (X)
  - ✅ Botões Aplicar (desabilitado se sem mudanças) e Limpar
  - ✅ State management local (localFilters) + sync com parent no Apply
  - ✅ Integrado no sidebar da página
- **Arquivos:**
  - `constants/person-filters.ts` (60 linhas)
  - `components/produtos/PersonFilters.tsx` (287 linhas)

### 1.4 📊 Tabela de Resultados PF ✅
- **Status:** ✅ Concluído
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1.5h | **Real:** 1h
- **Descrição:**
  - ✅ Criado types/person.ts com interfaces (Person, PersonTableData, PersonSearchFilters, etc)
  - ✅ Criado PersonTable.tsx com @tanstack/react-table
  - ✅ 7 colunas: CPF (monospace formatado), Nome, Idade, Sexo (map M→Masculino), UF, Município, Status
  - ✅ Badge de status com cores: Regular (verde), Pendências (amarelo), Restrições (vermelho)
  - ✅ Coluna Ações com DropdownMenu: Copiar CPF, Ver Detalhes, Baixar PDF, Gerar Relatório
  - ✅ Sorting em CPF, Nome, Idade (botões com ArrowUpDown)
  - ✅ Paginação: Anterior/Próxima + contador "Página X de Y"
  - ✅ Row hover + click para detalhes
  - ✅ Scroll horizontal automático em mobile
  - ✅ Integrado com mock data (5 pessoas)
- **Arquivos:**
  - `types/person.ts` (70 linhas)
  - `components/produtos/PersonTable.tsx` (300+ linhas)

### 1.5 🔗 Integração com API PF ✅
- **Status:** ✅ Concluído
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1h | **Real:** 1h
- **Descrição:**
  - ✅ Criado lib/api/endpoints/persons.ts com mock data (8 pessoas)
  - ✅ Funções: searchPersons (filtros + paginação), getPersonById, getPersonByCPF
  - ✅ Filtros: uf, sexo, estadoCivil, faixaEtaria aplicados no mock
  - ✅ Delay simulado (800ms) para UX realista
  - ✅ Criado hooks/usePersonSearch.ts com 3 hooks React Query:
    - usePersonSearch (com filtros, page, pageSize)
    - usePersonById
    - usePersonByCPF
  - ✅ StaleTime 5min, gcTime 10min
  - ✅ Integrado na página: searchParams state, usePersonSearch hook
  - ✅ Loading state (isLoading do React Query)
  - ✅ Error state com mensagem "Erro ao buscar"
  - ✅ Toast notifications: success com contador, info se 0 resultados, error em falha
  - ✅ Conversão Person→PersonTableData automática
- **Arquivos:**
  - `lib/api/endpoints/persons.ts` (200+ linhas, 8 mock persons)
  - `hooks/usePersonSearch.ts` (50 linhas, 3 hooks)

### 1.6 📱 Responsividade PF ✅
- **Status:** ✅ Concluído
- **Prioridade:** 🟡 Alta
- **Estimativa:** 0.5h | **Real:** 0.5h
- **Descrição:**
  - ✅ Atualizado MobileFilters.tsx com type discriminated union:
    - type: "person" → PersonFilters (Sheet bottom, 85vh, blue button)
    - type: "company" → CompanyFilters (Sheet left, legacy)
  - ✅ Badge contador de filtros ativos no botão flutuante
  - ✅ Floating button: bottom-right, z-50, rounded-full, 14x14, blue bg
  - ✅ Sheet side="bottom" com scroll interno, header com Filter icon azul
  - ✅ Integrado na página PF (lg:hidden, fixed positioning)
  - ✅ Fixed company page: adicionado type="company" prop
  - ✅ PersonTable já tem overflow-x-auto (scroll horizontal mobile) ✅
  - ✅ Grid responsivo: 1 col mobile, 4 cols desktop (lg:grid-cols-4)
  - ✅ Sidebar filtros: hidden lg:block
  - ✅ Build final: 0 errors, 6.15 kB page, 198 kB First Load
- **Arquivos:**
  - `components/produtos/MobileFilters.tsx` (120 linhas, discriminated union)

**FASE 1 RESUMO:**
- ✅ 6/6 issues completos
- ✅ Tempo real: ~5h vs 7h estimadas (29% ahead!)
- ✅ Arquivos criados: 8 files
  - 1 page: dados-cadastrais-pf/page.tsx
  - 4 components: PersonSearchForm, PersonFilters, PersonTable, MobileFilters (updated)
  - 2 lib: endpoints/persons.ts, hooks/usePersonSearch.ts
  - 1 type: types/person.ts
  - 1 constants: constants/person-filters.ts
- ✅ Build passing: 0 TypeScript errors, 6.15 kB, 198 kB First Load
- ✅ Features: CPF validation/mask, filters (accordion + mobile sheet), table (sort + pagination), React Query integration, responsive design

---

## 🏢 FASE 2: PÁGINA DADOS CADASTRAIS PJ (6 issues) - 7h

### 2.1 📄 Estrutura da Página PJ
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1h
- **Descrição:**
  - Criar `/produtos/dados-cadastrais-pj/page.tsx`
  - Layout consistente com outras páginas
  - Breadcrumbs: Produtos > Dados Cadastrais > Pessoa Jurídica
  - Diferenciação visual (cores/ícones) entre PF e PJ
- **Dependências:** FASE 1 completa (reutilizar componentes)
- **Arquivos:**
  - `frontend/src/app/produtos/dados-cadastrais-pj/page.tsx`

### 2.2 🔍 Formulário de Busca PJ Completo
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1.5h
- **Descrição:**
  - Busca por CNPJ, Razão Social, Nome Fantasia (reutilizar Sprint 3)
  - ADICIONAR: Busca por Inscrição Estadual
  - ADICIONAR: Busca por Email/Telefone
  - Multi-campo (buscar por vários critérios)
  - Validação completa
- **Dependências:** 2.1
- **Arquivos:**
  - `frontend/src/components/produtos/CompanyAdvancedSearchForm.tsx`
  - Estender validators.ts com IE, email, telefone

### 2.3 🎛️ Filtros Avançados PJ Expandidos
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟡 Alta
- **Estimativa:** 2h
- **Descrição:**
  - Reutilizar filtros da Sprint 3 (Situação, Porte, UF, CNAE)
  - ADICIONAR: Filtro por Capital Social (ranges)
  - ADICIONAR: Filtro por Data de Abertura (date range picker)
  - ADICIONAR: Filtro por Natureza Jurídica (expandido)
  - ADICIONAR: Filtro por Possui Filiais (sim/não)
  - Total de 8 filtros em accordion
- **Dependências:** 2.2
- **Arquivos:**
  - `frontend/src/components/produtos/CompanyAdvancedFilters.tsx`
  - Estender `constants/filters.ts`
  - Adicionar DateRangePicker (instalar react-day-picker se necessário)

### 2.4 📊 Tabela Detalhada PJ
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1.5h
- **Descrição:**
  - Expandir tabela da Sprint 3
  - Colunas: CNPJ, Razão Social, Situação, Porte, UF, Capital Social, Data Abertura, Ações
  - Row expansion para ver mais detalhes (sócios, filiais resumo)
  - Formatação de capital social (R$ X.XXX.XXX,XX)
  - Exportação CSV/Excel (preparar estrutura)
- **Dependências:** 2.3
- **Arquivos:**
  - `frontend/src/components/produtos/CompanyDetailedTable.tsx`

### 2.5 🔗 API Integration PJ Completa
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1h
- **Descrição:**
  - Expandir hook da Sprint 3
  - Adicionar endpoints para dados completos
  - Mock data mais rico (5-7 empresas com sócios)
  - Cache estratégico (5min busca, 10min detalhes)
- **Dependências:** 2.4
- **Arquivos:**
  - Estender `hooks/useCompanySearch.ts`
  - Adicionar `hooks/useCompanyDetails.ts`
  - Estender `lib/api/endpoints/products.ts`

### 2.6 ✨ Features Extras PJ
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟢 Média
- **Estimativa:** 0.5h
- **Descrição:**
  - Comparação de empresas (selecionar 2-3 para comparar)
  - Botão "Adicionar aos Favoritos"
  - Histórico de buscas recentes (últimas 5)
  - Quick actions no hover da linha
- **Dependências:** 2.1-2.5
- **Arquivos:**
  - Adicionar aos componentes existentes

---

## 💰 FASE 3: PÁGINA DOSSIE FINANCEIRO (7 issues) - 9h

### 3.1 📄 Estrutura Dossie Financeiro
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1.5h
- **Descrição:**
  - Criar `/produtos/dossie-financeiro/page.tsx`
  - Layout em 3 seções: Busca, Cards Resumo, Detalhes
  - Cards de estatísticas (Score, Protestos, Dívidas, Cheques)
  - Design mais visual (charts, gauges)
- **Dependências:** FASE 1 e 2 completas
- **Arquivos:**
  - `frontend/src/app/produtos/dossie-financeiro/page.tsx`

### 3.2 🔍 Formulário Busca Dossie
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1h
- **Descrição:**
  - Busca unificada: CPF ou CNPJ
  - Auto-detecção do tipo (11 dígitos = CPF, 14 = CNPJ)
  - Validação dinâmica
  - Switch para alternar entre PF/PJ
  - Histórico de consultas rápidas
- **Dependências:** 3.1
- **Arquivos:**
  - `frontend/src/components/produtos/DossieSearchForm.tsx`

### 3.3 📊 Cards de Score e Resumo
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟡 Alta
- **Estimativa:** 2h
- **Descrição:**
  - Card Score de Crédito (gauge 0-1000)
  - Card Protestos (quantidade + valor total)
  - Card Dívidas Ativas (quantidade + valor)
  - Card Cheques sem Fundo (quantidade + período)
  - StatsCard customizado com gráficos
  - Cores indicativas (verde/amarelo/vermelho)
- **Dependências:** 3.2
- **Arquivos:**
  - `frontend/src/components/produtos/FinancialScoreCards.tsx`
  - Instalar recharts ou similar para gráficos simples

### 3.4 📋 Tabela de Protestos
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟡 Alta
- **Estimativa:** 1.5h
- **Descrição:**
  - DataTable com protestos
  - Colunas: Data, Cartório, Cidade/UF, Valor, Status
  - Ordenação por valor/data
  - Badge de status (Ativo, Quitado, Prescrito)
  - Download de certidão (preparar)
  - Total geral no footer
- **Dependências:** 3.3
- **Arquivos:**
  - `frontend/src/components/produtos/ProtestTable.tsx`

### 3.5 💳 Tabela de Dívidas e Restrições
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟡 Alta
- **Estimativa:** 1.5h
- **Descrição:**
  - DataTable com dívidas ativas
  - Colunas: Órgão, Tipo Dívida, Valor, Data, Status, Ações
  - Tipos: Tributária, Previdenciária, FGTS, Trabalhista
  - Badge colorido por tipo
  - Ações: Ver Detalhes, Imprimir Certidão
  - Totalizador por tipo
- **Dependências:** 3.4
- **Arquivos:**
  - `frontend/src/components/produtos/DebtTable.tsx`

### 3.6 🔗 API Integration Dossie
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🔥 Crítica
- **Estimativa:** 1h
- **Descrição:**
  - Hook useFinancialDossie
  - Endpoints para score, protestos, dívidas
  - Mock data completo (2 PF + 2 PJ com dados variados)
  - Cache de 10 minutos (dados mais sensíveis)
  - Loading states por seção
- **Dependências:** 3.1-3.5
- **Arquivos:**
  - `frontend/src/hooks/useFinancialDossie.ts`
  - `frontend/src/lib/api/endpoints/financial.ts`

### 3.7 📊 Visualização de Score
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟢 Média
- **Estimativa:** 0.5h
- **Descrição:**
  - Gauge/Progress circular para score
  - Escala colorida (0-300 vermelho, 301-600 amarelo, 601-1000 verde)
  - Legenda explicativa
  - Evolução do score (últimos 6 meses - preparar estrutura)
- **Dependências:** 3.3
- **Arquivos:**
  - `frontend/src/components/produtos/ScoreGauge.tsx`

---

## 🚀 FASE 4: FEATURES AVANÇADAS (5 issues) - 5h

### 4.1 📥 Sistema de Exportação
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟡 Alta
- **Estimativa:** 1.5h
- **Descrição:**
  - Exportar resultados em CSV
  - Exportar resultados em Excel (XLSX)
  - Exportar relatório em PDF (preparar estrutura)
  - Modal de opções de exportação
  - Seleção de campos para exportar
  - Loading durante geração
- **Dependências:** FASE 1, 2, 3 completas
- **Arquivos:**
  - `frontend/src/components/produtos/ExportModal.tsx`
  - `frontend/src/lib/utils/export.ts` (CSV helper)
  - Instalar xlsx library

### 4.2 🔖 Sistema de Favoritos
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟢 Média
- **Estimativa:** 1h
- **Descrição:**
  - Adicionar/remover favoritos (localStorage)
  - Ícone estrela nas tabelas
  - Página /favoritos com lista completa
  - Filtros e busca em favoritos
  - Agrupamento por tipo (PF/PJ/Financeiro)
  - Limite de 50 favoritos
- **Dependências:** useLocalStorage (Sprint 3)
- **Arquivos:**
  - `frontend/src/app/favoritos/page.tsx`
  - `frontend/src/hooks/useFavorites.ts`
  - `frontend/src/components/produtos/FavoriteButton.tsx`

### 4.3 🕐 Histórico de Consultas
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟢 Média
- **Estimativa:** 1h
- **Descrição:**
  - Salvar histórico de consultas (localStorage)
  - Mostrar últimas 20 consultas
  - Agrupamento por data (Hoje, Ontem, Esta Semana, Mais Antigas)
  - Ações: Refazer busca, Limpar histórico
  - Contador de consultas por tipo
  - Página /historico
- **Dependências:** useLocalStorage
- **Arquivos:**
  - `frontend/src/app/historico/page.tsx`
  - `frontend/src/hooks/useSearchHistory.ts`
  - `frontend/src/components/produtos/SearchHistoryList.tsx`

### 4.4 🔍 Comparador de Empresas
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟢 Média
- **Estimativa:** 1.5h
- **Descrição:**
  - Selecionar 2-3 empresas para comparar
  - Modal/página de comparação lado a lado
  - Destacar diferenças (cores)
  - Comparar: Situação, Porte, Capital, Data Abertura, Score
  - Exportar comparação
  - Salvar comparações frequentes
- **Dependências:** FASE 2 completa
- **Arquivos:**
  - `frontend/src/components/produtos/CompanyComparator.tsx`
  - `frontend/src/app/produtos/comparar/page.tsx`

### 4.5 📈 Dashboard de Estatísticas
- **Status:** 🔴 Não Iniciado
- **Prioridade:** 🟢 Média
- **Estimativa:** 1h
- **Descrição:**
  - Expandir dashboard existente
  - Cards: Total de consultas, Consultas por tipo, Créditos gastos
  - Gráfico de consultas (últimos 7 dias)
  - Top 5 consultas mais feitas
  - Lista de consultas recentes
  - Link rápido para favoritos
- **Dependências:** Todos os hooks de busca
- **Arquivos:**
  - Estender `app/dashboard/page.tsx`
  - `frontend/src/components/dashboard/SearchStatsCards.tsx`
  - `frontend/src/components/dashboard/RecentSearches.tsx`

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

### **Semana 1 (16-20h): Páginas Principais**

**Dias 1-2 (7h): FASE 1 - Dados PF**
1. 1.1 - Estrutura PF (1h)
2. 1.2 - Formulário PF (1.5h)
3. 1.3 - Filtros PF (1.5h)
4. 1.4 - Tabela PF (1.5h)
5. 1.5 - API PF (1h)
6. 1.6 - Responsividade PF (0.5h)

**Dias 3-4 (7h): FASE 2 - Dados PJ**
7. 2.1 - Estrutura PJ (1h)
8. 2.2 - Formulário PJ (1.5h)
9. 2.3 - Filtros PJ (2h)
10. 2.4 - Tabela PJ (1.5h)
11. 2.5 - API PJ (1h)
12. 2.6 - Features PJ (0.5h)

**Dias 5-6 (9h): FASE 3 - Dossie Financeiro**
13. 3.1 - Estrutura Dossie (1.5h)
14. 3.2 - Formulário Dossie (1h)
15. 3.3 - Cards Score (2h)
16. 3.4 - Tabela Protestos (1.5h)
17. 3.5 - Tabela Dívidas (1.5h)
18. 3.6 - API Dossie (1h)
19. 3.7 - Score Gauge (0.5h)

### **Semana 2 (5h): Features Avançadas**

**Dia 7 (5h): FASE 4 - Features**
20. 4.1 - Exportação (1.5h)
21. 4.2 - Favoritos (1h)
22. 4.3 - Histórico (1h)
23. 4.4 - Comparador (1.5h)
24. 4.5 - Dashboard Stats (1h)

---

## 📊 MÉTRICAS DE SUCESSO

- ✅ 3 novas páginas de produtos funcionais
- ✅ Busca por CPF e CNPJ funcionando
- ✅ Dossie financeiro com score e tabelas
- ✅ Sistema de exportação (CSV/Excel)
- ✅ Favoritos e histórico implementados
- ✅ Comparador de empresas funcional
- ✅ Dashboard expandido com estatísticas
- ✅ Todas as páginas responsivas
- ✅ Mock data para todas as features
- ✅ Build sem erros TypeScript

---

## 📦 DEPENDÊNCIAS NOVAS

### NPM Packages a Instalar:
```bash
# Exportação
npm install xlsx                    # Excel export
npm install jspdf jspdf-autotable  # PDF generation

# Gráficos (opcional, pode usar CSS)
npm install recharts               # Charts simples

# Date Picker (se necessário)
npm install react-day-picker       # Date range picker
```

---

## 🚀 PRÓXIMAS SPRINTS (Visão)

**Sprint 5:** Backend - Endpoints reais + Integração APIs externas  
**Sprint 6:** Pesquisas Jurídicas (Processos, Tribunal)  
**Sprint 7:** Sistema de Relatórios Personalizados  
**Sprint 8:** Autenticação & Segurança  
**Sprint 9:** Performance & Otimização  
**Sprint 10:** Testes E2E & Deploy

---

## 🎨 DESIGN NOTES

### Paleta de Cores por Tipo:
- **PF (Pessoa Física):** Azul (#3B82F6)
- **PJ (Pessoa Jurídica):** Laranja (#EE4D2D) - tema atual
- **Financeiro:** Verde/Vermelho (score)
- **Favoritos:** Amarelo (#F59E0B)

### Ícones Sugeridos (Lucide):
- PF: User, Users
- PJ: Building2, Building
- Score: TrendingUp, TrendingDown
- Protestos: AlertTriangle, FileWarning
- Dívidas: DollarSign, CreditCard
- Exportação: Download, FileDown
- Favoritos: Star, Heart
- Histórico: Clock, History
- Comparar: GitCompare, ArrowLeftRight

---

**Status Atual:** 🚀 Pronta para começar!  
**Última atualização:** 20/10/2025 - 23:15  
**Sprint Anterior:** Sprint 3 - 100% completa (22/22 issues)
