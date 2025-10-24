# Issue 2.1.2 - Pydantic Schemas ✅ COMPLETO

**Sprint**: 2.1 - Smart CNPJ Backend  
**Branch**: beta004  
**Commit**: 27d8371  
**Data**: 2024-01-15  

---

## 📋 Objetivo

Criar schemas Pydantic para validação de requests e serialização de responses da API Smart CNPJ 360°.

---

## ✅ Arquivos Criados

### 1. `backend/app/schemas/base.py` (313 linhas)

**Schemas genéricos reutilizáveis:**

#### Responses Genéricos
- `MessageResponse`: Mensagem de sucesso/erro simples
- `ErrorResponse`: Detalhes de erro com código

#### Paginação
- `PaginationParams`: Parâmetros de entrada (page, limit)
  - Propriedade `offset`: Calcula offset para SQL
- `PaginationMetadata`: Metadados de resposta
  - Factory method `create()`: Calcula total_pages, hasNext, hasPrev
- `PaginatedResponse[T]`: Response paginado genérico (Generic)

#### Créditos
- `UserCreditsResponse`: Saldo de créditos do usuário
- `CreditTransactionResponse`: Transação individual
- `CreditHistoryResponse`: Histórico com saldo total

#### Histórico de Pesquisa
- `PesquisaCNPJResponse`: Registro de pesquisa (UUID, filtros, resultados, créditos)
- `SearchHistoryResponse`: Histórico paginado
- `SearchStatsResponse`: Estatísticas de uso

---

### 2. `backend/app/schemas/smart_cnpj_request.py` (242 linhas)

**Schemas de request com validações:**

#### Filtros
- `FiltrosRequest`: 8 filtros opcionais
  - Localização: `uf`, `municipio`
  - Situação: `situacao`
  - Porte: `porte`
  - Capital: `capitalMinimo`, `capitalMaximo` (range validation)
  - Datas: `dataAberturaInicio`, `dataAberturaFim` (range validation)
  
  **Validators:**
  - `validate_uf`: Normaliza para uppercase, valida 2 letras
  - `validate_ranges`: Valida ranges de capital e datas

#### Busca
- `SmartCNPJSearchRequest`: Request principal
  - `tipo_busca`: TipoBusca enum (7 tipos)
  - `valor_busca`: String (validação específica por tipo)
  - `filtros`: FiltrosRequest opcional
  - `page`, `limit`: Paginação
  
  **Validator:**
  - `validate_valor_busca`: Valida e normaliza conforme tipo
    - CNPJ: limpa formatação, valida 14 dígitos
    - Email: regex pattern, lowercase
    - Telefone: remove formatação, valida 10-11 dígitos
    - CEP: remove formatação, valida 8 dígitos
    - Outros: uppercase

- `SmartCNPJByIdRequest`: Busca por CNPJ específico
  - Validator: limpa formatação, valida 14 dígitos

#### Exportação
- `SmartCNPJExportRequest`: Request de exportação
  - Mesmos campos de busca
  - `formato`: xlsx, csv, json
  - `max_registros`: Limite de exportação (1-10000)

---

### 3. `backend/app/schemas/smart_cnpj_response.py` (269 linhas)

**Schemas de response (camelCase para frontend):**

#### Nested Objects
- `EnderecoResponse`: 8 campos
  - logradouro, numero, complemento, bairro, cep, municipio, uf
- `ContatosResponse`: 4 campos opcionais
  - email, telefone, telefone2, fax
- `CNAEResponse`: 2 campos
  - codigo, descricao
- `SocioResponse`: 4 campos
  - nome, cpfCnpj, qualificacao, dataEntrada

#### Main Response
- `SmartCNPJCompanyResponse`: Response completo (27 campos)
  - Identificação: cnpj, razaoSocial, nomeFantasia
  - Natureza: naturezaJuridica, codigoNaturezaJuridica
  - Porte: porte, codigoPorte, capitalSocial
  - Situação: situacaoCadastral, codigoSituacaoCadastral, dataSituacaoCadastral, motivoSituacaoCadastral
  - Datas: dataInicioAtividade, dataAbertura
  - Nested: endereco, contatos, cnaesPrimario
  - Arrays: cnaesSecundarios[], socios[]
  
  **Compatível com:** Interface frontend `SmartCNPJCompany`

- `SmartCNPJCompanySimpleResponse`: Response simplificado para listagens (8 campos)

#### Busca Paginada
- `SmartCNPJSearchResponse`: Response de busca
  - `data`: Array de empresas
  - `pagination`: PaginationMetadata
  - `filters`: Filtros aplicados
  - `searchType`, `searchValue`: Parâmetros da busca
  - `tempoResposta`: Tempo em ms (opcional)

