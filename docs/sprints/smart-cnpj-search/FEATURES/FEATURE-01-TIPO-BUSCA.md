# FEATURE-01: Caixa "Tipo de Busca"

## 📋 Metadados
- **ID:** FEATURE-01
- **Sprint:** Smart CNPJ Search
- **Prioridade:** 🟡 Média
- **Status:** 📋 Backlog
- **Responsável:** A definir
- **Estimativa:** 5 story points
- **Data Início:** -
- **Data Conclusão:** -

---

## 🎯 Objetivo

Reestruturar a interface de seleção de tipo de busca para torná-la mais intuitiva, reduzindo fricção e melhorando a experiência do usuário ao escolher como deseja pesquisar empresas.

---

## 📝 Descrição Detalhada

### Problema Atual
- Interface pode ser confusa para novos usuários
- Muitas opções podem gerar indecisão
- Falta de orientação sobre quando usar cada tipo

### Proposta
Melhorar a seleção de tipos de busca com:
1. **Visual mais claro:** Icons + labels descritivos
2. **Agrupamento lógico:** Busca direta vs busca por características
3. **Exemplos inline:** Placeholders que ensinam
4. **Validação contextual:** Feedback imediato

---

## 🔍 Issues Relacionadas

- [ ] **ISSUE-01-A:** Reestruturar tipos de busca (UX) - 3h
- [ ] **ISSUE-01-B:** Implementar nova interface de seleção - 4h

---

## 📐 Critérios de Aceitação

1. [ ] Interface visual melhorada com icons para cada tipo
2. [ ] Agrupamento de tipos de busca em categorias lógicas
3. [ ] Placeholders contextuais que mudam conforme tipo selecionado
4. [ ] Tooltip explicativo para cada tipo de busca
5. [ ] Responsivo em todos os tamanhos de tela
6. [ ] Acessível (keyboard navigation + screen readers)

---

## 🎨 Design/UX

### Proposta de Agrupamento

```
┌─────────────────────────────────────┐
│ Como você quer buscar?              │
├─────────────────────────────────────┤
│                                     │
│ 🔍 Busca Direta                    │
│ ○ CNPJ                             │
│ ○ Razão Social                     │
│ ○ Nome Fantasia                    │
│                                     │
│ 🎯 Por Características             │
│ ○ Segmento/CNAE                   │
│ ○ Sócio/Responsável               │
│ ○ Localização (CEP)               │
│                                     │
│ 📧 Contato                         │
│ ○ Email                            │
│ ○ Telefone                         │
└─────────────────────────────────────┘
```

### Alternativa: Tabs

```
┌──────────────────────────────────────┐
│ [Direta] [Características] [Contato] │
├──────────────────────────────────────┤
│ Busca Direta:                        │
│                                      │
│  ● CNPJ    ○ Razão Social  ○ Nome   │
│                                      │
│  [Digite o CNPJ: 00.000.000/0000-00]│
└──────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### Componentes
- `SearchTypeSelector.tsx` - Seletor reestruturado
- `SearchTypeGroup.tsx` - Grupo de tipos
- `SearchTypeOption.tsx` - Opção individual

### Dados

```typescript
const SEARCH_TYPES_CONFIG = {
  direct: {
    label: 'Busca Direta',
    icon: Search,
    types: [
      {
        value: 'cnpj',
        label: 'CNPJ',
        icon: Building2,
        placeholder: '00.000.000/0000-00',
        tooltip: 'Busca exata por CNPJ formatado ou não',
        example: '12.345.678/0001-90'
      },
      // ...
    ]
  },
  characteristics: {
    label: 'Por Características',
    icon: Target,
    types: [...]
  },
  contact: {
    label: 'Contato',
    icon: Mail,
    types: [...]
  }
}
```

---

## 🧪 Testes

- [ ] Seleção de cada tipo funciona corretamente
- [ ] Placeholder muda ao selecionar tipo
- [ ] Tooltip aparece ao fazer hover
- [ ] Navegação por teclado funcional
- [ ] Screen reader anuncia opções

---

## 📊 Métricas de Sucesso

- [ ] Redução de 30% no tempo para selecionar tipo de busca
- [ ] Aumento de 20% em uso de tipos alternativos (não apenas CNPJ)
- [ ] Feedback positivo sobre clareza da interface

---

**Criado em:** 25/10/2025  
**Aguardando:** Sprint Planning + definição com PO
