# 🚀 Sprint 2.1 - Smart CNPJ 360° Backend

**Status**: 🟡 Planejada  
**Prioridade**: 🔴 Alta  
**Início**: 23/10/2025  
**Prazo Estimado**: 4 dias úteis  
**Responsável**: Backend Team

---

## 📋 Visão Geral

Desenvolvimento do backend completo para o produto **Smart CNPJ 360°**, utilizando **EXCLUSIVAMENTE** a base de dados local PostgreSQL (100M+ registros). 

**Escopo:** Consultas inteligentes na base CNPJ local - **SEM integrações externas**.

### ✅ Pré-requisitos Atendidos
- ✅ Tabela CNPJ Brasil no PostgreSQL (100M+ registros)
- ✅ Base do backend FastAPI configurada
- ✅ PostgreSQL rodando (base completa)
- ✅ Redis configurado para cache

### 🚫 Fora do Escopo
- ❌ APIs externas (Predictus, etc.) - ficam para sprints futuras
- ❌ Sistema de autenticação JWT - será implementado na Delivery 3
- ❌ Enriquecimento de dados externos - será implementado depois

---

## 🎯 Objetivos da Sprint

1. **Mapear tabela CNPJ existente** com SQLAlchemy (ORM)
2. **Criar schemas Pydantic** para validação e resposta
3. **Implementar CRUD otimizado** para consultas na base local
4. **Desenvolver serviço de busca avançada** (7 tipos + 8 filtros)
5. **Criar endpoints REST API** para o produto Smart CNPJ
6. **Sistema de cache Redis** para performance
7. **Sistema de créditos** (mock user_id=1)
8. **Exportação CSV/JSON** simples

---

## 📦 Issues da Sprint

### **Issue 2.1.0** - Análise e Mapeamento Frontend ↔ Backend
**Prioridade**: 🔴 CRÍTICA (FAZER PRIMEIRO!)  
**Estimativa**: 2 horas  
**Status**: ✅ CONCLUÍDA

#### Descrição
Analisar o frontend existente e mapear campos/estruturas para o backend. Criar documento de DE/PARA e planejar índices de performance.

#### ✅ RESULTADOS COMPLETOS

**Estrutura Real Descoberta no PostgreSQL:**
- **Schema:** `cnpj` (separado do `public`)
- **Tabelas:** 10 tabelas (empresas, estabelecimentos, socios, cnaes, naturezas_juridicas, municipios, paises, qualificacoes_socios, motivos_situacao_cadastral, simples)
- **Volume:** 64M empresas, 68M estabelecimentos (matriz+filiais), 26M sócios, 2.7k CNAEs
- **Relacionamentos:** empresas 1:N estabelecimentos, empresas 1:N socios

**Documentos Criados:**
- ✅ `docs/DE_PARA_FRONTEND_BACKEND.md` - Mapeamento completo frontend↔backend
- ✅ `backend/scripts/02_create_indexes.sql` - Ajustado com índices reais descobertos
- ✅ `backend/scripts/03_create_support_tables.sql` - Tabelas de apoio (schema public)

**Índices Já Existentes (Performance Base):**
- ✅ 7 índices em `empresas` (cnpj_basico, razao_social GIN, capital_social, porte, natureza)
- ✅ 8 índices em `estabelecimentos` (cnpj_completo, cnae, uf, municipio, situacao, matriz/filial, nome_fantasia GIN)
- ✅ 4 índices em `socios` (id PK, cnpj_basico, cpf_cnpj, nome GIN)

**Índices Faltantes Identificados:**
- ❌ Email GIN (para ILIKE)
- ❌ Telefone concatenado (ddd_1 || telefone_1)
- ❌ CEP
- ❌ Data início atividade (range queries)
- ❌ Compostos: uf+situacao, porte+capital, situacao+data
- ❌ Parciais: matriz_ativa (otimização 90% queries)

#### Tarefas Frontend → Backend

##### **1. Análise da Interface SmartCNPJCompany (Frontend)**
```typescript
// frontend/src/mocks/smart-cnpj.ts
interface SmartCNPJCompany {
  id: string                    // UUID gerado no backend
  cnpj: string                  // "00.000.000/0000-00" formatado
  razaoSocial: string           // 
  nomeFantasia: string          //
  situacaoCadastral: enum       // 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA'
  tipo: enum                    // 'MATRIZ' | 'FILIAL'
  porte: enum                   // 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE'
  capitalSocial: number         //
  isMEI: boolean                // Calculado: porte === 'MEI'
  isSimplesNacional: boolean    //
  formaTributacao: enum         // 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'
  dataAbertura: string          // YYYY-MM-DD
  cnaesPrimario: object         // { codigo, descricao }
  cnaesSecundarios: array       // [{ codigo, descricao }]
  endereco: object              // { cep, logradouro, numero, complemento?, bairro, municipio, uf }
  contatos: object              // { email?, telefone? }
  socios: array                 // [{ nome, cpfCnpj, qualificacao, dataEntrada }]
}
```