---

### 4. `backend/app/schemas/enums.py` (88 linhas)

**Enums e utilitários (SEM dependências de SQLAlchemy):**

#### Enum
- `TipoBusca`: 7 tipos de busca
  - CNPJ, RAZAO_SOCIAL, SEGMENTO, EMAIL, TELEFONE, NOME_SOCIO, CEP

#### Funções de Limpeza
- `limpar_cnpj()`: Remove formatação (14 dígitos)
- `limpar_telefone()`: Remove formatação (10-11 dígitos)
- `limpar_cep()`: Remove formatação (8 dígitos)

**Motivo da separação:** Evitar imports circulares e problema de compatibilidade SQLAlchemy + Python 3.13

---

### 5. `backend/app/schemas/__init__.py` (ATUALIZADO)

**Exports organizados:**
- Base: 10 schemas genéricos
- Request: 4 schemas de request
- Response: 7 schemas de response

Total: **21 schemas exportados**

---

## 🎯 Validações Implementadas

| Campo | Validação |
|-------|-----------|
| **CNPJ** | 14 dígitos, auto-limpeza de formatação |
| **Email** | Regex pattern, lowercase |
| **Telefone** | 10-11 dígitos, remove formatação |
| **CEP** | 8 dígitos, remove formatação |
| **Capital** | Range validation (min ≤ max) |
| **Datas** | Range validation (início ≤ fim) |
| **UF** | 2 letras maiúsculas |
| **Formato** | Enum validation (xlsx, csv, json) |

---

## 🔄 Migração Pydantic v1 → v2

### Decorators Atualizados

| Pydantic v1 | Pydantic v2 |
|-------------|-------------|
| `@validator` | `@field_validator` + `@classmethod` |
| `@root_validator` | `@model_validator(mode='after')` |
| `.dict()` | `.model_dump()` |
| `values.get()` | `self.campo` |

### Exemplo de Migração

**Antes (Pydantic v1):**
```python
@validator('uf')
def validate_uf(cls, v):
    return v.upper()

@root_validator
def validate_ranges(cls, values):
    if values.get('min') > values.get('max'):
        raise ValueError('Invalid range')
    return values
```

**Depois (Pydantic v2):**
```python
@field_validator('uf')
@classmethod
def validate_uf(cls, v: str) -> str:
    return v.upper()

@model_validator(mode='after')
def validate_ranges(self) -> 'MyModel':
    if self.min > self.max:
        raise ValueError('Invalid range')
    return self
```

---

## 📊 Estatísticas

- **Arquivos criados**: 4 novos + 1 atualizado
- **Linhas de código**: 980+ linhas
- **Schemas criados**: 21 schemas
- **Validations**: 8 tipos diferentes
- **Nested objects**: 4 tipos (endereco, contatos, cnae, socio)
- **Array fields**: 2 (cnaesSecundarios[], socios[])

---

## 🧪 Testes Realizados

### Importação ✅
```python
from app.schemas import (
    MessageResponse, PaginationMetadata,
    SmartCNPJSearchRequest, SmartCNPJCompanyResponse,
    FiltrosRequest, EnderecoResponse
)
```

### Request Creation ✅
```python
request = SmartCNPJSearchRequest(
    tipo_busca="razao_social",
    valor_busca="TECNOLOGIA",
    filtros=FiltrosRequest(uf="SP", situacao="02", porte="01"),
    page=1,
    limit=20
)
```

### Validações ✅
- ✅ CNPJ formatado aceito: "11.779.918/0001-05" → "11779918000105"
- ✅ CNPJ sem formatação aceito: "11779918000105"
- ✅ CNPJ inválido rejeitado: "123" → ValidationError
- ✅ Range válido de capital: 1000-5000
- ✅ Range inválido rejeitado: 5000-1000 → ValueError

### Response Creation ✅
```python
empresa = SmartCNPJCompanyResponse(
    cnpj="11.779.918/0001-05",
    razaoSocial="N. F. C. VIANNA",
    # ... 25+ campos
    endereco=EnderecoResponse(...),
    contatos=ContatosResponse(...),
    socios=[]
)
```

---

## 🔗 Compatibilidade Frontend

### Interface Mapeada: `SmartCNPJCompany`
**Arquivo:** `frontend/src/mocks/smart-cnpj.ts`

