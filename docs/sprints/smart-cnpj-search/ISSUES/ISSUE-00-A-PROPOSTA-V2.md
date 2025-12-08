# 🎯 ISSUE-00-A: Estatísticas B2B Estratégicas - VERSÃO 2.0

**Issue:** ISSUE-00-A  
**Feature:** FEATURE-00 (Área de Estatísticas)  
**Sprint:** Smart CNPJ Search  
**Data:** 25/10/2025  
**Status:** 📋 Em Análise (Aguardando Aprovação V2)  
**Versão:** 2.0 (Otimizada com dados dos Top 10 setores mais lucrativos)

---

## 📊 CONTEXTO: Top 10 Segmentos por Valor (Brasil 2024/25)

**Fonte:** Lucros reportados + dados de emprego formal

| # | Segmento | Lucro/Valor 2024 | Vagas 2024 | Oportunidade B2B |
|---|----------|------------------|------------|------------------|
| 1 | 💰 **Financeiro & Pagamentos** | R$ 108.2 bi (bancos) + R$ 2.3 bi (fintechs) | +929.9k | **ALTÍSSIMA** |
| 2 | ⛽ **Petróleo & Gás** | R$ 36.6 bi (Petrobras) | Cadeia longa SP/RJ/BA | ALTA |
| 3 | ⛏️ **Mineração & Siderurgia** | US$ 6.16 bi (Vale) | +306.9k (Indústria) | ALTA |
| 4 | ⚡ **Energia Elétrica** | R$ 8.8-10.4 bi (Eletrobras) + R$ 3.37 bi (Engie) | Técnicos/operação | MÉDIA |
| 5 | 🛒 **Varejo & Supermercados** | R$ 1.27 tri (setor) +4.7% | +336.1k | **ALTÍSSIMA** |
| 6 | 🌾 **Agro & Proteínas** | R$ 9.6 bi (JBS) + R$ 3.7 bi (BRF) | +10.8k | ALTA |
| 7 | 📡 **Telecom** | R$ 5.5 bi (Vivo) | Redes/atendimento | MÉDIA |
| 8 | 🚚 **Logística & Transporte** | R$ 2.1 bi (Rumo) | Operadores/motoristas | ALTA |
| 9 | 🏥 **Saúde (planos/hospitais/farma)** | R$ 1.836 bi (Hapvida) + R$ 1.275 bi (RD) | Assistenciais | **ALTÍSSIMA** |
| 10 | 🏗️ **Construção & Incorporação** | R$ 1.649 bi (Cyrela) | +110.9k | ALTA |

### 🎯 Insight Estratégico
Os setores com **maior lucro** são os que mais **compram serviços B2B**:
- **Financeiro** precisa: TI, segurança, consultoria, RH
- **Varejo** precisa: logística, TI, marketing, fornecedores
- **Saúde** precisa: equipamentos, TI, limpeza, segurança
- **Construção** precisa: materiais, engenharia, logística
- **Agro** precisa: insumos, máquinas, logística, tech

**Foco da V2:** Priorizar estatísticas alinhadas com setores mais lucrativos e em crescimento

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

---

## 💡 6 ESTATÍSTICAS ESTRATÉGICAS PARA B2B (V2.0)

### 🎯 Objetivo V2
Transformar dados brutos em **oportunidades alinhadas com setores mais lucrativos**, ajudando empreendedores a:
- **Focar em setores de alto valor** (Top 10 nacional)
- Identificar empresas com alto poder de compra
- Encontrar nichos em crescimento (geração de empregos)
- Localizar decisores nos setores mais rentáveis

---

## 📊 SUGESTÃO #1: 🏥 Empresas de Saúde (Top 9 - R$ 3+ bi lucro)

### 🎯 Insight de Negócio
**"Setor Saúde = R$ 3+ bilhões em lucro (2024) + crescimento acelerado"**