##### **2. Mapeamento Tabela CNPJ (PostgreSQL) ↔ Frontend**

**Descobrir estrutura real da tabela:**
- [ ] Conectar no PostgreSQL e rodar: `\d nome_da_tabela_cnpj`
- [ ] Listar todas as colunas e tipos
- [ ] Verificar índices existentes: `\d+ nome_da_tabela_cnpj`

**Mapeamento esperado (VERIFICAR NO BANCO!):**
```
TABELA CNPJ (PostgreSQL)          →  Model Empresa (SQLAlchemy)      →  Frontend
================================     ================================    =====================
cnpj (varchar/text)               →  cnpj: str                       →  cnpj (formatado)
razao_social (text)               →  razao_social: str               →  razaoSocial
nome_fantasia (text)              →  nome_fantasia: str              →  nomeFantasia
situacao_cadastral (varchar)      →  situacao_cadastral: str         →  situacaoCadastral
tipo_estabelecimento (char)       →  tipo: str (M/F)                 →  tipo (MATRIZ/FILIAL)
porte_empresa (varchar)           →  porte: str                      →  porte
capital_social (numeric)          →  capital_social: float           →  capitalSocial
opcao_simples (bool/char)         →  opcao_simples: bool             →  isSimplesNacional
opcao_mei (bool/char)             →  opcao_mei: bool                 →  isMEI
data_inicio_atividade (date)      →  data_abertura: date             →  dataAbertura
cnae_fiscal_principal (varchar)   →  cnae_principal: str             →  cnaesPrimario.codigo
cnae_fiscal_secundaria (text)     →  cnaes_secundarios: str          →  cnaesSecundarios[]
logradouro (text)                 →  logradouro: str                 →  endereco.logradouro
numero (varchar)                  →  numero: str                     →  endereco.numero
complemento (text)                →  complemento: str                →  endereco.complemento
bairro (text)                     →  bairro: str                     →  endereco.bairro
cep (varchar)                     →  cep: str                        →  endereco.cep
municipio (text)                  →  municipio: str                  →  endereco.municipio
uf (char(2))                      →  uf: str                         →  endereco.uf
ddd_telefone_1 (varchar)          →  telefone1: str                  →  contatos.telefone
email (varchar)                   →  email: str                      →  contatos.email
```

##### **3. Índices de Performance (CRÍTICO!)**

**Índices que DEVEM existir para 7 tipos de busca:**
```sql
-- Busca 1: Por CNPJ (provavelmente já existe - PRIMARY KEY ou UNIQUE)
CREATE INDEX IF NOT EXISTS idx_cnpj ON empresas(cnpj);

-- Busca 2: Por Razão Social (ILIKE - usar trigram para performance)
CREATE INDEX IF NOT EXISTS idx_razao_social_gin ON empresas USING gin(razao_social gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_nome_fantasia_gin ON empresas USING gin(nome_fantasia gin_trgm_ops);

-- Busca 3: Por CNAE (LIKE)
CREATE INDEX IF NOT EXISTS idx_cnae_principal ON empresas(cnae_fiscal_principal);

-- Busca 4: Por Email (ILIKE)
CREATE INDEX IF NOT EXISTS idx_email_gin ON empresas USING gin(email gin_trgm_ops);

-- Busca 5: Por Telefone (LIKE)
CREATE INDEX IF NOT EXISTS idx_telefone ON empresas(ddd_telefone_1);

-- Busca 6: Por Nome Sócio (SKIP por enquanto - precisa tabela socios)
-- TODO: Criar tabela socios se não existir

-- Busca 7: Por CEP (LIKE)
CREATE INDEX IF NOT EXISTS idx_cep ON empresas(cep);

-- Índices para FILTROS (8 filtros):
CREATE INDEX IF NOT EXISTS idx_situacao_cadastral ON empresas(situacao_cadastral);
CREATE INDEX IF NOT EXISTS idx_uf_municipio ON empresas(uf, municipio); -- Composto
CREATE INDEX IF NOT EXISTS idx_porte ON empresas(porte_empresa);
CREATE INDEX IF NOT EXISTS idx_data_abertura ON empresas(data_inicio_atividade);
CREATE INDEX IF NOT EXISTS idx_opcao_simples ON empresas(opcao_simples);
CREATE INDEX IF NOT EXISTS idx_opcao_mei ON empresas(opcao_mei);

-- Habilitar extensão pg_trgm para ILIKE performático:
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

##### **4. Tabelas de Apoio (Criar no banco `basecerta`)**

```sql
-- Tabela: usuarios (se não existe)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    saldo_creditos INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: pesquisa_cnpj (histórico de buscas)
CREATE TABLE pesquisa_cnpj (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES usuarios(id),
    cnpj VARCHAR(18),  -- Pode ser null se busca não é por CNPJ
    tipo_busca VARCHAR(20) NOT NULL, -- 'cnpj', 'razao_social', etc
    valor_busca TEXT NOT NULL,
    filtros_aplicados JSONB,  -- JSON com os 8 filtros
    total_resultados INTEGER,
    creditos_usados INTEGER DEFAULT 5,
    tempo_resposta_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_pesquisa_user (user_id),
    INDEX idx_pesquisa_cnpj (cnpj),
    INDEX idx_pesquisa_created (created_at DESC),
    INDEX idx_pesquisa_tipo (tipo_busca)
);

