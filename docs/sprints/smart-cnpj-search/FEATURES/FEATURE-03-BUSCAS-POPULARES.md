# FEATURE-03: Buscas Populares

## 📋 Metadados
- **ID:** FEATURE-03
- **Sprint:** Smart CNPJ Search
- **Prioridade:** 🟡 Média
- **Status:** 📋 Backlog
- **Responsável:** A definir
- **Estimativa:** 3 story points
- **Data Início:** -
- **Data Conclusão:** -

---

## 🎯 Objetivo

Criar conjunto inteligente de buscas populares focadas em cenários B2B, posicionando no topo da página para facilitar acesso rápido a pesquisas estratégicas.

---

## 📝 Descrição Detalhada

### Problema Atual
- Buscas populares estão no rodapé (baixa visibilidade)
- Foco genérico, sem orientação B2B
- Não aproveitam potencial de guiar usuário para buscas valiosas

### Proposta

**Reposicionamento:**
```
ANTES:
[Header]
[Estatísticas]
[Busca]
[Filtros]
...
[Rodapé - Buscas Populares] ← Pouco visível

DEPOIS:
[Header]
[Estatísticas/Insights]
[🔥 Buscas Populares - Cards Visuais] ← Topo!
[Busca]
[Filtros]
...
```

**Conteúdo Estratégico:**
Buscas pré-configuradas para casos de uso B2B comuns:
- "Startups de Tecnologia SP" (últimos 6 meses)
- "Indústrias Médio Porte MG"
- "Empresas de Logística RJ"
- "Consultorias Ativas Brasil"
- "Micro e Pequenas Comércio"
- "Empresas Sustentabilidade"

---

## 🔍 Issues Relacionadas

- [ ] **ISSUE-03-A:** Definir buscas populares B2B - 2h
  - Pesquisa de casos de uso comuns
  - Definir 8-12 buscas estratégicas
  - Configurar parâmetros de cada busca
  
- [ ] **ISSUE-03-B:** Mover para topo da página - 2h
  - Ajustar layout da página de busca
  - Posicionar após insights/estatísticas
  - Responsividade
  
- [ ] **ISSUE-03-C:** Design de cards de buscas rápidas - 3h
  - Componente `QuickSearchCard`
  - Visual atraente com icons/badges
  - Animação hover + click

---

## 📐 Critérios de Aceitação

1. [ ] **Mínimo 8 buscas populares** definidas
2. [ ] **Posicionadas no topo** (abaixo de insights, acima de busca manual)
3. [ ] **Cards visuais:** Icon + título + descrição + badge (quantidade)
4. [ ] **Click executa busca:** Navegação automática para /results
5. [ ] **Responsivo:** 1 col (mobile), 2 cols (tablet), 4 cols (desktop)
6. [ ] **Performance:** Cards carregam instantaneamente (dados estáticos)

---

## 🎨 Design/UX

### Layout Proposto

```
┌────────────────────────────────────────────────────┐
│ 🔥 Buscas Rápidas - Encontre oportunidades B2B    │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 🚀      │ │ 🏭      │ │ 🚚      │ │ 💼      │ │
│ │Startups │ │Indústria│ │Logística│ │Consultor│ │
│ │Tech SP  │ │MG       │ │RJ       │ │Brasil   │ │
│ │2.4K ▸   │ │1.8K ▸   │ │890 ▸    │ │5.2K ▸   │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 🌱      │ │ 🏪      │ │ 📱      │ │ 🏗️      │ │
│ │Sustenta │ │Micro/PE │ │E-commerce│ │Constru- │ │
│ │bilidade │ │Comércio │ │Varejo   │ │ção      │ │
│ │420 ▸    │ │12K ▸    │ │3.1K ▸   │ │2.7K ▸   │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
└────────────────────────────────────────────────────┘
```

### Componente `QuickSearchCard`

```tsx
interface QuickSearchCardProps {
  icon: React.ReactNode
  title: string
  description: string
  count: number // Número de resultados estimado
  searchParams: SmartCNPJSearchRequest
  badge?: string // Ex: "Novo", "Popular"
}

<QuickSearchCard
  icon={<Rocket className="h-8 w-8" />}
  title="Startups de Tecnologia SP"
  description="Empresas de TI abertas nos últimos 6 meses"
  count={2400}
  badge="Popular"
  searchParams={{
    filtros: {
      uf: 'SP',
      data_abertura_inicio: getLast6Months(),
      cnaes: ['62.01', '62.02', '63.11'] // Tech CNAEs
    }
  }}
/>
```

---

## 🔧 Implementação Técnica

### Configuração de Buscas

**`/lib/constants/quickSearches.ts`:**

