# 🔄 DE/PARA: Frontend ↔ Backend - Smart CNPJ

**Criado em:** 2025-01-23  
**Issue:** 2.1.0 - Análise e Mapeamento  
**Status:** ✅ Completo

---

## 📊 Estrutura do Banco de Dados Descoberta

### Schema: `cnpj`
- **empresas** - 64.888.615 registros
- **estabelecimentos** - 68.048.884 registros (matriz + filiais)
- **socios** - 26.510.557 registros
- **cnaes** - 2.718 registros
- **naturezas_juridicas** - tabela auxiliar
- **qualificacoes_socios** - tabela auxiliar
- **motivos_situacao_cadastral** - tabela auxiliar
- **municipios** - tabela auxiliar
- **paises** - tabela auxiliar
- **simples** - regime tributário

### Relacionamentos
```
empresas (cnpj_basico PK) 
  ├─► estabelecimentos (cnpj_basico FK) - 1:N
  ├─► socios (cnpj_basico FK) - 1:N
  └─► simples (cnpj_basico FK) - 1:1

estabelecimentos
  ├─► cnaes (cnae_fiscal_principal FK)
  ├─► municipios (municipio FK)
  ├─► paises (pais FK)
  └─► motivos_situacao_cadastral (motivo_situacao_cadastral FK)

socios
  ├─► paises (pais FK)
  └─► qualificacoes_socios (qualificacao_socio FK)
```

---

## 🎯 Interface Frontend: SmartCNPJCompany

Localização: `frontend/src/mocks/smart-cnpj.ts`

```typescript
interface SmartCNPJCompany {
  // Identificação
  cnpj: string                      // formatado: 00.000.000/0000-00
  razaoSocial: string
  nomeFantasia: string | null
  
  // Natureza Jurídica
  naturezaJuridica: string          // descrição
  codigoNaturezaJuridica: string    // código
  
  // Porte e Capital
  porte: string                     // descrição
  codigoPorte: string               // código
  capitalSocial: number
  
  // Situação Cadastral
  situacaoCadastral: string         // descrição
  codigoSituacaoCadastral: string   // código
  dataSituacaoCadastral: string     // formato ISO
  motivoSituacaoCadastral: string | null
  
  // Datas
  dataInicioAtividade: string       // formato ISO
  dataAbertura: string              // formato ISO
  
  // Endereço (nested object)
  endereco: {
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cep: string                     // formatado: 00000-000
    municipio: string               // nome
    uf: string                      // sigla
  }
  
  // Contatos (nested object)
  contatos: {
    email: string | null
    telefone: string | null         // formatado: (00) 0000-0000
    telefone2: string | null
    fax: string | null
  }
  
  // CNAE Primário (nested object)
  cnaesPrimario: {
    codigo: string
    descricao: string
  }
  
  // CNAEs Secundários (array)
  cnaesSecundarios: Array<{
    codigo: string
    descricao: string
  }>
  
  // Sócios (array)
  socios: Array<{
    nome: string
    qualificacao: string
    cpfCnpj: string | null
    dataEntrada: string | null
  }>
}
```

---

## 🗺️ Mapeamento: Frontend → Backend

### 1️⃣ Tabela: `cnpj.empresas`

| Frontend (camelCase) | Backend (snake_case) | Tipo Backend | Transformação |
|---------------------|---------------------|--------------|---------------|
| `cnpj` (8 primeiros) | `cnpj_basico` | varchar(8) | **Remover formatação**: `00000000` |
| `razaoSocial` | `razao_social` | varchar(500) | Direto |
| `codigoNaturezaJuridica` | `natureza_juridica` | varchar(10) | Direto |
| `naturezaJuridica` | *(JOIN)* `naturezas_juridicas.descricao` | varchar(200) | JOIN na FK |
| `codigoPorte` | `porte_empresa` | varchar(2) | Direto |
| `porte` | *(Enum)* | - | Mapear: `01`→`Micro`, `03`→`Pequena`, `05`→`Grande` |
| `capitalSocial` | `capital_social` | numeric(18,2) | Direto |

