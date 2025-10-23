# 🗓️ ROADMAP DE SPRINTS - BASECERTA

> **Modelo de Desenvolvimento:** Orientado a Produtos (4 Produtos Principais)  
> **Última Atualização:** 22 de Outubro de 2025  
> **Status:** Em Desenvolvimento - Delivery 1  
> **Design:** Paleta Shopee + Fontes Modernas

---

## 📋 ÍNDICE

- [Visão Geral](#visão-geral)
- [Arquitetura de Produtos](#arquitetura-de-produtos)
- [Delivery 1: Frontend dos 4 Produtos](#delivery-1-frontend-dos-4-produtos-8-10-semanas)
- [Delivery 2: Backend dos 4 Produtos](#delivery-2-backend-dos-4-produtos-6-8-semanas)
- [Delivery 3: Autenticação RBAC](#delivery-3-autenticação-rbac-2-3-semanas)
- [Delivery 4: Segurança e Produção](#delivery-4-segurança-e-produção-2-3-semanas)

---

## 🎯 VISÃO GERAL

### Nova Estratégia: Produtos ao invés de Funcionalidades

**Mudança Estrutural:**
- ❌ **ANTES:** Funcionalidades dispersas (créditos, planos, pesquisas avulsas)
- ✅ **AGORA:** **4 Produtos Principais** organizados e focados

### Filosofia de Desenvolvimento

**Frontend-First + Product-Led:**
1. **Delivery 1:** UI completa dos 4 produtos com mockdata (8-10 semanas)
2. **Delivery 2:** Backend dos 4 produtos com dados reais (6-8 semanas)
3. **Delivery 3:** Sistema de autenticação RBAC (2-3 semanas)
4. **Delivery 4:** Hardening para produção (2-3 semanas)

**Durante Deliveries 1-2:**
- Usuário mock: `user_id=1` fixo
- Endpoints abertos (sem autenticação)
- Ambiente: Desenvolvimento

### Design System

**Inspiração:** Paleta Shopee
- **Cor Primária:** Laranja vibrante (#EE4D2D ou similar)
- **Cor Secundária:** Branco limpo (#FFFFFF)
- **Accent:** Gradientes suaves (laranja → rosa)
- **Neutros:** Cinzas modernos para textos

**Fontes:**
- **Títulos:** Inter, Poppins ou Montserrat (bold, alegre)
- **Corpo:** Inter ou Open Sans (legível, moderna)
- **Objetivo:** Transmitir felicidade e leveza no UX

### Sistema de Créditos

**Regra de Cobrança:**
- ✅ Cada pesquisa **cobra créditos** (mesmo CPF/CNPJ repetido)
- ✅ Cliente pode **ver resultados salvos** sem pagar novamente
- ✅ Nova pesquisa do mesmo documento = **nova cobrança**

**Custos por Produto:**
- Smart CNPJ 360°: 5 créditos
- Dados 360° PF: 8 créditos
- Dados 360° PJ: 10 créditos
- Radar Financeiro: 15-25 créditos (varia por subproduto)
- Radar Jurídico: 20 créditos

### Paginação

**Padrão:** 20 resultados por página em todas as listas

---

## 🏗️ ARQUITETURA DE PRODUTOS

### 📦 Produto 1: Smart CNPJ 360°

**Objetivo:** Busca inteligente e avançada de empresas brasileiras

**Fonte de Dados:** Base CNPJ completa do Brasil (PostgreSQL local) ✅

**Capacidades de Busca:**
1. Por CNPJ (individual)
2. Por Razão Social
3. Por Segmento (CNAE)
4. Por Email
5. Por Telefone
6. Por Nome do Sócio
7. Por CEP

**Filtros Avançados (8 filtros):**
1. Situação Cadastral (Ativa, Suspensa, Inapta, Baixada)
2. Tipo (Matriz, Filial)
3. Porte da Empresa (MEI, ME, EPP, Média, Grande)
4. Capital Social (faixas)
5. Opção pelo MEI (Sim/Não)
6. Opção pelo Simples Nacional (Sim/Não)
7. Forma de Tributação (Simples, Presumido, Real)
8. Data de Abertura (intervalo DE/ATÉ)

**Resultado Exibido:**
```
📋 Identificação
- CNPJ
- Razão Social
- Nome Fantasia

🏢 Classificação
- Natureza Jurídica
- Matriz/Filial
- Porte da Empresa
- Capital Social
- CNAE Principal
- CNAEs Secundários

📍 Localização
- Logradouro, Número, Complemento
- Bairro, CEP
- Município, UF

📞 Contato
- Telefone 1, Telefone 2
- Email
- Email Contabilidade

✅ Situação
- Situação Cadastral
- Data de Abertura
- Opção pelo Simples
- Opção pelo MEI
```

---

### 📦 Produto 2: Dados 360°

**Objetivo:** Visão completa do cliente (PF ou PJ) em um único clique

**Subprodutos:**
1. Dossiê Pessoa Física (CPF) - via DirectData/Predictus
2. Dossiê Pessoa Jurídica (CNPJ) - via Predictus

**Dossiê PF - Campos:**
- Dados Pessoais: Nome, CPF, Data Nascimento, Sexo, Nome da Mãe
- Situação RF: Situação, Data Situação, Óbito
- Renda: Faixa de Renda, Renda Presumida
- Endereços: Principal + Adicionais + Coordenadas GPS (mock inicial)
- Contatos: Telefones Móveis (com datas), Fixos, E-mails
- Parentes: Lista com CPF e grau de parentesco
- Profissional: Experiências (empresa, cargo, salário, admissão)
- Empresas: Sociedades e vínculos
- Mapa: Google Maps API + Coordenadas

**Dossiê PJ - Campos:**
- Identificação: Razão Social, Nome Fantasia, CNPJ
- Situação: Situação Cadastral, Data Abertura, Matriz/Filial, Natureza Jurídica
- Atividade: Faturamento Estimado, CNAE Principal, CNAEs Secundários
- Quadro Societário: Sócios atuais + Ex-sócios (CPF, data entrada/saída)
- Financeiro: Dívidas (se houver)
- RH: Histórico de Funcionários
- Localização: Endereços múltiplos
- Contatos: Telefones, E-mails
- Digital: Site + Redes Sociais (Facebook, LinkedIn, Instagram)
- Mapa: Google Maps API + Coordenadas

---

### 📦 Produto 3: Radar Financeiro

**Objetivo:** Análises financeiras e antifraude

**Subprodutos (7 itens):**
1. Dossiê de Crédito Completo (DirectData)
2. Score de Crédito QUOD (DirectData)
3. Protestos Nacional - Base (DirectData)
4. Protestos SP (DirectData)
5. CADIN - Secretaria da Fazenda SP
6. SCR Detalhada - Resumo BACEN
7. Antifraude Chave PIX (DirectData)

**Nota:** Sprint inicial cria apenas os menus. Páginas individuais em sprints posteriores.

---

### 📦 Produto 4: Radar Jurídico

**Objetivo:** Processos judiciais completos (PF e PJ)

**Subprodutos:**
1. Dossiê Pessoa Física (CPF)
2. Dossiê Pessoa Jurídica (CNPJ)

**Lista de Processos - Campos:**
- Status (Arquivamento, Em Tramitação, Em Grau de Recurso)
- Número do Processo
- Ramo do Direito
- Assunto
- Data de Distribuição
- Tribunal
- Polo (Ativo/Passivo/Terceiro)
- Classe Processual
- Valor da Causa
- Risco (Baixo/Médio/Alto)

**Detalhamento do Processo - Campos:**
- Identificação: Número, Situação, Ramo, Assunto, Risco, Classe
- Órgão: Órgão Julgador, Tribunal, Grau, Segmento
- Datas: Distribuição, Atualização
- Status: Predictus, Justiça Gratuita, Prioritário, Segredo, Digital
- Valores: Causa, Execução
- Características: Tutela Antecipada, Penhoras
- Partes: Lista com qualificação (CPF/CNPJ)
- Assuntos: Lista de assuntos
- Movimentações: Timeline cronológica reversa
- Relacionados: Processos conexos

---

## 🎨 FLUXO DE NAVEGAÇÃO (Universal)

```
🏠 Home
  ↓
📦 Escolher Produto (1, 2, 3 ou 4)
  ↓
🔍 Área de Pesquisa do Produto
  ↓ (Inserir CPF/CNPJ/filtros)
📊 Resultados (Lista com paginação - 20 por página)
  ↓ (Clicar "Ver Detalhes")
📄 Página de Detalhes Completa
  ↓
⚡ Ações: Baixar PDF, Favoritar, Compartilhar, Nova Pesquisa
```

---

## 📦 DELIVERY 1: FRONTEND DOS 4 PRODUTOS (8-10 SEMANAS)

> **Objetivo:** Construir UI completa dos 4 produtos com mockdata.  
> **Autenticação:** NÃO implementada (user_id=1 fixo)  
> **Backend:** Dados mockados localmente

---

### 🏃 SPRINT 1.1 - Design System + Layout Base (1 semana)

**Período Estimado:** Semanas 1

#### Issues:

**Issue 1.1.1 - Design System Shopee-Inspired (2 dias)**
- [ ] Criar paleta de cores (laranja Shopee + neutros)
- [ ] Definir fontes (Inter/Poppins para títulos, Inter para corpo)
- [ ] Criar tokens de design (tailwind.config.js)
- [ ] Documentar cores, espaçamentos, breakpoints
- [ ] Criar componentes base UI:
  - `Button.tsx` (primary, secondary, ghost)
  - `Card.tsx` (variants: default, elevated, bordered)
  - `Badge.tsx` (status colors)
  - `Alert.tsx` (success, warning, error, info)
  - `Input.tsx` (text, search, masked)
  - `Select.tsx` (dropdown)
- **Arquivos:**
  - `frontend/tailwind.config.js`
  - `frontend/app/globals.css`
  - `frontend/components/ui/*`

**Issue 1.1.2 - Layout Principal e Navegação (3 dias)**
- [ ] Criar `app/layout.tsx` (layout raiz)
- [ ] Componente `Header.tsx`:
  - Logo BaseCerta
  - Barra de busca global
  - Saldo de créditos (mock)
  - Menu usuário (dropdown)
- [ ] Componente `Sidebar.tsx` (colapsável):
  - **Menu Produtos:**
    - 🔍 Smart CNPJ 360°
    - 📊 Dados 360° (submenu: PF, PJ)
    - 💰 Radar Financeiro (submenu: 7 itens)
    - ⚖️ Radar Jurídico (submenu: PF, PJ)
  - **Menu Gestão:**
    - 💳 Créditos e Planos
    - ⭐ Favoritos
    - 🔔 Alertas
    - 📁 Relatórios
- [ ] Componente `Footer.tsx`
- [ ] Responsivo (mobile, tablet, desktop)
- **Arquivos:**
  - `frontend/app/layout.tsx`
  - `frontend/components/layout/Header.tsx`
  - `frontend/components/layout/Sidebar.tsx`
  - `frontend/components/layout/Footer.tsx`

---

### 🏃 SPRINT 1.2 - Smart CNPJ 360° (Frontend) (2 semanas)

**Período Estimado:** Semanas 2-3

#### Issues:

**Issue 1.2.1 - Página de Busca Smart CNPJ (3 dias)**
- [ ] Criar `/app/smart-cnpj/search/page.tsx`
- [ ] Componente `SearchForm.tsx`:
  - 7 tipos de busca (tabs ou dropdown)
  - Input com máscara CNPJ
  - Input Razão Social (autocomplete mock)
  - Input Email, Telefone, Nome Sócio, CEP
  - Select Segmento (CNAEs principais)
- [ ] Componente `FilterPanel.tsx`:
  - 8 filtros (collapsible)
  - Situação Cadastral (multi-select)
  - Tipo (radio: Matriz/Filial)
  - Porte (multi-select)
  - Capital Social (range slider)
  - MEI/Simples (checkboxes)
  - Forma Tributação (select)
  - Data Abertura (date range picker)
- [ ] Botão "Buscar" com loading state
- [ ] Mock data em `mocks/smart-cnpj.ts` (100 empresas)
- **Arquivos:**
  - `frontend/app/smart-cnpj/search/page.tsx`
  - `frontend/components/smart-cnpj/SearchForm.tsx`
  - `frontend/components/smart-cnpj/FilterPanel.tsx`
  - `frontend/mocks/smart-cnpj.ts`

**Issue 1.2.2 - Página de Resultados Smart CNPJ (3 dias)**
- [ ] Criar `/app/smart-cnpj/results/page.tsx`
- [ ] Componente `ResultsList.tsx`:
  - Lista paginada (20 por página)
  - Componente `CompanyCard.tsx` para cada empresa
- [ ] Componente `CompanyCard.tsx`:
  - CNPJ, Razão Social, Nome Fantasia
  - Badge Situação Cadastral (cores)
  - Badge Matriz/Filial
  - Porte, Capital Social
  - CNAE Principal
  - Município/UF
  - Botão "Ver Detalhes"
  - Botão "Favoritar" (ícone coração)
- [ ] Componente `Pagination.tsx`:
  - Navegação páginas
  - Total de resultados
  - Botões Anterior/Próximo
- [ ] Hook `useSmartCNPJ()` para gerenciar estado
- [ ] Filtros persistentes (query params)
- **Arquivos:**
  - `frontend/app/smart-cnpj/results/page.tsx`
  - `frontend/components/smart-cnpj/ResultsList.tsx`
  - `frontend/components/smart-cnpj/CompanyCard.tsx`
  - `frontend/components/ui/Pagination.tsx`
  - `frontend/hooks/useSmartCNPJ.ts`

**Issue 1.2.3 - Página de Detalhes Smart CNPJ (4 dias)**
- [ ] Criar `/app/smart-cnpj/[cnpj]/page.tsx`
- [ ] Componente `CompanyHeader.tsx`:
  - Logo placeholder
  - Razão Social (destaque)
  - CNPJ formatado
  - Badges (Situação, Tipo, Porte)
  - Ações: Favoritar, Compartilhar, PDF
- [ ] Componente `IdentificationCard.tsx`:
  - CNPJ, Razão Social, Nome Fantasia
- [ ] Componente `ClassificationCard.tsx`:
  - Natureza Jurídica, Matriz/Filial, Porte
  - Capital Social formatado
  - CNAE Principal + Secundários (collapsible)
- [ ] Componente `LocationCard.tsx`:
  - Endereço completo
  - Mapa Google Maps API (iframe)
  - Coordenadas GPS (mock)
- [ ] Componente `ContactCard.tsx`:
  - Telefones (com ícones)
  - Emails (com ícones)
- [ ] Componente `StatusCard.tsx`:
  - Situação Cadastral (badge grande)
  - Data de Abertura
  - Opção Simples/MEI (badges)
- [ ] Layout em grid responsivo (2 colunas desktop, 1 coluna mobile)
- **Arquivos:**
  - `frontend/app/smart-cnpj/[cnpj]/page.tsx`
  - `frontend/components/smart-cnpj/CompanyHeader.tsx`
  - `frontend/components/smart-cnpj/IdentificationCard.tsx`
  - `frontend/components/smart-cnpj/ClassificationCard.tsx`
  - `frontend/components/smart-cnpj/LocationCard.tsx`
  - `frontend/components/smart-cnpj/ContactCard.tsx`
  - `frontend/components/smart-cnpj/StatusCard.tsx`

---

### 🏃 SPRINT 1.3 - Dados 360° PF (Frontend) (1.5 semanas)

**Período Estimado:** Semanas 4-5.5

#### Issues:

**Issue 1.3.1 - Busca e Resultados Dados 360° PF (3 dias)**
- [ ] Criar `/app/dados360/pf/search/page.tsx`
- [ ] Componente `CPFSearchForm.tsx`:
  - Input CPF com máscara
  - Validação CPF (dígitos verificadores)
  - Modal confirmação custo (8 créditos)
  - Loading state
- [ ] Mock data em `mocks/dados360-pf.ts` (50 pessoas)
- [ ] Hook `useDados360PF()` para gerenciar pesquisa
- **Arquivos:**
  - `frontend/app/dados360/pf/search/page.tsx`
  - `frontend/components/dados360/CPFSearchForm.tsx`
  - `frontend/mocks/dados360-pf.ts`
  - `frontend/hooks/useDados360PF.ts`

**Issue 1.3.2 - Dossiê PF - Dados Pessoais (3 dias)**
- [ ] Criar `/app/dados360/pf/[cpf]/page.tsx`
- [ ] Componente `PersonHeader.tsx`:
  - Nome completo (destaque)
  - CPF formatado
  - Badges (Situação RF, Óbito)
- [ ] Componente `PersonalDataCard.tsx`:
  - Data Nascimento, Idade, Sexo
  - Nome da Mãe
  - Situação RF, Data Situação
- [ ] Componente `IncomeCard.tsx`:
  - Faixa de Renda (badge)
  - Renda Presumida (formatada R$)
  - Gráfico visual (gauge ou progress bar)
- [ ] Componente `AddressesPFCard.tsx`:
  - Endereço Principal (destaque)
  - Endereços Adicionais (collapsible list)
  - Coordenadas GPS (mock)
  - Mapa Google Maps API
- [ ] Componente `ContactsPFCard.tsx`:
  - Telefones Móveis (com datas atualização)
  - Telefones Fixos
  - E-mails (lista)
- **Arquivos:**
  - `frontend/app/dados360/pf/[cpf]/page.tsx`
  - `frontend/components/dados360/pf/PersonHeader.tsx`
  - `frontend/components/dados360/pf/PersonalDataCard.tsx`
  - `frontend/components/dados360/pf/IncomeCard.tsx`
  - `frontend/components/dados360/pf/AddressesPFCard.tsx`
  - `frontend/components/dados360/pf/ContactsPFCard.tsx`

**Issue 1.3.3 - Dossiê PF - Profissional e Empresas (2 dias)**
- [ ] Componente `RelativesCard.tsx`:
  - Lista parentes (Nome, CPF mascarado, grau)
  - Ícones para grau (pai, mãe, irmão, etc.)
- [ ] Componente `ProfessionalExperienceCard.tsx`:
  - Timeline de experiências
  - Empresa, Cargo, Salário, Data Admissão
  - Status (ativo/inativo)
- [ ] Componente `CompanyLinksCard.tsx`:
  - Lista empresas onde é sócio
  - CNPJ, Razão Social
  - Participação % (visual progress)
  - Data entrada
  - Link para dossiê PJ (interno)
- **Arquivos:**
  - `frontend/components/dados360/pf/RelativesCard.tsx`
  - `frontend/components/dados360/pf/ProfessionalExperienceCard.tsx`
  - `frontend/components/dados360/pf/CompanyLinksCard.tsx`

---

### 🏃 SPRINT 1.4 - Dados 360° PJ (Frontend) (1.5 semanas)

**Período Estimado:** Semanas 6-7.5

#### Issues:

**Issue 1.4.1 - Busca e Estrutura Dados 360° PJ (2 dias)**
- [ ] Criar `/app/dados360/pj/search/page.tsx`
- [ ] Componente `CNPJSearchForm.tsx`:
  - Input CNPJ com máscara
  - Validação CNPJ
  - Modal confirmação custo (10 créditos)
- [ ] Mock data em `mocks/dados360-pj.ts` (50 empresas)
- [ ] Hook `useDados360PJ()`
- **Arquivos:**
  - `frontend/app/dados360/pj/search/page.tsx`
  - `frontend/components/dados360/CNPJSearchForm.tsx`
  - `frontend/mocks/dados360-pj.ts`
  - `frontend/hooks/useDados360PJ.ts`

**Issue 1.4.2 - Dossiê PJ - Identificação e Atividade (3 dias)**
- [ ] Criar `/app/dados360/pj/[cnpj]/page.tsx`
- [ ] Componente `CompanyHeaderFull.tsx`:
  - Logo placeholder
  - Razão Social, Nome Fantasia
  - CNPJ formatado
  - Badges (Situação, Matriz/Filial)
- [ ] Componente `CompanyIdentificationCard.tsx`:
  - Razão Social, Nome Fantasia, CNPJ
  - Situação Cadastral, Data Abertura
  - Natureza Jurídica
  - Matriz/Filial (badge)
- [ ] Componente `CompanyActivityCard.tsx`:
  - Faturamento Estimado (se disponível)
  - CNAE Principal (com descrição)
  - CNAEs Secundários (lista collapsible)
- [ ] Componente `PartnersCard.tsx`:
  - Lista sócios atuais (Nome, CPF mascarado, data entrada)
  - Ex-sócios (collapsible, com data saída)
  - Qualificação (Administrador, Sócio, etc.)
- **Arquivos:**
  - `frontend/app/dados360/pj/[cnpj]/page.tsx`
  - `frontend/components/dados360/pj/CompanyHeaderFull.tsx`
  - `frontend/components/dados360/pj/CompanyIdentificationCard.tsx`
  - `frontend/components/dados360/pj/CompanyActivityCard.tsx`
  - `frontend/components/dados360/pj/PartnersCard.tsx`

**Issue 1.4.3 - Dossiê PJ - Financeiro e Contatos (3 dias)**
- [ ] Componente `DebtsCard.tsx`:
  - Lista dívidas (se houver)
  - Tipo, Valor, Data, Status
  - Alert se não houver dívidas
- [ ] Componente `EmployeesHistoryCard.tsx`:
  - Histórico de funcionários (se disponível)
  - Total funcionários atual
  - Gráfico evolução (mockado)
- [ ] Componente `AddressesPJCard.tsx`:
  - Lista endereços múltiplos
  - Tipo (Matriz, Filial, Comercial)
  - Mapa Google Maps API
- [ ] Componente `ContactsPJCard.tsx`:
  - Telefones (múltiplos)
  - E-mails
- [ ] Componente `SocialMediaCard.tsx`:
  - Site oficial (link)
  - Facebook, LinkedIn, Instagram (links)
  - Ícones lucide-react
- **Arquivos:**
  - `frontend/components/dados360/pj/DebtsCard.tsx`
  - `frontend/components/dados360/pj/EmployeesHistoryCard.tsx`
  - `frontend/components/dados360/pj/AddressesPJCard.tsx`
  - `frontend/components/dados360/pj/ContactsPJCard.tsx`
  - `frontend/components/dados360/pj/SocialMediaCard.tsx`

---

### 🏃 SPRINT 1.5 - Radar Jurídico (Frontend) (2 semanas)

**Período Estimado:** Semanas 8-9

#### Issues:

**Issue 1.5.1 - Busca Radar Jurídico PF (2 dias)**
- [ ] Criar `/app/radar-juridico/pf/search/page.tsx`
- [ ] Formulário busca CPF
- [ ] Modal confirmação custo (20 créditos)
- [ ] Mock data em `mocks/radar-juridico-pf.ts`
- **Arquivos:**
  - `frontend/app/radar-juridico/pf/search/page.tsx`
  - `frontend/mocks/radar-juridico-pf.ts`

**Issue 1.5.2 - Lista de Processos PF (3 dias)**
- [ ] Criar `/app/radar-juridico/pf/[cpf]/page.tsx`
- [ ] Componente `ProcessesHeader.tsx`:
  - Nome, CPF
  - Total de Processos (badge grande)
  - Filtros (Status, Ramo, Tribunal, Polo)
- [ ] Componente `ProcessCard.tsx`:
  - Numeração visual (1️⃣, 2️⃣, 3️⃣...)
  - Status (badge colorido)
  - Número do Processo (monospace)
  - Ramo do Direito (ícone + texto)
  - Assunto
  - Data Distribuição
  - Tribunal
  - Polo (Ativo/Passivo/Terceiro - badge)
  - Classe Processual
  - Valor da Causa (formatado R$)
  - Risco (badge: Verde=Baixo, Amarelo=Médio, Vermelho=Alto)
  - Botão "Ver Detalhes"
- [ ] Lista paginada (20 por página)
- [ ] Hook `useRadarJuridico()`
- **Arquivos:**
  - `frontend/app/radar-juridico/pf/[cpf]/page.tsx`
  - `frontend/components/radar-juridico/ProcessesHeader.tsx`
  - `frontend/components/radar-juridico/ProcessCard.tsx`
  - `frontend/hooks/useRadarJuridico.ts`

**Issue 1.5.3 - Detalhamento de Processo (4 dias)**
- [ ] Criar `/app/radar-juridico/processo/[numero]/page.tsx`
- [ ] Componente `ProcessDetailHeader.tsx`:
  - Número do Processo (destaque)
  - Status (badge grande)
  - Risco (badge grande)
- [ ] Componente `ProcessIdentificationCard.tsx`:
  - Número, Situação, Ramo, Assunto, Classe
- [ ] Componente `ProcessCourtCard.tsx`:
  - Órgão Julgador, Tribunal, Grau, Segmento
- [ ] Componente `ProcessDatesCard.tsx`:
  - Data Distribuição, Data Atualização
- [ ] Componente `ProcessStatusCard.tsx`:
  - Status Predictus
  - Justiça Gratuita, Prioritário, Segredo, Digital (badges)
  - Tutela Antecipada, Penhoras (badges)
- [ ] Componente `ProcessValuesCard.tsx`:
  - Valor da Causa, Valor de Execução
- [ ] Componente `ProcessPartiesCard.tsx`:
  - Lista partes (qualificação, nome, CPF/CNPJ)
- [ ] Componente `ProcessSubjectsCard.tsx`:
  - Lista assuntos (se disponível)
- [ ] Componente `ProcessTimelineCard.tsx`:
  - Timeline movimentações (ordem reversa)
  - Data, descrição
  - Ícones por tipo de movimentação
- [ ] Componente `RelatedProcessesCard.tsx`:
  - Lista processos relacionados (se houver)
- **Arquivos:**
  - `frontend/app/radar-juridico/processo/[numero]/page.tsx`
  - `frontend/components/radar-juridico/ProcessDetailHeader.tsx`
  - `frontend/components/radar-juridico/ProcessIdentificationCard.tsx`
  - `frontend/components/radar-juridico/ProcessCourtCard.tsx`
  - `frontend/components/radar-juridico/ProcessDatesCard.tsx`
  - `frontend/components/radar-juridico/ProcessStatusCard.tsx`
  - `frontend/components/radar-juridico/ProcessValuesCard.tsx`
  - `frontend/components/radar-juridico/ProcessPartiesCard.tsx`
  - `frontend/components/radar-juridico/ProcessSubjectsCard.tsx`
  - `frontend/components/radar-juridico/ProcessTimelineCard.tsx`
  - `frontend/components/radar-juridico/RelatedProcessesCard.tsx`

**Issue 1.5.4 - Radar Jurídico PJ (Replicar PF) (1 dia)**
- [ ] Criar `/app/radar-juridico/pj/search/page.tsx`
- [ ] Criar `/app/radar-juridico/pj/[cnpj]/page.tsx`
- [ ] Reutilizar componentes de PF (ProcessCard, ProcessDetail)
- [ ] Ajustar apenas cabeçalho (CNPJ ao invés de CPF)
- [ ] Mock data em `mocks/radar-juridico-pj.ts`
- **Arquivos:**
  - `frontend/app/radar-juridico/pj/search/page.tsx`
  - `frontend/app/radar-juridico/pj/[cnpj]/page.tsx`
  - `frontend/mocks/radar-juridico-pj.ts`

---

### 🏃 SPRINT 1.6 - Radar Financeiro (Menus) + Gestão (1.5 semanas)

**Período Estimado:** Semanas 10-11.5

#### Issues:

**Issue 1.6.1 - Radar Financeiro - Menu de Subprodutos (2 dias)**
- [ ] Criar `/app/radar-financeiro/page.tsx`
- [ ] Componente `FinancialProductsGrid.tsx`:
  - Grid com 7 cards (subprodutos)
  - Card para cada:
    1. Dossiê de Crédito Completo
    2. Score de Crédito QUOD
    3. Protestos Nacional
    4. Protestos SP
    5. CADIN
    6. SCR Detalhada BACEN
    7. Antifraude Chave PIX
  - Cada card: Ícone, Título, Descrição, Custo em créditos, Botão "Acessar"
- [ ] **Nota:** Páginas individuais serão criadas em sprints futuras
- **Arquivos:**
  - `frontend/app/radar-financeiro/page.tsx`
  - `frontend/components/radar-financeiro/FinancialProductsGrid.tsx`

**Issue 1.6.2 - Sistema de Créditos e Planos (3 dias)**
- [ ] Criar `/app/credits/page.tsx` (dashboard)
- [ ] Criar `/app/plans/page.tsx` (lista planos)
- [ ] Criar `/app/packages/page.tsx` (pacotes avulsos)
- [ ] Componente `CreditBalance.tsx` (saldo atual - mock)
- [ ] Componente `CreditUsageChart.tsx` (gráfico consumo)
- [ ] Componente `PlanCard.tsx`
- [ ] Componente `PackageCard.tsx`
- [ ] Mock data: 3 planos, 4 pacotes
- **Arquivos:**
  - `frontend/app/credits/page.tsx`
  - `frontend/app/plans/page.tsx`
  - `frontend/app/packages/page.tsx`
  - `frontend/components/credits/CreditBalance.tsx`
  - `frontend/components/credits/CreditUsageChart.tsx`
  - `frontend/mocks/credits.ts`

**Issue 1.6.3 - Favoritos e Alertas (2 dias)**
- [ ] Criar `/app/favorites/page.tsx`
- [ ] Criar `/app/alerts/page.tsx`
- [ ] Componente `FavoritesList.tsx` (PF/PJ separados)
- [ ] Componente `AlertsList.tsx`
- [ ] Mock localStorage para favoritos
- [ ] Mock data para alertas
- **Arquivos:**
  - `frontend/app/favorites/page.tsx`
  - `frontend/app/alerts/page.tsx`
  - `frontend/components/favorites/FavoritesList.tsx`
  - `frontend/components/alerts/AlertsList.tsx`

**Issue 1.6.4 - Relatórios (1 dia)**
- [ ] Criar `/app/reports/page.tsx`
- [ ] Componente `ReportGenerator.tsx` (mock)
- [ ] Lista relatórios gerados (mock)
- **Arquivos:**
  - `frontend/app/reports/page.tsx`
  - `frontend/components/reports/ReportGenerator.tsx`

---

### ✅ MILESTONE DELIVERY 1 - FRONTEND COMPLETO

**Critérios de Aceitação:**
- [ ] 4 Produtos principais funcionais com mockdata
- [ ] Smart CNPJ: Busca com 7 tipos + 8 filtros + detalhes
- [ ] Dados 360°: Dossiês PF e PJ completos
- [ ] Radar Jurídico: Lista processos + detalhamento
- [ ] Radar Financeiro: Menu de 7 subprodutos
- [ ] Sistema Créditos/Planos/Favoritos/Alertas/Relatórios
- [ ] Navegação completa entre todas páginas
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Paleta Shopee implementada
- [ ] Google Maps API funcionando
- [ ] Performance: Lighthouse Score > 90
- [ ] Acessibilidade: WCAG 2.1 AA
- [ ] Zero erros no console

**Entregáveis:**
- Frontend completo hospedado em dev
- Storybook com componentes documentados
- Guia de estilo visual
- Demo navegável para stakeholders
- Mockdata realista para todos produtos

---

## 🔧 DELIVERY 2: BACKEND DOS 4 PRODUTOS (6-8 SEMANAS)

> **Objetivo:** Substituir mockdata por APIs reais e banco de dados.  
> **Autenticação:** AINDA NÃO implementada (user_id=1 fixo)  
> **Endpoints:** Abertos (ambiente dev)

---

### 🏃 SPRINT 2.1 - Smart CNPJ Backend (PRIORIDADE MÁXIMA) (1.5 semanas)

**Período Estimado:** Semanas 12-13.5

**Justificativa:** Base CNPJ completa JÁ ESTÁ no PostgreSQL ✅

#### Issues:

**Issue 2.1.1 - Models e Schemas Smart CNPJ (2 dias)**
- [ ] Verificar model `Empresa` existente (ou criar)
- [ ] Adicionar campos faltantes (se necessário):
  - email, email_contabilidade
  - telefone_1, telefone_2
  - opção_simples, opção_mei
  - forma_tributacao
- [ ] Criar indexes para busca:
  - cnpj (único)
  - razao_social (full-text search)
  - email, telefone
  - nome_socio (join com tabela socios)
  - cep
  - situacao_cadastral, porte, data_abertura
- [ ] Migration Alembic
- [ ] Criar schemas Pydantic:
  - `SmartCNPJSearchRequest` (7 tipos de busca + 8 filtros)
  - `SmartCNPJResponse` (resultado paginado)
  - `EmpresaSmartResponse` (empresa individual)
- **Arquivos:**
  - `backend/app/models/empresa.py`
  - `backend/app/schemas/smart_cnpj.py`
  - `backend/migrations/versions/xxx_smart_cnpj_indexes.py`

**Issue 2.1.2 - Endpoints Smart CNPJ (3 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/smart_cnpj.py`
- [ ] Endpoint `POST /api/v1/smart-cnpj/search`:
  - Receber tipo_busca (cnpj, razao_social, segmento, email, telefone, nome_socio, cep)
  - Receber 8 filtros (situacao, tipo, porte, capital, mei, simples, tributacao, data_abertura)
  - Query builder dinâmico (SQLAlchemy)
  - Paginação (page, page_size=20)
  - Dedução de créditos: 5 créditos
  - Salvar pesquisa no histórico
  - Retornar lista + total + paginação
- [ ] Endpoint `GET /api/v1/smart-cnpj/{cnpj}`:
  - Buscar empresa por CNPJ
  - Retornar detalhes completos
  - NÃO deduz créditos (consulta salva)
- [ ] Tratamento de erros (400, 402, 404, 500)
- **Arquivos:**
  - `backend/app/api/v1/endpoints/smart_cnpj.py`

**Issue 2.1.3 - Query Builder Avançado (2 dias)**
- [ ] Criar `backend/app/services/smart_cnpj_service.py`
- [ ] Função `build_search_query()`:
  - Suportar 7 tipos de busca
  - Aplicar 8 filtros dinamicamente
  - Full-text search para razao_social
  - LIKE para email, telefone
  - Join com socios para busca por nome_socio
  - Range para capital_social e data_abertura
  - Multi-select para situacao, porte
- [ ] Função `calculate_coordinates()` (mock GPS):
  - Receber CEP, retornar lat/long mock
  - Preparar para integração futura com base real
- [ ] Testes unitários (pytest)
- **Arquivos:**
  - `backend/app/services/smart_cnpj_service.py`
  - `backend/tests/test_smart_cnpj_service.py`

**Issue 2.1.4 - Integração Frontend ↔ Backend Smart CNPJ (1 dia)**
- [ ] Atualizar hook `useSmartCNPJ()`:
  - Substituir mockdata por chamadas API
  - POST /api/v1/smart-cnpj/search
  - GET /api/v1/smart-cnpj/{cnpj}
- [ ] Tratamento de erros (402 - sem créditos, 404)
- [ ] Loading states
- [ ] Toast notifications
- **Arquivos:**
  - `frontend/hooks/useSmartCNPJ.ts`

---

### 🏃 SPRINT 2.2 - Dados 360° PJ (Predictus API) (2 semanas)

**Período Estimado:** Semanas 14-15

#### Issues:

**Issue 2.2.1 - Finalizar Endpoints Predictus PJ (RETOMAR Issue 5.3) (2 dias)**
- [ ] **RETOMAR:** Código criado na Issue 5.3
  - `backend/app/schemas/research_pj.py` (330 lines)
  - `backend/app/api/v1/endpoints/research_pj.py` (455 lines)
  - `backend/app/api/deps.py` (125 lines)
- [ ] Renomear rotas para alinhamento:
  - POST /api/v1/dados360/pj → solicitar dossiê
  - GET /api/v1/dados360/pj/{id}
  - GET /api/v1/dados360/pj/cnpj/{cnpj}
- [ ] Testar integração PredictusAPIClient
- [ ] Validar cache Redis
- [ ] Commit final

**Issue 2.2.2 - Integração Frontend Dados 360° PJ (2 dias)**
- [ ] Atualizar hook `useDados360PJ()`:
  - Chamar POST /api/v1/dados360/pj
  - Chamar GET /api/v1/dados360/pj/{id}
- [ ] Remover mockdata `mocks/dados360-pj.ts`
- [ ] Tratamento de erros
- [ ] Loading states

**Issue 2.2.3 - Sistema de Relacionamento Sócios (RETOMAR Issue 5.4) (3 dias)**
- [ ] **RETOMAR:** Issue 5.4
- [ ] CRUD `socios.py`
- [ ] Endpoints:
  - GET /api/v1/socios/{cpf_cnpj}/empresas
  - GET /api/v1/empresas/{cnpj}/socios
  - GET /api/v1/socios/{cpf_cnpj}/graph (grafo relacionamentos)
- [ ] Conectar componente `CompanyLinksCard.tsx`

---

### 🏃 SPRINT 2.3 - Dados 360° PF (DirectData API) (2 semanas)

**Período Estimado:** Semanas 16-17

#### Issues:

**Issue 2.3.1 - DirectData API Client (3 dias)**
- [ ] Criar `backend/app/services/directdata_service.py`
- [ ] Classe `DirectDataAPIClient`
- [ ] Método `get_dossie_pf(cpf: str)`
- [ ] Parser JSON → Models PF
- [ ] Cache Redis (7 dias TTL)
- [ ] Retry logic (3x)
- [ ] Testes unitários

**Issue 2.3.2 - Models Pessoa Física (2 dias)**
- [ ] Criar `backend/app/models/pessoa_fisica.py`
- [ ] Models: PessoaFisica, DocumentoPF, ContatoPF, EnderecoPF, EmpresaVinculadaPF, ExperienciaProfissionalPF, ParentePF
- [ ] Migration Alembic
- [ ] Relationships e indexes

**Issue 2.3.3 - Endpoints Dados 360° PF (3 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/dados360_pf.py`
- [ ] Schemas em `backend/app/schemas/dados360_pf.py`
- [ ] Endpoints:
  - POST /api/v1/dados360/pf (solicitar dossiê - 8 créditos)
  - GET /api/v1/dados360/pf/{id}
  - GET /api/v1/dados360/pf/cpf/{cpf}
- [ ] Registrar router

**Issue 2.3.4 - Integração Frontend Dados 360° PF (2 dias)**
- [ ] Atualizar hook `useDados360PF()`
- [ ] Remover mockdata `mocks/dados360-pf.ts`
- [ ] Tratamento de erros

---

### 🏃 SPRINT 2.4 - Radar Jurídico (Predictus Processos) (2 semanas)

**Período Estimado:** Semanas 18-19

#### Issues:

**Issue 2.4.1 - Predictus Processos API Client (3 dias)**
- [ ] Estender `PredictusAPIClient` (já existe)
- [ ] Método `get_processos_pf(cpf: str)`
- [ ] Método `get_processos_pj(cnpj: str)`
- [ ] Método `get_processo_detalhes(numero: str)`
- [ ] Parser JSON → Models Processo
- [ ] Cache Redis (30 dias TTL)

**Issue 2.4.2 - Models Processo Judicial (2 dias)**
- [ ] Criar `backend/app/models/processo.py`
- [ ] Models: Processo, Parte, Movimentacao, AssuntoProcesso, ProcessoRelacionado
- [ ] Migration Alembic

**Issue 2.4.3 - Endpoints Radar Jurídico (4 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/radar_juridico.py`
- [ ] Schemas em `backend/app/schemas/radar_juridico.py`
- [ ] Endpoints:
  - POST /api/v1/radar-juridico/pf (buscar processos - 20 créditos)
  - POST /api/v1/radar-juridico/pj (buscar processos - 20 créditos)
  - GET /api/v1/radar-juridico/processo/{numero} (detalhes)
- [ ] Salvar processos no PostgreSQL

**Issue 2.4.4 - Integração Frontend Radar Jurídico (1 dia)**
- [ ] Atualizar hook `useRadarJuridico()`
- [ ] Remover mockdata
- [ ] Tratamento de erros

---

### 🏃 SPRINT 2.5 - Sistema de Créditos Real (1 semana)

**Período Estimado:** Semanas 20-21

#### Issues:

**Issue 2.5.1 - Service de Créditos (2 dias)**
- [ ] Criar `backend/app/services/credit_service.py`
- [ ] Funções:
  - `check_user_credits(user_id, amount)`
  - `deduct_credits(user_id, amount, description, resource_type, resource_id)`
  - `add_credits(user_id, amount, description)`
  - `get_credit_history(user_id, filters)`
- [ ] Integrar em todos endpoints de pesquisa
- [ ] Histórico de transações com tipo de recurso

**Issue 2.5.2 - Endpoints Créditos (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/credits.py`
- [ ] Endpoints:
  - GET /api/v1/credits/balance (saldo atual)
  - GET /api/v1/credits/history (histórico paginado)
  - GET /api/v1/credits/usage-stats (estatísticas)
- [ ] Atualizar frontend `/app/credits/page.tsx`

**Issue 2.5.3 - Verificação de Pesquisas Duplicadas (1 dia)**
- [ ] Criar tabela `SearchHistory` (user_id, resource_type, resource_id, timestamp)
- [ ] Lógica: mesma pesquisa = nova cobrança (conforme especificado)
- [ ] Endpoint para buscar histórico: GET /api/v1/search-history
- [ ] Permitir visualizar resultados salvos sem cobrar

---

### 🏃 SPRINT 2.6 - Gateway de Pagamentos (1.5 semanas)

**Período Estimado:** Semanas 21.5-23

#### Issues:

**Issue 2.6.1 - Integração Asaas/Stripe (3 dias)**
- [ ] Escolher: Asaas (Brasil) ou Stripe (internacional)
- [ ] Criar `backend/app/services/payment_service.py`
- [ ] Configurar webhooks
- [ ] Criar checkout session
- [ ] Processar pagamentos aprovados/rejeitados

**Issue 2.6.2 - Endpoints de Pagamento (2 dias)**
- [ ] Criar `backend/app/api/v1/endpoints/payments.py`
- [ ] Endpoints:
  - POST /api/v1/payments/checkout (criar sessão)
  - POST /api/v1/payments/webhook (receber notificações)
  - GET /api/v1/payments/history
- [ ] Conectar frontend

**Issue 2.6.3 - Planos e Pacotes (2 dias)**
- [ ] Endpoints GET /api/v1/plans, POST /api/v1/plans/subscribe
- [ ] Endpoints GET /api/v1/packages, POST /api/v1/packages/purchase
- [ ] Atualizar frontend `/app/plans/page.tsx`, `/app/packages/page.tsx`

---

### 🏃 SPRINT 2.7 - Favoritos, Alertas, Relatórios (1 semana)

**Período Estimado:** Semanas 23-24

#### Issues:

**Issue 2.7.1 - CRUD Favoritos (2 dias)**
- [ ] Model `Favorito` (user_id, resource_type, resource_id)
- [ ] Endpoints: POST, GET, DELETE /api/v1/favorites
- [ ] Conectar frontend

**Issue 2.7.2 - Sistema de Alertas (2 dias)**
- [ ] Model `Alerta`
- [ ] Background job (Celery) para monitorar mudanças
- [ ] Endpoints: GET, PUT /api/v1/alerts
- [ ] Conectar frontend

**Issue 2.7.3 - Geração de Relatórios PDF (3 dias)**
- [ ] Criar `backend/app/services/pdf_generator.py`
- [ ] Template HTML → PDF (WeasyPrint)
- [ ] Endpoints:
  - GET /api/v1/smart-cnpj/{cnpj}/pdf
  - GET /api/v1/dados360/pf/{cpf}/pdf
  - GET /api/v1/dados360/pj/{cnpj}/pdf
  - GET /api/v1/radar-juridico/processo/{numero}/pdf
- [ ] Cache Redis (24h TTL)
- [ ] Conectar frontend (botões "Baixar PDF")

---

### ✅ MILESTONE DELIVERY 2 - BACKEND COMPLETO

**Critérios de Aceitação:**
- [ ] Smart CNPJ: Busca avançada funcionando (PostgreSQL)
- [ ] Dados 360° PJ: Predictus API integrada
- [ ] Dados 360° PF: DirectData API integrada
- [ ] Radar Jurídico: Processos PF/PJ funcionando
- [ ] Sistema de créditos: Cobrança a cada pesquisa
- [ ] Gateway de pagamentos: Sandbox funcionando
- [ ] Favoritos, Alertas, Relatórios: Backend completo
- [ ] Zero mockdata no frontend
- [ ] Cobertura de testes > 80%
- [ ] Documentação Swagger completa
- [ ] Performance: Tempo resposta < 2s (p95)

**Entregáveis:**
- Backend completo dos 4 produtos
- Documentação API (Swagger)
- Testes automatizados (pytest)
- Guia de deployment

---

## 📝 NOTAS IMPORTANTES

### Coordenadas GPS

**Estratégia:**
- **Fase 1 (Delivery 1):** Mock de coordenadas GPS
- **Fase 2 (Delivery 2):** Cálculo básico por CEP (mock)
- **Fase 3 (Futuro):** Integração com base lat/long real por CEP

### Google Maps API

**Integração interativa:**
- Usar `@googlemaps/react-wrapper` ou similar
- Configurar API Key no `.env`
- Mostrar marcador no endereço
- Zoom automático
- Info window com dados do local

### Priorização

**CRÍTICO (Fazer primeiro):**
1. Smart CNPJ Backend (base local já existe!)
2. Dados 360° PJ (Predictus - já temos integração 90% pronta)
3. Dados 360° PF (DirectData)
4. Radar Jurídico (Predictus)

**SECUNDÁRIO (Depois):**
- Radar Financeiro (7 subprodutos) - Delivery 3 ou 4
- Compliance avançado

---

*Continua na PARTE 2: Delivery 3 e 4 (Autenticação + Segurança)*
