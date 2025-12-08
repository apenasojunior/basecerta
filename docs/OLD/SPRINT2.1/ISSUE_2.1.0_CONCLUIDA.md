# ✅ Issue 2.1.0 - Análise e Mapeamento Frontend ↔ Backend

**Status:** ✅ CONCLUÍDA  
**Data:** 23/01/2025  
**Duração:** ~1.5 horas  
**Sprint:** 2.1 - Smart CNPJ Backend

---

## 🎯 Objetivo

Analisar estrutura do banco de dados CNPJ existente, mapear campos do frontend para o backend, identificar índices necessários e criar documentação DE/PARA completa.

---

## 📊 Descobertas do Banco de Dados

### Schema Estruture
```
Database: basecerta
├── Schema: cnpj (dados CNPJ Receita Federal)
│   ├── empresas (64.888.615 registros)
│   ├── estabelecimentos (68.048.884 registros)
│   ├── socios (26.510.557 registros)
│   ├── cnaes (2.718 registros)
│   ├── naturezas_juridicas (auxiliar)
│   ├── qualificacoes_socios (auxiliar)
│   ├── motivos_situacao_cadastral (auxiliar)
│   ├── municipios (auxiliar)
│   ├── paises (auxiliar)
│   └── simples (regime tributário)
└── Schema: public (tabelas de apoio da aplicação)
    └── [a serem criadas: usuarios, pesquisa_cnpj, transacoes_credito, planos, assinaturas]
```

### Estrutura da Tabela Principal: `cnpj.empresas`

```sql
Column                       | Type              | Nullable
-----------------------------|-------------------|----------
cnpj_basico                  | varchar(8)        | NOT NULL  ← PRIMARY KEY
razao_social                 | varchar(500)      | NOT NULL
natureza_juridica            | varchar(10)       | NULL
qualificacao_responsavel     | varchar(5)        | NULL
capital_social               | numeric(18,2)     | NULL
porte_empresa                | varchar(2)        | NULL
ente_federativo_responsavel  | varchar(100)      | NULL
```

### Estrutura da Tabela: `cnpj.estabelecimentos`

```sql
Column                       | Type              | Nullable
-----------------------------|-------------------|----------
cnpj_basico                  | varchar(8)        | NOT NULL  ← FK empresas
cnpj_ordem                   | varchar(4)        | NOT NULL
cnpj_dv                      | varchar(2)        | NOT NULL
identificador_matriz_filial  | varchar(1)        | NULL      ← '1' = Matriz, '2' = Filial
nome_fantasia                | varchar(500)      | NULL
situacao_cadastral           | varchar(2)        | NULL
data_situacao_cadastral      | date              | NULL
motivo_situacao_cadastral    | varchar(5)        | NULL
data_inicio_atividade        | date              | NULL
cnae_fiscal_principal        | varchar(10)       | NULL
cnae_fiscal_secundaria       | text              | NULL      ← CSV: "1234567,2345678"
tipo_logradouro              | varchar(50)       | NULL
logradouro                   | varchar(500)      | NULL
numero                       | varchar(20)       | NULL
complemento                  | varchar(300)      | NULL
bairro                       | varchar(100)      | NULL
cep                          | varchar(8)        | NULL
uf                           | varchar(2)        | NULL
municipio                    | varchar(10)       | NULL
ddd_1                        | varchar(5)        | NULL
telefone_1                   | varchar(20)       | NULL
ddd_2                        | varchar(5)        | NULL
telefone_2                   | varchar(20)       | NULL
ddd_fax                      | varchar(5)        | NULL
fax                          | varchar(20)       | NULL
correio_eletronico           | varchar(200)      | NULL
```

### Estrutura da Tabela: `cnpj.socios`