### 2️⃣ Tabela: `cnpj.estabelecimentos`

**Filtro:** `identificador_matriz_filial = '1'` (apenas matriz)

| Frontend (camelCase) | Backend (snake_case) | Tipo Backend | Transformação |
|---------------------|---------------------|--------------|---------------|
| `cnpj` (completo) | `cnpj_basico + cnpj_ordem + cnpj_dv` | varchar(14) | **Formatar**: `{cnpj_basico}{cnpj_ordem}{cnpj_dv}` → `00.000.000/0000-00` |
| `nomeFantasia` | `nome_fantasia` | varchar(500) | Direto (pode ser NULL) |
| `codigoSituacaoCadastral` | `situacao_cadastral` | varchar(2) | Direto |
| `situacaoCadastral` | *(Enum)* | - | Mapear: `02`→`Ativa`, `03`→`Suspensa`, `04`→`Inapta`, `08`→`Baixada` |
| `dataSituacaoCadastral` | `data_situacao_cadastral` | date | **ISO 8601**: `2024-01-15` |
| `motivoSituacaoCadastral` | *(JOIN)* `motivos_situacao_cadastral.descricao` | varchar(200) | JOIN na FK |
| `dataInicioAtividade` | `data_inicio_atividade` | date | **ISO 8601** |
| `dataAbertura` | `data_inicio_atividade` | date | **ISO 8601** (mesmo campo) |
| `endereco.logradouro` | `tipo_logradouro + logradouro` | varchar(550) | Concatenar: `{tipo_logradouro} {logradouro}` |
| `endereco.numero` | `numero` | varchar(20) | Direto |
| `endereco.complemento` | `complemento` | varchar(300) | Direto (pode ser NULL) |
| `endereco.bairro` | `bairro` | varchar(100) | Direto |
| `endereco.cep` | `cep` | varchar(8) | **Formatar**: `13024500` → `13024-500` |
| `endereco.uf` | `uf` | varchar(2) | Direto |
| `endereco.municipio` | *(JOIN)* `municipios.descricao` | varchar(200) | JOIN na FK `municipio` |
| `contatos.email` | `correio_eletronico` | varchar(200) | Direto (pode ser NULL) |
| `contatos.telefone` | `ddd_1 + telefone_1` | varchar(25) | **Formatar**: `({ddd_1}) {telefone_1}` |
| `contatos.telefone2` | `ddd_2 + telefone_2` | varchar(25) | **Formatar** (pode ser NULL) |
| `contatos.fax` | `ddd_fax + fax` | varchar(25) | **Formatar** (pode ser NULL) |
| `cnaesPrimario.codigo` | `cnae_fiscal_principal` | varchar(10) | Direto |
| `cnaesPrimario.descricao` | *(JOIN)* `cnaes.descricao` | varchar(250) | JOIN na FK |
| `cnaesSecundarios[]` | `cnae_fiscal_secundaria` | text | **Split por `,`** + JOIN com `cnaes` |

### 3️⃣ Tabela: `cnpj.socios`

**Filtro:** `cnpj_basico = ?`

| Frontend (camelCase) | Backend (snake_case) | Tipo Backend | Transformação |
|---------------------|---------------------|--------------|---------------|
| `socios[].nome` | `nome_socio` | varchar(500) | Direto |
| `socios[].cpfCnpj` | `cnpj_cpf_socio` | varchar(14) | **Formatar CPF/CNPJ** |
| `socios[].qualificacao` | *(JOIN)* `qualificacoes_socios.descricao` | varchar(200) | JOIN na FK `qualificacao_socio` |
| `socios[].dataEntrada` | `data_entrada_sociedade` | date | **ISO 8601** (pode ser NULL) |

---

## 🔍 7 Tipos de Busca → SQL

