# FEATURE-00: Área de Estatísticas

## 📋 Metadados
- **ID:** FEATURE-00
- **Sprint:** Smart CNPJ Search
- **Prioridade:** 🔴 Alta
- **Status:** 📋 Backlog
- **Responsável:** A definir (aguardando Sprint Planning)
- **Estimativa:** 8 story points
- **Data Início:** -
- **Data Conclusão:** -

---

## 🎯 Objetivo

Transformar a área de estatísticas de um simples painel informativo em uma ferramenta estratégica que:
1. Apresente métricas relevantes para decisões de negócio B2B
2. Permita interação direta com as estatísticas (clicáveis)
3. Guie o usuário para buscas inteligentes baseadas em padrões

---

## 📝 Descrição Detalhada

### Contexto Atual
Hoje a área de estatísticas exibe dados soltos sem contexto estratégico:
- Buscas Realizadas
- Empresas Únicas
- Buscas Hoje
- Tempo Médio

**Problemas:**
- Dados não acionáveis
- Não agregam valor para decisões B2B
- Não incentivam uso mais profundo da ferramenta

### Proposta de Melhoria
Redefinir estatísticas para focar em:
- **Insights de Mercado:** Segmentos mais buscados, regiões em alta
- **Oportunidades B2B:** Empresas em crescimento, novos CNPJs, setores aquecidos
- **Ações Rápidas:** Cada estatística é clicável e executa busca automática

### Exemplos de Novas Estatísticas

#### 1. Estatísticas Acionáveis
```
┌─────────────────────────────────────┐
│ 🚀 Empresas Abertas esta Semana    │
│ 1.247 empresas                      │
│ [Clique para buscar →]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📈 Setor em Crescimento             │
│ Tecnologia (+15% este mês)          │
│ [Ver empresas →]                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🎯 Micro e Pequenas Empresas SP     │
│ 45.832 empresas ativas              │
│ [Explorar →]                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💼 Empresas Médio/Grande Porte      │
│ 8.921 oportunidades B2B             │
│ [Buscar →]                          │
└─────────────────────────────────────┘
```

#### 2. Insights Personalizados
```
┌─────────────────────────────────────┐
│ 💡 Baseado nas suas buscas          │
│                                     │
│ Você buscou muito por "TECNOLOGIA"  │
│ Empresas de TI em SP cresceram 20%  │
│ [Ver todas →]                       │
└─────────────────────────────────────┘
```

---

## 🔍 Issues Relacionadas

### ISSUE-00-A: Redefinir estatísticas relevantes
- [ ] Mapear necessidades do cliente B2B
- [ ] Definir métricas estratégicas (mín. 6 cards)
- [ ] Validar com Product Owner
- [ ] Documentar cada estatística com:
  - Título
  - Descrição/valor
  - Filtros da busca automática
  - Tooltip explicativo

**Estimativa:** 3 horas

### ISSUE-00-B: Implementar estatísticas clicáveis
- [ ] Criar componente `StatCard` clicável
- [ ] Implementar lógica de auto-busca ao clicar
- [ ] Preservar parâmetros de busca complexos
- [ ] Adicionar loading state durante busca
- [ ] Testes de navegação

**Estimativa:** 5 horas

---

## 📐 Critérios de Aceitação

### Must Have (Obrigatório)
1. [ ] **Mínimo 6 cards de estatísticas** diferentes exibidos
2. [ ] **Todas estatísticas são clicáveis** e executam busca automática
3. [ ] **Dados relevantes para B2B:** Foco em oportunidades de negócio
4. [ ] **Loading state:** Indicador visual ao clicar em estatística
5. [ ] **Tooltips informativos:** Cada card explica o que representa
6. [ ] **Responsivo:** Funciona em mobile, tablet e desktop
7. [ ] **Performance:** Cards carregam em < 500ms

### Should Have (Desejável)
- [ ] Estatísticas personalizadas baseadas em histórico do usuário
- [ ] Atualização em tempo real dos números
- [ ] Animações suaves ao interagir

### Could Have (Nice to Have)
- [ ] Gráficos visuais nos cards
- [ ] Comparação com período anterior (ex: +15% vs mês passado)
- [ ] Exportação de dados de estatística

---

## 🎨 Design/UX

### Layout Proposto

```
┌──────────────────────────────────────────────────┐
│ SMART CNPJ 360° - Pesquisa Inteligente          │
├──────────────────────────────────────────────────┤
│                                                  │
│  📊 Insights do Mercado                         │
│                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐│
│  │ 🚀 1.2K │ │ 📈 Tech │ │ 🎯 45K  │ │ 💼 8K ││
│  │ Novas   │ │ +15%    │ │ MEI/ME  │ │ Médio ││
│  │ [Ver→]  │ │ [Ver→]  │ │ [Ver→]  │ │ [Ver→]││
│  └─────────┘ └─────────┘ └─────────┘ └───────┘│
│                                                  │
│  ┌─────────┐ ┌─────────┐                       │
│  │ 💡 TI SP│ │ 🔥 Alta │                       │
│  │ +20%    │ │ 3.2K    │                       │
│  │ [Ver→]  │ │ [Ver→]  │                       │
│  └─────────┘ └─────────┘                       │
│                                                  │
├──────────────────────────────────────────────────┤
│ [Tipo de Busca] [Valor] [Filtros] [Buscar]     │
└──────────────────────────────────────────────────┘
```

### Componente `StatCard`

