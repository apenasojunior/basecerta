# FEATURE-02: Caixa de Filtros

## 📋 Metadados
- **ID:** FEATURE-02
- **Sprint:** Smart CNPJ Search
- **Prioridade:** 🔴 Alta
- **Status:** 📋 Backlog
- **Responsável:** A definir
- **Estimativa:** 8 story points
- **Data Início:** -
- **Data Conclusão:** -

---

## 🎯 Objetivo

Permitir que filtros sejam usados como busca principal (sem necessidade de valor de busca), com validação mínima de 3 filtros selecionados para evitar resultados excessivamente amplos.

---

## 📝 Descrição Detalhada

### Problema Atual
- Filtros estão atrelados obrigatoriamente a uma busca por valor
- Não é possível buscar APENAS por filtros (ex: "Todas empresas de SP porte ME")
- Resultados muito amplos sem validação mínima

### Proposta

**Mudança Fundamental:**
```
ANTES: [Tipo de Busca] + [Valor] + [Filtros Opcionais] → Busca

AGORA: 
  Opção 1: [Tipo] + [Valor] + [Filtros Opcionais] → Busca
  Opção 2: [Mínimo 3 Filtros] → Busca (sem valor)
```

**Exemplo de Uso:**
```
Busca apenas com filtros:
✓ UF: São Paulo
✓ Porte: ME (Microempresa)  
✓ Situação: ATIVA
→ Botão "Buscar" habilitado (3 filtros)

Resultado: Todas microempresas ativas de SP
```

---

## 🔍 Issues Relacionadas

- [ ] **ISSUE-02-A:** Filtros como busca principal (sem valor) - 6h
  - Lógica backend para aceitar busca apenas com filtros
  - Validação de mínimo 3 filtros
  - Ajustes no endpoint de busca
  
- [ ] **ISSUE-02-B:** Validação mínima de 3 filtros - 2h
  - Contador visual de filtros selecionados
  - Desabilitar botão "Buscar" se < 3 filtros (e sem valor)
  - Mensagem de feedback ao usuário
  
- [ ] **ISSUE-02-C:** UX para indicar filtros obrigatórios - 3h
  - Badge mostrando "X/3 filtros"
  - Highlight em filtros selecionados
  - Tooltip explicativo sobre regra mínima

---

## 📐 Critérios de Aceitação

### Must Have
1. [ ] **Busca sem valor funcional:** Permitir busca apenas com filtros
2. [ ] **Validação de 3 filtros:** Mínimo 3 filtros obrigatórios para busca sem valor
3. [ ] **Botão inteligente:** 
   - Habilitado se: (tem valor) OU (3+ filtros)
   - Desabilitado se: (sem valor E < 3 filtros)
4. [ ] **Contador visual:** Badge "X/3 filtros selecionados"
5. [ ] **Feedback claro:** Mensagem explicando por que botão está desabilitado
6. [ ] **Performance:** Busca com filtros < 200ms

### Should Have
- [ ] Sugestão de "filtros populares" quando contador < 3
- [ ] Salvar combinações de filtros favoritas
- [ ] Histórico de filtros usados

---

## 🎨 Design/UX

### Interface Proposta

```
┌──────────────────────────────────────────┐
│ Tipo de Busca: [Razão Social ▼]         │
│ Valor: [________________]                │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 📂 Filtros (2/3 selecionados)      │  │
│ │                                    │  │
│ │ ✓ UF: São Paulo                    │  │
│ │ ✓ Porte: ME (Microempresa)         │  │
│ │ ☐ Situação: -                      │  │
│ │ ☐ Natureza Jurídica: -            │  │
│ │                                    │  │
│ │ ⚠️ Selecione pelo menos 1 filtro   │  │
│ │    adicional para buscar sem valor │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [Buscar] ← DESABILITADO                 │
└──────────────────────────────────────────┘
```

### Quando 3+ Filtros:

```
┌──────────────────────────────────────────┐
│ Tipo de Busca: [Não selecionado]        │
│ Valor: [vazio - opcional]                │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 📂 Filtros (3/3 selecionados) ✓    │  │
│ │                                    │  │
│ │ ✓ UF: São Paulo                    │  │
│ │ ✓ Porte: ME (Microempresa)         │  │
│ │ ✓ Situação: ATIVA                  │  │
│ │ ☐ Natureza Jurídica: -            │  │
│ │                                    │  │
│ │ ✅ Pronto para buscar!             │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [🔍 Buscar] ← HABILITADO                │
└──────────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### Backend

#### Endpoint Atual
`POST /api/v1/smart-cnpj/search`

**Request Schema Atualizado:**
```python
class SmartCNPJSearchRequest(BaseModel):
    tipo_busca: Optional[TipoBusca] = None  # ← Agora opcional!
    valor_busca: Optional[str] = None        # ← Agora opcional!
    filtros: Optional[FiltrosRequest] = None
    page: int = 1
    limit: int = 20
    
    @validator('filtros')
    def validate_filter_search(cls, v, values):
        """
        Se não tem tipo_busca nem valor_busca,
        deve ter pelo menos 3 filtros
        """
        tipo = values.get('tipo_busca')
        valor = values.get('valor_busca')
        
        # Se tem tipo E valor, filtros são opcionais
        if tipo and valor:
            return v
            
        # Se não tem tipo/valor, DEVE ter 3+ filtros
        if not v:
            raise ValueError(
                'Busca sem valor requer pelo menos 3 filtros'
            )
        
        # Contar filtros não vazios
        filter_count = sum(1 for k, val in v.dict().items() 
                          if val is not None and val != '')
        
        if filter_count < 3:
            raise ValueError(
                f'Busca sem valor requer mínimo 3 filtros '
                f'(você forneceu {filter_count})'
            )
            
        return v