### 1. **Busca por CNPJ**
```sql
SELECT * FROM cnpj.empresas e
INNER JOIN cnpj.estabelecimentos est 
  ON e.cnpj_basico = est.cnpj_basico
WHERE CONCAT(est.cnpj_basico, est.cnpj_ordem, est.cnpj_dv) = :cnpj_sem_formatacao
  AND est.identificador_matriz_filial = '1';
```

### 2. **Busca por Razão Social**
```sql
SELECT * FROM cnpj.empresas e
INNER JOIN cnpj.estabelecimentos est 
  ON e.cnpj_basico = est.cnpj_basico
WHERE e.razao_social ILIKE :termo
  AND est.identificador_matriz_filial = '1';
-- Índice GIN: idx_empresas_razao
```

### 3. **Busca por Segmento (CNAE)**
```sql
SELECT * FROM cnpj.estabelecimentos est
INNER JOIN cnpj.empresas e ON est.cnpj_basico = e.cnpj_basico
WHERE est.cnae_fiscal_principal = :codigo_cnae
  AND est.identificador_matriz_filial = '1';
-- Índice B-tree: idx_estab_cnae
```

### 4. **Busca por Email**
```sql
SELECT * FROM cnpj.estabelecimentos est
INNER JOIN cnpj.empresas e ON est.cnpj_basico = e.cnpj_basico
WHERE est.correio_eletronico ILIKE :email
  AND est.identificador_matriz_filial = '1';
-- Índice GIN: criar idx_estab_email
```

### 5. **Busca por Telefone**
```sql
SELECT * FROM cnpj.estabelecimentos est
INNER JOIN cnpj.empresas e ON est.cnpj_basico = e.cnpj_basico
WHERE CONCAT(est.ddd_1, est.telefone_1) LIKE :telefone_sem_formatacao
  AND est.identificador_matriz_filial = '1';
-- Índice B-tree: criar idx_estab_telefone
```

### 6. **Busca por Nome do Sócio**
```sql
SELECT DISTINCT e.*, est.* 
FROM cnpj.socios s
INNER JOIN cnpj.empresas e ON s.cnpj_basico = e.cnpj_basico
INNER JOIN cnpj.estabelecimentos est 
  ON e.cnpj_basico = est.cnpj_basico
WHERE s.nome_socio ILIKE :nome_socio
  AND est.identificador_matriz_filial = '1';
-- Índice GIN: idx_socios_nome
```

### 7. **Busca por CEP**
```sql
SELECT * FROM cnpj.estabelecimentos est
INNER JOIN cnpj.empresas e ON est.cnpj_basico = e.cnpj_basico
WHERE est.cep = :cep_sem_formatacao
  AND est.identificador_matriz_filial = '1';
-- Índice B-tree: criar idx_estab_cep
```

---

## 🎛️ 8 Filtros → SQL WHERE

| Frontend Filter | Backend Column | SQL Condition |
|----------------|---------------|---------------|
| `uf` (select) | `est.uf` | `= :uf` |
| `municipio` (select) | `est.municipio` | `= :codigo_municipio` |
| `situacao` (select) | `est.situacao_cadastral` | `= :situacao` |
| `porte` (select) | `e.porte_empresa` | `= :porte` |
| `capitalMinimo` (number) | `e.capital_social` | `>= :capital_minimo` |
| `capitalMaximo` (number) | `e.capital_social` | `<= :capital_maximo` |
| `dataAberturaInicio` (date) | `est.data_inicio_atividade` | `>= :data_inicio` |
| `dataAberturaFim` (date) | `est.data_inicio_atividade` | `<= :data_fim` |

**Exemplo SQL Completo:**
```sql
SELECT e.*, est.* 
FROM cnpj.empresas e
INNER JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
WHERE est.identificador_matriz_filial = '1'
  AND (:uf IS NULL OR est.uf = :uf)
  AND (:municipio IS NULL OR est.municipio = :municipio)
  AND (:situacao IS NULL OR est.situacao_cadastral = :situacao)
  AND (:porte IS NULL OR e.porte_empresa = :porte)
  AND (:capital_minimo IS NULL OR e.capital_social >= :capital_minimo)
  AND (:capital_maximo IS NULL OR e.capital_social <= :capital_maximo)
  AND (:data_inicio IS NULL OR est.data_inicio_atividade >= :data_inicio)
  AND (:data_fim IS NULL OR est.data_inicio_atividade <= :data_fim)
LIMIT :limit OFFSET :offset;
```