```sql
Column                          | Type              | Nullable
--------------------------------|-------------------|----------
id                              | integer           | NOT NULL  ← PRIMARY KEY
cnpj_basico                     | varchar(8)        | NOT NULL  ← FK empresas
identificador_socio             | varchar(1)        | NULL
nome_socio                      | varchar(500)      | NULL
cnpj_cpf_socio                  | varchar(14)       | NULL
qualificacao_socio              | varchar(5)        | NULL
data_entrada_sociedade          | date              | NULL
pais                            | varchar(5)        | NULL
representante_legal             | varchar(11)       | NULL
nome_representante              | varchar(300)      | NULL
qualificacao_representante_legal| varchar(5)        | NULL
faixa_etaria                    | varchar(1)        | NULL
```

### Amostra de Dados Real

```
CNPJ: 11779918-0001-05
Razão Social: N. F. C. VIANNA
Natureza Jurídica: 2135
Capital Social: 5000.00
Porte: 01 (Microempresa)
Nome Fantasia: (vazio)
Situação: 04 (Inapta)
CNAE Principal: 5611204
Endereço: ANA NERI, 73 - CAMBUI
CEP: 13024500
Município: 6291 (SP)
Email: kaconori@ig.com.br
Telefone: (19) 91174491
```

---

## 🗺️ Mapeamento Frontend ↔ Backend

### Interface Frontend (`SmartCNPJCompany`)

**Arquivo:** `frontend/src/mocks/smart-cnpj.ts`

```typescript
interface SmartCNPJCompany {
  cnpj: string                      // "00.000.000/0000-00"
  razaoSocial: string
  nomeFantasia: string | null
  situacaoCadastral: string         // "Ativa"
  porte: string                     // "Microempresa"
  capitalSocial: number
  dataAbertura: string              // ISO 8601
  
  endereco: {
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cep: string                     // "00000-000"
    municipio: string               // nome
    uf: string
  }
  
  contatos: {
    email: string | null
    telefone: string | null         // "(00) 0000-0000"
    telefone2: string | null
  }
  
  cnaesPrimario: {
    codigo: string
    descricao: string
  }
  
  cnaesSecundarios: Array<{
    codigo: string
    descricao: string
  }>
  
  socios: Array<{
    nome: string
    cpfCnpj: string | null
    qualificacao: string
    dataEntrada: string | null
  }>
}
```

### Transformações Necessárias

| Frontend | Backend | Transformação |
|----------|---------|---------------|
| `cnpj: "00.000.000/0000-00"` | `cnpj_basico + cnpj_ordem + cnpj_dv` | **Formatar:** `11779918 + 0001 + 05` → `11.779.918/0001-05` |
| `razaoSocial` | `razao_social` | Direto |
| `nomeFantasia` | `nome_fantasia` | Direto (NULL allowed) |
| `situacaoCadastral: "Ativa"` | `situacao_cadastral: "02"` | **Enum:** `02→Ativa`, `04→Inapta`, `03→Suspensa`, `08→Baixada` |
| `porte: "Microempresa"` | `porte_empresa: "01"` | **Enum:** `01→Microempresa`, `03→Pequena`, `05→Grande` |
| `capitalSocial: 5000.00` | `capital_social: numeric` | Direto |
| `dataAbertura: "2024-01-15"` | `data_inicio_atividade: date` | ISO 8601 |
| `endereco.logradouro` | `tipo_logradouro + logradouro` | **Concat:** `"RUA" + "ANA NERI"` → `"RUA ANA NERI"` |
| `endereco.cep: "13024-500"` | `cep: "13024500"` | **Formatar:** `13024500` → `13024-500` |
| `endereco.municipio: "Campinas"` | `municipio: "6291"` (**JOIN**) | **FK Join** com `municipios.descricao` |
| `contatos.telefone: "(19) 91174-491"` | `ddd_1: "19" + telefone_1: "91174491"` | **Concat & Format:** `19 + 91174491` → `(19) 91174-491` |
| `contatos.email` | `correio_eletronico` | Direto |
| `cnaesPrimario.codigo` | `cnae_fiscal_principal` | Direto |
| `cnaesPrimario.descricao` | (**JOIN**) `cnaes.descricao` | **FK Join** |
| `cnaesSecundarios[]` | `cnae_fiscal_secundaria` (text) | **Split:** `"1234567,2345678"` → Array + JOIN |
| `socios[].nome` | `nome_socio` | Direto |
| `socios[].cpfCnpj` | `cnpj_cpf_socio` | **Format CPF/CNPJ** |
| `socios[].qualificacao` | (**JOIN**) `qualificacoes_socios.descricao` | **FK Join** |