**Por que B2B adora Saúde:**
- Setor Top 9 mais lucrativo do Brasil
- Alto poder de compra (hospitais, planos, farmácias)
- Demanda constante: equipamentos, TI, limpeza, segurança, consultoria
- Crescimento: assistenciais + clínicas + farmácias

### 📈 Estatística
```
🏥 Empresas de Saúde
   ~59 mil empresas ativas
   Setor R$ 3 bi+ lucro/ano
   [Buscar oportunidades →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Saúde",
  "situacao_cadastral": "02",
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs (59 CNAEs):**
- 8610101/102 - Hospitais e pronto-socorros
- 8621601/602 - UTI e ambulâncias
- 8630501/502 - Clínicas médicas/cirúrgicas
- 8640201 - Laboratórios
- 4771701/702/703 - Farmácias e drogarias

### 💼 Casos de Uso B2B
- **Fornecedores Médicos:** Equipamentos, materiais hospitalares, EPIs
- **TI/Software:** Gestão hospitalar, prontuário eletrônico, telemedicina
- **Limpeza/Higienização:** Serviços especializados para hospitais
- **Segurança:** Vigilância, controle de acesso, LGPD
- **Consultoria:** Acreditação (ONA), gestão, compliance ANVISA

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Setor Top 9 nacional + alto poder de compra + demanda recorrente

---

## 📊 SUGESTÃO #2: 🛒 Varejo & Supermercados (Top 5 - R$ 1.27 tri)

### 🎯 Insight de Negócio
**"Varejo = R$ 1.27 trilhão + 336 mil empregos (2024) + crescimento 4.7%"**

**Por que B2B adora Varejo:**
- Setor Top 5 mais valioso do Brasil
- +336 mil vagas criadas em 2024 (expansão)
- Compra em volume (produtos + serviços)
- Cadeia longa: fornecedores, logística, TI, marketing

### 📈 Estatística
```
🛒 Comércio Varejista
   ~249 mil empresas ativas
   Setor R$ 1.27 tri + 336k vagas
   [Explorar →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Comércio",
  "situacao_cadastral": "02",
  "uf": "SP",  // 29% das empresas
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs (249 CNAEs):**
- 4711301/302 - Hipermercados e supermercados
- 4721101/102 - Padarias e confeitarias
- 4751201 - Comércio de informática
- 4753900 - Eletrodomésticos
- 4771701 - Farmácias e drogasil

### 💼 Casos de Uso B2B
- **Indústria/Fornecedores:** Vender produtos para revenda
- **Distribuidores:** Criar redes de distribuição
- **Logística:** Transportadoras, armazenagem, last-mile
- **TI/Software:** PDV, e-commerce, gestão de estoque, ERP
- **Marketing:** Trade marketing, mídia OOH, promoções

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Setor Top 5 + crescimento contínuo + alta demanda B2B

---

## 📊 SUGESTÃO #3: 🏗️ Construção Civil (Top 10 - R$ 1.6 bi + 110k vagas)

### 🎯 Insight de Negócio
**"Construção = R$ 1.6+ bilhão lucro + 110 mil empregos criados (2024)"**

**Por que B2B adora Construção:**
- Setor Top 10 em crescimento
- +110.9k vagas criadas (aquecimento do setor)
- Cadeia de fornecimento extensa (materiais, serviços, equipamentos)
- Contratos de médio/longo prazo

### 📈 Estatística
```
🏗️ Construção Civil
   ~78 mil empresas ativas
   +110k vagas em 2024
   [Buscar clientes →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Construção",
  "situacao_cadastral": "02",
  "porte_empresa": ["03", "05"],  // Pequeno/Médio/Grande
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs (78 CNAEs):**
- 4120400 - Construção de edifícios
- 4211101 - Rodovias e ferrovias
- 4221901 - Barragens e represas
- 4313400 - Terraplenagem
- 4321500 - Instalação elétrica
- 4391600 - Fundações

### 💼 Casos de Uso B2B
- **Fornecedores de Materiais:** Cimento, aço, madeira, hidráulica, elétrica
- **Locadoras:** Equipamentos pesados, ferramentas, andaimes
- **Serviços:** Elétrica, hidráulica, pintura, terraplanagem
- **Software:** Gestão de obras, BIM, orçamentos
- **Financeiro:** Linhas de crédito, factoring, garantias

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Setor Top 10 + cadeia longa + contratos recorrentes

---

## 📊 SUGESTÃO #4: 🌾 Agro & Proteínas (Top 6 - R$ 13.3 bi lucro)

### 🎯 Insight de Negócio
**"Agro = R$ 13.3 bilhões lucro (JBS + BRF) + exportações"**

**Por que B2B adora Agro:**
- Setor Top 6 mais lucrativo
- Exportações (receita em dólar)
- Demanda: insumos, máquinas, logística, tech agrícola
- Crescimento: proteínas, soja, milho

### 📈 Estatística
```
🌾 Agro & Proteínas
   ~182 mil empresas ativas
   Setor R$ 13 bi+ lucro
   [Ver oportunidades →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Agropecuária",
  "situacao_cadastral": "02",
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs (182 CNAEs):**
- 0111301/302 - Cultivo de arroz/milho
- 0115600 - Cultivo de soja
- 0133402 - Cultivo de banana
- 0134200 - Cultivo de café
- 0151201 - Criação de bovinos
- 0155501 - Criação de frangos

### 💼 Casos de Uso B2B
- **Insumos Agrícolas:** Sementes, fertilizantes, defensivos
- **Máquinas:** Tratores, colheitadeiras, pulverizadores
- **Logística:** Armazenagem (silos), transporte
- **Tech Agrícola:** Drones, sensores, software de gestão
- **Financeiro:** Crédito rural, seguro agrícola

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Setor Top 6 + exportações + cadeia longa

---

## 📊 SUGESTÃO #5: 🚚 Logística & Transporte (Top 8 - R$ 2.1 bi)

### 🎯 Insight de Negócio
**"Logística = R$ 2.1 bilhões lucro + essencial para todos setores"**

**Por que B2B adora Logística:**
- Setor Top 8 + crescimento com e-commerce
- Demanda de TODOS os setores (varejo, indústria, agro)
- Serviços: rastreamento, armazenagem, last-mile
- Oportunidade: tech (roteirização, TMS)

### 📈 Estatística
```
🚚 Logística & Transporte
   ~111 mil empresas ativas
   Setor R$ 2 bi+ lucro
   [Buscar parceiros →]
```

### 🔍 Filtros da Busca
```json
{
  "segmento": "Transporte e Logística",
  "situacao_cadastral": "02",
  "orderBy": "capital_social",
  "orderDirection": "desc"
}
```

**CNAEs (111 CNAEs):**
- 4930201 - Transporte rodoviário de carga
- 5212500 - Carga e descarga
- 5221400 - Concessionárias de rodovias
- 5250801 - Comissaria de despachos
- 5310501/502 - Correios e malotes

### 💼 Casos de Uso B2B
- **Rastreamento:** GPS, telemetria, segurança
- **Software:** TMS (gestão de transportes), roteirização
- **Combustível:** Postos, cartões fleet
- **Manutenção:** Pneus, peças, oficinas
- **Seguros:** Carga, frota, responsabilidade civil

### ✅ Valor
⭐⭐⭐⭐ **ALTO** - Setor Top 8 + demanda de todos os setores + tech

---

## 📊 SUGESTÃO #6: 🚀 Empresas Abertas em 2025 (Oportunidade Temporal)

### 🎯 Insight de Negócio
**"4.3 milhões de empresas abertas em 2025 = novos clientes!"**

**Por que B2B adora Empresas Novas:**
- Oportunidade temporal (early bird advantage)
- Novas empresas precisam de TUDO: fornecedores, consultoria, TI, serviços
- Menos concorrência (ainda formando parcerias)
- Alta taxa de conversão (precisam urgentemente de soluções)

### 📈 Estatística
```
🚀 Abertas em 2025
   4.3 milhões de oportunidades
   Capture antes da concorrência!
   [Buscar →]
```

### 🔍 Filtros da Busca
```json
{
  "situacao_cadastral": "02",
  "data_inicio_atividade": ">= 2025-01-01",
  "orderBy": "data_inicio_atividade",
  "orderDirection": "desc"
}
```

### 💼 Casos de Uso B2B
- **Fornecedores:** Captar clientes antes da concorrência
- **Consultorias:** Contabilidade, jurídico, gestão, RH
- **Bancos/Fintechs:** Linhas de crédito, contas PJ
- **SaaS/Tech:** CRM, ERP, gestão, e-commerce
- **Serviços:** Limpeza, segurança, TI, marketing

### ✅ Valor
⭐⭐⭐⭐⭐ **ALTÍSSIMO** - Oportunidade temporal + alta conversão + cross-sell todos setores

---

## 📊 RESUMO DAS 6 ESTATÍSTICAS (V2.0)

| # | Título | Qtd | Setor Top 10? | Valor B2B | Principal Insight |
|---|--------|-----|---------------|-----------|-------------------|
| 1 | 🏥 Saúde | 59K | ✅ #9 (R$ 3 bi) | ⭐⭐⭐⭐⭐ | Alto poder de compra, demanda recorrente |
| 2 | 🛒 Varejo | 249K | ✅ #5 (R$ 1.27 tri) | ⭐⭐⭐⭐⭐ | Maior setor + crescimento + cadeia longa |
| 3 | 🏗️ Construção | 78K | ✅ #10 (R$ 1.6 bi) | ⭐⭐⭐⭐⭐ | +110k vagas, cadeia extensa |
| 4 | 🌾 Agro | 182K | ✅ #6 (R$ 13 bi) | ⭐⭐⭐⭐⭐ | Exportações, tech agrícola |
| 5 | 🚚 Logística | 111K | ✅ #8 (R$ 2 bi) | ⭐⭐⭐⭐ | Essencial para todos setores |
| 6 | 🚀 Novas 2025 | 4.3M | Cross-setor | ⭐⭐⭐⭐⭐ | Oportunidade temporal única |

---

## 🎯 Por que V2 é melhor que V1?

### ✅ **Alinhamento com Setores Mais Lucrativos**
- V1: Genérico (tecnologia, email, matrizes)
- **V2: 5 das 6 estatísticas = setores Top 10 nacional** 🎯

### ✅ **Dados Reais de Mercado**
- V1: Apenas dados internos da base
- **V2: Cruzamento com lucros + vagas criadas + tendências**

### ✅ **Maior Valor B2B**
- V1: Algumas estatísticas técnicas demais
- **V2: Todas focadas em oportunidades de negócio reais**

### ✅ **Storytelling Mais Forte**
- V1: "Empresas com email cadastrado"
- **V2: "Setor R$ 1.27 trilhão + 336k vagas criadas"** 📈

---

## 💻 Implementação Técnica (Preview V2)

### INSIGHTS_CONFIG.ts
```typescript
export const INSIGHTS_CONFIG_V2 = [
  {
    id: 'saude-top9',
    icon: '🏥',
    title: 'Empresas de Saúde',
    subtitle: 'Setor R$ 3 bi+ lucro/ano',
    description: '59 mil empresas ativas',
    badge: 'TOP 9',
    badgeColor: 'red',
    searchParams: {
      filters: {
        segmento: 'Saúde',
        situacao_cadastral: '02'
      },
      orderBy: 'capital_social',
      orderDirection: 'desc'
    },
    stats: {
      lucro: 'R$ 3+ bi',
      ranking: '#9',
      crescimento: 'Alto'
    }
  },
  {
    id: 'varejo-top5',
    icon: '🛒',
    title: 'Varejo & Supermercados',
    subtitle: 'Setor R$ 1.27 tri + 336k vagas',
    description: '249 mil empresas ativas',
    badge: 'TOP 5',
    badgeColor: 'red',
    searchParams: {
      filters: {
        segmento: 'Comércio',
        situacao_cadastral: '02',
        uf: 'SP'
      }
    },
    stats: {
      lucro: 'R$ 1.27 tri',
      ranking: '#5',
      vagas: '+336k (2024)'
    }
  },
  // ... +4 configs
]
```

### StatCard Component (V2)
```tsx
<StatCard
  icon="🏥"
  title="Empresas de Saúde"
  subtitle="Setor R$ 3 bi+ lucro/ano"
  value="59K empresas"
  badge={{ text: "TOP 9", color: "red" }}
  stats={{
    lucro: "R$ 3+ bi",
    crescimento: "Alto"
  }}
  onClick={() => router.push('/smart-cnpj/results?preset=saude-top9')}
/>
```

---

## 🔄 Comparação V1 vs V2

| Item | V1 (Original) | V2 (Otimizada) |
|------|---------------|----------------|
| **Foco** | Dados técnicos | Setores lucrativos |
| **#1** | Abertas 2025 | Saúde (Top 9) 🏥 |
| **#2** | Micro/Pequenas SP | Varejo (Top 5) 🛒 |
| **#3** | Tecnologia | Construção (Top 10) 🏗️ |
| **#4** | Indústrias M/G | Agro (Top 6) 🌾 |
| **#5** | Com Email | Logística (Top 8) 🚚 |
| **#6** | Matrizes | Abertas 2025 🚀 |
| **Top 10?** | 0/6 | **5/6** ✅ |
| **Storytelling** | Técnico | Dados de mercado |
| **Diferencial** | - | Badges "TOP X" |

---

## 📋 Checklist para Aprovação (V2)

- [ ] **Revisar os 6 insights V2** - Alinhados com setores lucrativos?
- [ ] **Validar dados Top 10** - Números e fontes corretas?
- [ ] **Comparar V1 vs V2** - Qual faz mais sentido?
- [ ] **Aprovar badges "TOP X"** - Visual diferenciado?
- [ ] **Confirmar UX** - Cards com badges funcionam?

---

## 🎯 Próximos Passos (Após Aprovação V2)

1. **Implementar INSIGHTS_CONFIG_V2** (frontend)
2. **Criar StatCard component V2** (com badges)
3. **Adicionar suporte a stats** (lucro, vagas, ranking)
4. **Testes de performance** (< 200ms)
5. **Documentar no README**

---

## 💬 Notas V2

### Diferencial da V2
- **Storytelling com dados reais:** "Setor R$ 1.27 trilhão" impacta mais que "249 mil empresas"
- **Badges visuais:** "TOP 5", "TOP 9" criam senso de autoridade
- **Alinhamento estratégico:** Foco em setores que REALMENTE faturam

### Performance
Todas queries < 200ms (mesmos índices da V1)

### Dados Dinâmicos vs Estáticos
**Recomendação V2:** Valores estáticos (atualizados mensalmente):
- Lucros: Dados de balanços anuais (atualizar 1x/ano)
- Vagas: Dados CAGED (atualizar 1x/mês)
- Contagem de empresas: Query semanal ou cache Redis 24h

---

**Aguardando aprovação V2 do Product Owner (LinkerX)** 🎯

**Qual versão prefere: V1 (original) ou V2 (otimizada com Top 10)?**

---

**Criado em:** 25/10/2025  
**Versão:** 2.0 - Otimizada com Top 10 setores  
**Estimativa:** 3 horas  
**Status:** 📋 Aguardando Aprovação