-- Tabela: transacoes_credito
CREATE TABLE transacoes_credito (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(20) NOT NULL, -- 'COMPRA', 'USO', 'ESTORNO', 'BONUS'
    quantidade INTEGER NOT NULL,
    saldo_anterior INTEGER NOT NULL,
    saldo_posterior INTEGER NOT NULL,
    descricao TEXT,
    pesquisa_id UUID REFERENCES pesquisa_cnpj(id),  -- Se foi uso em pesquisa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_transacao_user (user_id),
    INDEX idx_transacao_created (created_at DESC)
);

-- Tabela: planos
CREATE TABLE planos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    creditos_mensais INTEGER NOT NULL,
    preco_mensal NUMERIC(10,2) NOT NULL,
    is_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: assinaturas
CREATE TABLE assinaturas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id),
    plano_id INTEGER REFERENCES planos(id),
    status VARCHAR(20) NOT NULL, -- 'ATIVA', 'CANCELADA', 'SUSPENSA', 'EXPIRADA'
    data_inicio DATE NOT NULL,
    data_fim DATE,
    preco NUMERIC(10,2) NOT NULL,
    gateway_subscription_id VARCHAR(255),  -- ID na Asaas/Stripe
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_assinatura_user (user_id),
    INDEX idx_assinatura_status (status)
);

