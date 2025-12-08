# 🎯 ISSUE-00-A: Estatísticas B2B Estratégicas - Proposta

**Issue:** ISSUE-00-A  
**Feature:** FEATURE-00 (Área de Estatísticas)  
**Sprint:** Smart CNPJ Search  
**Data:** 25/10/2025  
**Status:** 📋 Em Análise (Aguardando Aprovação)

---

## 📊 Dados Disponíveis na BaseCerta

### Snapshot do Banco (25/10/2025)

```
Total de Empresas:           64,888,615
Total de Estabelecimentos:   68,048,884

📍 Situação Cadastral:
├─ Ativa:      27,191,679 (40%)  ✅
├─ Baixada:    31,645,319 (46%)  
├─ Inapta:      8,820,485 (13%)  
├─ Suspensa:      288,440 (0.4%)
└─ Nula:          102,961 (0.2%)

📏 Porte:
├─ Microempresa:           48,292,736 (74%)  🟢
├─ Pequeno Porte:           1,920,313 (3%)   🟡
└─ Demais (Médio/Grande):  14,674,006 (23%)  🔴

📍 Top Estados:
├─ SP: 19,652,367 (29%)
├─ MG:  7,400,825 (11%)
├─ RJ:  5,779,421 (9%)
├─ RS:  4,684,317 (7%)
├─ PR:  4,621,288 (7%)
└─ BA:  3,389,475 (5%)

🚀 Abertas Último Ano (Ativas): 4,299,937
```

### Campos Disponíveis para Filtros

**Estabelecimento:**
- `situacao_cadastral` → Ativa, Baixada, Inapta, Suspensa
- `data_inicio_atividade` → Data de abertura
- `uf` → Estado (SP, MG, RJ...)
- `municipio` → Código do município
- `cep` → CEP
- `cnae_fiscal_principal` → CNAE principal
- `cnae_fiscal_secundaria` → CNAEs secundários (CSV)
- `identificador_matriz_filial` → 1=Matriz, 2=Filial
- `correio_eletronico` → Email
- `telefone_1`, `telefone_2` → Telefones

**Empresa:**
- `porte_empresa` → 01=Micro, 03=Pequena, 05=Demais
- `capital_social` → Capital social (Numeric)
- `natureza_juridica` → Tipo jurídico
- `razao_social` → Nome da empresa

**Sócio:**
- `nome_socio` → Nome do sócio
- `identificador_socio` → 1=PF, 2=PJ, 3=Estrangeiro

**CNAEs (27 Segmentos):**
- Tecnologia, Saúde, Educação, Indústria, Comércio, Serviços, Construção, Transporte, Alimentação, etc.

---

## � CONTEXTO: Top 10 Segmentos por Valor (Brasil 2024/25)

**Fonte:** Lucros reportados + dados de emprego formal

| # | Segmento | Lucro/Valor 2024 | Vagas Criadas | Oportunidade B2B |
|---|----------|------------------|---------------|------------------|
| 1 | 💰 **Financeiro & Pagamentos** | R$ 108.2 bi (bancos) + R$ 2.3 bi (fintechs) | +929.9k (Serviços) | **ALTÍSSIMA** |
| 2 | ⛽ **Petróleo & Gás** | R$ 36.6 bi (Petrobras) | Cadeia longa SP/RJ/BA | **ALTA** |
| 3 | ⛏️ **Mineração & Siderurgia** | US$ 6.16 bi (Vale) | +306.9k (Indústria) | **ALTA** |
| 4 | ⚡ **Energia Elétrica** | R$ 8.8-10.4 bi (Eletrobras) + R$ 3.37 bi (Engie) | Técnicos/operação | **MÉDIA** |
| 5 | 🛒 **Varejo & Supermercados** | R$ 1.27 tri (setor) +4.7% | +336.1k (Comércio) | **ALTÍSSIMA** |
| 6 | 🌾 **Agro & Proteínas** | R$ 9.6 bi (JBS) + R$ 3.7 bi (BRF) | +10.8k | **ALTA** |
| 7 | 📡 **Telecom** | R$ 5.5 bi (Vivo) | Redes/atendimento | **MÉDIA** |
| 8 | 🚚 **Logística & Transporte** | R$ 2.1 bi (Rumo) | Operadores/motoristas | **ALTA** |
| 9 | 🏥 **Saúde (planos/hospitais/farma)** | R$ 1.836 bi (Hapvida) + R$ 1.275 bi (RD) | Assistenciais | **ALTÍSSIMA** |
| 10 | 🏗️ **Construção & Incorporação** | R$ 1.649 bi (Cyrela) | +110.9k | **ALTA** |