---

## 📋 Enums e Mapeamentos

### Porte da Empresa
```python
PORTE_EMPRESA = {
    "00": "Não Informado",
    "01": "Microempresa",
    "03": "Empresa de Pequeno Porte",
    "05": "Demais"
}
```

### Situação Cadastral
```python
SITUACAO_CADASTRAL = {
    "01": "Nula",
    "02": "Ativa",
    "03": "Suspensa",
    "04": "Inapta",
    "08": "Baixada"
}
```

### Identificador Matriz/Filial
```python
TIPO_ESTABELECIMENTO = {
    "1": "Matriz",
    "2": "Filial"
}
```

---

## 🚀 Índices Necessários (Backend)

### ✅ Índices JÁ EXISTENTES
- `idx_empresas_cnpj_basico` - busca por CNPJ (empresas)
- `idx_empresas_razao` - busca textual por razão social (GIN)
- `idx_empresas_capital_social` - filtro por capital
- `idx_empresas_porte` - filtro por porte
- `idx_estab_cnpj_completo` - busca por CNPJ completo
- `idx_estab_cnae` - busca por segmento
- `idx_estab_uf` - filtro por UF
- `idx_estab_municipio` - filtro por município
- `idx_estab_situacao` - filtro por situação
- `idx_estab_nome_fantasia` - busca textual por nome fantasia (GIN)
- `idx_socios_cnpj` - relação empresa-sócio
- `idx_socios_nome` - busca textual por nome sócio (GIN)

### ❌ Índices FALTANDO (Criar)
```sql
-- Email search
CREATE INDEX idx_estab_email_gin 
ON cnpj.estabelecimentos USING gin (correio_eletronico gin_trgm_ops);

-- Telefone search (concatenado)
CREATE INDEX idx_estab_telefone_concat 
ON cnpj.estabelecimentos ((ddd_1 || telefone_1));

-- CEP search
CREATE INDEX idx_estab_cep 
ON cnpj.estabelecimentos (cep);

-- Data de abertura range filter
CREATE INDEX idx_estab_data_atividade 
ON cnpj.estabelecimentos (data_inicio_atividade);

-- Capital social range filter (já existe, mas verificar performance)
-- idx_empresas_capital_social

-- Composite index for common filter combinations
CREATE INDEX idx_estab_uf_situacao 
ON cnpj.estabelecimentos (uf, situacao_cadastral);

CREATE INDEX idx_empresas_porte_capital 
ON cnpj.empresas (porte_empresa, capital_social);
```

---

## 🔗 Exemplo de Query Completa (SQLAlchemy)