```

#### CRUD Updates

```python
# app/crud/smart_cnpj.py

def search_empresas(
    db: Session,
    tipo_busca: Optional[TipoBusca] = None,
    valor_busca: Optional[str] = None,
    filtros: Optional[FiltrosRequest] = None,
    # ...
):
    query = db.query(Estabelecimento).join(Empresa)
    
    # Aplicar busca por valor (se fornecido)
    if tipo_busca and valor_busca:
        query = _apply_search_type(query, tipo_busca, valor_busca)
    
    # Aplicar filtros (obrigatório se sem valor)
    if filtros:
        query = _apply_filters(query, filtros)
    
    # Se não tem busca E não tem filtros → erro
    if not tipo_busca and not filtros:
        raise ValueError('Forneça valor de busca OU filtros')
    
    return query
```

### Frontend

#### Lógica de Validação

```typescript
// hooks/useSmartCNPJ.ts

const canSearch = useMemo(() => {
  const hasValue = searchType && searchValue?.trim()
  const filterCount = Object.values(filters).filter(
    v => v !== null && v !== undefined && v !== ''
  ).length
  
  // Pode buscar se:
  // 1. Tem tipo E valor (com ou sem filtros), OU
  // 2. Tem 3+ filtros (sem valor)
  return hasValue || filterCount >= 3
}, [searchType, searchValue, filters])

const filterValidation = useMemo(() => {
  const count = Object.values(filters).filter(
    v => v !== null && v !== undefined && v !== ''
  ).length
  
  return {
    count,
    isValid: count >= 3,
    remaining: Math.max(0, 3 - count),
    message: count < 3 
      ? `Selecione mais ${3 - count} filtro(s) para buscar sem valor`
      : 'Pronto para buscar!'
  }
}, [filters])
```

#### Componente de Badge

```tsx
export function FilterCounter({ validation }: Props) {
  const { count, isValid, remaining, message } = validation
  
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isValid ? 'success' : 'warning'}
        className="text-sm"
      >
        {count}/3 filtros
      </Badge>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{message}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
```

---

## 🧪 Testes

### Cenários de Teste

#### 1. Busca com Valor (comportamento atual)
```
Input: tipo=razao_social, valor="GOOGLE"
Filtros: nenhum
Resultado: ✅ Busca executada
```

#### 2. Busca sem Valor com 3+ Filtros
```
Input: sem tipo, sem valor
Filtros: uf=SP, porte=ME, situacao=ATIVA
Resultado: ✅ Busca executada
```

#### 3. Busca sem Valor com < 3 Filtros
```
Input: sem tipo, sem valor
Filtros: uf=SP (apenas 1)
Resultado: ❌ Botão desabilitado, mensagem de erro
```

#### 4. Busca com Valor + Filtros
```
Input: tipo=razao_social, valor="TECH"
Filtros: uf=SP, porte=ME
Resultado: ✅ Busca executada (filtros complementam)
```

---

## 📊 Métricas de Sucesso

### Quantitativas
- [ ] **Uso de Filtros Puros:** 20% das buscas usam apenas filtros
- [ ] **Engajamento:** Aumento de 35% em filtros utilizados
- [ ] **Performance:** Busca com 3 filtros < 200ms
- [ ] **Conversão:** 80% dos usuários que selecionam 3+ filtros executam busca

### Qualitativas
- [ ] Feedback positivo sobre flexibilidade
- [ ] Redução em suporte sobre "como filtrar sem buscar"
- [ ] Casos de uso B2B documentados

---

## 🚧 Bloqueios/Dependências

### Dependências
- ✅ Sistema de filtros atual funcionando
- ✅ Backend aceita filtros opcionais
- ⚠️ **Backend precisa aceitar busca SEM valor** (ISSUE-02-A)

### Considerações
- **Performance:** Busca com apenas filtros pode retornar muitos resultados
  - Solução: Manter LIMIT padrão e paginação
  - Considerar cache para combinações populares
- **UX:** Usuário pode ficar confuso sobre quando usar valor vs filtros
  - Solução: Tooltips educativos e exemplos

---

## 📝 Notas/Observações

### Casos de Uso B2B

**Prospecção por Região:**
```
Filtros: UF=SP, Município=São Paulo, Porte=GRANDE
Resultado: Grandes empresas em SP capital
Uso: Identificar potenciais clientes enterprise
```

**Mapeamento de Setor:**
```
Filtros: CNAE=62.01-5, UF=RJ, Situação=ATIVA
Resultado: Empresas de TI ativas no Rio
Uso: Análise de concorrência regional
```

**Lead Generation:**
```
Filtros: Data Abertura (últimos 30 dias), Porte=ME, UF=MG
Resultado: Microempresas novas em MG
Uso: Identificar novos empreendimentos para oferta de serviços
```

---

**Criado em:** 25/10/2025  
**Prioridade Alta:** Feature crítica para flexibilidade de busca B2B
