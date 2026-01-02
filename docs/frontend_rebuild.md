# Frontend Blueprint (BaseCerta)

## Stack e Fundamentos
- Next.js App Router (React 19), TypeScript, Tailwind 3.4 + tailwindcss-animate, Radix UI (shadcn/ui).
- Estado/dados: TanStack React Query 5 (ReactQueryProvider), React Hook Form + Zod, Axios, Recharts, Sonner (toasts).
- Estrutura base: src/app/layout.tsx aplica AppLayout, ReactQueryProvider, SonnerToaster e fontes via next/font.

## Identidade Visual
- Fontes: Inter (body, --font-inter), Poppins (display, --font-poppins), Roboto Mono (mono, --font-roboto-mono).
- Paleta principal: primária #EE4D2D (Shopee), neutros: background #F4F4F4, foreground #333, border/input #E8E8E8; estados: sucesso #28A745, erro #DC3545, warning #FFC107, info #17A2B8.
- Tokens em CSS vars (globals.css) e Tailwind extend: cores (primary/secondary/muted/accent/destructive), radius base 8px (var(--radius)), sombras sm/md/lg/xl e shadow primary, animações (fadeIn, slideInRight, slideInDown, accordion up/down, spin, pulse).
- Gradiente: .gradient-primary (laranja->vermelho), scrollbar custom, line-clamp 1–3, focus-visible com ring primário.

## Layout Global
- AppLayout: shell com Sidebar fixa colapsável e Header; body usa classes de fontes e antialias.
- Header: breadcrumbs ou título Dashboard; botão menu mobile; cartão de créditos (Créditos: disponível/total) com ícone Coins; notificações dropdown (badge de não lidos); menu usuário (avatar/iniciais, perfil/logout placeholders).
- Sidebar: colapsável (72px/288px), grupos expansíveis; hover preview no estado colapsado; badges “Novo”. Baseada em NAVIGATION (constants/navigation.ts).

## Navegação (menus)
- Dashboard (/dashboard).
- PRODUTOS: Smart CNPJ 360° (/smart-cnpj, /smart-cnpj/search, /smart-cnpj/similares), Dados 360° PF (/dados360/pf/search), Dados 360° PJ (/dados360/pj/search), Radar Financeiro (/radar-financeiro).
- RADAR JURÍDICO: PF (/radar-juridico/pf/search), PJ (/radar-juridico/pj/search).
- GESTÃO: Créditos (/credits), Favoritos (/favoritos), Alertas (/alertas), Relatórios (/relatorios).
- AJUDA: Central (/help).

## Rotas e Páginas Principais
- Dashboard: cards de métricas, gráfico, buscas recentes, top buscados.
- Smart CNPJ: Insights (/smart-cnpj), Busca avançada (/smart-cnpj/search) com 7 tipos (CNPJ, Razão Social, CNAE, Email, Telefone, Nome Sócio, CEP) + filtros (situação, matriz/filial, porte, capital, MEI/Simples, tributação, data); Resultados (/smart-cnpj/results) lista paginada 20/página com ExportButton; Detalhe (/smart-cnpj/[cnpj]) com Identificação, Classificação, Localização, Contato, Status e ações Favoritar/Compartilhar/Exportar PDF (placeholder); Similares (/smart-cnpj/similares); Dashboard específico (/smart-cnpj/dashboard).
- Dados 360°: PF search (/dados360/pf/search) custo 8 créditos (modal confirmação); PF detalhe (/dados360/pf/[cpf]) cards: Dados Pessoais, Contatos, Endereços, Profissional, Empresas, Parentes, Renda, ação Exportar PDF (placeholder). PJ search (/dados360/pj/search) custo 10 créditos; PJ detalhe (/dados360/pj/[cnpj]) header com status/favorito; cards: Identificação, Contatos, Endereços, CNAEs, Sócios, Funcionários, Dívidas, Redes Sociais; Exportar PDF.
- Radar Jurídico: PF/PJ search por documento; Detalhe processo (/radar-juridico/processo/[numero]) com cabeçalho (status, classe, valor, risco), cards de identificação, tribunal, datas, partes, assuntos, movimentações (timeline), relacionados, documentos; Exportar PDF (placeholder).
- Radar Financeiro: hub (/radar-financeiro) com tiers/planos e CTAs; subpáginas score, restrições, dívidas, limite, renda/patrimônio, relatório completo — tabelas/cards com modais de export.
- Gestão: Créditos (/credits) saldo/histórico; Planos (/plans) tabela comparativa (Exportações listadas); Pacotes (/packages) lista de créditos/preço; Favoritos (/favoritos) lista + skeleton; Alertas (/alertas) configuração; Relatórios (/relatorios) cards de uso de exportação por formato (PDF/EXCEL/CSV/TXT) e limite/used; Histórico (/historico) listas de buscas.
- Produtos extras: Dados cadastrais PF/PJ, Dossiê financeiro, Comparador de empresas (/produtos/comparar) com seleção e ExportModal.

