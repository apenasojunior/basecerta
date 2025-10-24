# 🎨 Sistema de Design - BaseCerta

Documentação completa do Design System da plataforma BaseCerta.

**Versão:** 1.0.0  
**Última Atualização:** 20/10/2025  
**Responsável:** Equipe de Design e Frontend

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Espaçamentos](#espaçamentos)
5. [Componentes](#componentes)
6. [Layout](#layout)
7. [Ícones](#ícones)
8. [Animações](#animações)
9. [Responsividade](#responsividade)
10. [Acessibilidade](#acessibilidade)

---

## 🎯 Visão Geral

O Design System da BaseCerta segue os princípios de:

- **Consistência:** Todos os componentes seguem o mesmo padrão visual
- **Acessibilidade:** WCAG 2.1 nível AA
- **Escalabilidade:** Componentes reutilizáveis e modulares
- **Performance:** Otimizado para carregamento rápido
- **Responsividade:** Adaptável a todos os tamanhos de tela

### Identidade Visual

A BaseCerta utiliza uma paleta vibrante focada em **laranja** como cor principal, transmitindo **energia**, **confiança** e **inovação**.

---

## 🎨 Paleta de Cores

### Cores Principais

```css
/* Primária - Laranja Vibrante */
--primary-50: #FFF5F2;
--primary-100: #FFE8E0;
--primary-200: #FFCFBD;
--primary-300: #FFB199;
--primary-400: #FF8766;
--primary-500: #EE4D2D;  /* COR PRINCIPAL */
--primary-600: #D43919;
--primary-700: #B32A12;
--primary-800: #921F0E;
--primary-900: #78180C;

/* Secundária - Branco */
--secondary: #FFFFFF;
```

### Cores de Texto

```css
--text-primary: #333333;      /* Títulos, textos principais */
--text-secondary: #666666;    /* Textos secundários, labels */
--text-tertiary: #999999;     /* Placeholders, textos auxiliares */
--text-disabled: #CCCCCC;     /* Textos desabilitados */
--text-inverse: #FFFFFF;      /* Texto sobre fundos escuros */
```

### Cores de Fundo

```css
--background-primary: #F4F4F4;    /* Fundo principal da aplicação */
--background-secondary: #FFFFFF;  /* Fundo de cards e modais */
--background-tertiary: #FAFAFA;   /* Fundo alternativo */
--background-dark: #1A1A1A;       /* Modo escuro (futuro) */
```

### Cores de Status

```css
/* Sucesso */
--success-light: #D4EDDA;
--success: #28A745;
--success-dark: #1E7E34;

/* Erro */
--error-light: #F8D7DA;
--error: #DC3545;
--error-dark: #C82333;

/* Aviso */
--warning-light: #FFF3CD;
--warning: #FFC107;
--warning-dark: #E0A800;

/* Informação */
--info-light: #D1ECF1;
--info: #17A2B8;
--info-dark: #117A8B;
```

### Cores Neutras (Grays)

```css
--gray-50: #FAFAFA;
--gray-100: #F4F4F4;
--gray-200: #E8E8E8;
--gray-300: #D1D1D1;
--gray-400: #B0B0B0;
--gray-500: #888888;
--gray-600: #666666;
--gray-700: #444444;
--gray-800: #333333;
--gray-900: #1A1A1A;
```

### Cores de Borda

```css
--border-light: #E8E8E8;      /* Bordas sutis */
--border-medium: #D1D1D1;     /* Bordas padrão */
--border-dark: #B0B0B0;       /* Bordas destacadas */
--border-primary: #EE4D2D;    /* Bordas em foco/ativas */
```

### Uso das Cores

| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| Botão Primário | Laranja | `#EE4D2D` | CTAs principais, ações primárias |
| Botão Secundário | Outline Laranja | `#EE4D2D` | Ações secundárias |
| Links | Laranja | `#EE4D2D` | Links e textos clicáveis |
| Item Ativo (Sidebar) | Laranja | `#EE4D2D` | Indicação de página ativa |
| Sucesso | Verde | `#28A745` | Confirmações, checks |
| Erro | Vermelho | `#DC3545` | Erros, alertas críticos |
| Aviso | Amarelo | `#FFC107` | Avisos, atenção |
| Info | Azul | `#17A2B8` | Informações neutras |

---

## ✍️ Tipografia

### Font Family

```css
/* Primária - Interface */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                       'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
                       'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Secundária - Números/Dados */
--font-family-mono: 'Roboto Mono', 'Courier New', monospace;

/* Logo */
--font-family-logo: 'Inter', sans-serif;
```

### Font Sizes

```css
/* Escala de tamanhos */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
```

### Font Weights

```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Hierarquia Tipográfica

```css
/* Heading 1 - Página Principal */
h1 {
  font-size: var(--text-4xl);      /* 36px */
  font-weight: var(--font-bold);   /* 700 */
  line-height: var(--leading-tight); /* 1.25 */
  color: var(--text-primary);
}

/* Heading 2 - Seções */
h2 {
  font-size: var(--text-3xl);      /* 30px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* Heading 3 - Subsections */
h3 {
  font-size: var(--text-2xl);      /* 24px */
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--text-primary);
}

/* Heading 4 - Cards */
h4 {
  font-size: var(--text-xl);       /* 20px */
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* Body - Texto padrão */
p, body {
  font-size: var(--text-base);     /* 16px */
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* Small - Textos pequenos */
small {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

/* Caption - Legendas */
.caption {
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--text-tertiary);
}
```

---

## 📏 Espaçamentos

### Sistema de Escala (8px base)

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Uso de Espaçamentos

| Contexto | Espaçamento | Uso |
|----------|-------------|-----|
| Entre elementos inline | 4px (spacing-1) | Badges, tags |
| Padding interno de botões | 8px 16px (spacing-2/4) | Botões pequenos |
| Padding interno de inputs | 12px 16px (spacing-3/4) | Campos de formulário |
| Espaço entre campos de formulário | 16px (spacing-4) | Vertical spacing |
| Padding interno de cards | 24px (spacing-6) | Cards padrão |
| Margem entre seções | 32px (spacing-8) | Seções de página |
| Margem de página | 48px (spacing-12) | Margens externas |

---

## 🧩 Componentes

### Botões

#### Variantes

**Primary (Primário)**
```css
.button-primary {
  background: var(--primary-500);
  color: var(--text-inverse);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(238, 77, 45, 0.3);
}

.button-primary:active {
  background: var(--primary-700);
  transform: translateY(0);
}

.button-primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  transform: none;
}
```

**Secondary (Secundário)**
```css
.button-secondary {
  background: transparent;
  color: var(--primary-500);
  border: 2px solid var(--primary-500);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.button-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-600);
}
```

**Ghost**
```css
.button-ghost {
  background: transparent;
  color: var(--primary-500);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.button-ghost:hover {
  background: var(--primary-50);
}
```

#### Tamanhos

```css
/* Small */
.button-sm {
  padding: 8px 16px;
  font-size: var(--text-sm);
  border-radius: 6px;
}

/* Medium (padrão) */
.button-md {
  padding: 12px 24px;
  font-size: var(--text-base);
  border-radius: 8px;
}

/* Large */
.button-lg {
  padding: 16px 32px;
  font-size: var(--text-lg);
  border-radius: 10px;
}
```

### Cards

```css
.card {
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 16px;
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: 4px;
}

.card-body {
  /* Conteúdo principal */
}

.card-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
  margin-top: 16px;
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: var(--text-base);
  font-family: var(--font-family-primary);
  color: var(--text-primary);
  background: var(--background-secondary);
  border: 2px solid var(--border-medium);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(238, 77, 45, 0.1);
}

.input:disabled {
  background: var(--gray-100);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.input.error {
  border-color: var(--error);
}

.input.success {
  border-color: var(--success);
}

/* Input com ícone */
.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.input-with-icon {
  padding-left: 44px;
}
```

### Tabelas

```css
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--background-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  background: var(--gray-50);
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-header th {
  padding: 16px;
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border-light);
}

.table-body tr {
  transition: background 0.2s ease;
}

.table-body tr:nth-child(even) {
  background: var(--background-tertiary);
}

.table-body tr:hover {
  background: var(--primary-50);
}

.table-body td {
  padding: 16px;
  font-size: var(--text-base);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
}

.table-body tr:last-child td {
  border-bottom: none;
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: var(--success-light);
  color: var(--success-dark);
}

.badge-error {
  background: var(--error-light);
  color: var(--error-dark);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning-dark);
}

.badge-info {
  background: var(--info-light);
  color: var(--info-dark);
}

.badge-primary {
  background: var(--primary-100);
  color: var(--primary-700);
}
```

### Modais

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: var(--background-secondary);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

---

## 📐 Layout

### Grid System

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.grid {
  display: grid;
  gap: 24px;
}

/* Responsive columns */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

### Sidebar Layout

```css
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: var(--background-secondary);
  border-right: 1px solid var(--border-light);
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 64px;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--border-light);
  padding: 0 24px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.content {
  flex: 1;
  padding: 24px;
  background: var(--background-primary);
}
```

### Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Tablet pequeno */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop pequeno */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop grande */
```

---

## 🎭 Ícones

### Biblioteca: Lucide React

Utilizar [Lucide React](https://lucide.dev/) para todos os ícones.

### Tamanhos Padrão

```css
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

### Ícones Principais

| Contexto | Ícone | Nome Lucide |
|----------|-------|-------------|
| Dashboard | 📊 | `LayoutDashboard` |
| Empresas | 🏢 | `Building2` |
| Cadastrais | 📋 | `FileText` |
| Financeiro | 💰 | `DollarSign` |
| Jurídico | ⚖️ | `Scale` |
| Perfil | 👤 | `User` |
| Configurações | ⚙️ | `Settings` |
| Ajuda | ❓ | `HelpCircle` |
| Notificações | 🔔 | `Bell` |
| Menu | ☰ | `Menu` |
| Fechar | ✕ | `X` |
| Busca | 🔍 | `Search` |
| Adicionar | ➕ | `Plus` |
| Editar | ✏️ | `Edit` |
| Deletar | 🗑️ | `Trash2` |
| Download | ⬇️ | `Download` |
| Upload | ⬆️ | `Upload` |
| Sucesso | ✓ | `CheckCircle` |
| Erro | ✕ | `XCircle` |
| Aviso | ⚠️ | `AlertTriangle` |
| Info | ℹ️ | `Info` |

---

## 🎬 Animações

### Transições

```css
/* Transição padrão */
.transition {
  transition: all 0.2s ease;
}

/* Transições específicas */
.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
```

### Durações

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Easing

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Keyframes Úteis

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 📱 Responsividade

### Princípios

1. **Mobile First:** Desenhar primeiro para mobile, depois adaptar para telas maiores
2. **Touch Friendly:** Botões e áreas clicáveis com no mínimo 44x44px
3. **Content Priority:** Priorizar conteúdo essencial em telas pequenas
4. **Flexible Layouts:** Usar flexbox e grid para layouts adaptativos

### Guia de Breakpoints

```css
/* Mobile (< 640px) */
- Sidebar vira drawer (menu lateral deslizante)
- Grid de 4 colunas vira 1 coluna
- Tabelas com scroll horizontal ou cards
- Breadcrumbs truncados
- Modais fullscreen

/* Tablet (640px - 1024px) */
- Sidebar colapsada por padrão
- Grid de 4 colunas vira 2 colunas
- Tabelas com scroll horizontal
- Breadcrumbs completos

/* Desktop (> 1024px) */
- Sidebar expandida
- Grid completo (até 4 colunas)
- Tabelas completas
- Todos os recursos visíveis
```

---

## ♿ Acessibilidade

### Princípios WCAG 2.1 - Nível AA

#### 1. Perceptível

**Contraste de Cores**
- Texto normal: mínimo 4.5:1
- Texto grande (18px+): mínimo 3:1
- Componentes UI: mínimo 3:1

**Texto Alternativo**
```html
<!-- Sempre fornecer alt em imagens -->
<img src="logo.png" alt="BaseCerta - Logo" />

<!-- Ícones decorativos -->
<svg aria-hidden="true">...</svg>

<!-- Ícones funcionais -->
<button aria-label="Fechar modal">
  <X />
</button>
```

#### 2. Operável

**Navegação por Teclado**
```css
/* Focus visível */
*:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Remover outline apenas se usar outro indicador */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

**Skip Links**
```html
<a href="#main-content" class="skip-link">
  Pular para conteúdo principal
</a>
```

**ARIA Labels**
```html
<!-- Botões com ícones -->
<button aria-label="Abrir menu">
  <Menu />
</button>

<!-- Inputs -->
<input 
  type="text" 
  aria-label="Buscar produtos"
  aria-describedby="search-hint"
/>
<span id="search-hint">Digite CNPJ ou CPF</span>

<!-- Estados dinâmicos -->
<div role="alert" aria-live="polite">
  Créditos adicionados com sucesso!
</div>
```

#### 3. Compreensível

**Labels Claros**
```html
<!-- Sempre usar label em inputs -->
<label for="email">E-mail</label>
<input id="email" type="email" />

<!-- Mensagens de erro claras -->
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">
  Por favor, insira um e-mail válido
</span>
```

#### 4. Robusto

**HTML Semântico**
```html
<!-- Usar tags semânticas -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>

<!-- Headings hierárquicos -->
<h1>Dashboard</h1>
  <h2>Estatísticas</h2>
  <h2>Atividade Recente</h2>
    <h3>Últimas Consultas</h3>
```

### Checklist de Acessibilidade

- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Navegação por teclado funcional
- [ ] Focus visível em todos os elementos interativos
- [ ] ARIA labels em ícones e botões sem texto
- [ ] Mensagens de erro associadas aos campos
- [ ] HTML semântico
- [ ] Headings hierárquicos (h1 → h2 → h3)
- [ ] Alt text em todas as imagens
- [ ] Skip links para navegação rápida
- [ ] Estados de loading anunciados para screen readers
- [ ] Modais trapam focus
- [ ] Tamanho de toque mínimo 44x44px

---

## 🔧 Implementação em Tailwind CSS

### Configuração do tema

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFCFBD',
          300: '#FFB199',
          400: '#FF8766',
          500: '#EE4D2D',
          600: '#D43919',
          700: '#B32A12',
          800: '#921F0E',
          900: '#78180C',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F4F4F4',
          200: '#E8E8E8',
          300: '#D1D1D1',
          400: '#B0B0B0',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#333333',
          900: '#1A1A1A',
        },
        success: {
          light: '#D4EDDA',
          DEFAULT: '#28A745',
          dark: '#1E7E34',
        },
        error: {
          light: '#F8D7DA',
          DEFAULT: '#DC3545',
          dark: '#C82333',
        },
        warning: {
          light: '#FFF3CD',
          DEFAULT: '#FFC107',
          dark: '#E0A800',
        },
        info: {
          light: '#D1ECF1',
          DEFAULT: '#17A2B8',
          dark: '#117A8B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 20px 60px rgba(0, 0, 0, 0.3)',
        'primary': '0 4px 12px rgba(238, 77, 45, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 📚 Recursos Adicionais

### Ferramentas Recomendadas

- **Design:** Figma
- **Ícones:** Lucide React
- **Animações:** Framer Motion (opcional)
- **Componentes:** shadcn/ui
- **Validação de Cores:** WebAIM Contrast Checker
- **Acessibilidade:** axe DevTools

### Referências

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Material Design](https://m3.material.io/)

---

## 🎯 Logo BaseCerta

### Especificação

```tsx
// Componente Logo
export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  }
  
  return (
    <h1 className={`font-bold ${sizes[size]}`}>
      <span className="text-primary-500">Base</span>
      <span className="text-gray-800">Certa</span>
      <span className="text-primary-500">.</span>
    </h1>
  )
}
```

### Uso

- **Sidebar:** Logo médio com texto completo
- **Header:** Logo pequeno ou ícone apenas
- **Login/Landing:** Logo grande

---

**Fim do Design System v1.0**  
**BaseCerta © 2025**