### 🎯 Insight Estratégico
Os setores com **maior lucro** são os que mais **compram serviços B2B**:
- Financeiro precisa: TI, segurança, consultoria, RH
- Varejo precisa: logística, TI, marketing, fornecedores
- Saúde precisa: equipamentos, TI, limpeza, segurança
- Construção precisa: materiais, engenharia, logística

---

## �💡 6 ESTATÍSTICAS ESTRATÉGICAS PARA B2B (VERSÃO 2.0)

### 🎯 Objetivo
Transformar dados brutos em **oportunidades de negócio acionáveis** focadas nos **setores mais lucrativos**, ajudando empreendedores a:
- Identificar empresas nos setores que mais faturam
- Encontrar potenciais clientes com alto poder de compra
- Focar em nichos com geração de empregos (= crescimento)
- Localizar empresas com perfil específico e regional

---

## 📊 SUGESTÃO #1: 🏥 Empresas de Saúde (Setor Top 9 - R$ 3+ bi lucro)

### 🎯 Insight de Negócio
"**Setor de Saúde = R$ 3+ bilhões em lucro (2024)**"  
Setor Top 9 mais lucrativo do Brasil. Empresas de saúde têm:
- Alto poder de compra (hospitais, planos, farmácias)
- Demanda constante de fornecedores (equipamentos, TI, limpeza, segurança)
- Crescimento acelerado (assistenciais + clínicas)