## Componentes-Chave
- Layout: Header, Sidebar, Footer, DashboardLayout.
- Form helpers: FormField, FormInput (React Hook Form + Tailwind).
- Export: ExportModal, ExportButton; tabelas (CompanyTable, DebtTable) e modais de export em produtos.
- Produtos Smart CNPJ: CompanyCard, ClassificationCard, FilterPanel, AdvancedFilters, CompanyFilters, MobileFilters, CompanySearchForm, CompanyTable.
- Dados 360 PF/PJ: CPFSearchForm, CNPJSearchForm, CostConfirmationModal; PF cards (PersonHeader, PersonalDataCard, ContactsPFCard, AddressesPFCard, ProfessionalExperienceCard, RelativesCard, IncomeCard, CompanyLinksCard); PJ cards (CompanyHeaderFull, CompanyIdentificationCard, ContactsPJCard, AddressesPJCard, CompanyActivityCard, PartnersCard, EmployeesHistoryCard, DebtsCard, SocialMediaCard, Dados360PJSkeleton).
- Radar Jurídico: ProcessCard, ProcessDetailHeader, ProcessDetailCards1/2/3 (identificação, tribunal, datas, status, valores, partes, assuntos, timeline, relacionados, documentos), ProcessesHeader, RadarJuridicoPFSearchSkeleton.
- Radar Financeiro: FinancialSearchForm, FinancialScoreCards, DebtTable (tipos TRIBUTARIA/PREVIDENCIARIA/FGTS/TRABALHISTA) com export.
- Dashboard widgets: SearchStatsCards, SearchChart, TopSearched, RecentSearches, DashboardSkeleton.
- Providers: ReactQueryProvider, SonnerToaster; ErrorBoundary/InlineErrorBoundary exemplos.

## Textos e CTAs (principais)
- Botões: Buscar, Exportar, Exportar PDF, Ver detalhes, Favoritar, Compartilhar, Limpar filtros, Gerar CSV/PDF/TXT/Excel, Assinar, Comprar créditos, Ver relatório.
- Badges: "Novo" em Empresas Similares; notificações não lidas; chips de status/risco.
- Labels de filtros: Situação Cadastral, Matriz/Filial, Porte, Capital Social, MEI/Simples, Forma de Tributação, Data de Abertura.

## Comportamentos e Placeholders
- Sidebar colapsável com hover preview; breadcrumbs dinâmicos; menu mobile.
- Exportações centralizadas via ExportModal (seleção de campos, formatação de valores).
- Placeholders/mocks: créditos, notificações, usuário, export usage, alguns dados de relatório e PDF ainda simulados aguardando backend.

## Como reusar/recriar
- Replicar tokens de tema de globals.css e tailwind.config.ts (cores, radius, sombras, animações, gradiente, scrollbar, focus-visible).
- Manter estrutura de navegação (constants/navigation.ts) e grupos para Sidebar; respeitar colapso/hover.
- Recriar AppLayout com Header (créditos, notificações, user menu) e Sidebar colapsável; aplicar fontes via next/font variables.
- Preservar fluxos de busca + filtros + export em Smart CNPJ, Dados 360 e Radar (mesma nomenclatura de campos e CTAs).
- Manter CTAs e labels listados acima para consistência da UI.