---

## 🔍 7 Tipos de Busca Mapeados

| Frontend Search Type | Backend SQL | Índice Necessário |
|---------------------|-------------|-------------------|
| **1. CNPJ** | `CONCAT(cnpj_basico, cnpj_ordem, cnpj_dv) = :cnpj` | ✅ `idx_estab_cnpj_completo` (B-tree) |
| **2. Razão Social** | `razao_social ILIKE '%:termo%'` | ✅ `idx_empresas_razao` (GIN to_tsvector) |
| **3. Segmento (CNAE)** | `cnae_fiscal_principal = :cnae` | ✅ `idx_estab_cnae` (B-tree) |
| **4. Email** | `correio_eletronico ILIKE '%:email%'` | ✅ **CRIADO** `idx_estab_email_gin` (GIN pg_trgm) |
| **5. Telefone** | `(ddd_1 \|\| telefone_1) LIKE '%:tel%'` | ✅ **CRIADO** `idx_estab_telefone_concat` (B-tree) |
| **6. Nome Sócio** | `nome_socio ILIKE '%:nome%'` | ✅ `idx_socios_nome` (GIN to_tsvector) |
| **7. CEP** | `cep = :cep` | ✅ **CRIADO** `idx_estab_cep` (B-tree) |

---

## 🎛️ 8 Filtros Mapeados

| Frontend Filter | Backend Column | SQL Condition | Índice |
|----------------|---------------|---------------|--------|
| `uf` (select) | `uf` | `= :uf` | ✅ `idx_estab_uf` |
| `municipio` (select) | `municipio` | `= :cod_mun` | ✅ `idx_estab_municipio` |
| `situacao` (select) | `situacao_cadastral` | `= :situacao` | ✅ `idx_estab_situacao` |
| `porte` (select) | `porte_empresa` | `= :porte` | ✅ `idx_empresas_porte` |
| `capitalMinimo` (number) | `capital_social` | `>= :min` | ✅ `idx_empresas_capital_social` |
| `capitalMaximo` (number) | `capital_social` | `<= :max` | ✅ (mesmo índice) |
| `dataAberturaInicio` (date) | `data_inicio_atividade` | `>= :inicio` | ✅ **CRIADO** `idx_estab_data_atividade` |
| `dataAberturaFim` (date) | `data_inicio_atividade` | `<= :fim` | ✅ (mesmo índice) |

---

## 📈 Índices Criados (Performance)

### Índices Novos (14 criados)
```sql
✅ idx_estab_email_gin              -- GIN pg_trgm para ILIKE em email
✅ idx_estab_telefone_concat        -- B-tree em (ddd_1 || telefone_1)
✅ idx_estab_cep                    -- B-tree em cep
✅ idx_estab_data_atividade         -- B-tree em data_inicio_atividade
✅ idx_estab_uf_situacao            -- Composite (uf, situacao_cadastral)
✅ idx_empresas_porte_capital       -- Composite (porte_empresa, capital_social)
✅ idx_estab_situacao_data          -- Composite (situacao_cadastral, data_inicio_atividade)
✅ idx_estab_uf_mun_sit             -- Composite (uf, municipio, situacao_cadastral)
✅ idx_estab_cnae_secundaria_gin    -- GIN pg_trgm para busca em CNAEs secundários
✅ idx_naturezas_codigo             -- JOIN com naturezas_juridicas
✅ idx_municipios_codigo            -- JOIN com municipios
✅ idx_qualificacoes_codigo         -- JOIN com qualificacoes_socios
✅ idx_estab_matriz_ativa           -- Partial: (cnpj_basico) WHERE matriz='1' AND situacao='02'
✅ idx_estab_sem_nome_fantasia      -- Partial: (cnpj_basico) WHERE nome_fantasia IS NULL
```