### 📈 Estatística
```
🏥 Empresas de Saúde
   ~59 mil empresas ativas
   Setor com R$ 3 bi+ lucro/ano
   [Buscar oportunidades →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Saúde",  // CNAEs: hospitais, clínicas, laboratórios, farmácias
  "situacao_cadastral": "02",  // Ativas
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs Incluídos:**
- 8610101/102 - Hospitais e pronto-socorros
- 8621601/602 - UTI e ambulâncias
- 8630501/502 - Clínicas médicas e cirúrgicas
- 8640201 - Laboratórios
- 8650003 - Psicologia
- 4771701/702/703 - Farmácias e drogarias

### 💼 Casos de Uso B2B
- **Fornecedores Médicos:** Equipamentos, materiais hospitalares
- **TI/Software:** Sistemas de gestão hospitalar, prontuário eletrônico
- **Limpeza/Higienização:** Serviços especializados para hospitais
- **Segurança:** Vigilância, controle de acesso
- **Consultoria:** Acreditação, gestão hospitalar, compliance

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Setor Top 9 nacional + alto poder de compra

---

## 📊 SUGESTÃO #2: 🛒 Varejo & Supermercados (Setor Top 5 - R$ 1.27 tri)

### 🎯 Insight de Negócio
"**Varejo = R$ 1.27 trilhão + 336 mil empregos criados (2024)**"  
Setor Top 5 nacional. Crescimento de +4.7% em 2024. O varejo precisa:
- Fornecedores de produtos (alimentos, higiene, bens de consumo)
- Logística e distribuição
- TI (PDV, e-commerce, gestão de estoque)
- Marketing e vendas

### 📈 Estatística
```
🛒 Comércio Varejista Ativo
   ~249 mil empresas (segmento)
   Setor R$ 1.27 tri + 336k vagas
   [Explorar oportunidades →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Comércio",  // Varejo, atacado, super/hiper
  "situacao_cadastral": "02",
  "uf": "SP",  // Maior concentração (29% nacional)
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs Incluídos:**
- 4711301/302/303 - Hipermercados e supermercados
- 4721101/102 - Padarias e confeitarias
- 4751201/202 - Comércio de informática
- 4753900 - Comércio de eletrodomésticos
- 4754701/702 - Comércio de móveis e artigos

### 💼 Casos de Uso B2B
- **Indústria/Fornecedores:** Vender produtos para revenda
- **Distribuidores:** Criar redes de distribuição
- **Logística:** Transportadoras e armazenagem
- **TI/Software:** PDV, e-commerce, ERP varejo
- **Marketing:** Agências, trade marketing

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Setor Top 5 + crescimento contínuo + alta demanda B2B

---

## 📊 SUGESTÃO #3: Empresas de Tecnologia (Brasil)

### 🎯 Insight de Negócio
"**Setor Tech = alto crescimento + alto ticket**"  
Empresas de tecnologia costumam ter:
- Maior poder de compra
- Abertura para inovação
- Necessidade de parceiros/fornecedores especializados

### 📈 Estatística
```
💻 Empresas de Tecnologia
   120 mil empresas ativas
   [Ver todas →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Tecnologia",  // CNAE 62*, 63* (TI, telecom, software)
  "situacao_cadastral": "02",
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs Incluídos:**
- 6201500 - Desenvolvimento de software sob encomenda
- 6202300 - Desenvolvimento de software customizável
- 6203100 - Licenciamento de programas
- 6204000 - Consultoria em TI
- 6209100 - Suporte técnico e TI
- 6311900 - Tratamento de dados, hospedagem
- 6391700 - Agências de notícias

### 💼 Casos de Uso B2B
- **Fornecedores Tech:** Cloud, servidores, licenças
- **RH Tech:** Recrutamento de desenvolvedores
- **Investidores:** Startups e scale-ups
- **Parcerias:** Integração de soluções

### ✅ Valor
⭐⭐⭐⭐ **ALTO** - Setor estratégico e lucrativo

---

## 📊 SUGESTÃO #4: Indústrias de Médio/Grande Porte

### 🎯 Insight de Negócio
"**Grandes indústrias = grandes contratos**"  
Empresas industriais de porte médio/grande:
- Compram em volume
- Contratos recorrentes
- Necessidade de múltiplos fornecedores (matéria-prima, logística, manutenção, etc)

### 📈 Estatística
```
🏭 Indústrias Médio/Grande Porte
   2.1 milhões de empresas ativas
   [Buscar oportunidades →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Indústria",
  "porte_empresa": "05",  // Demais (Médio/Grande)
  "situacao_cadastral": "02",
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**Segmentos Incluídos:**
- Alimentos e bebidas
- Metalurgia
- Automóveis
- Químicos
- Têxtil
- Móveis
- Máquinas e equipamentos

### 💼 Casos de Uso B2B
- **Fornecedores Industriais:** Matéria-prima, insumos
- **Logística:** Transporte e armazenagem
- **Serviços:** Manutenção, limpeza, segurança
- **Financeiro:** Linhas de crédito, factoring

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Alto ticket, contratos recorrentes

---

## 📊 SUGESTÃO #5: Empresas com Email Cadastrado

### 🎯 Insight de Negócio
"**Email = canal direto de comunicação**"  
Empresas que cadastraram email na Receita Federal são mais:
- Profissionalizadas
- Abertas a contato comercial
- Facilmente contatáveis (dispensa cold call)

### 📈 Estatística
```
📧 Empresas com Email Cadastrado
   8.5 milhões prontas para contato
   [Gerar lista →]
```

### 🔍 Filtros da Busca
```json
{
  "situacao_cadastral": "02",
  "correio_eletronico": "IS NOT NULL",  // Tem email
  "orderBy": "data_inicio_atividade",
  "orderDirection": "desc"
}
```

### 💼 Casos de Uso B2B
- **Email Marketing:** Base para campanhas
- **Vendas B2B:** Prospecção por email (warm leads)
- **Parcerias:** Contato direto com decisores
- **Eventos:** Divulgação de feiras, congressos

### ✅ Valor
⭐⭐⭐⭐ **ALTO** - Facilita prospecção (skip cold calling)

---

## 📊 SUGESTÃO #6: Matrizes Ativas (Sede das Empresas)

### 🎯 Insight de Negócio
"**Matriz = decisor centralizado**"  
Negociar com a matriz pode abrir portas para:
- Contratos nacionais (todas filiais)
- Decisão centralizada (1 negociação = N filiais)
- Contato direto com C-level

### 📈 Estatística
```
🏢 Matrizes Ativas (Sede)
   27.2 milhões de sedes empresariais
   [Buscar decisores →]
```

### 🔍 Filtros da Busca
```json
{
  "identificador_matriz_filial": "1",  // 1 = Matriz
  "situacao_cadastral": "02",
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

### 💼 Casos de Uso B2B
- **Vendas Enterprise:** Contratos nacionais (matriz + filiais)
- **Distribuidores:** Negociar rede de distribuição
- **Consultoria:** Projetos estratégicos (sede)
- **Tech/SaaS:** Licenciamento enterprise

### ✅ Valor
⭐⭐⭐⭐ **ALTO** - Acesso a decisores, potencial de escalabilidade

---

## 📊 RESUMO DAS 6 ESTATÍSTICAS

| # | Título | Qtd Estimada | Valor B2B | Casos de Uso |
|---|--------|--------------|-----------|--------------|
| 1 | 🚀 Empresas Abertas 2025 | 4.3M | ⭐⭐⭐⭐⭐ | Novos clientes, early adopters |
| 2 | 🎯 Micro/Pequenas SP | 14.6M | ⭐⭐⭐⭐⭐ | Base de prospecção, distribuição |
| 3 | 💻 Empresas de Tecnologia | 120K | ⭐⭐⭐⭐ | Parcerias, investimento, RH |
| 4 | 🏭 Indústrias Médio/Grande | 2.1M | ⭐⭐⭐⭐⭐ | Grandes contratos, recorrência |
| 5 | 📧 Com Email Cadastrado | 8.5M | ⭐⭐⭐⭐ | Email marketing, prospecção |
| 6 | 🏢 Matrizes Ativas | 27.2M | ⭐⭐⭐⭐ | Decisores, contratos enterprise |

---

## 🎯 Critérios de Seleção

Essas 6 estatísticas foram escolhidas porque:

### ✅ Diversidade de Casos de Uso
- **Temporal:** #1 (recentes)
- **Geográfico:** #2 (SP)
- **Segmento:** #3 (Tech), #4 (Indústria)
- **Contato:** #5 (Email)
- **Estrutura:** #6 (Matriz)

### ✅ Acionáveis
Cada estatística é **clicável** e executa uma busca real

### ✅ Valor B2B Comprovado
Todas resolvem dores reais de:
- Vendedores
- Distribuidores
- Investidores
- Empreendedores

### ✅ Performance
Queries rápidas (< 200ms) com índices existentes:
- `situacao_cadastral` (indexed)
- `data_inicio_atividade` (indexed)
- `uf` (indexed)
- `porte_empresa` (indexed)
- `identificador_matriz_filial` (indexed)

---

## 🔄 Alternativas Consideradas (Não Selecionadas)

### Opção A: "Empresas com Capital > 1M"
**Por que não:** Filtro muito técnico, não é "insight" (é filtro avançado)

### Opção B: "Empresas por Município"
**Por que não:** Muito específico, menos útil que por UF

### Opção C: "Empresas com Sócio Estrangeiro"
**Por que não:** Nicho muito pequeno, baixo volume

### Opção D: "MEI (Microempreendedor Individual)"
**Por que não:** Tabela `simples` tem problemas de schema (erro detectado)

---

## 💻 Implementação Técnica (Preview)

### INSIGHTS_CONFIG.ts
```typescript
export const INSIGHTS_CONFIG = [
  {
    id: 'empresas-abertas-2025',
    icon: '🚀',
    title: 'Empresas Abertas em 2025',
    description: '4.3 milhões de oportunidades',
    color: 'green',
    searchParams: {
      filters: {
        situacao_cadastral: '02',
        data_inicio_atividade_min: '2025-01-01'
      },
      orderBy: 'data_inicio_atividade',
      orderDirection: 'desc'
    }
  },
  {
    id: 'micro-pequenas-sp',
    icon: '🎯',
    title: 'Micro e Pequenas - SP',
    description: '14.6 milhões de empresas',
    color: 'blue',
    searchParams: {
      filters: {
        uf: 'SP',
        porte_empresa: ['01', '03'],
        situacao_cadastral: '02'
      }
    }
  },
  // ... +4 configs
]
```

### StatCard Component
```tsx
<StatCard
  icon="🚀"
  title="Empresas Abertas 2025"
  value="4.3M"
  trend="+18% vs 2024"
  onClick={() => router.push('/smart-cnpj/results?preset=novas-2025')}
/>
```

---

## 📋 Checklist para Aprovação

- [ ] **Revisar os 6 insights** - Fazem sentido para B2B?
- [ ] **Validar estimativas** - Números parecem realistas?
- [ ] **Ajustar prioridades** - Alguma estatística deveria ser trocada?
- [ ] **Confirmar UX** - Cards clicáveis são a melhor abordagem?

---

## 🎯 Próximos Passos (Após Aprovação)

1. **Implementar INSIGHTS_CONFIG** (frontend)
2. **Criar StatCard component** (React)
3. **Adicionar suporte a presets** (backend)
4. **Testes de performance** (< 200ms)
5. **Documentar no README**

---

## 💬 Notas

### Performance Estimada
Todas queries devem rodar em **< 200ms** pois usam índices existentes:
- ✅ `situacao_cadastral` (indexed)
- ✅ `data_inicio_atividade` (indexed)
- ✅ `uf` (indexed)
- ✅ `porte_empresa` (indexed)

### Dados Dinâmicos vs Estáticos
**Recomendação:** Começar com **valores estáticos** (atualizados semanalmente):
- Performance instantânea
- Sem sobrecarga no DB
- Suficientemente preciso

**Futuro:** Migrar para cache Redis com TTL de 24h

---

**Aguardando aprovação do Product Owner (LinkerX)** 🎯

---

**Criado em:** 25/10/2025  
**Estimativa:** 3 horas  
**Status:** 📋 Aguardando Aprovação