## Hierarquia JSX/DOM (alto nível por página)
- **Shell global**: `<html><body>` → `ReactQueryProvider` → `AppLayout` → `Header` + `Sidebar` + `<main class="flex-1">{children}</main>` + `SonnerToaster`.
- **Dashboard (/dashboard)**: `DashboardLayout` → seção hero (título/subtítulo) → grid de `SearchStatsCards` → `SearchChart` → `TopSearched` → `RecentSearches`.
- **Smart CNPJ Search (/smart-cnpj/search)**: `Header` breadcrumbs → coluna filtros (`AdvancedFilters`/`CompanyFilters`/`MobileFilters`) + coluna form (`CompanySearchForm`) → resultados opcionais (cards) ou estado vazio.
- **Smart CNPJ Results (/smart-cnpj/results)**: cabeçalho de busca (resumo + filtros aplicados) → `CompanyTable` (20/página) → `ExportButton`/`ExportModal` → paginação.
- **Smart CNPJ Detalhe (/smart-cnpj/[cnpj])**: header empresa (nome, CNPJ, ações Favoritar/Compartilhar/Exportar) → grid de cards: `ClassificationCard`, localização, contato, status, CNAEs, sócios (quando presente) → seção de insights/similares opcional.
- **Smart CNPJ Similares (/smart-cnpj/similares)**: filtros topo → lista/cards comparativos → CTA Exportar.
- **Dados 360 PF Search (/dados360/pf/search)**: form `CPFSearchForm` (input + custo/modal confirmação) → estado de loading/success → render de cards PF (quando disponível).
- **Dados 360 PF Detalhe (/dados360/pf/[cpf])**: `PersonHeader` (identificação + ações export/favorito) → grid de cards: `PersonalDataCard`, `ContactsPFCard`, `AddressesPFCard`, `ProfessionalExperienceCard`, `CompanyLinksCard`, `RelativesCard`, `IncomeCard`.
- **Dados 360 PJ Search (/dados360/pj/search)**: form `CNPJSearchForm` (input + custo/modal) → loading/success → tabela ou cards resumidos.
- **Dados 360 PJ Detalhe (/dados360/pj/[cnpj])**: `CompanyHeaderFull` (status/favorito/export) → grid de cards: `CompanyIdentificationCard`, `ContactsPJCard`, `AddressesPJCard`, `CompanyActivityCard`, `PartnersCard`, `EmployeesHistoryCard`, `DebtsCard`, `SocialMediaCard`.
- **Radar Jurídico Search (PF/PJ)**: header `ProcessesHeader` (dados da pessoa) + filtros básicos → lista de `ProcessCard` → paginação.
- **Radar Jurídico Detalhe (/radar-juridico/processo/[numero])**: `ProcessDetailHeader` (status/classe/valor/risco + export) → colunas de cards: identificação, tribunal, datas; status/valores/partes; assuntos/timeline/relacionados/documentos.
- **Radar Financeiro (/radar-financeiro e subpáginas)**: hero com tiers/benefícios → cards de features → seções por produto (score, restrições, dívidas, limite, renda/patrimônio, relatório) → tabelas/cards com CTA Exportar/Ver relatório.
- **Gestão Créditos (/credits)**: resumo de saldo/ganhos/gastos → histórico/lista → CTA recarga/planos.
- **Planos (/plans)**: tabela comparativa de planos (linhas de features incluindo “Exportações (PDF/TXT/CSV/Excel)”) + botões “Assinar”/“Fale com vendas”.
- **Pacotes (/packages)**: grid de pacotes (créditos/preço) + CTA “Comprar créditos”.
- **Favoritos (/favoritos)**: lista de itens salvos ou `FavoritosSkeleton` → ações remover/abrir.
- **Alertas (/alertas)**: form/lista de alertas (documento, tipo de evento) + toggles + salvar.
- **Relatórios (/relatorios)**: cards de uso por formato (PDF/EXCEL/CSV/TXT) + progress de limite usado + CTA gerar exportações.
- **Histórico (/historico)**: lista de buscas (tipo, valor, data, status) + filtros e paginação.
- **Produtos/Comparar (/produtos/comparar)**: filtros e seleção de empresas → tabela comparativa → botão “Exportar” que abre `ExportModal`.