```typescript
export const QUICK_SEARCHES = [
  {
    id: 'startups-tech-sp',
    icon: 'Rocket',
    title: 'Startups de Tecnologia SP',
    description: 'Empresas de TI abertas nos últimos 6 meses',
    badge: 'Popular',
    category: 'tecnologia',
    searchParams: {
      filtros: {
        uf: 'SP',
        data_abertura_inicio: getMonthsAgo(6),
        data_abertura_fim: getToday(),
      }
    }
  },
  {
    id: 'industria-mg',
    icon: 'Factory',
    title: 'Indústrias Médio Porte MG',
    description: 'Indústrias ativas de médio porte em Minas Gerais',
    category: 'industria',
    searchParams: {
      filtros: {
        uf: 'MG',
        porte: 'MEDIO',
        situacao: 'ATIVA',
      }
    }
  },
  {
    id: 'logistica-rj',
    icon: 'Truck',
    title: 'Empresas de Logística RJ',
    description: 'Transporte e logística no Rio de Janeiro',
    category: 'logistica',
    searchParams: {
      tipo_busca: 'segmento',
      valor_busca: 'TRANSPORTE',
      filtros: {
        uf: 'RJ',
        situacao: 'ATIVA'
      }
    }
  },
  {
    id: 'consultorias',
    icon: 'Briefcase',
    title: 'Consultorias Ativas',
    description: 'Empresas de consultoria em todo Brasil',
    category: 'servicos',
    searchParams: {
      tipo_busca: 'segmento',
      valor_busca: 'CONSULTORIA',
      filtros: {
        situacao: 'ATIVA'
      }
    }
  },
  {
    id: 'sustentabilidade',
    icon: 'Leaf',
    title: 'Sustentabilidade',
    description: 'Empresas focadas em meio ambiente e sustentabilidade',
    badge: 'Tendência',
    category: 'sustentabilidade',
    searchParams: {
      tipo_busca: 'segmento',
      valor_busca: 'SUSTENTABILIDADE',
      filtros: {
        situacao: 'ATIVA'
      }
    }
  },
  {
    id: 'micro-pequenas-comercio',
    icon: 'Store',
    title: 'Micro e Pequenas Comércio',
    description: 'MEI e ME do setor comercial',
    category: 'comercio',
    searchParams: {
      filtros: {
        porte: ['MEI', 'ME'],
        situacao: 'ATIVA',
      }
    }
  },
  {
    id: 'ecommerce',
    icon: 'Smartphone',
    title: 'E-commerce e Varejo Digital',
    description: 'Comércio eletrônico e vendas online',
    badge: 'Novo',
    category: 'tecnologia',
    searchParams: {
      tipo_busca: 'segmento',
      valor_busca: 'COMERCIO ELETRONICO',
      filtros: {
        situacao: 'ATIVA'
      }
    }
  },
  {
    id: 'construcao',
    icon: 'HardHat',
    title: 'Construção Civil',
    description: 'Construtoras e empresas do setor',
    category: 'construcao',
    searchParams: {
      tipo_busca: 'segmento',
      valor_busca: 'CONSTRUCAO',
      filtros: {
        situacao: 'ATIVA',
        porte: ['MEDIO', 'GRANDE']
      }
    }
  }
]
```

### Componentes

**`QuickSearchCard.tsx`:**

```tsx
export function QuickSearchCard({ search }: Props) {
  const router = useRouter()
  const { handleSearch } = useSmartCNPJ()
  
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    setIsLoading(true)
    await handleSearch(search.searchParams)
    router.push('/smart-cnpj/results')
  }
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            {getIcon(search.icon)}
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-gray-900">
            {search.title}
          </h3>
          
          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {search.description}
          </p>
          
          {/* Count + Badge */}
          <div className="flex items-center justify-between mt-2">
            {search.count && (
              <span className="text-sm font-medium text-gray-500">
                {formatNumber(search.count)} empresas
              </span>
            )}
            {search.badge && (
              <Badge variant="secondary" className="text-xs">
                {search.badge}
              </Badge>
            )}
          </div>
          
          {/* Loading */}
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary-600" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

**`QuickSearchPanel.tsx`:**

```tsx
export function QuickSearchPanel() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Buscas Rápidas - Encontre Oportunidades B2B
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_SEARCHES.map(search => (
          <QuickSearchCard key={search.id} search={search} />
        ))}
      </div>
    </section>
  )
}
```

---

## 🧪 Testes

### Testes Manuais
- [ ] Clicar em cada busca rápida
- [ ] Verificar navegação correta
- [ ] Validar parâmetros aplicados
- [ ] Testar responsividade
- [ ] Confirmar contagem de resultados

### Testes E2E
```typescript
test('Busca rápida executa pesquisa correta', async ({ page }) => {
  await page.goto('/smart-cnpj/search')
  
  // Clicar em "Startups Tech SP"
  await page.click('[data-testid="quick-search-startups-tech-sp"]')
  
  // Verificar navegação
  await page.waitForURL('**/smart-cnpj/results')
  
  // Verificar filtros aplicados
  const filterBadges = page.locator('[data-testid="active-filter"]')
  await expect(filterBadges).toHaveCount(2) // UF + Data
  
  // Verificar resultados
  await expect(page.locator('[data-testid="result-item"]')).toHaveCount(20)
})
```

---

## 📊 Métricas de Sucesso

- [ ] **Taxa de Clique:** > 40% dos usuários clicam em busca rápida
- [ ] **Descoberta:** 30% dos usuários exploram tipos de busca que não usariam naturalmente
- [ ] **Engajamento:** Aumento de 50% em buscas por segmento/setor
- [ ] **Conversão:** 70% dos cliques em buscas rápidas resultam em exploração de resultados

---

## 📝 Notas/Observações

### Evolução Futura
- **Personalização:** Buscas rápidas baseadas em histórico
- **A/B Testing:** Testar diferentes conjuntos de buscas
- **Analytics:** Qual busca rápida gera mais conversões
- **Dinâmico:** Atualizar buscas com base em tendências

### Inspirações
- **Pinterest:** Pins sugeridos
- **YouTube:** Vídeos recomendados
- **LinkedIn:** "People also viewed"

---

**Criado em:** 25/10/2025  
**Quick win:** Feature de baixo esforço, alto impacto em descoberta