### Total de Índices no Schema cnpj
- **Antes:** 29 índices (nativos do dump)
- **Depois:** 43 índices (+14 novos)
- **Extensão pg_trgm:** ✅ Habilitada

---

## 📝 Documentos Criados

### 1. `docs/DE_PARA_FRONTEND_BACKEND.md`
- ✅ Mapeamento completo de todos os campos
- ✅ 7 tipos de busca com SQL examples
- ✅ 8 filtros com SQL conditions
- ✅ Enums de porte, situação, tipo estabelecimento
- ✅ Exemplo de query SQLAlchemy completa
- ✅ Checklist de implementação

### 2. `backend/scripts/02_create_indexes.sql`
- ✅ Identificação de índices existentes
- ✅ Criação de 14 índices novos
- ✅ Comentários explicando estratégia de cada índice
- ✅ ANALYZE após criação

### 3. `backend/scripts/03_create_support_tables.sql`
- ✅ Tabela `usuarios` (schema public)
- ✅ Tabela `pesquisa_cnpj` (histórico de buscas)
- ✅ Tabela `transacoes_credito` (histórico de créditos)
- ✅ Tabela `planos` (catálogo de planos)
- ✅ Tabela `assinaturas` (assinaturas de usuários)
- ✅ Triggers para débito automático de créditos

---

## 🚀 Próximos Passos (Issue 2.1.1)

**Criar Models SQLAlchemy:**
```python
class Empresa(Base):
    __tablename__ = 'empresas'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    cnpj_basico = Column(String(8), primary_key=True)
    razao_social = Column(String(500), nullable=False)
    # ... demais campos

class Estabelecimento(Base):
    __tablename__ = 'estabelecimentos'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    cnpj_basico = Column(String(8), ForeignKey('cnpj.empresas.cnpj_basico'), primary_key=True)
    cnpj_ordem = Column(String(4), primary_key=True)
    cnpj_dv = Column(String(2), primary_key=True)
    # ... demais campos
    
    # Relacionamentos
    empresa = relationship("Empresa", back_populates="estabelecimentos")
```

---

## ✅ Checklist de Conclusão

- [x] Conectar no PostgreSQL e listar schemas
- [x] Descobrir estrutura de todas as tabelas do schema cnpj
- [x] Coletar amostra de dados reais
- [x] Contar volume de registros por tabela
- [x] Mapear campos frontend → backend
- [x] Documentar 7 tipos de busca com SQL
- [x] Documentar 8 filtros com SQL
- [x] Identificar índices existentes
- [x] Criar script de índices faltantes
- [x] Executar script de índices (14 criados)
- [x] Verificar índices criados no banco
- [x] Criar documento DE/PARA completo
- [x] Atualizar Sprint 2.1 com status

---

## 📊 Métricas Finais

- **Tempo estimado:** 2 horas
- **Tempo real:** 1.5 horas
- **Eficiência:** 125%
- **Índices criados:** 14
- **Documentos criados:** 3
- **Tabelas analisadas:** 10
- **Campos mapeados:** 50+
- **Queries SQL testadas:** 7

---

**Issue 2.1.0:** ✅ CONCLUÍDA  
**Próxima Issue:** 2.1.1 - Criar Models SQLAlchemy  
**Bloqueios:** Nenhum  
**Observações:** Base de dados tem estrutura MUITO bem organizada com índices nativos de alta qualidade. Adicionar apenas índices específicos para casos de uso da aplicação.