## Hierarquia detalhada (componentes, classes e labels)
- **Shell/AppLayout**: `div.flex.h-screen.bg-gray-50` → Sidebar (desktop hidden on md-) + overlay/mobile Sidebar (md:hidden, z-50) + coluna principal `flex flex-1 flex-col` com `Header`, `<main class="flex-1 overflow-y-auto bg-gray-50"><div class="container mx-auto p-4 md:p-6 lg:p-8">{children}</div></main>` e `Footer`. Sidebar largura 72/288 px, transição 300ms.
- **Header**: `header.h-16.bg-white.border-b` com: botão menu mobile (`Button variant="ghost" size="icon"`), breadcrumbs (`nav.hidden.sm:flex`) ou `<h1>Dashboard</h1>`; área de ações com cartão de créditos (link /credits, bg-primary-50), versão mobile ícone, Dropdown notificações (Badge vermelha, lista com title/description/time, CTA “Ver todas notificações”), Dropdown usuário (avatar, nome, email, itens Perfil/Financeiro/Ajuda, Sair). Ícones: Coins, Bell, Menu, ChevronDown.
- **Sidebar**: `aside.h-screen.bg-white.border-r` colapsável (w-20 vs w-72). Header com `Logo` e botão toggle (Menu/X). Navegação: grupos com botão `text-xs font-semibold tracking-wider`; subitems com `NavLink` e estados ativos `bg-primary-50 text-primary-600 shadow-sm` ou subativo `bg-primary-100 text-primary-700` para submenus. Collapsed hover preview: dropdown lateral com itens e ícones. Scroll com `.scrollbar-thin`.
- **Tokens/cores**: primária HSL 10 85% 55% (#EE4D2D), escala 50–900; neutros em CSS vars; radius `--radius` 8px mapeado para lg/md/sm; sombras (`shadow-primary` rgba(238,77,45,0.3)); animações (fadeIn, slideInRight, slideInDown, accordion up/down, spin, pulse). Gradiente `.gradient-primary` laranja→vermelho. Focus-visible: ring-2 primary offset background.
- **Nav/menus**: grupos Dashboard; PRODUTOS (Smart CNPJ: Insights, Busca Avançada, Empresas Similares badge “Novo”; Dados 360 PF; Dados 360 PJ; Radar Financeiro); RADAR JURÍDICO (PF, PJ); GESTÃO (Créditos e Planos, Favoritos, Alertas, Relatórios); AJUDA (Central).
- **Dashboard (/dashboard)**: seção hero (título/sub) + grid de `SearchStatsCards` (cards com títulos, valores, variação); `SearchChart` (Recharts); `TopSearched` lista; `RecentSearches` lista com datas/valores; Skeleton disponível.
- **Smart CNPJ Search**: layout duas colunas: painel filtros (AdvancedFilters/CompanyFilters/MobileFilters) com campos e toggles; painel form `CompanySearchForm` com select tipo de busca (7 opções), input valor, filtros rápidos, botão “Buscar”, “Limpar filtros”. Estados de loading/empty. Classe container padrão.
- **Smart CNPJ Results**: header com resumo e filtros ativos; `CompanyTable` (tanstack table) com colunas: Razão Social, CNPJ, CNAE, UF/Município, Situação, Abertura, Capital, Porte, ações. Botão “Exportar” abre `ExportModal` com seleção de campos; paginação bottom; usa `ExportButton` também.
- **Smart CNPJ Detalhe**: header empresa com nome/CNPJ, chips de situação e porte, ações Favoritar/Compartilhar/Exportar PDF (placeholder). Cards: `ClassificationCard` (porte, capital, CNAE), localização (endereço/UF/município, mapa futuro), contato (emails/telefones), status (situação/data), CNAEs, sócios (quando disponível). Seção “similares/insights” opcional.
- **Smart CNPJ Similares**: filtros topo (segmento, localização, porte) → cards comparativos com score de similaridade → CTA Exportar (abre modal).
- **Dados 360 PF Search**: `CPFSearchForm` com input CPF (mask), aviso de custo 8 créditos e modal `CostConfirmationModal`, botão “Buscar”. Estado loading/success renderiza cards PF.
- **Dados 360 PF Detalhe**: `PersonHeader` (nome, CPF, idade, status; botões Exportar PDF placeholder e Favoritar). Grid cards: `PersonalDataCard` (dados pessoais), `ContactsPFCard` (telefones/emails), `AddressesPFCard` (endereços), `ProfessionalExperienceCard`, `CompanyLinksCard` (empresas/sócio), `RelativesCard`, `IncomeCard` (renda presumida/faixa), possivelmente mapas.
- **Dados 360 PJ Search**: `CNPJSearchForm` input CNPJ, custo 10 créditos, modal de confirmação; lista/tabela de empresas retornadas (mock/placeholder), com CTA detalhes/export.
- **Dados 360 PJ Detalhe**: `CompanyHeaderFull` (razao social, fantasia, CNPJ, status, porte, capital, botões Favoritar/Exportar PDF placeholder); cards: Identificação (natureza, qualificação, capital, porte), Contatos (tel/email/site), Endereços (matriz/filiais), Atividade (CNAE principal/secundário), Sócios, Funcionários (histórico), Dívidas, Redes Sociais. Skeleton `Dados360PJSkeleton` para loading.
- **Radar Jurídico Search (PF/PJ)**: `ProcessesHeader` com dados da pessoa/empresa, filtros básicos (tribunal, período, status), lista de `ProcessCard` (status, número, assunto, tribunal, partes, datas) com paginação; skeleton PF search existe.
- **Radar Jurídico Detalhe**: `ProcessDetailHeader` (número, status, classe, valor da causa, risco, botões Exportar PDF placeholder). Colunas de cards: identificação/tribunal/datas; status/valores/partes; assuntos/timeline/relacionados/documentos. Timeline com eventos datados; partes com polo ativo/passivo; assuntos em lista; documentos/relacionados em listas linkáveis.
- **Radar Financeiro (hub e subpáginas)**: hero com tiers/benefícios; cards de features; seções por produto: score de crédito, restrições, dívidas (usa `DebtTable` com colunas tipo/órgão/valor/data/status e export modal), limite de crédito, renda/patrimônio, relatório completo. CTAs “Ver relatório”, “Exportar”, “Imprimir” em DebtTable.
- **Créditos (/credits)**: cards de saldo (`balance`, `total_earned`, `total_spent`), histórico de transações (lista/tabela), CTA recarga/planos; loading usa hook `useCredits` (hoje mock/placeholder parcialmente).
- **Planos (/plans)**: tabela comparativa com linhas de features (inclui “Exportações (PDF/TXT/CSV/Excel)”), colunas por plano; botões “Assinar”, “Fale com vendas”.
- **Pacotes (/packages)**: grid de pacotes (créditos + preço), cartões com CTA “Comprar créditos”.
- **Favoritos (/favoritos)**: lista de itens salvos (empresa/processo/etc.), ações abrir/remover, `FavoritosSkeleton` para loading.
- **Alertas (/alertas)**: formulário/lista de alertas por documento/evento, toggles de ativação, ações salvar/editar/excluir (UI pronta, integração pendente).
- **Relatórios (/relatorios)**: cards de uso por formato (PDF/EXCEL/CSV/TXT), progress bar do limite (`usagePercentage`), texto “Você usou X de Y exportações disponíveis neste mês.”, botões gerar exportação.
- **Histórico (/historico)**: tabela/lista de buscas (tipo_busca, valor, data, tempo, créditos), filtros por período/tipo, paginação.
- **Produtos/Comparar (/produtos/comparar)**: filtros de seleção, tabela comparativa (empresas lado a lado), botão “Exportar” abre `ExportModal`; estados de validação (mínimo 2 empresas) com toast warning.

## Props e ações principais (componentes chave)
- **CompanyTable/DebtTable**: recebem `data`, `isLoading`, callbacks `onViewDetails`, `onPrint` (DebtTable), controlam `exportOpen` state, usam `ExportModal` com `availableFields` e `data` formatado (`useMemo`). Botão “Exportar” no header da tabela.
- **ExportModal**: props `open`, `onOpenChange`, `title`, `data`, `availableFields` (seleção de colunas para CSV/Excel/PDF/TXT). Usada em Smart CNPJ resultados, DebtTable, Comparar.
- **CompanySearchForm/PersonSearchForm/FinancialSearchForm**: inputs tipados, select de tipo, onSearch callback, botão “Buscar”, estado `isLoading` desabilita e mostra spinner.
- **AdvancedFilters/CompanyFilters/MobileFilters/PersonFilters**: recebem `filters`, `onChange`, `onApply`; incluem checkboxes/toggles/selects para situação, matriz/filial, porte, capital social, MEI/Simples, tributação, data de abertura, UF/município, etc.
- **Process* cards (Radar Jurídico)**: recebem `processo` com campos (status, classe, valor, tribunal, datas, partes, assuntos, movimentações) e renderizam grids responsivos com badges e listas.
- **Header**: usa `useCredits` (saldo, total_added, isLoadingBalance) e `useLayout` (toggleMobileMenu). Mock de usuário/notificações. Breadcrumbs via prop.
- **Sidebar**: usa `useLayout` (sidebarOpen/toggleSidebar), controla `expandedGroups`, detecta ativo via pathname; submenus não marcam pai como ativo, apenas filhos; hover preview quando colapsado.

## Placeholders e integrações pendentes
- Créditos/notificações/usuário em Header usam mock; `useCredits` precisa de backend real.
- Exportar PDF em Smart CNPJ, Dados 360, Radar Jurídico e Financeiro é placeholder (alert/toast). 
- Alguns dados de Radar Financeiro, Relatórios e Histórico estão mockados; conectar às APIs reais ao refazer.