```tsx
interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  description?: string
  tooltip?: string
  searchParams: SmartCNPJSearchRequest // Parâmetros para auto-busca
  trend?: 'up' | 'down' | 'neutral' // Opcional: mostrar tendência
  trendValue?: string // Ex: "+15%"
}

// Exemplo de uso:
<StatCard
  icon={<RocketIcon />}
  title="Empresas Abertas esta Semana"
  value="1.247"
  description="Novos CNPJs cadastrados"
  tooltip="Empresas registradas nos últimos 7 dias"
  searchParams={{
    tipo_busca: 'data_abertura',
    filtros: {
      data_abertura_inicio: '2025-10-18',
      data_abertura_fim: '2025-10-25'
    }
  }}
  trend="up"
  trendValue="+12%"
/>
```

### Cores e Estilo
- **Background:** Gradiente sutil por card
- **Hover:** Elevação + borda colorida
- **Click:** Ripple effect + navegação
- **Icons:** Lucide React consistentes

---

## 🔧 Implementação Técnica

### Backend

#### Endpoint Novo (Opcional)
`GET /api/v1/smart-cnpj/insights`

**Response:**
```json
{
  "statistics": [
    {
      "id": "empresas-novas",
      "title": "Empresas Abertas esta Semana",
      "value": 1247,
      "trend": "up",
      "trendValue": "+12%",
      "searchParams": {
        "tipo_busca": "data_abertura",
        "filtros": {
          "data_abertura_inicio": "2025-10-18",
          "data_abertura_fim": "2025-10-25"
        }
      }
    }
  ]
}
```

**OU usar queries diretas no frontend** (mais simples para MVP)

### Frontend

#### Arquivos Novos
- `frontend/src/components/smart-cnpj/InsightsPanel.tsx`
- `frontend/src/components/smart-cnpj/StatCard.tsx`
- `frontend/src/lib/constants/insights.ts`

#### Código Exemplo

**`insights.ts`:**
```typescript
export const INSIGHTS_CONFIG = [
  {
    id: 'empresas-novas',
    icon: 'Rocket',
    title: 'Empresas Abertas esta Semana',
    description: 'Novos CNPJs',
    tooltip: 'Empresas registradas nos últimos 7 dias',
    searchParams: {
      tipo_busca: 'data_abertura',
      filtros: {
        data_abertura_inicio: getDaysAgo(7),
        data_abertura_fim: getToday(),
      }
    }
  },
  {
    id: 'tech-crescimento',
    icon: 'TrendingUp',
    title: 'Setor Tecnologia',
    description: '+15% este mês',
    searchParams: {
      tipo_busca: 'segmento',
      valor_busca: 'TECNOLOGIA'
    }
  },
  // ... mais configs
]
```

**`StatCard.tsx`:**
```tsx
export function StatCard({ config, onClick }: Props) {
  const handleClick = () => {
    // Executar busca com parâmetros pré-definidos
    onClick(config.searchParams)
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{config.title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {config.value}
            </p>
            {config.description && (
              <p className="text-xs text-gray-500">{config.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**`InsightsPanel.tsx`:**
```tsx
export function InsightsPanel() {
  const router = useRouter()
  const { handleSearch } = useSmartCNPJ()

  const handleStatClick = (searchParams: SearchParams) => {
    // Setar parâmetros e executar busca
    handleSearch(searchParams)
    router.push('/smart-cnpj/results')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📊 Insights do Mercado</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {INSIGHTS_CONFIG.map(insight => (
          <StatCard
            key={insight.id}
            config={insight}
            onClick={handleStatClick}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 🧪 Testes

### Testes Manuais
- [ ] Clicar em cada card de estatística
- [ ] Verificar navegação para `/results` com parâmetros corretos
- [ ] Testar responsividade em 3 tamanhos de tela
- [ ] Validar tooltips exibidos corretamente
- [ ] Confirmar loading states

### Testes Automatizados (E2E)
```typescript
test('Estatística clicável executa busca correta', async ({ page }) => {
  await page.goto('/smart-cnpj/search')
  
  // Clicar no card "Empresas Novas"
  await page.click('[data-testid="stat-card-empresas-novas"]')
  
  // Verificar navegação
  await page.waitForURL('**/smart-cnpj/results?*')
  
  // Verificar parâmetros na URL
  expect(page.url()).toContain('tipo_busca=data_abertura')
  
  // Verificar resultados carregados
  await expect(page.locator('[data-testid="result-item"]')).toBeVisible()
})
```

---

## 📊 Métricas de Sucesso

### Quantitativas
- [ ] **Taxa de Clique:** > 30% dos usuários clicam em pelo menos 1 estatística
- [ ] **Tempo para Primeira Busca:** Redução de 40% no tempo médio
- [ ] **Engajamento:** Aumento de 25% em buscas iniciadas
- [ ] **Performance:** Cards carregam em < 500ms

### Qualitativas
- [ ] Feedback positivo sobre utilidade das estatísticas
- [ ] Usuários relatam facilidade para encontrar empresas relevantes
- [ ] Redução em perguntas sobre "como usar filtros"

---

## 🚧 Bloqueios/Dependências

### Bloqueios Atuais
- Nenhum

### Dependências
- ✅ Hook `useSmartCNPJ` existente e funcional
- ✅ Sistema de filtros já implementado
- ✅ Navegação para `/results` funcional
- ⚠️ **Decisão PO:** Quais estatísticas priorizar (ISSUE-00-A)

---

## 📝 Notas/Observações

### Inspirações
- **LinkedIn:** Cards de "People also viewed"
- **Google Analytics:** Dashboard de métricas acionáveis
- **Similarweb:** Insights de mercado clicáveis

### Evolução Futura
- **Fase 2:** Personalização baseada em ML (histórico do usuário)
- **Fase 3:** Alertas de oportunidades (push notifications)
- **Fase 4:** Exportação de insights para PDF/Excel

---

**Criado em:** 25/10/2025  
**Última atualização:** 25/10/2025  
**Próxima revisão:** Após Sprint Planning