-- Tabela: cnae_descricoes (para trazer descrições dos CNAEs)
CREATE TABLE cnae_descricoes (
    codigo VARCHAR(10) PRIMARY KEY,  -- "6201-5/00"
    descricao TEXT NOT NULL,
    secao VARCHAR(1),  -- A, B, C, etc
    divisao VARCHAR(2),
    grupo VARCHAR(3),
    classe VARCHAR(5),
    subclasse VARCHAR(10)
);
```

##### **5. Documento DE/PARA Final**

- [ ] Criar `docs/DE_PARA_FRONTEND_BACKEND.md`
- [ ] Mapear TODOS os campos do frontend
- [ ] Listar transformações necessárias (ex: formatação CNPJ, conversão enum)
- [ ] Listar campos calculados (ex: isMEI = porte === 'MEI')
- [ ] Definir nomenclatura: snake_case (banco) → camelCase (frontend)

#### Entregáveis
- `docs/DE_PARA_FRONTEND_BACKEND.md` - Mapeamento completo
- `backend/scripts/create_indexes.sql` - Script de índices
- `backend/scripts/create_support_tables.sql` - Tabelas de apoio
- Documento com nome REAL da tabela CNPJ no PostgreSQL

#### Critérios de Aceite
- ✅ Estrutura real da tabela CNPJ documentada
- ✅ Todos os campos frontend mapeados para backend
- ✅ Scripts SQL de índices criados
- ✅ Scripts SQL de tabelas de apoio criados
- ✅ Extensão pg_trgm habilitada
- ✅ Índices testados (EXPLAIN ANALYZE)

---

### **Issue 2.1.1** - Modelagem de Dados CNPJ Local
**Prioridade**: 🔴 Crítica  
**Estimativa**: 3 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.0 (OBRIGATÓRIO!)

#### Descrição
Criar models SQLAlchemy baseados no mapeamento da Issue 2.1.0.

#### Tarefas

- [ ] **Model `Empresa`** - Mapeamento READ-ONLY da tabela existente
  - Usar nome real da tabela descoberto na Issue 2.1.0
  - Usar `__table_args__ = {'extend_existing': True, 'schema': 'public'}`
  - Mapear campos conforme documento DE/PARA
  - Exemplo estrutura:
    ```python
    class Empresa(Base):
        __tablename__ = 'nome_real_da_tabela'  # Descoberto na 2.1.0
        __table_args__ = {'extend_existing': True}
        
        # Campos base (ajustar conforme tabela real)
        cnpj = Column(String(18), primary_key=True)
        razao_social = Column(Text)
        nome_fantasia = Column(Text, nullable=True)
        situacao_cadastral = Column(String(20))
        tipo = Column(String(1))  # M=Matriz, F=Filial
        porte_empresa = Column(String(20))
        capital_social = Column(Numeric(15, 2))
        opcao_simples = Column(Boolean)
        opcao_mei = Column(Boolean)
        data_abertura = Column(Date)
        cnae_fiscal_principal = Column(String(10))
        cnae_fiscal_secundaria = Column(Text)  # Separado por vírgula
        
        # Endereço
        logradouro = Column(Text)
        numero = Column(String(10))
        complemento = Column(Text)
        bairro = Column(Text)
        cep = Column(String(10))
        municipio = Column(Text)
        uf = Column(String(2))
        
        # Contato
        telefone1 = Column(String(20))
        email = Column(String(255))
        
        # Métodos helper
        def to_dict(self) -> dict:
            """Converte para dict compatível com frontend"""
            pass
    ```

- [ ] **Model `Usuario`** - Se não existe
  - Campos: id, email, nome, saldo_creditos
  - Para usar user_id=1 por enquanto

- [ ] **Model `PesquisaCNPJ`** - Histórico de consultas
  - Campos conforme Issue 2.1.0
  - FK para Usuario
  - JSONB para filtros

- [ ] **Model `TransacaoCredito`** - Movimentações de crédito
  - Campos conforme Issue 2.1.0

- [ ] **Migration Alembic** - Criar tabelas de apoio
  - Executar script da Issue 2.1.0 (`create_support_tables.sql`)
  - Criar apenas: usuarios, pesquisa_cnpj, transacoes_credito
  - **NÃO** alterar tabela Empresa (READ-ONLY)

#### Entregáveis
- `backend/app/models/empresa.py`
- `backend/app/models/usuario.py`
- `backend/app/models/pesquisa_cnpj.py`
- `backend/app/models/credito.py`
- `backend/alembic/versions/xxx_create_support_tables.py`

#### Critérios de Aceite
- ✅ Model Empresa mapeia tabela real (descoberta na 2.1.0)
- ✅ Tabelas de apoio criadas
- ✅ Migration executa sem erros
- ✅ Seeds: criar user_id=1 para testes
- ✅ Documentação inline

---

### **Issue 2.1.2** - Schemas Pydantic Smart CNPJ
**Prioridade**: 🔴 Crítica  
**Estimativa**: 2 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.1

#### Descrição
Criar schemas Pydantic para validação de entrada e serialização de respostas do produto Smart CNPJ.

#### Tarefas
- [ ] **Schema `CNPJInput`** - Validação CNPJ de entrada
  - cnpj: str (validação formato: 14 dígitos, dígitos verificadores)
  - Validator: remover caracteres especiais (. / -)
  - Validator: validar dígitos verificadores

- [ ] **Schema `SmartCNPJSearchRequest`** - Parâmetros de busca
  - tipo_busca: Enum (cnpj, razao_social, segmento, email, telefone, nome_socio, cep)
  - valor_busca: str (obrigatório)
  - **8 Filtros Opcionais:**
    - situacao_cadastral: List[str] (ATIVA, SUSPENSA, INAPTA, BAIXADA)
    - tipo_empresa: str (MATRIZ, FILIAL)
    - porte_empresa: List[str] (MEI, ME, EPP, MEDIA, GRANDE)
    - capital_social_min: float
    - capital_social_max: float
    - opcao_mei: bool
    - opcao_simples: bool
    - data_abertura_inicio: date
    - data_abertura_fim: date
  - Paginação: page (default=1), page_size (default=20, max=100)

- [ ] **Schema `EmpresaBasicResponse`** - Resultado item da lista
  - cnpj: str (formatado XX.XXX.XXX/XXXX-XX)
  - razao_social: str
  - nome_fantasia: str | None
  - situacao_cadastral: str
  - porte_empresa: str
  - municipio: str
  - uf: str
  - cnae_principal: str

- [ ] **Schema `EmpresaFullResponse`** - Detalhes completos
  - Herda EmpresaBasicResponse
  - capital_social: float
  - natureza_juridica: str
  - endereco_completo: dict
  - telefones: List[str]
  - email: str | None
  - data_abertura: date
  - opcao_simples: bool
  - opcao_mei: bool
  - cnaes_secundarios: List[str]

- [ ] **Schema `SmartCNPJSearchResponse`** - Resposta paginada
  - resultados: List[EmpresaBasicResponse]
  - total: int
  - pagina: int
  - total_paginas: int
  - creditos_usados: int (sempre 5)
  - tempo_resposta_ms: int
  - from_cache: bool

- [ ] **Schema `ExportCNPJRequest`** - Exportação simples
  - cnpjs: List[str] (max 100)
  - formato: Enum (csv, json)

#### Entregáveis
- `backend/app/schemas/smart_cnpj.py` - Todos os schemas

#### Critérios de Aceite
- ✅ Validação CNPJ com dígitos verificadores
- ✅ Schemas Pydantic V2
- ✅ Documentação com Field(description=..., example=...)
- ✅ Enums para valores fixos
- ✅ Tipagem completa

---

### **Issue 2.1.3** - CRUD Smart CNPJ
**Prioridade**: 🔴 Crítica  
**Estimativa**: 3 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.1, 2.1.2

#### Descrição
Implementar operações CRUD otimizadas para consultas na base CNPJ local.

#### Tarefas
- [ ] **`get_empresa_by_cnpj`** - Buscar por CNPJ específico
  - SELECT com índice em cnpj
  - Retorna um registro ou None
  - Usar `first()` para performance

- [ ] **`search_empresas`** - Busca dinâmica (7 tipos)
  - **Tipo 1 - CNPJ:** WHERE cnpj = :valor
  - **Tipo 2 - Razão Social:** WHERE razao_social ILIKE '%:valor%'
  - **Tipo 3 - Segmento (CNAE):** WHERE cnae_principal LIKE ':valor%'
  - **Tipo 4 - Email:** WHERE email ILIKE '%:valor%'
  - **Tipo 5 - Telefone:** WHERE telefone1 LIKE '%:valor%' OR telefone2 LIKE '%:valor%'
  - **Tipo 6 - Nome Sócio:** JOIN com tabela socios (se existir) ou SKIP
  - **Tipo 7 - CEP:** WHERE cep LIKE ':valor%'
  - Aplicar 8 filtros opcionais (AND conditions)
  - Paginação: LIMIT, OFFSET
  - COUNT total (query separada)
  - Retornar (resultados, total)

- [ ] **`apply_filters`** - Aplicar 8 filtros
  - Situação: WHERE situacao_cadastral IN (:lista)
  - Tipo: WHERE tipo = 'MATRIZ' ou 'FILIAL'
  - Porte: WHERE porte_empresa IN (:lista)
  - Capital: WHERE capital_social BETWEEN :min AND :max
  - MEI: WHERE opcao_pelo_mei = :bool
  - Simples: WHERE opcao_pelo_simples = :bool
  - Data: WHERE data_abertura BETWEEN :inicio AND :fim
  - Query builder dinâmico (adiciona apenas filtros preenchidos)

- [ ] **`create_pesquisa_record`** - Salvar histórico
  - INSERT em `pesquisa_cnpj`
  - user_id=1 (fixo)
  - cnpj, tipo_busca, filtros_aplicados (JSON)
  - creditos_usados=5, created_at, tempo_resposta_ms

- [ ] **`get_historico_pesquisas`** - Histórico do usuário
  - SELECT * FROM pesquisa_cnpj WHERE user_id = 1
  - ORDER BY created_at DESC
  - LIMIT, OFFSET para paginação

#### Entregáveis
- `backend/app/crud/smart_cnpj.py` - Operações CRUD

#### Critérios de Aceite
- ✅ Queries otimizadas com índices
- ✅ Query builder dinâmico (apenas filtros preenchidos)
- ✅ ILIKE com % para busca parcial
- ✅ Paginação eficiente
- ✅ Tratamento de None/null
- ✅ Type hints completos
- ✅ Logging de queries lentas (> 500ms)

---

### **Issue 2.1.4** - Service Layer Smart CNPJ
**Prioridade**: 🔴 Crítica  
**Estimativa**: 4 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.3

#### Descrição
Implementar camada de serviço com lógica de negócio do produto Smart CNPJ (apenas base local).

#### Tarefas
- [ ] **`SmartCNPJService`** - Classe principal
  - `__init__(db: Session, cache: Redis)`
  - Injeção de dependências

- [ ] **`buscar_cnpj`** - Buscar CNPJ específico
  - Validar formato CNPJ
  - Verificar cache Redis (key: `cnpj:{cnpj}`, TTL: 24h)
  - Se não cached: buscar no banco (CRUD)
  - Salvar no cache
  - Registrar consulta no histórico
  - **Mock de créditos:** user_id=1, -5 créditos (TODO: implementar real na Delivery 2.5)
  - Retornar EmpresaFullResponse

- [ ] **`buscar_empresas`** - Busca avançada (7 tipos + 8 filtros)
  - Validar parâmetros de entrada
  - Montar query dinâmica (CRUD)
  - Aplicar filtros opcionais
  - Executar busca paginada
  - Registrar consulta no histórico
  - Mock de créditos: -5 créditos
  - Retornar SmartCNPJSearchResponse (lista + metadata)

- [ ] **`validar_creditos`** - Mock de validação (simplificado)
  - TODO: Por enquanto sempre retorna True
  - Na Sprint 2.5 será implementado sistema real
  - Logar "Mock: user_id=1 tem créditos ilimitados"

- [ ] **`registrar_pesquisa`** - Salvar histórico
  - Chamar CRUD `create_pesquisa_record`
  - Calcular tempo de resposta (inicio vs fim)
  - Salvar filtros aplicados em JSON

- [ ] **`formatar_cnpj`** - Utilitário
  - Input: "12345678000190"
  - Output: "12.345.678/0001-90"
  - Usar em todas respostas

#### Entregáveis
- `backend/app/services/smart_cnpj_service.py` - Service

#### Critérios de Aceite
- ✅ Lógica de negócio isolada
- ✅ Cache Redis funcional (hit/miss)
- ✅ Mock de créditos (TODO comentado)
- ✅ Tratamento de erros (CNPJ inválido, not found)
- ✅ Logging de operações
- ✅ Type hints completos
- ✅ Testável (dependency injection)

---

### **Issue 2.1.5** - API Endpoints Smart CNPJ
**Prioridade**: 🔴 Crítica  
**Estimativa**: 3 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.4

#### Descrição
Criar endpoints REST API para o produto Smart CNPJ (base local, sem autenticação JWT por enquanto).

#### Tarefas
- [ ] **`GET /api/v1/smart-cnpj/{cnpj}`** - Consulta por CNPJ
  - Path param: cnpj (string, 14 dígitos)
  - Response: EmpresaFullResponse
  - Status: 200 (sucesso), 404 (não encontrado), 400 (CNPJ inválido)
  - **SEM autenticação** (user_id=1 fixo)
  - Chamar SmartCNPJService.buscar_cnpj()

- [ ] **`POST /api/v1/smart-cnpj/search`** - Busca avançada
  - Body: SmartCNPJSearchRequest
  - Response: SmartCNPJSearchResponse (lista paginada + metadata)
  - Status: 200 (sucesso), 400 (parâmetros inválidos)
  - **SEM autenticação** (user_id=1 fixo)
  - Chamar SmartCNPJService.buscar_empresas()

- [ ] **`GET /api/v1/smart-cnpj/historico`** - Histórico de pesquisas
  - Query params: page (default=1), page_size (default=20)
  - Response: Lista de PesquisaCNPJ paginada
  - Status: 200
  - **SEM autenticação** (user_id=1 fixo)
  - Chamar CRUD.get_historico_pesquisas()

- [ ] **`POST /api/v1/smart-cnpj/export`** - Exportar resultados
  - Body: ExportCNPJRequest (cnpjs, formato)
  - Response: StreamingResponse (CSV) ou JSONResponse
  - Status: 200, 400 (limite excedido)
  - **SEM autenticação**
  - Formatos: CSV e JSON apenas (PDF/Excel futuro)

- [ ] **Incluir router** em `backend/app/api/v1/api.py`
  - `router.include_router(smart_cnpj.router, prefix="/smart-cnpj", tags=["Smart CNPJ"])`

#### Entregáveis
- `backend/app/api/v1/endpoints/smart_cnpj.py` - Endpoints
- Atualizar `backend/app/api/v1/api.py` - Incluir router

#### Critérios de Aceite
- ✅ 4 endpoints funcionais
- ✅ Documentação OpenAPI (Swagger)
- ✅ Validação Pydantic em todas entradas
- ✅ Status codes HTTP corretos
- ✅ Tratamento de exceções (try/except)
- ✅ Logging de requests
- ✅ Response models consistentes
- ✅ **SEM** autenticação JWT (por enquanto)

---

### **Issue 2.1.6** - Sistema de Cache Redis
**Prioridade**: 🟡 Média  
**Estimativa**: 2 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.4

#### Descrição
Implementar cache Redis integrado ao service (já parcialmente feito na Issue 2.1.4).

#### Tarefas
- [ ] **Configuração Redis** - Verificar conexão
  - Verificar `REDIS_URL` no .env
  - Testar conexão no startup da aplicação
  - Logging de status (conectado/erro)

- [ ] **Helper de Cache** - Utilitários
  - `backend/app/core/cache.py`
  - Função `get_redis_client()` → retorna Redis client
  - Função `cache_key(prefix, *args)` → gera keys consistentes
  - Função `serialize(obj)` → JSON
  - Função `deserialize(data)` → dict

- [ ] **Métricas de Cache** - Hit/Miss tracking
  - Logging: "Cache HIT: cnpj:{cnpj}"
  - Logging: "Cache MISS: cnpj:{cnpj}"
  - TODO: Métricas Prometheus (futuro)

- [ ] **Fallback** - Funcionar sem Redis
  - Try/except em operações de cache
  - Se Redis down: buscar sempre no banco
  - Logging: "Redis unavailable, skipping cache"

#### Entregáveis
- `backend/app/core/cache.py` - Helpers
- Integrado no SmartCNPJService

#### Critérios de Aceite
- ✅ Cache funcional (get/set)
- ✅ TTL correto (24h)
- ✅ Serialização JSON
- ✅ Fallback se Redis offline
- ✅ Logging de hit/miss

---

### **Issue 2.1.7** - Exportação CSV/JSON
**Prioridade**: � Baixa  
**Estimativa**: 2 horas  
**Status**: 📝 A Fazer  
**Depende de**: Issue 2.1.5

#### Descrição
Implementar exportação simples de resultados em CSV e JSON.

#### Tarefas
- [ ] **`export_to_csv`** - Exportar CSV
  - Receber lista de CNPJs
  - Buscar dados no banco
  - Gerar CSV usando módulo `csv` (stdlib)
  - Encoding: UTF-8 with BOM
  - Separador: ponto-vírgula
  - Headers: CNPJ, Razão Social, UF, Município, Situação, etc.
  - Retornar StreamingResponse

- [ ] **`export_to_json`** - Exportar JSON
  - Receber lista de CNPJs
  - Buscar dados no banco
  - Retornar JSONResponse com lista
  - Pretty print (indent=2)

- [ ] **Limite de exportação** - Max 100 CNPJs por vez
  - Validar no schema ExportCNPJRequest
  - Retornar erro 400 se exceder

- [ ] **Endpoint já criado** na Issue 2.1.5
  - Implementar lógica de exportação
  - Chamar funções export_to_*

#### Entregáveis
- `backend/app/services/export_service.py` - Exportação

#### Critérios de Aceite
- ✅ CSV com encoding correto
- ✅ JSON formatado
- ✅ Limite de 100 CNPJs
- ✅ StreamingResponse para CSV
- ✅ Headers corretos (Content-Disposition)

---

### **Issue 2.1.8** - Testes e Documentação
**Prioridade**: 🟡 Média  
**Estimativa**: 3 horas  
**Status**: 📝 A Fazer  
**Depende de**: Todas as issues acima

#### Descrição
Criar testes básicos e documentação dos endpoints Smart CNPJ.

#### Tarefas
- [ ] **Testes Unitários** - Service
  - `tests/unit/test_smart_cnpj_service.py`
  - Testar `buscar_cnpj()` com mock DB
  - Testar `buscar_empresas()` com filtros
  - Testar validação CNPJ
  - Mock Redis para cache
  - Coverage alvo: 70%+

- [ ] **Testes de Integração** - Endpoints
  - `tests/integration/test_smart_cnpj_endpoints.py`
  - Test GET /api/v1/smart-cnpj/{cnpj}
  - Test POST /api/v1/smart-cnpj/search
  - Test GET /api/v1/smart-cnpj/historico
  - Test POST /api/v1/smart-cnpj/export
  - Usar TestClient (FastAPI)
  - Banco de teste SQLite in-memory

- [ ] **Fixtures** - Dados de teste
  - `tests/fixtures/empresas.py`
  - 10 empresas mock
  - CNPJs válidos (dígitos verificadores corretos)

- [ ] **Documentação Swagger** - OpenAPI
  - Adicionar `description` em todos endpoints
  - Adicionar `summary` curto
  - Adicionar `response_description`
  - Adicionar `examples` nos schemas
  - Tags: "Smart CNPJ"

- [ ] **README** - Guia rápido
  - `docs/SMART_CNPJ_API.md`
  - Como usar cada endpoint
  - Exemplos curl
  - Códigos de erro

#### Entregáveis
- Testes unitários e integração
- Documentação Swagger completa
- Guia de uso (docs/SMART_CNPJ_API.md)

#### Critérios de Aceite
- ✅ Coverage > 70%
- ✅ Testes passando
- ✅ Swagger UI navegável
- ✅ Examples funcionais

---

## 📊 Resumo de Esforço

| Issue | Prioridade | Estimativa | Dependências |
|-------|-----------|-----------|--------------|
| 2.1.0 - **Análise & Mapeamento** | 🔴 CRÍTICA | 2h | - (FAZER PRIMEIRO!) |
| 2.1.1 - Modelagem Local | 🔴 Crítica | 3h | 2.1.0 |
| 2.1.2 - Schemas | 🔴 Crítica | 2h | 2.1.1 |
| 2.1.3 - CRUD | 🔴 Crítica | 3h | 2.1.1, 2.1.2 |
| 2.1.4 - Service | 🔴 Crítica | 4h | 2.1.3 |
| 2.1.5 - Endpoints | 🔴 Crítica | 3h | 2.1.4 |
| 2.1.6 - Cache Redis | 🟡 Média | 2h | 2.1.4 |
| 2.1.7 - Exportação | 🟢 Baixa | 2h | 2.1.5 |
| 2.1.8 - Testes | 🟡 Média | 3h | Todas |
| **TOTAL** | | **24h** | **~3-4 dias** |

---

## 🔧 Stack Técnica

### Core
- **FastAPI** - Framework web
- **SQLAlchemy** - ORM (mapear tabela existente)
- **Alembic** - Migrations
- **Pydantic V2** - Validação e serialização
- **PostgreSQL** - Database (tabela CNPJ 100M+ registros) ✅

### Cache
- **Redis** - Cache de consultas (TTL 24h)

### Exportação
- **csv** - CSV (stdlib Python)
- **json** - JSON (stdlib Python)

### Testes
- **pytest** - Framework de testes
- **pytest-cov** - Coverage
- **TestClient** - FastAPI testing

---

## 🎯 Definição de Pronto (DoD)

### Para cada Issue:
- ✅ Código implementado seguindo padrões do projeto
- ✅ Type hints completos (mypy)
- ✅ Docstrings completas (Google style)
- ✅ Testes unitários (quando aplicável)
- ✅ Sem erros de linting (ruff/black)
- ✅ Code review aprovado
- ✅ Documentação atualizada

### Para a Sprint:
- ✅ Todas as issues concluídas
- ✅ Testes passando (coverage > 80%)
- ✅ API documentada (Swagger)
- ✅ Performance validada (< 500ms p95)
- ✅ Integração com frontend possível
- ✅ Deploy em staging OK

---

## 🚀 Ordem de Execução Sugerida

### **Dia 0 - Análise e Preparação** (2h) 🔥 CRÍTICO!
0. **Issue 2.1.0 - Análise & Mapeamento** (2h)
   - Conectar no PostgreSQL e descobrir estrutura real
   - Criar scripts SQL de índices
   - Criar scripts SQL de tabelas de apoio
   - Documentar DE/PARA frontend ↔ backend
   - **SEM ISSO, NÃO COMEÇAR AS OUTRAS ISSUES!**

### **Dia 1 - Fundação** (5h)
1. Issue 2.1.1 - Modelagem Local (3h)
2. Issue 2.1.2 - Schemas Pydantic (2h)

### **Dia 2 - Core Business** (7h)
3. Issue 2.1.3 - CRUD Operations (3h)
4. Issue 2.1.4 - Service Layer (4h)

### **Dia 3 - API** (5h)
5. Issue 2.1.5 - Endpoints (3h)
6. Issue 2.1.6 - Cache Redis (2h)

### **Dia 4 - Finalização** (5h)
7. Issue 2.1.7 - Exportação CSV/JSON (2h)
8. Issue 2.1.8 - Testes & Docs (3h)

**Total: 24 horas (~3-4 dias úteis)**

---

## 📝 Notas Importantes

### Base de Dados Local
- Tabela CNPJ existente com 100M+ registros ✅
- **CRÍTICO:** Não recriar a tabela - apenas MAPEAR com SQLAlchemy
- `__table_args__ = {'extend_existing': True}`
- Consultas devem usar índices existentes
- Verificar nome real da tabela antes de mapear

### Sistema de Créditos (Mock)
- **Smart CNPJ**: 5 créditos por busca
- **Exportação**: gratuita (por enquanto)
- **user_id=1** fixo durante esta sprint
- Sistema real será implementado na Sprint 2.5

### Performance
- Target: **< 500ms** para busca (p95)
- Target: **< 200ms** para consulta CNPJ direto
- Cache Redis: TTL 24h
- Paginação: padrão 20, max 100 itens/página
- Logging de queries lentas (> 500ms)

### Autenticação
- **SEM JWT** nesta sprint
- Endpoints **ABERTOS** (desenvolvimento)
- user_id=1 fixo em todos os registros
- Autenticação será implementada na Delivery 3

### Fora do Escopo (Futuro)
- ❌ APIs externas (Predictus, etc.)
- ❌ Enriquecimento de dados
- ❌ Autenticação JWT
- ❌ Exportação PDF/Excel
- ❌ Tarefas Celery assíncronas
- ❌ Sistema real de créditos

---

## 🔄 Próximos Passos

Após conclusão da Sprint 2.1:
1. **Integração Frontend** - Substituir mockdata por API real
2. **Sprint 2.2** - Dados 360° PJ (Predictus API)
3. **Sprint 2.3** - Dados 360° PF (DirectData API)
4. **Sprint 2.4** - Radar Jurídico (Predictus Processos)
5. **Sprint 2.5** - Sistema de Créditos Real
6. **Delivery 3** - Autenticação JWT e RBAC

---

## 📞 Recursos

- **Database**: PostgreSQL com tabela CNPJ (100M+ registros) ✅
- **Cache**: Redis (localhost:6379)
- **Swagger UI**: http://localhost:8000/docs
- **Frontend Dev**: http://localhost:3000

---

**Última atualização**: 23/10/2025  
**Versão do documento**: 3.0 (COM MAPEAMENTO FRONTEND ↔ BACKEND)  
**Status**: 🟢 Pronta para início  
**Escopo**: Smart CNPJ com base PostgreSQL local - SEM APIs externas

---

## ⚠️ ATENÇÃO: COMEÇAR PELA ISSUE 2.1.0!

**ANTES de codificar qualquer model ou endpoint:**
1. ✅ Execute `backend/scripts/01_descobrir_estrutura.sql`
2. ✅ Descubra o nome REAL da tabela CNPJ
3. ✅ Documente a estrutura real (colunas, tipos, índices)
4. ✅ Execute `backend/scripts/02_create_indexes.sql`
5. ✅ Execute `backend/scripts/03_create_support_tables.sql`
6. ✅ Teste conectividade e consultas básicas

**SEM esses passos, o resto da sprint FALHARÁ!**
