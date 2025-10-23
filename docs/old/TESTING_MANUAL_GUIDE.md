# 🧪 GUIA DE TESTES MANUAIS - Issue 1.7.2

**Sprint:** 1.7 - Testing & Validation  
**Issue:** 1.7.2 - Performance & Acessibilidade  
**Data:** 23/10/2025

---

## 📋 PRÉ-REQUISITOS

✅ **Containers rodando:**
```bash
cd /Users/linkerx/Documents/ADACODE/basecerta
docker-compose up -d
```

✅ **Frontend acessível:** http://localhost:3000

✅ **Chrome DevTools instalado** (já vem com Chrome)

✅ **Extensões recomendadas:**
- [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
- [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) (opcional, já vem no DevTools)

---

## 🚀 PARTE 1: LIGHTHOUSE AUDITS

### Como Executar

1. **Abrir Chrome** em modo anônimo (Cmd/Ctrl + Shift + N)
   - Garante resultados sem cache/extensões

2. **Navegar até a página a testar**
   - Ex: http://localhost:3000/dashboard

3. **Abrir DevTools** (F12 ou Cmd+Option+I)

4. **Ir para aba "Lighthouse"**
   - Se não aparecer, clicar no ícone ">>" e selecionar

5. **Configurar o audit:**
   - Mode: **Navigation**
   - Device: **Desktop** (primeiro) e depois **Mobile**
   - Categories: **Marcar todas** (Performance, Accessibility, Best Practices, SEO)
   - Throttling: **Simulated throttling** (padrão)

6. **Clicar em "Analyze page load"**

7. **Aguardar resultados** (~30 segundos)

8. **Copiar scores e métricas** para o PERFORMANCE_AUDIT.md

### Páginas para Auditar (em ordem)

#### 🔴 Alta Prioridade

1. ✅ **Dashboard:** http://localhost:3000/dashboard
2. ✅ **Smart CNPJ - Search:** http://localhost:3000/smart-cnpj/search
3. ✅ **Smart CNPJ - Results:** http://localhost:3000/smart-cnpj/results
   - Fazer uma busca primeiro para ter resultados
4. ✅ **Smart CNPJ - Details:** http://localhost:3000/smart-cnpj/33000167000101
   - CNPJ exemplo dos mocks

#### 🟡 Média Prioridade

5. ✅ **Dados 360° PF - Search:** http://localhost:3000/dados360/pf/search
6. ✅ **Dados 360° PF - Details:** http://localhost:3000/dados360/pf/12345678901
7. ✅ **Dados 360° PJ - Details:** http://localhost:3000/dados360/pj/33000167000101
8. ✅ **Favoritos:** http://localhost:3000/favoritos

#### 🟢 Baixa Prioridade

9. ✅ **Credits:** http://localhost:3000/credits
10. ✅ **Radar Jurídico PF:** http://localhost:3000/radar-juridico/pf/search

### Template para Copiar Resultados

```markdown
#### Dashboard - Lighthouse Audit

**Data:** 23/10/2025
**URL:** http://localhost:3000/dashboard
**Device:** Desktop

**Scores:**
- 🎯 Performance: XX/100
- ♿ Accessibility: XX/100
- ✅ Best Practices: XX/100
- 🔍 SEO: XX/100

**Métricas Core Web Vitals:**
- FCP (First Contentful Paint): X.X s
- LCP (Largest Contentful Paint): X.X s
- TBT (Total Blocking Time): X ms
- CLS (Cumulative Layout Shift): X.XXX
- SI (Speed Index): X.X s

**Issues Encontrados:**
[Copiar da seção "Opportunities" e "Diagnostics" do Lighthouse]

**Recomendações:**
[Copiar sugestões principais]
```

---

## ♿ PARTE 2: TESTES DE ACESSIBILIDADE

### 2.1 Navegação por Teclado

**Como testar:**

1. **Abrir página** (ex: Dashboard)
2. **Clicar na barra de endereço** (Cmd+L)
3. **Pressionar Tab repetidamente**
4. **Observar:**
   - ✅ Focus indicator visível (outline ou borda)
   - ✅ Ordem lógica de navegação
   - ✅ Todos elementos interativos alcançáveis
5. **Testar ações:**
   - Enter em links/botões funciona
   - Escape fecha modals/dropdowns
   - Setas navegam em dropdowns/selects

**Páginas críticas:**
- [ ] Dashboard
- [ ] Smart CNPJ Search (todos campos do form)
- [ ] Smart CNPJ Results (cards e filtros)
- [ ] Favoritos (botões de ação)

**Anotar problemas:**
- Elementos sem focus visible
- Ordem de tab confusa
- Elementos não alcançáveis

---

### 2.2 Screen Reader (VoiceOver - macOS)

**Como ativar:**
- **Cmd + F5** (ativa/desativa VoiceOver)
- Ou: Settings → Accessibility → VoiceOver → Enable

**Comandos básicos:**
- **VO = Control + Option**
- **VO + Right Arrow:** Próximo elemento
- **VO + Left Arrow:** Elemento anterior
- **VO + Space:** Ativar elemento
- **VO + A:** Ler tudo

**Como testar:**

1. **Ativar VoiceOver** (Cmd + F5)
2. **Navegar pela página** com VO + setas
3. **Verificar:**
   - ✅ Landmarks anunciados (header, nav, main, footer)
   - ✅ Headings lidos com nível correto (h1, h2, h3)
   - ✅ Labels de inputs lidos antes do campo
   - ✅ Alt text de imagens (se houver)
   - ✅ Status de botões (pressed, expanded, etc)
   - ✅ Toast notifications anunciados

**Páginas críticas:**
- [ ] Dashboard (navegação geral)
- [ ] Smart CNPJ Search (formulários)
- [ ] Smart CNPJ Results (cards, paginação)

**Anotar problemas:**
- Elementos sem label
- Hierarquia de headings quebrada
- Imagens sem alt text
- Status não anunciados

---

### 2.3 Contraste de Cores (axe DevTools)

**Como usar:**

1. **Instalar extensão:** [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)

2. **Abrir DevTools** → Aba "axe DevTools"

3. **Clicar "Scan ALL of my page"**

4. **Aguardar resultado**

5. **Verificar seção "Color Contrast"**
   - Issues críticos aparecem em vermelho
   - Mostra ratio atual vs requerido
   - Sugere cores alternativas

**Requisitos WCAG AA:**
- Texto normal: **4.5:1**
- Texto grande: **3:1**
- UI elements: **3:1**

**Páginas para escanear:**
- [ ] Dashboard
- [ ] Smart CNPJ Search
- [ ] Smart CNPJ Results
- [ ] Favoritos

**Anotar problemas:**
- Texto com baixo contraste
- Badges/labels problemáticos
- Botões disabled sem contraste suficiente

---

### 2.4 Formulários

**Como testar:**

1. **Abrir página com formulário** (Smart CNPJ Search)

2. **Verificar visualmente:**
   - ✅ Cada input tem label visível
   - ✅ Required fields têm indicador (asterisco, etc)
   - ✅ Placeholders não substituem labels
   - ✅ Error messages aparecem próximas ao campo

3. **Testar com teclado:**
   - Tab navega entre campos
   - Labels são lidos pelo screen reader

4. **Forçar erro de validação:**
   - Submeter form vazio
   - Verificar mensagens de erro claras

**Forms para testar:**
- [ ] Smart CNPJ Search (7 tipos)
- [ ] Dados 360° PF Search
- [ ] Dados 360° PJ Search
- [ ] Filtros (Smart CNPJ Results)

**Anotar problemas:**
- Inputs sem label
- Mensagens de erro genéricas
- Required fields não indicados

---

## 📦 PARTE 3: BUNDLE ANALYSIS

### Gerar Relatório

```bash
# Entrar no container frontend
docker exec -it basecerta_frontend sh

# Gerar análise
ANALYZE=true npm run build

# Aguardar abrir navegador com gráficos
```

**O que observar:**
- **Total bundle size**
- **First Load JS** (deve ser < 200KB)
- **Dependencies grandes** (> 50KB)
- **Código duplicado** entre chunks

### Comandos Úteis

```bash
# Ver tamanho do build atual
docker exec -it basecerta_frontend sh -c "du -sh .next/static"

# Listar maiores arquivos
docker exec -it basecerta_frontend sh -c "find .next -type f -exec du -h {} + | sort -rh | head -20"
```

---

## 📊 PARTE 4: CONSOLE ERRORS

### Como verificar

1. **Abrir DevTools** → Console

2. **Navegar por todas páginas**

3. **Anotar:**
   - ❌ Errors (vermelho)
   - ⚠️ Warnings (amarelo)
   - 🔵 Info (azul - menos crítico)

**Páginas para verificar:**
- [ ] Dashboard
- [ ] Smart CNPJ Search
- [ ] Smart CNPJ Results
- [ ] Smart CNPJ Details
- [ ] Dados 360° PF
- [ ] Dados 360° PJ
- [ ] Favoritos
- [ ] Credits

**Errors comuns a ignorar:**
- Warnings do Next.js em dev mode
- Hot reload messages

**Errors CRÍTICOS:**
- React warnings (keys, hooks, etc)
- Failed API calls (se houver)
- Undefined variables

---

## ✅ CHECKLIST FINAL

### Lighthouse (10 páginas)

- [ ] Dashboard - Desktop
- [ ] Dashboard - Mobile
- [ ] Smart CNPJ Search - Desktop
- [ ] Smart CNPJ Search - Mobile
- [ ] Smart CNPJ Results - Desktop
- [ ] Smart CNPJ Results - Mobile
- [ ] Smart CNPJ Details - Desktop
- [ ] Smart CNPJ Details - Mobile
- [ ] Dados 360° PF - Desktop
- [ ] Dados 360° PF - Mobile
- [ ] Dados 360° PJ - Desktop
- [ ] Dados 360° PJ - Mobile
- [ ] Favoritos - Desktop
- [ ] Favoritos - Mobile
- [ ] Credits - Desktop
- [ ] Credits - Mobile

### Acessibilidade

- [ ] Navegação por teclado (6 páginas principais)
- [ ] Screen reader VoiceOver (4 páginas principais)
- [ ] Contraste de cores axe DevTools (4 páginas)
- [ ] Formulários (4 forms diferentes)

### Performance

- [ ] Bundle analysis executado
- [ ] Console errors verificados (8 páginas)

---

## 📝 DOCUMENTAR RESULTADOS

**Arquivo:** `docs/PERFORMANCE_AUDIT.md`

### Seções a preencher:

1. **Lighthouse Audits** - Adicionar resultado de cada página
2. **WCAG 2.1 AA Compliance** - Marcar checkboxes dos critérios
3. **Bundle Analysis** - Adicionar tamanhos e top dependencies
4. **Ações Corretivas** - Criar issues para problemas encontrados

### Template de Issue Corretiva:

```markdown
#### 🔴 Issue #X: [Título]

- **Categoria:** Performance / Accessibility / SEO / Best Practices
- **Página Afetada:** [página]
- **Descrição:** [descrição detalhada]
- **Impacto:** [score atual] → [score esperado]
- **Solução:** [como corrigir]
- **Arquivos:** [arquivos a modificar]
- **Status:** ⏳ Pendente
```

---

## 🎯 PRÓXIMOS PASSOS

Após completar todos os testes:

1. ✅ Consolidar scores no PERFORMANCE_AUDIT.md
2. ✅ Identificar issues críticos (score < 90)
3. ✅ Criar plano de ação para correções
4. ✅ Implementar correções
5. ✅ Re-executar audits
6. ✅ Validar melhoria nos scores
7. ✅ Commit e tag release v1.7.2

---

**Tempo Estimado Total:** 2-3 horas  
**Prioridade:** 🔴 Alta  
**Status:** 🔄 Pronto para iniciar

**Última atualização:** 23/10/2025 21:15