```python
from sqlalchemy import select, func
from sqlalchemy.orm import aliased

def buscar_empresas(
    tipo_busca: str,
    termo_busca: str,
    filtros: dict,
    page: int = 1,
    limit: int = 20
):
    """
    tipo_busca: 'cnpj' | 'razaoSocial' | 'segmento' | 'email' | 'telefone' | 'nomeSocio' | 'cep'
    filtros: {uf, municipio, situacao, porte, capitalMinimo, capitalMaximo, dataAberturaInicio, dataAberturaFim}
    """
    
    query = (
        select(Empresa, Estabelecimento)
        .join(Estabelecimento, Empresa.cnpj_basico == Estabelecimento.cnpj_basico)
        .where(Estabelecimento.identificador_matriz_filial == '1')
    )
    
    # Aplicar tipo de busca
    if tipo_busca == 'cnpj':
        cnpj_sem_formatacao = termo_busca.replace('.', '').replace('/', '').replace('-', '')
        query = query.where(
            func.concat(
                Estabelecimento.cnpj_basico,
                Estabelecimento.cnpj_ordem,
                Estabelecimento.cnpj_dv
            ) == cnpj_sem_formatacao
        )
    elif tipo_busca == 'razaoSocial':
        query = query.where(Empresa.razao_social.ilike(f'%{termo_busca}%'))
    elif tipo_busca == 'segmento':
        query = query.where(Estabelecimento.cnae_fiscal_principal == termo_busca)
    elif tipo_busca == 'email':
        query = query.where(Estabelecimento.correio_eletronico.ilike(f'%{termo_busca}%'))
    elif tipo_busca == 'telefone':
        telefone_sem_formatacao = termo_busca.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
        query = query.where(
            func.concat(Estabelecimento.ddd_1, Estabelecimento.telefone_1).like(f'%{telefone_sem_formatacao}%')
        )
    elif tipo_busca == 'nomeSocio':
        query = query.join(Socio, Empresa.cnpj_basico == Socio.cnpj_basico)
        query = query.where(Socio.nome_socio.ilike(f'%{termo_busca}%'))
    elif tipo_busca == 'cep':
        cep_sem_formatacao = termo_busca.replace('-', '')
        query = query.where(Estabelecimento.cep == cep_sem_formatacao)
    
    # Aplicar filtros opcionais
    if filtros.get('uf'):
        query = query.where(Estabelecimento.uf == filtros['uf'])
    if filtros.get('municipio'):
        query = query.where(Estabelecimento.municipio == filtros['municipio'])
    if filtros.get('situacao'):
        query = query.where(Estabelecimento.situacao_cadastral == filtros['situacao'])
    if filtros.get('porte'):
        query = query.where(Empresa.porte_empresa == filtros['porte'])
    if filtros.get('capitalMinimo'):
        query = query.where(Empresa.capital_social >= filtros['capitalMinimo'])
    if filtros.get('capitalMaximo'):
        query = query.where(Empresa.capital_social <= filtros['capitalMaximo'])
    if filtros.get('dataAberturaInicio'):
        query = query.where(Estabelecimento.data_inicio_atividade >= filtros['dataAberturaInicio'])
    if filtros.get('dataAberturaFim'):
        query = query.where(Estabelecimento.data_inicio_atividade <= filtros['dataAberturaFim'])
    
    # Paginação
    offset = (page - 1) * limit
    query = query.limit(limit).offset(offset)
    
    return query
```

---

## 📝 Notas Importantes

1. **CNPJ sem formatação:** Sempre remover `.` `/` `-` antes de comparar
2. **Matriz apenas:** Filtrar sempre `identificador_matriz_filial = '1'`
3. **CNAEs Secundários:** Campo `cnae_fiscal_secundaria` é TEXT com vírgulas (ex: `1234567,2345678,3456789`)
4. **Telefone concatenado:** `ddd_1 + telefone_1` (sem parênteses/hífen no banco)
5. **Enums:** Criar arquivos Python com dicionários para mapear códigos
6. **Performance:** Queries com ILIKE devem usar índices GIN com pg_trgm
7. **Cache Redis:** Implementar TTL 24h para buscas diretas por CNPJ
8. **Lazy Loading:** Carregar sócios apenas quando necessário (endpoint separado ou JOIN condicional)

---

## ✅ Checklist de Implementação

- [x] Descobrir estrutura real do banco
- [x] Mapear todos os campos frontend → backend
- [x] Documentar 7 tipos de busca
- [x] Documentar 8 filtros
- [x] Identificar índices existentes
- [x] Listar índices faltantes
- [ ] Criar script SQL de índices faltantes
- [ ] Criar enums Python (porte, situação, etc)
- [ ] Implementar models SQLAlchemy
- [ ] Implementar schemas Pydantic
- [ ] Implementar CRUD functions
- [ ] Criar endpoints FastAPI
- [ ] Implementar cache Redis
- [ ] Testes de performance

---

**Próxima Issue:** 2.1.1 - Criar Models SQLAlchemy com `__table_args__ = {'schema': 'cnpj'}`