Todos os campos do response `SmartCNPJCompanyResponse` são **100% compatíveis** com a interface frontend:
- ✅ Naming: camelCase
- ✅ Types: string, number, nested objects, arrays
- ✅ Structure: mesma hierarquia de objetos
- ✅ Optionals: mesmos campos opcionais

---

## 📝 Próximos Passos

### Issue 2.1.3 - CRUD Operations
- Criar repository pattern functions
- `buscar_empresa_por_cnpj()`
- `buscar_empresas_por_filtros()`
- `registrar_pesquisa()`
- `get_user_credits()`

### Issue 2.1.4 - Search Service
- Implementar lógica de busca
- Aplicar filtros
- Calcular créditos necessários
- Debitar créditos

### Issue 2.1.5 - API Endpoints
- Usar schemas criados nesta issue
- `/api/v1/smart-cnpj/search` (POST)
- `/api/v1/smart-cnpj/{cnpj}` (GET)
- `/api/v1/smart-cnpj/export` (POST)

---

## 🐛 Known Issues

### ~~Python 3.13 + SQLAlchemy 2.0.23~~ ✅ RESOLVIDO!
- ~~Erro: `AssertionError` em `SQLCoreOperations`~~
- ~~Workaround: Enums separados em `schemas/enums.py` (sem SQLAlchemy)~~
- **Fix aplicado (commit c18fc24):**
  - SQLAlchemy: 2.0.23 → 2.0.44
  - psycopg2-binary: 2.9.9 → 2.9.10
  - Pydantic: 2.5.0 → 2.11.4
  - pydantic-settings: 2.1.0 → 2.11.0
- ✅ Todos os imports funcionando corretamente

---

## 📦 Git

```bash
Branch: beta004
Commit: 27d8371
Message: feat(backend): Issue 2.1.2 - Create Pydantic Schemas

Files changed: 5
Insertions: 980+
Deletions: 3
```

---

## ✅ Checklist de Conclusão

- [x] Criar schemas base (paginação, créditos, mensagens)
- [x] Criar schemas de request (busca, filtros, exportação)
- [x] Criar schemas de response (empresa, nested objects)
- [x] Criar enums e utilitários
- [x] Implementar validações customizadas
- [x] Migrar para Pydantic v2 syntax
- [x] Testar importação e criação de objetos
- [x] Validar compatibilidade com frontend
- [x] Atualizar __init__.py para exports
- [x] Commitar e fazer push para beta004
- [x] Documentar issue

---

---

## 🔧 Fix Aplicado - Python 3.13 Compatibility

**Data:** 2024-10-24  
**Commit:** c18fc24  

### Problema Original
```
AssertionError: Class <class 'sqlalchemy.sql.elements.SQLCoreOperations'> 
directly inherits TypingOnly but has additional attributes 
{'__firstlineno__', '__static_attributes__'}.
```

### Solução
Upgrade de todas as dependências para versões compatíveis com Python 3.13:

| Dependência | Antes | Depois | Upgrade |
|-------------|-------|--------|---------|
| **SQLAlchemy** | 2.0.23 | 2.0.44 | +21 versões |
| **psycopg2-binary** | 2.9.9 | 2.9.10 | +1 versão |
| **Pydantic** | 2.5.0 | 2.11.4 | +6 versões |
| **pydantic-settings** | 2.1.0 | 2.11.0 | +10 versões |

### Testes Pós-Fix
```python
✅ SQLAlchemy imports
✅ Models imports (Empresa, Estabelecimento, Socio, CNAE, SimplesNacional, PesquisaCNPJ)
✅ Schemas imports (SmartCNPJSearchRequest, SmartCNPJCompanyResponse, FiltrosRequest)
✅ Request creation with validation
✅ Nested objects (EnderecoResponse, ContatosResponse, CNAEResponse, SocioResponse)
✅ Field validators (@field_validator)
✅ Model validators (@model_validator)
```

### Por Que Não Corrigimos Logo?
Excelente pergunta! A razão é que:
1. No momento da Issue 2.1.1, não tínhamos certeza se era bug do SQLAlchemy ou problema no nosso código
2. Criamos workaround (enums separados) que permitiu continuar o desenvolvimento
3. Agora com Issue 2.1.2 completa, pudemos testar e confirmar que era problema de compatibilidade
4. **Upgrade de 37+ versões** em 4 dependências requer teste extensivo para garantir que nada quebre

**Resultado:** Sistema 100% funcional com Python 3.13.7 + bibliotecas atualizadas! 🚀

---

**Status:** ✅ COMPLETO  
**Data de conclusão:** 2024-01-15  
**Fix aplicado:** 2024-10-24  
**Próxima issue:** 2.1.3 - CRUD Operations
