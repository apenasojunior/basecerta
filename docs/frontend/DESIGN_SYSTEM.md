# 🎨 Design System BaseCerta

> **Inspiração:** Paleta Shopee  
> **Objetivo:** UX alegre, moderna e que transmite felicidade  
> **Última Atualização:** 22 de Outubro de 2025

---

## 📋 ÍNDICE

- [Paleta de Cores](#paleta-de-cores)
- [Tipografia](#tipografia)
- [Espaçamentos](#espaçamentos)
- [Breakpoints](#breakpoints)
- [Componentes Base](#componentes-base)
- [Sombras](#sombras)
- [Animações](#animações)
- [Ícones](#ícones)
- [Uso de Cores](#uso-de-cores)

---

## 🎨 PALETA DE CORES

### Cores Primárias (Laranja Shopee)

**Primary - Laranja Vibrante**
```css
--primary: #EE4D2D (HSL: 10 85% 55%)
```

**Escala Completa:**
- `primary-50`: `#FFF5F2` (Background muito claro)
- `primary-100`: `#FFE8E0` (Hover states suaves)
- `primary-200`: `#FFCFBD` (Borders suaves)
- `primary-300`: `#FFB199` (Disabled states)
- `primary-400`: `#FF8766` (Hover buttons)
- `primary-500`: `#EE4D2D` ⭐ **COR PRINCIPAL**
- `primary-600`: `#D43919` (Active states)
- `primary-700`: `#B32A12` (Texto escuro)
- `primary-800`: `#921F0E` (Texto mais escuro)
- `primary-900`: `#78180C` (Texto máximo contraste)

**Uso:**
- Botões principais (CTAs)
- Links importantes
- Badges de destaque
- Ícones de ação
- Barra de progresso
- Gradientes (primary-500 → primary-600)

---

### Cores Neutras

**Background e Texto:**
```css
--background: #FFFFFF (Branco limpo)
--foreground: #0A0A0A (Preto suave, 3.9% lightness)
--card: #FFFFFF
--card-foreground: #0A0A0A
```

**Cinzas Modernos:**
- `gray-50`: `#FAFAFA` (Background sutil)
- `gray-100`: `#F4F4F4` (Background secundário)
- `gray-200`: `#E8E8E8` (Borders)
- `gray-300`: `#D4D4D4` (Borders hover)
- `gray-400`: `#A3A3A3` (Texto disabled)
- `gray-500`: `#737373` (Texto secundário)
- `gray-600`: `#525252` (Texto primário leve)
- `gray-700`: `#404040` (Texto primário)
- `gray-800`: `#262626` (Texto forte)
- `gray-900`: `#171717` (Texto máximo contraste)

**Uso:**
- Textos (gray-700 para corpo, gray-500 para secundário)
- Borders (gray-200)
- Backgrounds (gray-50, gray-100)
- Dividers (gray-200)

---

### Cores Semânticas

**Success (Verde):**
- `success-light`: `#D4EDDA`
- `success`: `#28A745` ⭐
- `success-dark`: `#1E7E34`
- **Uso:** Mensagens de sucesso, status ativo, confirmações

**Error (Vermelho):**
- `error-light`: `#F8D7DA`
- `error`: `#DC3545` ⭐
- `error-dark`: `#C82333`
- **Uso:** Mensagens de erro, validações, alertas críticos

**Warning (Amarelo):**
- `warning-light`: `#FFF3CD`
- `warning`: `#FFC107` ⭐
- `warning-dark`: `#E0A800`
- **Uso:** Avisos, alertas moderados, atenção

**Info (Azul):**
- `info-light`: `#D1ECF1`
- `info`: `#17A2B8` ⭐
- `info-dark`: `#117A8B`
- **Uso:** Mensagens informativas, tooltips, ajuda

---

### Gradientes

**Gradient Primary (Padrão):**
```css
background: linear-gradient(135deg, #EE4D2D 0%, #D43919 100%);
/* Classe Tailwind: gradient-primary */
```

**Gradient Secondary (Suave):**
```css
background: linear-gradient(135deg, #FFCFBD 0%, #FFE8E0 100%);
```

**Gradient Overlay (Escurecer imagens):**
```css
background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
/* Classe Tailwind: gradient-overlay */
```

**Uso:**
- Backgrounds de hero sections
- Botões especiais
- Cards de destaque
- Overlays de imagens

---

## ✏️ TIPOGRAFIA

### Fontes

**Display (Títulos e Destaques):**
```css
font-family: 'Poppins', sans-serif;
font-weight: 600, 700, 800 (SemiBold, Bold, ExtraBold)
```
- **Uso:** H1, H2, H3, CTAs, Logos, Badges grandes

**Sans (Corpo e UI):**
```css
font-family: 'Inter', sans-serif;
font-weight: 400, 500, 600 (Regular, Medium, SemiBold)
```
- **Uso:** Parágrafos, labels, inputs, botões, UI geral

**Mono (Códigos e Números):**
```css
font-family: 'Roboto Mono', monospace;
font-weight: 400, 500 (Regular, Medium)
```
- **Uso:** CPF, CNPJ, números de processo, códigos, datas

---

### Hierarquia de Texto

| Elemento | Fonte | Tamanho | Peso | Cor | Tailwind |
|----------|-------|---------|------|-----|----------|
| **H1** | Poppins | 36px (2.25rem) | 700 | gray-900 | `text-4xl font-display font-bold` |
| **H2** | Poppins | 30px (1.875rem) | 700 | gray-900 | `text-3xl font-display font-bold` |
| **H3** | Poppins | 24px (1.5rem) | 600 | gray-800 | `text-2xl font-display font-semibold` |
| **H4** | Poppins | 20px (1.25rem) | 600 | gray-800 | `text-xl font-display font-semibold` |
| **H5** | Inter | 18px (1.125rem) | 600 | gray-700 | `text-lg font-semibold` |
| **H6** | Inter | 16px (1rem) | 600 | gray-700 | `text-base font-semibold` |
| **Body Large** | Inter | 18px (1.125rem) | 400 | gray-700 | `text-lg` |
| **Body** | Inter | 16px (1rem) | 400 | gray-700 | `text-base` |
| **Body Small** | Inter | 14px (0.875rem) | 400 | gray-600 | `text-sm` |
| **Caption** | Inter | 12px (0.75rem) | 400 | gray-500 | `text-xs` |
| **Label** | Inter | 14px (0.875rem) | 500 | gray-700 | `text-sm font-medium` |
| **Button** | Inter | 16px (1rem) | 600 | - | `text-base font-semibold` |
| **Code** | Roboto Mono | 14px (0.875rem) | 400 | gray-800 | `font-mono text-sm` |

---

### Line Heights

```css
leading-none: 1
leading-tight: 1.25
leading-snug: 1.375
leading-normal: 1.5 (padrão para corpo)
leading-relaxed: 1.625
leading-loose: 2
```

**Recomendações:**
- **Títulos (H1-H4):** `leading-tight` (1.25)
- **Corpo de texto:** `leading-normal` (1.5)
- **Textos longos:** `leading-relaxed` (1.625)

---

## 📏 ESPAÇAMENTOS

### Escala de Espaçamento (Tailwind)

```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
32: 128px
```

### Uso por Contexto

**Padding de Cards:**
- Small: `p-4` (16px)
- Medium: `p-6` (24px)
- Large: `p-8` (32px)

**Gap entre elementos:**
- Tight: `gap-2` (8px)
- Normal: `gap-4` (16px)
- Relaxed: `gap-6` (24px)

**Margens entre seções:**
- Small: `mb-8` (32px)
- Medium: `mb-12` (48px)
- Large: `mb-16` (64px)

---

## 📱 BREAKPOINTS

```css
sm: 640px   /* Smartphones landscape */
md: 768px   /* Tablets portrait */
lg: 1024px  /* Tablets landscape, small laptops */
xl: 1280px  /* Desktops */
2xl: 1400px /* Large desktops */
```

**Estratégia:** Mobile-first (padrão = mobile, depois `md:`, `lg:`, etc.)

---

## 🧩 COMPONENTES BASE

### Button (Variantes)

**Primary (CTA principal):**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg shadow-primary transition-all">
  Buscar
</button>
```

**Secondary (Ação secundária):**
```tsx
<button className="bg-white hover:bg-gray-50 text-primary-500 border-2 border-primary-500 font-semibold px-6 py-3 rounded-lg transition-all">
  Cancelar
</button>
```

**Ghost (Ação sutil):**
```tsx
<button className="bg-transparent hover:bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all">
  Ver Detalhes
</button>
```

---

### Card (Variantes)

**Default:**
```tsx
<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  {/* Conteúdo */}
</div>
```

**Elevated (Com hover):**
```tsx
<div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
  {/* Conteúdo */}
</div>
```

**Bordered (Sem sombra):**
```tsx
<div className="bg-white rounded-lg p-6 border-2 border-gray-200">
  {/* Conteúdo */}
</div>
```

---

### Badge (Status)

**Success:**
```tsx
<span className="bg-success-light text-success-dark px-3 py-1 rounded-full text-sm font-medium">
  Ativa
</span>
```

**Error:**
```tsx
<span className="bg-error-light text-error-dark px-3 py-1 rounded-full text-sm font-medium">
  Suspensa
</span>
```

**Warning:**
```tsx
<span className="bg-warning-light text-warning-dark px-3 py-1 rounded-full text-sm font-medium">
  Pendente
</span>
```

**Info:**
```tsx
<span className="bg-info-light text-info-dark px-3 py-1 rounded-full text-sm font-medium">
  Em Análise
</span>
```

**Primary:**
```tsx
<span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
  Novo
</span>
```

---

### Alert

**Success:**
```tsx
<div className="bg-success-light border-l-4 border-success p-4 rounded-r-lg">
  <p className="text-success-dark font-medium">Pesquisa realizada com sucesso!</p>
</div>
```

**Error:**
```tsx
<div className="bg-error-light border-l-4 border-error p-4 rounded-r-lg">
  <p className="text-error-dark font-medium">Erro ao processar solicitação.</p>
</div>
```

---

### Input

**Text Input:**
```tsx
<input 
  type="text" 
  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
  placeholder="Digite o CNPJ..."
/>
```

**Input com Erro:**
```tsx
<input 
  type="text" 
  className="w-full px-4 py-3 border-2 border-error rounded-lg focus:ring-2 focus:ring-error-light outline-none"
/>
<p className="text-error text-sm mt-1">CNPJ inválido</p>
```

---

### Select

```tsx
<select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white">
  <option value="">Selecione...</option>
  <option value="1">Opção 1</option>
</select>
```

---

## 🌑 SOMBRAS

```css
shadow-sm: 0 2px 4px rgba(0,0,0,0.05)       /* Sutil */
shadow: 0 2px 8px rgba(0,0,0,0.08)          /* Padrão */
shadow-md: 0 4px 12px rgba(0,0,0,0.1)       /* Média */
shadow-lg: 0 8px 24px rgba(0,0,0,0.12)      /* Grande */
shadow-xl: 0 20px 60px rgba(0,0,0,0.3)      /* Extra grande */
shadow-primary: 0 4px 12px rgba(238,77,45,0.3) /* Primary glow */
```

**Uso:**
- `shadow-sm`: Cards padrão
- `shadow-md`: Cards com hover
- `shadow-lg`: Modals, dropdowns
- `shadow-primary`: Botões primários

---

## ✨ ANIMAÇÕES

### Transições Padrão

```css
transition-all: all 0.2s ease-out          /* Padrão */
transition-colors: colors 0.2s ease-out    /* Cores */
transition-shadow: box-shadow 0.2s ease-out /* Sombras */
transition-transform: transform 0.2s ease-out /* Movimentos */
```

### Animações Prontas

**Fade In:**
```tsx
<div className="animate-fadeIn">
  {/* Conteúdo */}
</div>
```

**Slide In Right:**
```tsx
<div className="animate-slideInRight">
  {/* Conteúdo */}
</div>
```

**Slide In Down:**
```tsx
<div className="animate-slideInDown">
  {/* Conteúdo */}
</div>
```

**Spin (Loading):**
```tsx
<div className="animate-spin">⏳</div>
```

**Pulse (Indicador):**
```tsx
<div className="animate-pulse">🔴</div>
```

---

## 🎯 ÍCONES

**Biblioteca:** Lucide React

**Instalação:**
```bash
npm install lucide-react
```

**Uso:**
```tsx
import { Search, Building2, FileText, Scale, TrendingUp } from 'lucide-react'

<Search className="w-5 h-5 text-gray-500" />
```

**Tamanhos Recomendados:**
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px) ⭐ **Padrão**
- Large: `w-6 h-6` (24px)
- XLarge: `w-8 h-8` (32px)

**Ícones por Produto:**
- Smart CNPJ: `Building2`
- Dados 360°: `FileText`
- Radar Jurídico: `Scale`
- Radar Financeiro: `TrendingUp`

---

## 🎨 USO DE CORES POR CONTEXTO

### Situação Cadastral (CNPJ)

- **Ativa:** `success` (verde)
- **Suspensa:** `warning` (amarelo)
- **Inapta:** `error` (vermelho)
- **Baixada:** `gray-400` (cinza)

### Status de Processo (Jurídico)

- **Arquivamento:** `gray-500`
- **Em Tramitação:** `info` (azul)
- **Em Grau de Recurso:** `warning` (amarelo)

### Risco (Jurídico)

- **Baixo:** `success` (verde)
- **Médio:** `warning` (amarelo)
- **Alto:** `error` (vermelho)

### Polo (Jurídico)

- **Ativo:** `primary` (laranja)
- **Passivo:** `error` (vermelho)
- **Terceiro:** `gray-500` (cinza)

---

## 📝 BOAS PRÁTICAS

### Contraste

✅ **Fazer:**
- Usar `text-gray-700` ou mais escuro para texto principal
- Garantir contraste mínimo 4.5:1 (WCAG AA)
- Usar `text-white` em backgrounds escuros

❌ **Evitar:**
- `text-gray-400` ou mais claro para texto principal
- Texto laranja em backgrounds brancos (baixo contraste)

### Consistência

✅ **Fazer:**
- Usar sempre as mesmas classes para componentes iguais
- Seguir a hierarquia de títulos (H1 → H2 → H3)
- Manter espaçamentos consistentes (múltiplos de 4px)

❌ **Evitar:**
- Inventar novos tamanhos de fonte
- Misturar estilos de botões
- Criar sombras personalizadas

### Performance

✅ **Fazer:**
- Usar Tailwind classes (JIT otimizado)
- Reutilizar componentes
- Lazy load de imagens

❌ **Evitar:**
- Inline styles CSS
- Classes personalizadas desnecessárias
- Animações complexas em muitos elementos

---

## 🚀 PRÓXIMOS PASSOS

- [ ] Criar componentes React em `frontend/src/components/ui/`
- [ ] Criar Storybook para documentar visualmente
- [ ] Testar acessibilidade (WCAG 2.1 AA)
- [ ] Validar responsividade em todos breakpoints
- [ ] Criar variantes dark mode (futuro)

---

**Mantido por:** Equipe BaseCerta  
**Versão:** 1.0.0  
**Data:** 22/10/2025
